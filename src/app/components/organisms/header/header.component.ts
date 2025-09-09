import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../atoms/icon/icon.component';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, IconComponent],
    template: `
    <div class="header-container">
      <div class="title-container">
        <h1 class="header-title">{{ title }}</h1>
        <h2 class="header-subtitle">{{ subtitle }}</h2>
      </div>
      <div class="icon-container" *ngIf="iconSrc">
        <app-icon 
          [src]="iconSrc" 
          [width]="iconWidth || '32px'" 
          [height]="iconHeight || '32px'"
          class="header-icon"
        ></app-icon>
      </div>
    </div>
  `,
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    @Input() title: string = '';
    @Input() subtitle: string = '';
    @Input() iconSrc?: string;
    @Input() iconWidth?: string;
    @Input() iconHeight?: string;
}
