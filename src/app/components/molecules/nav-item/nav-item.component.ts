import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../atoms/icon/icon.component';

@Component({
    selector: 'app-nav-item',
    standalone: true,
    imports: [CommonModule, IconComponent],
    template: `
    <button 
      class="nav-item"
      [class.active]="active"
      (click)="onClick.emit()"
      [disabled]="disabled"
    >
      <app-icon 
        *ngIf="icon"
        [src]="icon" 
        width="16px" 
        height="16px"
        class="nav-icon"
      ></app-icon>
      <span class="nav-text">
        <ng-content></ng-content>
      </span>
    </button>
  `,
    styleUrls: ['./nav-item.component.scss']
})
export class NavItemComponent {
    @Input() active: boolean = false;
    @Input() icon?: string;
    @Input() disabled: boolean = false;

    @Output() onClick = new EventEmitter<void>();
}
