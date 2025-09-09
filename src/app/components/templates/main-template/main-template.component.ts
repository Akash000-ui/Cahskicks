import { Component, Input, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../organisms/sidebar/sidebar.component';
import { HeaderComponent } from '../../organisms/header/header.component';

@Component({
  selector: 'app-main-template',
  standalone: true,
  imports: [CommonModule, SidebarComponent, HeaderComponent],
  template: `
    <div class="main-template">
      <!-- Sidebar -->
      <app-sidebar *ngIf="showSidebar"></app-sidebar>
      
      <!-- Main Content -->
      <div class="main-content" [class.with-sidebar]="showSidebar">
        <div class="content-container">
          <!-- Header -->
          <app-header
            *ngIf="showHeader"
            [title]="headerTitle"
            [subtitle]="headerSubtitle"
            [iconSrc]="headerIconSrc"
            [iconWidth]="headerIconWidth"
            [iconHeight]="headerIconHeight"
          ></app-header>
          
          <!-- Body Content -->
          <div class="body-content">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./main-template.component.scss']
})
export class MainTemplateComponent {
  @Input() showSidebar: boolean = true;
  @Input() showHeader: boolean = true;
  @Input() headerTitle: string = '';
  @Input() headerSubtitle: string = '';
  @Input() headerIconSrc?: string;
  @Input() headerIconWidth?: string;
  @Input() headerIconHeight?: string;
}
