import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent, TableColumn } from '../../components/molecules/data-table/data-table.component';
import { ModalComponent } from '../../components/molecules/modal/modal.component';
import { TabsComponent, TabItem } from '../../components/molecules/tabs/tabs.component';
import { MainTemplateComponent } from '../../components/templates/main-template/main-template.component';
import { ButtonComponent } from '../../components/atoms/button/button.component';

interface TestData {
    id: number;
    name: string;
    status: string;
    amount: number;
}

@Component({
    selector: 'app-component-demo',
    standalone: true,
    imports: [
        CommonModule,
        DataTableComponent,
        ModalComponent,
        TabsComponent,
        MainTemplateComponent,
        ButtonComponent
    ],
    template: `
    <app-main-template
      headerTitle="Component Demo"
      headerSubtitle="Testing Phase 5 Components"
      headerIconSrc="assets/example-avatar.png"
    >
      <!-- Tabs Demo -->
      <div class="demo-section">
        <h2>Tabs Component</h2>
        <app-tabs 
          [tabs]="tabItems" 
          [activeTab]="activeTab"
          (tabChange)="onTabChange($event)"
        ></app-tabs>
      </div>

      <!-- DataTable Demo -->
      <div class="demo-section">
        <h2>DataTable Component</h2>
        <app-data-table
          [cols]="tableColumns"
          [rows]="tableData"
          [selectable]="true"
          [selectedRowIds]="selectedRows"
          (onSelectionChange)="onSelectionChange($event)"
        ></app-data-table>
        
        <div class="demo-buttons">
          <app-button type="primary" (click)="showModal = true">
            Show Modal
          </app-button>
          <app-button type="background" (click)="clearSelection()">
            Clear Selection
          </app-button>
        </div>
      </div>

      <!-- Modal Demo -->
      <app-modal
        [open]="showModal"
        title="Demo Modal"
        subtitle="This is a test modal component"
        cancelActionText="Cancel"
        acceptActionText="Confirm"
        [acceptBtnDisabled]="false"
        (onCancel)="showModal = false"
        (onAccept)="handleModalAccept()"
        (onClose)="showModal = false"
      >
        <p>This is the content inside the modal. You can put any content here.</p>
        <p>Selected items: {{ selectedRows.length }}</p>
      </app-modal>
    </app-main-template>
  `,
    styleUrls: ['./component-demo.component.scss']
})
export class ComponentDemoComponent {
    showModal = false;
    activeTab = 'tab1';
    selectedRows: number[] = [];

    tabItems: TabItem[] = [
        { label: 'Tab 1', value: 'tab1' },
        { label: 'Tab 2', value: 'tab2' },
        { label: 'Disabled Tab', value: 'tab3', disabled: true }
    ];

    tableColumns: TableColumn[] = [
        {
            name: 'Name',
            accessor: (row: TestData) => row.name
        },
        {
            name: 'Status',
            accessor: (row: TestData) => row.status,
            render: ({ value }) => `<span style="color: ${value === 'Active' ? 'green' : 'red'}">${value}</span>`
        },
        {
            name: 'Amount',
            accessor: (row: TestData) => `$${row.amount.toLocaleString()}`
        }
    ];

    tableData: TestData[] = [
        { id: 1, name: 'Item 1', status: 'Active', amount: 1000 },
        { id: 2, name: 'Item 2', status: 'Inactive', amount: 2000 },
        { id: 3, name: 'Item 3', status: 'Active', amount: 3000 },
        { id: 4, name: 'Item 4', status: 'Active', amount: 4000 }
    ];

    onTabChange(tab: string) {
        this.activeTab = tab;
        console.log('Tab changed to:', tab);
    }

    onSelectionChange(event: { selectedRows: TestData[] }) {
        this.selectedRows = event.selectedRows.map(row => row.id);
        console.log('Selection changed:', event.selectedRows);
    }

    clearSelection() {
        this.selectedRows = [];
    }

    handleModalAccept() {
        console.log('Modal accepted');
        this.showModal = false;
    }
}
