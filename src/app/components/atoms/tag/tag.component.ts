import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-tag',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './tag.component.html',
    styleUrl: './tag.component.scss'
})
export class TagComponent {
    // Simple tag component that wraps content with styling
}
