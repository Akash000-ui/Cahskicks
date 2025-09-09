import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

export type ButtonSize = 'sm' | 'md' | 'lg' | 'fit';
export type ButtonType = 'primary' | 'background' | 'bordered' | 'text';

@Component({
    selector: 'app-button',
    standalone: true,
    imports: [CommonModule, MatButtonModule],
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss'
})
export class ButtonComponent {
    @Input() size: ButtonSize = 'md';
    @Input() type: ButtonType = 'primary';
    @Input() textColor?: string;
    @Input() disabled: boolean = false;
    @Input() loading: boolean = false;
    @Output() clicked = new EventEmitter<void>();

    onClick(): void {
        if (!this.disabled && !this.loading) {
            this.clicked.emit();
        }
    }

    get buttonClasses(): string {
        return `btn-${this.size} btn-${this.type}`;
    }

    get customStyles(): any {
        const styles: any = {};
        if (this.textColor) {
            styles.color = this.textColor;
        }
        return styles;
    }

    get isDisabled(): boolean {
        return this.disabled || this.loading;
    }
}
