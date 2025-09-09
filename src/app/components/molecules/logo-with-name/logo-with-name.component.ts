import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../atoms/icon/icon.component';

@Component({
    selector: 'app-logo-with-name',
    standalone: true,
    imports: [CommonModule, IconComponent],
    template: `
    <div class="logo-container">
      <app-icon 
        src="assets/icons/seeder.png" 
        width="29.88px" 
        height="28px"
        class="logo-icon"
      ></app-icon>
      <span class="logo-text">Seeder</span>
    </div>
  `,
    styleUrls: ['./logo-with-name.component.scss']
})
export class LogoWithNameComponent { }
