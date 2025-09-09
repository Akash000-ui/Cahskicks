import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../atoms/button/button.component';

@Component({
    selector: 'app-launch-cashkick-card',
    standalone: true,
    imports: [CommonModule, ButtonComponent],
    template: `
    <div class="launch-card">
      <div class="launch-content">
        <div class="launch-text">
          <h1 class="launch-title" [innerHTML]="title"></h1>
          <p class="launch-body" [innerHTML]="body"></p>
        </div>
        <div class="launch-button">
          <app-button 
            type="primary" 
            size="lg"
            (click)="onAction.emit()"
          >
            {{ actionText }}
          </app-button>
        </div>
      </div>
    </div>
  `,
    styleUrls: ['./launch-cashkick-card.component.scss']
})
export class LaunchCashKickCardComponent {
    @Input() title: string = '';
    @Input() body: string = '';
    @Input() actionText: string = '';

    @Output() onAction = new EventEmitter<void>();
}
