import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LogoWithNameComponent } from '../../molecules/logo-with-name/logo-with-name.component';
import { NavItemComponent } from '../../molecules/nav-item/nav-item.component';

interface MenuItem {
  name: string;
  icon: string;
  path: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, LogoWithNameComponent, NavItemComponent],
  template: `
    <div class="sidebar-container">
      <div class="sidebar-content">
        <div class="sidebar-top">
          <app-logo-with-name></app-logo-with-name>
          
          <div class="nav-menu">
            <app-nav-item
              *ngFor="let item of menuItems; trackBy: trackByMenuItem"
              [active]="currentPath === item.path"
              [icon]="item.icon"
              (onClick)="navigateToPath(item.path)"
            >
              {{ item.name }}
            </app-nav-item>
          </div>
        </div>
        
        <div class="sidebar-bottom">
          <app-nav-item 
            icon="/assets/icons/flash.png"
            class="watch-howto-item"
          >
            Watch how to
          </app-nav-item>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  currentPath: string = '';

  menuItems: MenuItem[] = [
    {
      name: 'Home',
      icon: 'assets/icons/home-2.png',
      path: '/home'
    },
    {
      name: 'Cash Acceleration',
      icon: 'assets/icons/dollar.png',
      path: '/cash-acceleration'
    }
  ];

  constructor(private router: Router) { }

  ngOnInit() {
    // Get current route
    this.currentPath = this.router.url;

    // Listen to route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentPath = event.url;
      });
  }

  trackByMenuItem(index: number, item: MenuItem): string {
    return item.path;
  }

  navigateToPath(path: string) {
    this.router.navigate([path]);
  }
}
