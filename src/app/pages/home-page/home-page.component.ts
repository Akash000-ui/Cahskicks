import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MainTemplateComponent } from '../../components/templates/main-template/main-template.component';
import { CongratsCardComponent } from '../../components/molecules/congrats-card/congrats-card.component';
import { LaunchCashKickCardComponent } from '../../components/molecules/launch-cashkick-card/launch-cashkick-card.component';
import { PaymentTableCardComponent } from '../../components/molecules/payment-table-card/payment-table-card.component';
import { TourModalComponent } from '../../components/molecules/tour-modal/tour-modal.component';
import { ApiService } from '../../services/api.service';
import { TourService } from '../../services/tour.service';
import { CreditLimit } from '../../models';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CommonModule,
    MainTemplateComponent,
    CongratsCardComponent,
    LaunchCashKickCardComponent,
    PaymentTableCardComponent,
    TourModalComponent
  ],
  template: `
    <app-main-template>
      <div class="home-page">
        <div class="home-header">
          <div class="header-left">
            <h1 class="page-title">{{ greeting }} ✋</h1>
            <p class="page-date">{{ getCurrentDate() }}</p>
          </div>
          <button class="help-btn" (click)="showTour()" title="Take Tour">
            <span class="help-icon">❓</span>
            <span class="help-text">Need Help?</span>
          </button>
        </div>
        
        <div class="cards-section">
          <div class="cards-row">
            <app-congrats-card
              title="Congratulations you are ready to start!"
              [body]="congratsDescription"
              actionText="Learn More"
              (onAction)="navigateToLearnMore()"
            ></app-congrats-card>
            
            <app-launch-cashkick-card
              title="Launch a new<br />Cash Kick"
              [body]="launchDescription"
              actionText="New Cash Kick"
              (onAction)="navigateToNewCashkick()"
            ></app-launch-cashkick-card>
          </div>
        </div>

        <div class="payments-section">
          <app-payment-table-card
            title="Your payments"
            (viewAllClick)="navigateToNewCashkick()"
          ></app-payment-table-card>
        </div>
      </div>
    </app-main-template>

    <!-- Tour Modal -->
    <app-tour-modal
      [isOpen]="showTourModal"
      (tourClosed)="onTourClosed()"
      (tourCompleted)="onTourCompleted()">
    </app-tour-modal>
  `,
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit, OnDestroy, AfterViewInit {
  private destroy$ = new Subject<void>();

  creditLimit: CreditLimit | null = null;
  greeting = '';
  congratsDescription = 'You are approved for funding. We are ready to advance you up to $875,000.00.';
  launchDescription = 'You have up to <strong>$875,000.00</strong> available for a new cash advance';
  showTourModal = false;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private tourService: TourService
  ) { }

  ngOnInit() {
    this.greeting = this.getGreeting();
    this.loadCreditLimit();
  }

  ngAfterViewInit() {
    this.checkIfShouldShowTour();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCreditLimit() {
    this.apiService.getCreditLimit()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (creditLimit) => {
          this.creditLimit = creditLimit;
          this.updateDescriptions();
        },
        error: (error) => {
          console.error('Error loading credit limit:', error);
          // Set default values from our new db.json data if API fails
          this.creditLimit = {
            totalAmount: 1200000,
            availableCreditAmount: 875000,
            currencyCode: 'USD',
            rate: 12,
            termPeriod: 12,
            termType: 'MONTHLY'
          };
          this.updateDescriptions();
        }
      });
  }

  private updateDescriptions() {
    if (this.creditLimit) {
      this.congratsDescription = `You are approved for funding. We are ready to advance you upto ${this.formatCurrency(this.creditLimit.availableCreditAmount)}.`;
      this.launchDescription = `You have upto <strong>${this.formatCurrency(this.creditLimit.availableCreditAmount)}</strong> available for a new cash advance`;
    }
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  getCurrentDate(): string {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  }

  navigateToLearnMore() {
    console.log('Navigate to learn more');
    // TODO: Implement navigation to learn more page
  }

  navigateToViewCashkicks() {
    console.log('Navigate to view cashkicks');
    this.router.navigate(['/cash-acceleration']);
  }

  navigateToNewCashkick() {
    console.log('Navigate to new cashkick');
    this.router.navigate(['/create']);
  }

  navigateToAllPayments() {
    console.log('Navigate to all payments');
    // TODO: Implement navigation to payments page
  }

  // Tour-related methods
  private checkIfShouldShowTour() {
    // Show tour for first-time users after a small delay
    if (this.tourService.shouldShowTour()) {
      setTimeout(() => {
        this.showTourModal = true;
      }, 1000);
    }
  }

  showTour() {
    this.showTourModal = true;
  }

  onTourClosed() {
    this.showTourModal = false;
    this.tourService.skipTour();
  }

  onTourCompleted() {
    this.showTourModal = false;
    this.tourService.completeTour();
    console.log('🎉 Tour completed! User is ready to use the app.');
  }
}
