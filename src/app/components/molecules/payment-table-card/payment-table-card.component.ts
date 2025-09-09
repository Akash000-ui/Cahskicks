import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-table-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="payments-card">
      <div class="payments-header">
        <h2 class="payments-title">{{ title }}</h2>
        <img src="assets/icons/info.png" class="info-icon" alt="Info" />
      </div>
      
      <div class="payments-table">
        <div class="table-header">
          <div class="table-col">DUE DATE</div>
          <div class="table-col">STATUS</div>
          <div class="table-col">EXPECTED AMOUNT</div>
          <div class="table-col">OUTSTANDING</div>
        </div>
        
        <div class="empty-state">
          <img src="assets/cheque.png" class="empty-icon" alt="No payments" />
          <p class="empty-text">You don't have any payments pending</p>
          <a href="#" class="empty-action" (click)="viewAllClick.emit()">Launch A New Cash Kick</a>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./payment-table-card.component.scss']
})
export class PaymentTableCardComponent {
  @Input() title = 'Your payments';
  @Output() viewAllClick = new EventEmitter<void>();
}
