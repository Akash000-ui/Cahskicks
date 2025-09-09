import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';

export interface CheckboxProps {
    checked?: boolean;
    disabled?: boolean;
    indeterminate?: boolean;
    label?: string;
    size?: 'small' | 'medium';
}

@Component({
    selector: 'app-checkbox',
    standalone: true,
    imports: [CommonModule, IconComponent],
    templateUrl: './checkbox.component.html',
    styleUrl: './checkbox.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CheckboxComponent),
            multi: true
        }
    ]
})
export class CheckboxComponent implements ControlValueAccessor {
    @Input() checked: boolean = false;
    @Input() disabled: boolean = false;
    @Input() indeterminate: boolean = false;
    @Input() label: string = '';
    @Input() size: 'small' | 'medium' = 'medium';

    @Output() checkedChange = new EventEmitter<boolean>();

    // ControlValueAccessor implementation
    private onChange = (value: boolean) => { };
    private onTouched = () => { };

    onToggle(): void {
        if (this.disabled) return;

        this.checked = !this.checked;
        this.indeterminate = false;
        this.checkedChange.emit(this.checked);
        this.onChange(this.checked);
        this.onTouched();
    }

    writeValue(value: boolean): void {
        this.checked = value;
    }

    registerOnChange(fn: (value: boolean) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    get iconSrc(): string {
        if (this.indeterminate) {
            return 'assets/icons/minus-square.png';
        }
        return this.checked ? 'assets/icons/tick-square.png' : 'assets/icons/box.png';
    }

    get iconSize(): string {
        if (this.indeterminate || this.checked) {
            return '20px';
        }
        return '16.67px';
    }
}
