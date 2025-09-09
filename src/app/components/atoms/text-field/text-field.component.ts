import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-text-field',
    standalone: true,
    imports: [CommonModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TextFieldComponent),
            multi: true
        }
    ],
    template: `
    <div class="text-field" [class.disabled]="disabled">
      <label *ngIf="label" class="label">{{ label }}</label>
      <input
        #input
        type="text"
        class="input"
        [placeholder]="placeholder"
        [value]="value"
        [disabled]="disabled"
        (input)="onInput($event)"
        (blur)="onTouched()"
        (focus)="onFocus()"
      />
    </div>
  `,
    styleUrls: ['./text-field.component.scss']
})
export class TextFieldComponent implements ControlValueAccessor {
    @Input() label: string = '';
    @Input() placeholder: string = '';
    @Input() disabled: boolean = false;
    @Input() value: string = '';

    @Output() valueChange = new EventEmitter<string>();
    @Output() focus = new EventEmitter<void>();
    @Output() blur = new EventEmitter<void>();

    private onChange = (value: string) => { };
    onTouched = () => { };

    onInput(event: Event) {
        const target = event.target as HTMLInputElement;
        this.value = target.value;
        this.valueChange.emit(this.value);
        this.onChange(this.value);
    }

    onFocus() {
        this.focus.emit();
    }

    // ControlValueAccessor implementation
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
}
