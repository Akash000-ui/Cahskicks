import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../atoms/icon/icon.component';

@Component({
    selector: 'app-data-block',
    standalone: true,
    imports: [CommonModule, IconComponent],
    template: `
    <div class="data-block">
      <div class="icon-section">
        <app-icon 
          [src]="iconSrc" 
          width="40px" 
          height="40px"
        ></app-icon>
      </div>
      <div class="content-section">
        <p class="info-title">{{ infoTitle }}</p>
        <h3 class="title">{{ title }}</h3>
      </div>
    </div>
  `,
    styleUrls: ['./data-block.component.scss']
})
export class DataBlockComponent {
    @Input() iconSrc: string = '';
    @Input() infoTitle: string = '';
    @Input() title: string = '';
}
