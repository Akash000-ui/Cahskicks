import { Component, Input, Output, EventEmitter, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../atoms/button/button.component';
import { IconComponent } from '../../atoms/icon/icon.component';

@Component({
    selector: 'app-modal',
    standalone: true,
    imports: [CommonModule, ButtonComponent, IconComponent],
    template: `
    <div class="modal-backdrop" *ngIf="open" (click)="handleBackdropClick($event)">
      <div class="modal-container" (click)="$event.stopPropagation()">
        <!-- Modal Header -->
        <div class="modal-header">
          <div class="modal-title-box">
            <h1 class="modal-title">{{ title }}</h1>
            <h2 *ngIf="subtitle" class="modal-subtitle">{{ subtitle }}</h2>
          </div>
          
          <button class="modal-close-btn" (click)="onClose.emit()">
            <app-icon 
              src="assets/icons/cross.png" 
              width="32px" 
              height="32px"
            ></app-icon>
          </button>
        </div>

        <!-- Modal Content -->
        <div class="modal-content">
          <ng-content></ng-content>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <app-button 
            size="lg" 
            type="background" 
            (click)="onCancel.emit()"
          >
            {{ cancelActionText || 'Cancel' }}
          </app-button>
          <app-button
            [disabled]="acceptBtnDisabled || false"
            size="lg"
            type="primary"
            (click)="onAccept.emit()"
          >
            {{ acceptActionText || 'Accept' }}
          </app-button>
        </div>
      </div>
    </div>
  `,
    styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
    @Input() open: boolean = false;
    @Input() title: string = '';
    @Input() subtitle?: string;
    @Input() cancelActionText?: string;
    @Input() acceptActionText?: string;
    @Input() acceptBtnDisabled?: boolean = false;

    @Output() onCancel = new EventEmitter<void>();
    @Output() onAccept = new EventEmitter<void>();
    @Output() onClose = new EventEmitter<void>();

    handleBackdropClick(event: Event) {
        if (event.target === event.currentTarget) {
            this.onClose.emit();
        }
    }
}
