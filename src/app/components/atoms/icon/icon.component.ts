import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-icon',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './icon.component.html',
    styleUrl: './icon.component.scss'
})
export class IconComponent {
    @Input() src!: string;
    @Input() width: string = '24px';
    @Input() height: string = '24px';
    @Input() alt: string = 'Icon';

    get iconStyles(): any {
        return {
            width: this.width,
            height: this.height
        };
    }
}
