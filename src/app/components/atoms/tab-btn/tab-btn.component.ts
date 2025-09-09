import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TabBtnProps {
    label: string;
    value?: string;
    selected?: boolean;
    disabled?: boolean;
    icon?: string;
}

@Component({
    selector: 'app-tab-btn',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './tab-btn.component.html',
    styleUrl: './tab-btn.component.scss'
})
export class TabBtnComponent {
    @Input() label: string = '';
    @Input() value: string = '';
    @Input() selected: boolean = false;
    @Input() disabled: boolean = false;
    @Input() icon?: string;

    @Output() tabClick = new EventEmitter<string>();

    onClick(): void {
        if (this.disabled) return;
        this.tabClick.emit(this.value || this.label);
    }

    onKeyDown(event: KeyboardEvent): void {
        if (this.disabled) return;

        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.onClick();
        }
    }
}
