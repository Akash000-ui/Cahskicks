import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="success-overlay" *ngIf="isOpen" (click)="onBackgroundClick()">
      <div class="success-modal" (click)="$event.stopPropagation()">
        
        <!-- Close Button -->
        <button class="modal-close" (click)="close()">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>

        <!-- Header Section -->
        <div class="modal-header">
          <h2 class="success-title">Cash kick launched successfully</h2>
          <p class="success-subtitle">We are reviewing your cash kick</p>
        </div>

        <!-- Success Animation -->
        <div class="chart-container">
          <img src="assets/cashkicksuccess.gif" alt="Cash kick success" class="success-gif" />
        </div>

        <!-- Status Message -->
        <div class="status-section">
          <h3 class="status-title">Your cash kick is under review</h3>
          <p class="status-description">
            It will remain on pending state until we review it internally. This can take upto
            5 mins to couple of hours. Once reviewed, the cash will be transferred to
            your account and you'll be notified.
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button class="btn btn-secondary" (click)="close()">
            Close
          </button>
          <button class="btn btn-primary" (click)="viewCashKicks()">
            View Cash Kicks
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./success-modal.component.scss']
})
export class SuccessModalComponent {
  @Input() isOpen = false;
  @Input() cashKickData: any = null;
  @Output() closed = new EventEmitter<void>();
  @Output() viewCashKicksClicked = new EventEmitter<void>();
  @Output() createAnotherClicked = new EventEmitter<void>();

  constructor(private router: Router) { }

  onBackgroundClick() {
    // Prevent closing on background click to ensure user sees the success message
    // They must use one of the action buttons
  }

  close() {
    this.isOpen = false;
    this.closed.emit();
  }

  viewCashKicks() {
    this.close();
    this.router.navigate(['/cash-acceleration']);
    this.viewCashKicksClicked.emit();
  }

  createAnother() {
    this.close();
    // Stay on current page but reset form
    this.createAnotherClicked.emit();
  }

  goToHome() {
    this.close();
    this.router.navigate(['/home']);
  }
}
