import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TabItem {
    label: string;
    value: string;
    disabled?: boolean;
}

@Component({
    selector: 'app-tabs',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="tabs-container">
      <div class="tabs-flex-container">
        <button
          *ngFor="let tab of tabs; trackBy: trackByTab"
          class="tab-button"
          [class.active]="tab.value === activeTab"
          [disabled]="tab.disabled"
          (click)="selectTab(tab.value)"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>
  `,
    styleUrls: ['./tabs.component.scss']
})
export class TabsComponent {
    @Input() tabs: TabItem[] = [];
    @Input() activeTab: string = '';

    @Output() tabChange = new EventEmitter<string>();

    trackByTab(index: number, tab: TabItem): string {
        return tab.value;
    }

    selectTab(value: string) {
        if (this.activeTab !== value) {
            this.activeTab = value;
            this.tabChange.emit(value);
        }
    }
}
