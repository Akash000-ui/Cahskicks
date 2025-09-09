import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../atoms/button/button.component';

@Component({
  selector: 'app-congrats-card',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="congrats-card">
      <div class="card-content">
        <div class="card-text">
          <h1 class="card-title">{{ title }}</h1>
          <p class="card-body" [innerHTML]="body"></p>
        </div>
        <div class="card-button" *ngIf="actionText">
          <app-button 
            type="bordered" 
            size="lg"
            (click)="onAction.emit()"
          >
            {{ actionText }}
          </app-button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./congrats-card.component.scss']
})
export class CongratsCardComponent {
  @Input() title: string = '';
  @Input() body: string = '';
  @Input() actionText?: string;

  @Output() onAction = new EventEmitter<void>();
}
