import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataBlockComponent } from '../../molecules/data-block/data-block.component';

@Component({
  selector: 'app-data-card',
  standalone: true,
  imports: [CommonModule, DataBlockComponent],
  template: `
    <div class="data-card">
      <div class="data-row">
        <app-data-block
          [iconSrc]="termCapIconSrc"
          [infoTitle]="termCapInfoTitle"
          [title]="termCapTitle"
        ></app-data-block>
        <app-data-block
          [iconSrc]="availableCreditIconSrc"
          [infoTitle]="availableCreditInfoTitle"
          [title]="availableCreditTitle"
        ></app-data-block>
        <app-data-block
          [iconSrc]="dueDateIconSrc"
          [infoTitle]="dueDateInfoTitle"
          [title]="dueDateTitle"
        ></app-data-block>
      </div>
    </div>
  `,
  styleUrls: ['./data-card.component.scss']
})
export class DataCardComponent {
  @Input() termCapIconSrc: string = 'assets/icons/calendar.png';
  @Input() termCapInfoTitle: string = 'Term cap';
  @Input() termCapTitle: string = '12 months';

  @Input() availableCreditIconSrc: string = 'assets/icons/document-download.png';
  @Input() availableCreditInfoTitle: string = 'Available credit';
  @Input() availableCreditTitle: string = '$523K';

  @Input() dueDateIconSrc: string = 'assets/icons/percentage-square.png';
  @Input() dueDateInfoTitle: string = 'Max interest rate';
  @Input() dueDateTitle: string = '12%';
}
