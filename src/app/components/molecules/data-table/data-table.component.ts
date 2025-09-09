import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxComponent } from '../../atoms/checkbox/checkbox.component';

export interface TableColumn {
  name: string;
  accessor: (row: any) => any;
  render?: (params: { value: any, theme?: any }) => string;
}

export interface TableErrorProps {
  image?: string;
  title?: string;
  subtitle?: string;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, CheckboxComponent],
  template: `
  <div class="table-container" [ngClass]="{ 'full-width': fullWidth }">
  <div *ngIf="title" class="table-title">{{ title }}</div>
      <table class="data-table">
        <thead class="table-head">
          <tr class="table-row">
            <th 
              *ngIf="selectable" 
              class="table-cell checkbox-cell" 
              role="columnheader"
            >
              <app-checkbox
                [checked]="isAllSelected()"
                [indeterminate]="isIndeterminate()"
                (checkedChange)="handleSelectAllClick($event)"
              ></app-checkbox>
            </th>
            <th 
              *ngFor="let col of cols; trackBy: trackByColumn" 
        class="table-cell"
        [class.numeric-column]="isNumericColumn(col.name)"
            >
              <span class="table-header-text">{{ col.name }}</span>
            </th>
          </tr>
        </thead>
        <tbody class="table-body" *ngIf="rows && rows.length > 0">
          <tr 
            *ngFor="let row of rows; trackBy: trackByRow; let i = index"
            class="table-row"
            [class.selected]="selectable && isSelected(row.id)"
          >
            <td *ngIf="selectable" class="table-cell checkbox-cell">
              <app-checkbox
                [id]="row.id + 'cbox'"
                [checked]="isSelected(row.id)"
                (checkedChange)="handleRowClick(row.id)"
              ></app-checkbox>
            </td>
            <td 
              *ngFor="let col of cols; trackBy: trackByColumn; let colIndex = index" 
        class="table-cell"
              [class.status-column]="col.name === 'Status'"
        [class.numeric-column]="isNumericColumn(col.name)"
            >
              <!-- Special handling for Status column -->
              <span 
                *ngIf="col.name === 'Status'"
                class="status-badge"
                [class.status-available]="normalizeStatus(col.accessor(row)) === 'AVAILABLE'"
                [class.status-unavailable]="normalizeStatus(col.accessor(row)) === 'UNAVAILABLE'"
                [class.status-pending]="normalizeStatus(col.accessor(row)) === 'PENDING'"
              >
                {{ normalizeStatus(col.accessor(row)) }}
              </span>
              
              <!-- Regular handling for other columns -->
              <span 
                *ngIf="col.name !== 'Status' && !col.render" 
                [innerHTML]="col.accessor(row)"
              ></span>
              <span 
                *ngIf="col.name !== 'Status' && col.render" 
                [innerHTML]="col.render({value: col.accessor(row)})"
              ></span>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Empty State -->
      <div *ngIf="!rows || rows.length === 0" class="empty-state">
        <img 
          *ngIf="empty?.image" 
          [src]="empty!.image" 
          class="empty-icon"
          alt="Empty state"
        />
        <p *ngIf="empty?.title" class="empty-title">{{ empty!.title }}</p>
        <p *ngIf="empty?.subtitle" class="empty-subtitle">{{ empty!.subtitle }}</p>
      </div>
    </div>
  `,
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit, OnChanges {
  @Input() cols: TableColumn[] = [];
  @Input() rows: any[] = [];
  @Input() title?: string;
  @Input() empty?: TableErrorProps;
  @Input() selectable: boolean = false;
  @Input() pageState?: string;
  @Input() selectedContracts?: any;
  @Input() selectedRowIds: number[] = [];
  @Input() fullWidth: boolean = false;

  @Output() onSelectionChange = new EventEmitter<{ selectedRows: any[] }>();

  selected: number[] = [];

  ngOnInit() {
    console.log('DataTable ngOnInit - cols:', this.cols);
    console.log('DataTable ngOnInit - rows:', this.rows);
    this.selected = [...this.selectedRowIds];
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('DataTable ngOnChanges:', changes);
    if (changes['rows']) {
      console.log('Rows changed:', changes['rows'].currentValue);
    }
    if (changes['selectedRowIds']) {
      this.selected = [...this.selectedRowIds];
    }
  }

  trackByColumn(index: number, col: TableColumn): string {
    return col.name;
  }

  trackByRow(index: number, row: any): any {
    return row.id || index;
  }

  isSelected(id: number): boolean {
    return this.selected.indexOf(id) !== -1;
  }

  isAllSelected(): boolean {
    return this.rows && this.rows.length > 0 && this.selected.length === this.rows.length;
  }

  isIndeterminate(): boolean {
    return this.selected.length > 0 && this.rows && this.selected.length < this.rows.length;
  }

  selectionChanged(newSelected: number[]) {
    if (this.onSelectionChange) {
      this.onSelectionChange.emit({
        selectedRows: this.rows.filter(row => newSelected.includes(row.id))
      });
    }
  }

  handleSelectAllClick(checked: boolean) {
    if (checked) {
      const newSelected = this.rows.map(row => row.id);
      this.selected = newSelected;
      this.selectionChanged(newSelected);
    } else {
      this.selected = [];
      this.selectionChanged([]);
    }
  }

  handleRowClick(id: number) {
    const selectedIndex = this.selected.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = [...this.selected, id];
    } else if (selectedIndex === 0) {
      newSelected = this.selected.slice(1);
    } else if (selectedIndex === this.selected.length - 1) {
      newSelected = this.selected.slice(0, -1);
    } else if (selectedIndex > 0) {
      newSelected = [
        ...this.selected.slice(0, selectedIndex),
        ...this.selected.slice(selectedIndex + 1)
      ];
    }

    this.selected = newSelected;
    this.selectionChanged(newSelected);
  }

  handleClick(event: Event, id: number) {
    event.stopPropagation();
    this.handleRowClick(id);
  }

  // Numeric columns aligned to match screenshot (currency, totals, rates)
  isNumericColumn(name: string): boolean {
    return [
      'Per Payment',
      'Total Financed',
      'Total Available',
      'Total Received',
      'Rate'
    ].includes(name);
  }

  normalizeStatus(value: any): string {
    return String(value ?? '').trim().toUpperCase();
  }
}
