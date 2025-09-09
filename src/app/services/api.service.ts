import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
    CashKick,
    Contract,
    CreditLimit,
    CashKickCreateRequest,
    ApiError
} from '../models';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private readonly BASE_URL = 'http://localhost:3000';
    private readonly CONTRACTS_API = '/contracts';
    private readonly CASHKICKS_API = '/cashkicks';
    private readonly CREDIT_API = '/credit';

    constructor(private http: HttpClient) { }

    /**
     * Get all contracts
     * Matches React: getContracts()
     */
    getContracts(): Observable<Contract[]> {
        return this.http.get<Contract[]>(`${this.BASE_URL}${this.CONTRACTS_API}`)
            .pipe(
                catchError(this.handleError)
            );
    }

    /**
     * Get available contracts for cash kick creation
     * Matches React: getAvailableContracts() 
     * Note: React calls /contracts-list but we'll filter available from /contracts
     */
    getAvailableContracts(): Observable<Contract[]> {
        return this.http.get<Contract[]>(`${this.BASE_URL}${this.CONTRACTS_API}`)
            .pipe(
                map(contracts => contracts.filter(contract => contract.status === 'AVAILABLE')),
                catchError(this.handleError)
            );
    }

    /**
     * Get all cash kicks
     * Matches React: getCashKicks()
     */
    getCashKicks(): Observable<CashKick[]> {
        return this.http.get<CashKick[]>(`${this.BASE_URL}${this.CASHKICKS_API}`)
            .pipe(
                catchError(this.handleError)
            );
    }

    /**
     * Get credit limit information
     * Matches React: getCreditLimit()
     */
    getCreditLimit(): Observable<CreditLimit> {
        return this.http.get<CreditLimit>(`${this.BASE_URL}${this.CREDIT_API}`)
            .pipe(
                catchError(this.handleError)
            );
    }

    /**
     * Create a new cash kick
     * Matches React: createCashKick()
     */
    createCashKick(cashKickData: CashKickCreateRequest): Observable<CashKick> {
        const payload = {
            name: cashKickData.name,
            contracts: cashKickData.contracts,
            rate: cashKickData.rate,
            payBackAmount: cashKickData.payBackAmount,
            maturity: cashKickData.maturity,
            totalRecieved: cashKickData.totalRecieved,
            totalFinanced: cashKickData.totalFinanced,
            status: cashKickData.status,
            currencyCode: cashKickData.currencyCode
        };

        return this.http.post<CashKick>(`${this.BASE_URL}${this.CASHKICKS_API}`, payload)
            .pipe(
                catchError(this.handleError)
            );
    }

    /**
     * Error handling method
     * Provides consistent error handling across all API calls
     */
    private handleError = (error: HttpErrorResponse): Observable<never> => {
        let errorMessage: ApiError;

        if (typeof ErrorEvent !== 'undefined' && error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = {
                message: `Client Error: ${error.error.message}`,
                status: 0,
                error: error.error
            };
        } else {
            // Server-side error
            errorMessage = {
                message: `Server Error: ${error.status} - ${error.message}`,
                status: error.status,
                error: error.error
            };
        }

        console.error('API Error:', errorMessage);
        return throwError(() => errorMessage);
    };
}
