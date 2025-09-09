import { Component, Input, Output, EventEmitter, forwardRef, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SliderProps {
    min?: number;
    max?: number;
    step?: number;
    value?: number;
    disabled?: boolean;
    orientation?: 'horizontal' | 'vertical';
}

@Component({
    selector: 'app-slider',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './slider.component.html',
    styleUrl: './slider.component.scss',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SliderComponent),
            multi: true
        }
    ]
})
export class SliderComponent implements ControlValueAccessor, AfterViewInit {
    @Input() min: number = 0;
    @Input() max: number = 100;
    @Input() step: number = 1;
    @Input() value: number = 0;
    @Input() disabled: boolean = false;
    @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';

    @Output() valueChange = new EventEmitter<number>();

    @ViewChild('sliderTrack', { static: true }) sliderTrack!: ElementRef;
    @ViewChild('sliderThumb', { static: true }) sliderThumb!: ElementRef;

    private isDragging = false;

    // ControlValueAccessor implementation
    private onChange = (value: number) => { };
    private onTouched = () => { };

    ngAfterViewInit(): void {
        this.updateSliderPosition();
    }

    onSliderClick(event: MouseEvent): void {
        if (this.disabled) return;

        const rect = this.sliderTrack.nativeElement.getBoundingClientRect();
        const percentage = this.orientation === 'horizontal'
            ? (event.clientX - rect.left) / rect.width
            : 1 - (event.clientY - rect.top) / rect.height;

        const newValue = this.min + (percentage * (this.max - this.min));
        this.setValue(Math.round(newValue / this.step) * this.step);
    }

    onThumbMouseDown(event: MouseEvent): void {
        if (this.disabled) return;

        event.preventDefault();
        this.isDragging = true;
        this.onTouched();

        const mouseMoveHandler = (e: MouseEvent) => {
            if (!this.isDragging) return;

            const rect = this.sliderTrack.nativeElement.getBoundingClientRect();
            const percentage = this.orientation === 'horizontal'
                ? (e.clientX - rect.left) / rect.width
                : 1 - (e.clientY - rect.top) / rect.height;

            const newValue = this.min + (percentage * (this.max - this.min));
            this.setValue(Math.round(newValue / this.step) * this.step);
        };

        const mouseUpHandler = () => {
            this.isDragging = false;
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    }

    private setValue(newValue: number): void {
        const clampedValue = Math.max(this.min, Math.min(this.max, newValue));
        this.value = clampedValue;
        this.valueChange.emit(this.value);
        this.onChange(this.value);
        this.updateSliderPosition();
    }

    private updateSliderPosition(): void {
        const percentage = ((this.value - this.min) / (this.max - this.min)) * 100;

        if (this.orientation === 'horizontal') {
            if (this.sliderThumb) {
                this.sliderThumb.nativeElement.style.left = `${percentage}%`;
            }
        } else {
            if (this.sliderThumb) {
                this.sliderThumb.nativeElement.style.bottom = `${percentage}%`;
            }
        }
    }

    writeValue(value: number): void {
        this.value = value || 0;
        setTimeout(() => this.updateSliderPosition());
    }

    registerOnChange(fn: (value: number) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    get progressPercentage(): number {
        return ((this.value - this.min) / (this.max - this.min)) * 100;
    }
}
