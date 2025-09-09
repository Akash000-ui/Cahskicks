import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { MainTemplateComponent } from '../../components/templates/main-template/main-template.component';
import { DataCardComponent } from '../../components/organisms/data-card/data-card.component';
import { LaunchCashKickCardComponent } from '../../components/molecules/launch-cashkick-card/launch-cashkick-card.component';
import { DataTableComponent } from '../../components/molecules/data-table/data-table.component';
import { TextFieldComponent } from '../../components/atoms/text-field/text-field.component';
import { DataService } from '../../services/data.service';
import { ApiService } from '../../services/api.service';
import { Contract, CashKick } from '../../models';

@Component({
  selector: 'app-cash-acceleration-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MainTemplateComponent,
    DataCardComponent,
    LaunchCashKickCardComponent,
    DataTableComponent
  ],
  template: `
    <app-main-template>
      <div class="cash-acceleration-page">
        <div class="page-header">
          <div class="header-content">
            <h1 class="page-title">Cash acceleration</h1>
            <p class="page-subtitle">Place to create new cash kicks to run your business</p>
          </div>
          <div class="header-avatar">
            <img src="assets/example-avatar.png" alt="User Avatar" class="avatar-img">
          </div>
        </div>

        <div class="cards-section">
          <div class="cards-row">
            <div class="data-cards-container">
              <app-data-card
                [termCapTitle]="'12 months'"
                [availableCreditTitle]="'$523K'"
                [dueDateTitle]="'12%'"
                [termCapInfoTitle]="'Term cap'"
                [availableCreditInfoTitle]="'Available credit'"
                [dueDateInfoTitle]="'Max interest rate'"
              ></app-data-card>
            </div>
            <app-launch-cashkick-card 
              title="Launch a new Cash Kick"
              body="You have up to <strong>$523,051.44</strong> available for a new cash advance"
              actionText="New Cash Kick"
              (onAction)="navigateToNewCashkick()"
            ></app-launch-cashkick-card>
          </div>
        </div>

        <div class="contracts-section">
          <div class="section-header">
            <div class="section-title-container">
              <h2 class="section-title">Cash acceleration</h2>
              <button class="sync-button" (click)="syncData()">
                <img src="assets/icons/refresh.png" alt="Sync Icon" class="sync-icon">
                <span>Sync Now</span>
              </button>
            </div>
            
            <div class="tabs-container">
              <button 
                class="tab-button" 
                [class.active]="activeTab === 'contracts'"
                (click)="switchTab('contracts')"
              >
                My Contracts
              </button>
              <button 
                class="tab-button" 
                [class.active]="activeTab === 'cashkicks'"
                (click)="switchTab('cashkicks')"
              >
                My Cash Kicks
              </button>
            </div>
          </div>

          <div class="table-container">
            <div *ngIf="isLoading" class="loading-state">
              <p>Loading {{ activeTab === 'contracts' ? 'contracts' : 'cash kicks' }}...</p>
            </div>
            <div *ngIf="hasError" class="error-state">
              <p>{{ errorMessage }}</p>
            </div>
            
            <!-- Contracts Table -->
            <app-data-table
              *ngIf="!isLoading && !hasError && activeTab === 'contracts'"
              [cols]="contractColumns"
              [rows]="filteredContracts"
              [selectable]="false"
              [fullWidth]="true"
            ></app-data-table>
            
            <!-- Cash Kicks Table -->
            <app-data-table
              *ngIf="!isLoading && !hasError && activeTab === 'cashkicks'"
              [cols]="cashKickColumns"
              [rows]="filteredCashKicks"
              [selectable]="false"
              [fullWidth]="true"
            ></app-data-table>
          </div>
        </div>
      </div>
    </app-main-template>
  `,
  styleUrls: ['./cash-acceleration-page.component.scss']
})
export class CashAccelerationPageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Tab Management
  activeTab: 'contracts' | 'cashkicks' = 'contracts';

  // Form Controls
  searchForm = new FormGroup({
    searchQuery: new FormControl('')
  });

  // State Management
  isLoading = true;
  hasError = false;
  errorMessage = '';

  constructor(private router: Router, private dataService: DataService, private apiService: ApiService) { }

  // Data State
  contractColumns = [
    {
      name: 'Name',
      accessor: (row: any) => row.name
    },
    {
      name: 'Status',
      accessor: (row: any) => row.status
    },
    {
      name: 'Type',
      accessor: (row: any) => row.type
    },
    {
      name: 'Per Payment',
      accessor: (row: any) => `$${row.perPayment.toLocaleString()}`
    },
    {
      name: 'Total Financed',
      accessor: (row: any) => row.totalFinanced > 0 ? `$${row.totalFinanced.toLocaleString()}` : '-'
    },
    {
      name: 'Total Available',
      accessor: (row: any) => `$${row.totalAvailable.toLocaleString()}`
    }
  ];

  // Cash Kicks Table Configuration
  cashKickColumns = [
    {
      name: 'Name',
      accessor: (row: any) => row.name
    },
    {
      name: 'Status',
      accessor: (row: any) => row.status
    },
    {
      name: 'Maturity',
      accessor: (row: any) => row.maturity
    },
    {
      name: 'Total Received',
      accessor: (row: any) => `$${row.totalRecieved?.toLocaleString() || '0'}`
    },
    {
      name: 'Total Financed',
      accessor: (row: any) => `$${row.totalFinanced?.toLocaleString() || '0'}`
    },
    {
      name: 'Rate',
      accessor: (row: any) => `${row.rate}%`
    }
  ];

  allContracts: Contract[] = [];
  filteredContracts: Contract[] = [];
  allCashKicks: CashKick[] = [];
  filteredCashKicks: CashKick[] = [];

  ngOnInit() {
    console.log('CashAccelerationPageComponent ngOnInit');
    this.setupSearchForm();
    this.loadContracts();
    this.loadCashKicks();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearchForm() {
    // Setup reactive search with debouncing
    this.searchForm.get('searchQuery')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(searchValue => {
        if (this.activeTab === 'contracts') {
          this.updateFilteredContracts(searchValue || '');
        } else {
          this.updateFilteredCashKicks(searchValue || '');
        }
      });
  }

  private loadContracts() {
    console.log('Loading contracts from service...');
    this.isLoading = true;
    this.hasError = false;

    // Subscribe to contracts from DataService
    this.dataService.contracts$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (contracts) => {
          console.log('Contracts received from service:', contracts);
          this.allContracts = contracts;
          this.filteredContracts = [...contracts];

          // Only set loading to false if we have data
          if (contracts.length > 0) {
            this.isLoading = false;
          }
        },
        error: (error) => {
          console.error('Error loading contracts:', error);
          this.hasError = true;
          this.errorMessage = 'Failed to load contracts';
          this.isLoading = false;
        }
      });

    // Subscribe to loading state
    this.dataService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        if (!loading && this.allContracts.length > 0) {
          this.isLoading = false;
        }
      });

    // Trigger data loading
    this.dataService.loadInitialData();
  }

  // Tab Management
  switchTab(tab: 'contracts' | 'cashkicks') {
    this.activeTab = tab;
    console.log('Switched to tab:', tab);

    // Filter data for the active tab
    if (tab === 'contracts') {
      this.updateFilteredContracts(this.searchForm.get('searchQuery')?.value || '');
    } else {
      this.updateFilteredCashKicks(this.searchForm.get('searchQuery')?.value || '');
    }
  }

  // Data Loading Methods
  private loadCashKicks() {
    this.apiService.getCashKicks()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (cashKicks) => {
          this.allCashKicks = cashKicks;
          this.filteredCashKicks = cashKicks;
          console.log('Cash kicks loaded:', cashKicks);
        },
        error: (error) => {
          console.error('Error loading cash kicks:', error);
        }
      });
  }

  private updateFilteredCashKicks(searchValue: string) {
    if (!searchValue.trim()) {
      this.filteredCashKicks = this.allCashKicks;
    } else {
      const searchTerm = searchValue.toLowerCase();
      this.filteredCashKicks = this.allCashKicks.filter(cashKick =>
        cashKick.name.toLowerCase().includes(searchTerm) ||
        cashKick.status.toLowerCase().includes(searchTerm) ||
        (cashKick.maturity && cashKick.maturity.toLowerCase().includes(searchTerm))
      );
    }
  }

  private updateFilteredContracts(searchValue: string) {
    if (!searchValue.trim()) {
      this.filteredContracts = this.allContracts;
    } else {
      const searchTerm = searchValue.toLowerCase();
      this.filteredContracts = this.allContracts.filter(contract =>
        contract.name.toLowerCase().includes(searchTerm) ||
        contract.type.toLowerCase().includes(searchTerm) ||
        contract.status.toLowerCase().includes(searchTerm)
      );
    }
  }

  navigateToNewCashkick() {
    this.router.navigate(['/create']);
  }

  syncData() {
    console.log('Syncing data...');
    this.dataService.forceRefreshData();
  }
}
