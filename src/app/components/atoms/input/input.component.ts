import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-input',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './input.component.html',
    styleUrl: './input.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputComponent),
            multi: true
        }
    ]
})
export class InputComponent implements ControlValueAccessor {
    @Input() placeholder: string = '';
    @Input() label?: string;
    @Input() disabled: boolean = false;
    @Input() type: string = 'text';

    @Output() valueChange = new EventEmitter<string>();
    @Output() inputFocus = new EventEmitter<void>();
    @Output() inputBlur = new EventEmitter<void>();

    value: string = '';
    isFocused: boolean = false;

    // ControlValueAccessor implementation
    private onChange = (value: string) => { };
    private onTouched = () => { };

    writeValue(value: string): void {
        this.value = value || '';
    }

    registerOnChange(fn: (value: string) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    onInput(event: Event): void {
        const target = event.target as HTMLInputElement;
        this.value = target.value;
        this.onChange(this.value);
        this.valueChange.emit(this.value);
    }

    onFocus(): void {
        this.isFocused = true;
        this.inputFocus.emit();
    }

    onBlur(): void {
        this.isFocused = false;
        this.onTouched();
        this.inputBlur.emit();
    }

    get inputClasses(): string {
        return `custom-input ${this.isFocused ? 'focused' : ''}`;
    }
}
