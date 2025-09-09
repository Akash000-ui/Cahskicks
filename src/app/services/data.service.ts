import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin, timer } from 'rxjs';
import { retry, catchError, finalize } from 'rxjs/operators';
import { ApiService } from './api.service';
import { CashKick, Contract, CreditLimit } from '../models';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    // State management using BehaviorSubjects
    private contractsSubject = new BehaviorSubject<Contract[]>([]);
    private cashKicksSubject = new BehaviorSubject<CashKick[]>([]);
    private creditLimitSubject = new BehaviorSubject<CreditLimit | null>(null);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    // Public observables for components to subscribe to
    public contracts$ = this.contractsSubject.asObservable();
    public cashKicks$ = this.cashKicksSubject.asObservable();
    public creditLimit$ = this.creditLimitSubject.asObservable();
    public loading$ = this.loadingSubject.asObservable();

    constructor(private apiService: ApiService) { }

    /**
     * Load all initial data
     * Call this on app startup to populate state
     */
    loadInitialData(): void {
        // Don't load if already loading
        if (this.loadingSubject.value) {
            console.log('Data already loading, skipping...');
            return;
        }

        // Don't reload if we already have data
        if (this.contractsSubject.value.length > 0) {
            console.log('Data already loaded, skipping...');
            return;
        }

        this.setLoading(true);
        console.log('Starting to load initial data...');

        // Use forkJoin to load all data in parallel with retry logic
        const contracts$ = this.apiService.getContracts().pipe(
            retry(2),
            catchError(error => {
                console.error('Failed to load contracts after retries:', error);
                throw error;
            })
        );

        const cashKicks$ = this.apiService.getCashKicks().pipe(
            retry(2),
            catchError(error => {
                console.error('Failed to load cash kicks after retries:', error);
                throw error;
            })
        );

        const creditLimit$ = this.apiService.getCreditLimit().pipe(
            retry(2),
            catchError(error => {
                console.error('Failed to load credit limit after retries:', error);
                throw error;
            })
        );

        forkJoin({
            contracts: contracts$,
            cashKicks: cashKicks$,
            creditLimit: creditLimit$
        }).pipe(
            finalize(() => this.setLoading(false))
        ).subscribe({
            next: (data) => {
                console.log('All data loaded successfully:', data);
                this.contractsSubject.next(data.contracts);
                this.cashKicksSubject.next(data.cashKicks);
                this.creditLimitSubject.next(data.creditLimit);
            },
            error: (error) => {
                console.error('Error loading initial data:', error);
                // Even on error, try to load individual pieces that might work
                this.loadDataIndividually();
            }
        });
    }

    /**
     * Fallback method to load data individually if parallel loading fails
     */
    private loadDataIndividually(): void {
        // Load contracts
        this.apiService.getContracts().pipe(retry(1)).subscribe({
            next: (contracts) => {
                this.contractsSubject.next(contracts);
                console.log('Contracts loaded individually:', contracts);
            },
            error: (error) => {
                console.error('Error loading contracts individually:', error);
            }
        });

        // Load cash kicks
        this.apiService.getCashKicks().pipe(retry(1)).subscribe({
            next: (cashKicks) => {
                this.cashKicksSubject.next(cashKicks);
                console.log('Cash kicks loaded individually:', cashKicks);
            },
            error: (error) => {
                console.error('Error loading cash kicks individually:', error);
            }
        });

        // Load credit limit
        this.apiService.getCreditLimit().pipe(retry(1)).subscribe({
            next: (creditLimit) => {
                this.creditLimitSubject.next(creditLimit);
                console.log('Credit limit loaded individually:', creditLimit);
            },
            error: (error) => {
                console.error('Error loading credit limit individually:', error);
            }
        });
    }

    /**
     * Force refresh all data (ignores cache)
     */
    forceRefreshData(): void {
        console.log('Force refreshing all data...');
        this.contractsSubject.next([]);
        this.cashKicksSubject.next([]);
        this.creditLimitSubject.next(null);
        this.loadInitialData();
    }

    /**
     * Get available contracts for cash kick creation
     */
    getAvailableContracts(): Observable<Contract[]> {
        return this.apiService.getAvailableContracts();
    }

    /**
     * Refresh contracts data
     */
    refreshContracts(): void {
        this.apiService.getContracts().subscribe({
            next: (contracts) => {
                this.contractsSubject.next(contracts);
            },
            error: (error) => {
                console.error('Error refreshing contracts:', error);
            }
        });
    }

    /**
     * Refresh cash kicks data
     */
    refreshCashKicks(): void {
        this.apiService.getCashKicks().subscribe({
            next: (cashKicks) => {
                this.cashKicksSubject.next(cashKicks);
            },
            error: (error) => {
                console.error('Error refreshing cash kicks:', error);
            }
        });
    }

    /**
     * Create a new cash kick and refresh data
     */
    createCashKick(cashKickData: any): Observable<CashKick> {
        return new Observable(observer => {
            this.apiService.createCashKick(cashKickData).subscribe({
                next: (newCashKick) => {
                    // Refresh cash kicks data after creation
                    this.refreshCashKicks();
                    observer.next(newCashKick);
                    observer.complete();
                },
                error: (error) => {
                    observer.error(error);
                }
            });
        });
    }

    /**
     * Set loading state
     */
    private setLoading(loading: boolean): void {
        this.loadingSubject.next(loading);
    }

    /**
     * Get current contracts value (synchronous)
     */
    getCurrentContracts(): Contract[] {
        return this.contractsSubject.value;
    }

    /**
     * Get current cash kicks value (synchronous)
     */
    getCurrentCashKicks(): CashKick[] {
        return this.cashKicksSubject.value;
    }

    /**
     * Get current credit limit value (synchronous)
     */
    getCurrentCreditLimit(): CreditLimit | null {
        return this.creditLimitSubject.value;
    }
}
