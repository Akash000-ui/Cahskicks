import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { MainTemplateComponent } from '../../components/templates/main-template/main-template.component';
import { DataTableComponent } from '../../components/molecules/data-table/data-table.component';
import { ButtonComponent } from '../../components/atoms/button/button.component';
import { TextFieldComponent } from '../../components/atoms/text-field/text-field.component';
import { ModalComponent } from '../../components/molecules/modal/modal.component';
import { SuccessModalComponent } from '../../components/molecules/success-modal/success-modal.component';
import { DataService } from '../../services/data.service';
import { ApiService } from '../../services/api.service';
import { Contract, CashKickCreateRequest } from '../../models';

@Component({
  selector: 'app-create-cashkick-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MainTemplateComponent,
    DataTableComponent,
    ButtonComponent,
    TextFieldComponent,
    ModalComponent,
    SuccessModalComponent
  ],
  template: `
    <app-main-template>
      <div class="create-cashkick-page">
        <div class="page-header">
          <h1 class="page-title">Cash accelaration</h1>
          <h2 class="page-subtitle">Place to create new cash kicks to run your business</h2>
        </div>

        <div class="progress-indicator">
          <div class="step" [class.active]="currentStep === 1" [class.completed]="currentStep > 1">
            <span class="step-number">1</span>
            <span class="step-label">Select contracts</span>
          </div>
          <div class="step-divider"></div>
          <div class="step" [class.active]="currentStep === 2">
            <span class="step-number">2</span>
            <span class="step-label">Review & Submit</span>
          </div>
        </div>

        <div class="content-section">
          <!-- Step 1: Contract Selection -->
          <div *ngIf="currentStep === 1" class="step-content-with-sidebar">
            <div class="main-content">
              <div class="step-header">
                <h2 class="step-title">Select contracts</h2>
                <p class="step-description">
                  Choose the contracts you want to include in your cashkick
                </p>
              </div>

              <!-- <div class="selection-summary" *ngIf="selectedContracts.length > 0">
                <div class="summary-row">
                  <span class="summary-label">
                    {{ selectedContracts.length }} contract(s) selected
                  </span>
                  <span class="summary-total">
                    Total: {{ calculateTotal() | currency }}
                  </span>
                </div>
              </div> -->

              <div class="table-container">
                <div *ngIf="isLoading" class="loading-state">
                  <p>Loading contracts...</p>
                </div>
                <div *ngIf="hasError" class="error-state">
                  <p>{{ errorMessage }}</p>
                </div>
                <app-data-table
                  title="Your Contracts"
                  *ngIf="!isLoading && !hasError"
                  [cols]="contractColumns"
                  [rows]="availableContracts"
                  [selectable]="true"
                  [selectedRowIds]="selectedContractIds"
                  (onSelectionChange)="onContractSelectionChange($event)"
                ></app-data-table>
              </div>

              <!-- <div class="step-actions">
                <app-button
                  type="bordered"
                  (click)="goBack()"
                >
                  Cancel
                </app-button>
                <app-button
                  type="primary"
                  [disabled]="selectedContracts.length === 0"
                  (click)="nextStep()"
                >
                  Continue
                </app-button>
              </div> -->
            </div>

            <!-- Summary Sidebar -->
            <div class="summary-sidebar">
              <div class="summary-card">
                <div class="summary-header">
                  <h3 class="summary-title">Summary</h3>
                </div>
                
                <div class="summary-details">
                  <div class="summary-item">
                    <span class="summary-label">Term</span>
                    <span class="summary-value">12 months</span>
                  </div>
                  
                  <div class="summary-item">
                    <span class="summary-label">Selected Contracts</span>
                    <span class="summary-value">{{ selectedContracts.length }}</span>
                  </div>
                  
                  <div class="summary-item">
                    <span class="summary-label">Slide to auto</span>
                  </div>
                  
                  <div class="slider-container">
                    <input 
                      type="range" 
                      class="slider" 
                      min="0" 
                      [max]="maxAmount" 
                      [value]="selectedAmount"
                      [style.--progress]="getSliderPercentage() + '%'"
                      (input)="onSliderChange($event)"
                    >
                  </div>
                  
                  <div class="amount-display">
                    <span class="amount-text">{{ selectedAmount | currency }} selected out of {{ maxAmount | currency }}</span>
                  </div>
                  
                  <div class="summary-item">
                    <span class="summary-label">Pay back amount</span>
                    <span class="summary-value">{{ calculatePayback() | currency }}</span>
                  </div>
                  
                  <div class="summary-item">
                    <span class="summary-label">Rate %</span>
                    <span class="summary-value">(12%) {{ calculateFee() | currency }}</span>
                  </div>
                  
                  <div class="summary-total-section">
                    <div class="total-payable">
                      <span class="total-label">Total Payable</span>
                      <span class="total-value">{{ calculatePayback() | currency }}</span>
                    </div>
                  </div>
                  
                  <div class="review-action">
                    <app-button
                      type="primary"
                      size="lg"
                      [disabled]="selectedContracts.length === 0"
                      (click)="nextStep()"
                    >
                      Review your Credit
                    </app-button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 2: Review & Submit -->
      <div *ngIf="currentStep === 2" class="step-content-with-sidebar review-mode">
            <div class="main-content">
              <div class="table-container">
                <app-data-table
                  title="Selected Contracts"
                  [cols]="contractColumns"
                  [rows]="selectedContracts"
                  [selectable]="false"
                  [selectedRowIds]="selectedContractIds"
                ></app-data-table>
        <div class="table-filler"></div>
              </div>
            </div>

            <!-- Summary Sidebar for Review -->
            <div class="summary-sidebar">
              <div class="summary-card">
                <div class="summary-header">
                  <h3 class="summary-title">Summary</h3>
                </div>
                
                <div class="summary-details">
                  <div class="summary-item">
                    <span class="summary-label">Term</span>
                    <span class="summary-value">12 months</span>
                  </div>
                  
                  <div class="summary-item">
                    <span class="summary-label">Selected Contracts</span>
                    <span class="summary-value">{{ selectedContracts.length }}</span>
                  </div>
                  
                  <div class="summary-item">
                    <span class="summary-label">Pay back amount</span>
                    <span class="summary-value">{{ selectedAmount | currency }}</span>
                  </div>
                  
                  <div class="summary-item">
                    <span class="summary-label">Rate %</span>
                    <span class="summary-value">(12%) {{ calculateFee() | currency }}</span>
                  </div>
                  
                  <div class="summary-total-section">
                    <div class="total-payable">
                      <span class="total-label">Total Payable</span>
                      <span class="total-value">{{ calculateNetAmount() | currency }}</span>
                    </div>
                  </div>
                  
                  <div class="review-action">
                    <app-button
                      type="primary"
                      size="lg"
                      [disabled]="selectedContracts.length === 0"
                      [loading]="isSubmitting"
                      (click)="openNameModal()"
                    >
                      Submit your Credit
                    </app-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Name Modal -->
        <app-modal
          *ngIf="showNameModal"
          [open]="showNameModal"
          title="Name your cashkick"
          acceptActionText="Create Cash Kick"
          (onClose)="closeNameModal()"
          (onCancel)="closeNameModal()"
          (onAccept)="submitCashkick()"
          [acceptBtnDisabled]="cashkickForm.invalid || isSubmitting"
        >
          <form [formGroup]="cashkickForm">
            <app-text-field
              label="Cashkick name"
              placeholder="Enter cashkick name"
              formControlName="name"
            ></app-text-field>
            
            <div *ngIf="cashkickForm.get('name')?.invalid && cashkickForm.get('name')?.touched" class="error-message">
              <span *ngIf="cashkickForm.get('name')?.errors?.['required']">
                Cashkick name is required
              </span>
              <span *ngIf="cashkickForm.get('name')?.errors?.['minlength']">
                Name must be at least 3 characters
              </span>
              <span *ngIf="cashkickForm.get('name')?.errors?.['maxlength']">
                Name must be less than 50 characters
              </span>
            </div>
          </form>
        </app-modal>
      </div>
    </app-main-template>

    <!-- Success Modal -->
    <app-success-modal
      [isOpen]="showSuccessModal"
      [cashKickData]="successData"
      (closed)="onSuccessModalClosed()"
      (viewCashKicksClicked)="onViewCashKicks()"
      (createAnotherClicked)="onCreateAnother()">
    </app-success-modal>
  `,
  styleUrls: ['./create-cashkick-page.component.scss']
})
export class CreateCashkickPageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Form State
  cashkickForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(50)
    ])
  });

  // Component State
  currentStep = 1;
  isSubmitting = false;
  isLoading = false;
  hasError = false;
  errorMessage = '';
  showNameModal = false;
  showSuccessModal = false;
  successData: any = null;

  // Data State
  selectedContracts: Contract[] = [];
  selectedContractIds: number[] = [];
  availableContracts: Contract[] = [];
  selectedAmount = 0;
  maxAmount = 0; // Start with 0, will be updated when contracts are selected
  termMonths = 12;
  interestRate = 12.0;

  contractColumns = [
    {
      name: 'Name',
      accessor: (row: any) => row.name
    },
    {
      name: 'Type',
      accessor: (row: any) => row.type ? (row.type.charAt(0).toUpperCase() + row.type.slice(1).toLowerCase()) : ''
    },
    {
      name: 'Per Payment',
      accessor: (row: any) => `$${row.perPayment?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    },
    {
      name: 'Term Length',
      accessor: (_row: any) => '12',
      render: () => `
        <div class="term-length-cell">
          <div class="term-value">12</div>
          <div class="term-meta">
            <div class="term-months">months</div>
            <div class="term-fee">12% fee</div>
          </div>
        </div>
      `
    },
    {
      name: 'Payment Amount',
      accessor: (row: any) => {
        // Approximate to match screenshot: payment = perPayment * termMonths * (1 - rate)
        const months = this.termMonths ?? 12;
        const rate = (this.interestRate ?? 12) / 100;
        const amount = (row.perPayment || 0) * months * (1 - rate);
        return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
    }
  ];

  constructor(private router: Router, private dataService: DataService, private apiService: ApiService) { }

  ngOnInit() {
    this.loadAvailableContracts();
    console.log('CreateCashkickPage ngOnInit - initial selectedAmount:', this.selectedAmount);
    console.log('CreateCashkickPage ngOnInit - initial maxAmount:', this.maxAmount);
  }

  private loadAvailableContracts() {
    this.isLoading = true;
    this.hasError = false;

    // First try to get data from DataService (might already be loaded)
    this.dataService.contracts$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (allContracts) => {
          console.log('Contracts from DataService:', allContracts);
          if (allContracts.length > 0) {
            // Filter available contracts
            this.availableContracts = allContracts.filter(contract => contract.status === 'AVAILABLE');
            this.isLoading = false;
            console.log('Available contracts for CREATE page:', this.availableContracts);

            // Set maxAmount to total of all available contracts
            this.maxAmount = this.getTotalAvailableFromAllContracts();
            // Set default selected amount to a reasonable starting point
            this.selectedAmount = this.maxAmount > 0 ? Math.round(this.maxAmount * 0.3) : 0;

            console.log('Max amount from all contracts:', this.maxAmount);
            console.log('Initial selected amount:', this.selectedAmount);
          }
        },
        error: (error) => {
          console.error('Error getting contracts from DataService:', error);
        }
      });

    // Load data if not already loaded
    this.dataService.loadInitialData();

    // Also try direct API call as fallback
    this.apiService.getAvailableContracts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (contracts) => {
          console.log('Direct API contracts loaded for CREATE page:', contracts);
          if (this.availableContracts.length === 0) {
            this.availableContracts = contracts;

            // Set maxAmount to total of all available contracts
            this.maxAmount = this.getTotalAvailableFromAllContracts();
            // Set default selected amount to a reasonable starting point
            this.selectedAmount = this.maxAmount > 0 ? Math.round(this.maxAmount * 0.3) : 0;

            console.log('Max amount from all contracts (API):', this.maxAmount);
            console.log('Initial selected amount (API):', this.selectedAmount);
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading available contracts:', error);
          this.hasError = true;
          this.errorMessage = 'Failed to load contracts';
          this.isLoading = false;
        }
      });
  }

  onContractSelectionChange(event: { selectedRows: Contract[] }) {
    console.log('Manual contract selection changed! Event:', event);
    this.selectedContracts = event.selectedRows;
    this.selectedContractIds = this.selectedContracts.map(contract => contract.id);

    // Update selected amount to match manually selected contracts
    this.selectedAmount = this.getTotalAvailable();

    console.log('Selected contracts:', this.selectedContracts);
    console.log('Selected contract IDs:', this.selectedContractIds);
    console.log('Updated selected amount to match contracts:', this.selectedAmount);
  }

  calculateTotal(): number {
    console.log('calculateTotal called - selectedAmount:', this.selectedAmount);
    return this.selectedAmount; // Use selected amount instead of total available
  }

  calculateFee(): number {
    return this.selectedAmount * 0.12; // Use selected amount for fee calculation
  }

  calculateNetAmount(): number {
    // This is what you actually receive (contract value - fee)
    return this.selectedAmount - this.calculateFee();
  }

  calculatePayback(): number {
    // This is what you pay back (contract value + fee)
    return this.selectedAmount + this.calculateFee();
  }

  nextStep() {
    if (this.currentStep < 2) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goBack() {
    console.log('Navigate back to previous page');
    // TODO: Implement navigation
  }

  async submitCashkick() {
    if (this.cashkickForm.invalid) {
      return;
    }

    this.isSubmitting = true;

    const cashKickName = this.cashkickForm.get('name')?.value || '';
    const cashKickData: CashKickCreateRequest = {
      contracts: this.selectedContractIds,
      rate: 0.12, // 12% rate as shown in the calculation
      payBackAmount: this.calculatePayback(),
      name: cashKickName,
      currencyCode: 'USD'
    };

    try {
      console.log('Submitting cashkick:', cashKickData);

      const result = await this.apiService.createCashKick(cashKickData).toPromise();

      console.log('Cashkick submitted successfully:', result);

      this.closeNameModal();

      // Refresh data to show updated contract statuses
      this.dataService.forceRefreshData();

      // Prepare success data
      this.successData = {
        name: cashKickName,
        amount: this.selectedAmount,
        payBackAmount: this.calculatePayback(),
        contractCount: this.selectedContracts.length,
        contracts: this.selectedContracts.map(c => c.name).join(', ')
      };

      // Show success modal with animation
      this.showSuccessModal = true;

    } catch (error) {
      console.error('Error submitting cashkick:', error);
      this.hasError = true;
      this.errorMessage = 'Failed to create cashkick. Please try again.';
    } finally {
      this.isSubmitting = false;
    }
  }

  // Calculation Methods
  getTotalAvailable(): number {
    const total = this.selectedContracts.reduce((total, contract) => total + contract.totalAvailable, 0);
    console.log('getTotalAvailable called - selectedContracts:', this.selectedContracts);
    console.log('getTotalAvailable result:', total);
    return total;
  }

  /**
   * Get total available amount from all contracts (not just selected)
   */
  getTotalAvailableFromAllContracts(): number {
    return this.availableContracts.reduce((total, contract) => total + contract.totalAvailable, 0);
  }

  onSliderChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.selectedAmount = parseInt(target.value, 10);
    console.log('Slider changed:', this.selectedAmount);

    // Auto-select contracts based on slider amount
    this.autoSelectContractsByAmount(this.selectedAmount);

    console.log('Payback amount:', this.calculatePayback());
    console.log('Fee amount:', this.calculateFee());
  }

  /**
   * Automatically select contracts to match the slider amount
   * Uses a greedy algorithm to select contracts efficiently
   */
  private autoSelectContractsByAmount(targetAmount: number): void {
    console.log('Auto-selecting contracts for amount:', targetAmount);

    // Clear current selection
    this.selectedContracts = [];
    this.selectedContractIds = [];

    // Sort contracts by totalAvailable in descending order for better selection
    const sortedContracts = [...this.availableContracts].sort(
      (a, b) => b.totalAvailable - a.totalAvailable
    );

    let currentTotal = 0;
    const tolerance = 10000; // Allow some tolerance for rounding

    // First pass: Try to get close to target with larger contracts
    for (const contract of sortedContracts) {
      if (currentTotal + contract.totalAvailable <= targetAmount + tolerance) {
        this.selectedContracts.push(contract);
        this.selectedContractIds.push(contract.id);
        currentTotal += contract.totalAvailable;

        if (Math.abs(currentTotal - targetAmount) <= tolerance) {
          break;
        }
      }
    }

    // Second pass: If we're still under target, try smaller contracts
    if (currentTotal < targetAmount - tolerance) {
      const remainingContracts = sortedContracts.filter(
        contract => !this.selectedContractIds.includes(contract.id)
      );

      for (const contract of remainingContracts) {
        if (currentTotal + contract.totalAvailable <= targetAmount + tolerance) {
          this.selectedContracts.push(contract);
          this.selectedContractIds.push(contract.id);
          currentTotal += contract.totalAvailable;

          if (Math.abs(currentTotal - targetAmount) <= tolerance) {
            break;
          }
        }
      }
    }

    // If still over target, try to optimize by removing and replacing
    if (currentTotal > targetAmount + tolerance) {
      this.optimizeSelection(targetAmount, tolerance);
    }

    console.log('Auto-selected contracts:', this.selectedContracts.map(c => c.name));
    console.log('Total selected amount:', this.calculateTotal());
    console.log('Target amount:', targetAmount);
  }

  /**
   * Optimize selection by trying different combinations
   */
  private optimizeSelection(targetAmount: number, tolerance: number): void {
    const currentTotal = this.calculateTotal();

    if (currentTotal <= targetAmount + tolerance) {
      return; // Already within tolerance
    }

    // Try removing the largest contract and adding smaller ones
    const sortedSelected = [...this.selectedContracts].sort(
      (a, b) => b.totalAvailable - a.totalAvailable
    );

    for (let i = 0; i < sortedSelected.length; i++) {
      const contractToRemove = sortedSelected[i];
      const tempSelected = this.selectedContracts.filter(c => c.id !== contractToRemove.id);
      const tempTotal = tempSelected.reduce((sum, c) => sum + c.totalAvailable, 0);

      if (tempTotal <= targetAmount + tolerance && tempTotal >= targetAmount - tolerance) {
        // This is a better selection
        this.selectedContracts = tempSelected;
        this.selectedContractIds = tempSelected.map(c => c.id);
        break;
      }
    }
  }

  getFormattedAmount(amount: number): string {
    return `$${amount.toLocaleString()}`;
  }

  getSliderPercentage(): number {
    return this.maxAmount > 0 ? (this.selectedAmount / this.maxAmount) * 100 : 0;
  }

  openNameModal() {
    this.showNameModal = true;
  }

  closeNameModal() {
    this.showNameModal = false;
    this.cashkickForm.reset();
  }

  // Success Modal Event Handlers
  onSuccessModalClosed() {
    this.showSuccessModal = false;
    this.successData = null;
    // Navigate to cash acceleration page by default
    this.router.navigate(['/cash-acceleration']);
  }

  onViewCashKicks() {
    console.log('Navigating to view cash kicks');
    this.showSuccessModal = false;
    this.router.navigate(['/cash-acceleration']);
  }

  onCreateAnother() {
    console.log('Creating another cash kick');
    this.showSuccessModal = false;
    this.successData = null;

    // Reset the form to initial state
    this.currentStep = 1;
    this.selectedContracts = [];
    this.selectedContractIds = [];
    this.selectedAmount = this.maxAmount > 0 ? Math.round(this.maxAmount * 0.3) : 0;
    this.cashkickForm.reset();

    console.log('Form reset for new cash kick');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
