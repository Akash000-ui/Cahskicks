import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TourStep {
    id: number;
    title: string;
    content: string;
    image?: string;
    targetElement?: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

@Component({
    selector: 'app-tour-modal',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="tour-overlay" *ngIf="isOpen" (click)="closeTour()">
      <div class="tour-modal" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="tour-header">
          <h2 class="tour-title">{{ currentStep.title }}</h2>
          <button class="tour-close" (click)="closeTour()">
            <span class="close-icon">×</span>
          </button>
        </div>

        <!-- Progress indicator -->
        <div class="tour-progress">
          <div class="progress-bar">
            <div class="progress-fill" [style.width.%]="progressPercentage"></div>
          </div>
          <span class="progress-text">{{ currentStepIndex + 1 }} of {{ tourSteps.length }}</span>
        </div>

        <!-- Content -->
        <div class="tour-content">
          <div class="tour-image" *ngIf="currentStep.image">
            <img [src]="currentStep.image" [alt]="currentStep.title" />
          </div>
          
          <div class="tour-text" [innerHTML]="currentStep.content"></div>
        </div>

        <!-- Navigation -->
        <div class="tour-navigation">
          <button 
            class="tour-btn tour-btn-secondary" 
            (click)="previousStep()" 
            [disabled]="currentStepIndex === 0"
            *ngIf="currentStepIndex > 0">
            Previous
          </button>
          
          <button 
            class="tour-btn tour-btn-skip" 
            (click)="closeTour()"
            *ngIf="currentStepIndex < tourSteps.length - 1">
            Skip Tour
          </button>

          <button 
            class="tour-btn tour-btn-primary" 
            (click)="nextStep()"
            *ngIf="currentStepIndex < tourSteps.length - 1">
            Next
          </button>

          <button 
            class="tour-btn tour-btn-primary" 
            (click)="finishTour()"
            *ngIf="currentStepIndex === tourSteps.length - 1">
            Get Started!
          </button>
        </div>
      </div>
    </div>

    <!-- Spotlight overlay for highlighting elements -->
    <div class="tour-spotlight" *ngIf="isOpen && currentStep.targetElement" 
         [attr.data-target]="currentStep.targetElement">
    </div>
  `,
    styleUrls: ['./tour-modal.component.scss']
})
export class TourModalComponent implements OnInit {
    @Input() isOpen = false;
    @Input() tourSteps: TourStep[] = [];
    @Output() tourClosed = new EventEmitter<void>();
    @Output() tourCompleted = new EventEmitter<void>();

    currentStepIndex = 0;

    get currentStep(): TourStep {
        return this.tourSteps[this.currentStepIndex] || this.tourSteps[0];
    }

    get progressPercentage(): number {
        return ((this.currentStepIndex + 1) / this.tourSteps.length) * 100;
    }

    ngOnInit() {
        // Initialize tour steps if not provided
        if (this.tourSteps.length === 0) {
            this.tourSteps = this.getDefaultTourSteps();
        }
    }

    nextStep() {
        if (this.currentStepIndex < this.tourSteps.length - 1) {
            this.currentStepIndex++;
        }
    }

    previousStep() {
        if (this.currentStepIndex > 0) {
            this.currentStepIndex--;
        }
    }

    closeTour() {
        this.isOpen = false;
        this.currentStepIndex = 0;
        this.tourClosed.emit();
    }

    finishTour() {
        this.isOpen = false;
        this.currentStepIndex = 0;
        this.tourCompleted.emit();
    }

    private getDefaultTourSteps(): TourStep[] {
        return [
            {
                id: 1,
                title: "Welcome to Seeder! 🎉",
                content: `
          <p>Welcome to <strong>Seeder</strong> - your smart cash flow acceleration platform!</p>
          <p>We help businesses convert their recurring revenue contracts into immediate cash advance, so you can grow faster without waiting for payments.</p>
          <ul>
            <li>✅ Convert contracts to instant cash</li>
            <li>✅ No collateral required</li>
            <li>✅ Transparent pricing</li>
            <li>✅ Quick approval process</li>
          </ul>
        `,
                image: "assets/bannerimg.png"
            },
            {
                id: 2,
                title: "How Cash Kicks Work 💰",
                content: `
          <p>A <strong>Cash Kick</strong> is our term for cash advance based on your contracts:</p>
          <ol>
            <li><strong>Upload Contracts:</strong> Connect your recurring revenue contracts (SaaS subscriptions, service agreements, etc.)</li>
            <li><strong>Get Approved:</strong> We analyze your contracts and approve you for funding</li>
            <li><strong>Select Amount:</strong> Choose how much cash you want upfront</li>
            <li><strong>Receive Funds:</strong> Get money in your account within 24 hours</li>
            <li><strong>Automatic Repayment:</strong> We collect directly from your customers as contracts pay out</li>
          </ol>
        `,
                image: "assets/cashkicksuccess.gif"
            },
            {
                id: 3,
                title: "Your Available Credit 💳",
                content: `
          <p>Based on your connected contracts, you have <strong>$875,000</strong> available for cash advance!</p>
          <p><strong>How we calculate this:</strong></p>
          <ul>
            <li>📊 We analyze your contract values</li>
            <li>📈 Consider payment history and reliability</li>
            <li>⚡ Factor in contract terms and duration</li>
            <li>🎯 Apply our risk assessment model</li>
          </ul>
          <p>Your available credit updates automatically as you add more contracts or existing ones perform well.</p>
        `
            },
            {
                id: 4,
                title: "Cash Acceleration Page 🚀",
                content: `
          <p>The <strong>Cash Acceleration</strong> page is your command center:</p>
          <ul>
            <li><strong>Contract Overview:</strong> See all your uploaded contracts and their status</li>
            <li><strong>Available Credit:</strong> Track your total available funding</li>
            <li><strong>Active Cash Kicks:</strong> Monitor your current cash advances</li>
            <li><strong>Performance Metrics:</strong> View interest rates, terms, and limits</li>
          </ul>
          <p>💡 <em>Tip: Sync regularly to get the latest contract updates and credit increases!</em></p>
        `
            },
            {
                id: 5,
                title: "Creating a Cash Kick 🎯",
                content: `
          <p>Ready to get cash? Here's how to create a Cash Kick:</p>
          <ol>
            <li><strong>Select Contracts:</strong> Choose which contracts you want to include</li>
            <li><strong>Interactive Slider:</strong> Drag the amount slider to select how much cash you want</li>
            <li><strong>Auto-Selection:</strong> Contracts automatically get selected/deselected based on your amount</li>
            <li><strong>Real-time Calculations:</strong> See payback amounts, fees, and terms instantly</li>
            <li><strong>Review & Submit:</strong> Confirm details and submit your cash kick</li>
          </ol>
          <p>⚡ <strong>New Feature:</strong> Smart contract selection - just drag the slider and we'll optimize which contracts to include!</p>
        `
            },
            {
                id: 6,
                title: "Payment Tracking 📊",
                content: `
          <p>Stay on top of your finances with our payment tracking:</p>
          <ul>
            <li><strong>Payment Schedule:</strong> See when payments are due</li>
            <li><strong>Automatic Collection:</strong> We handle all customer billing</li>
            <li><strong>Real-time Updates:</strong> Track payment status in real-time</li>
            <li><strong>Notifications:</strong> Get alerts for important payment events</li>
          </ul>
          <p>📈 <strong>Pro Tip:</strong> Good payment performance increases your available credit for future cash kicks!</p>
        `
            },
            {
                id: 7,
                title: "Pricing & Terms 💡",
                content: `
          <p>Transparent, competitive pricing with no hidden fees:</p>
          <ul>
            <li><strong>Interest Rate:</strong> 12% annual rate (1% monthly)</li>
            <li><strong>Term Length:</strong> Flexible 6-12 month terms</li>
            <li><strong>No Hidden Fees:</strong> What you see is what you pay</li>
            <li><strong>Early Payoff:</strong> Pay early to reduce total interest</li>
          </ul>
          <p><strong>Example:</strong> Borrow $100,000 → Pay back $112,000 over 12 months</p>
        `
            },
            {
                id: 8,
                title: "Ready to Get Started? 🎊",
                content: `
          <p>You're all set to accelerate your cash flow! Here's what to do next:</p>
          <ol>
            <li><strong>📋 Review Your Contracts:</strong> Check the Cash Acceleration page</li>
            <li><strong>💰 Create Your First Cash Kick:</strong> Click "New Cash Kick" to get started</li>
            <li><strong>📊 Monitor Performance:</strong> Track your payments and available credit</li>
          </ol>
          <p>💫 <strong>Welcome to faster growth with Seeder!</strong></p>
          <p>Need help? Our support team is available 24/7 to assist you.</p>
        `
            }
        ];
    }
}
