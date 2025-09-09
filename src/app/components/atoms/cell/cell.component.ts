import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type CellType = 'head' | 'body';

export interface CellProps {
    type?: CellType;
    align?: 'left' | 'center' | 'right';
    width?: string;
    sticky?: boolean;
}

@Component({
    selector: 'app-cell',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './cell.component.html',
    styleUrl: './cell.component.scss'
})
export class CellComponent {
    @Input() type: CellType = 'body';
    @Input() align: 'left' | 'center' | 'right' = 'left';
    @Input() width?: string;
    @Input() sticky: boolean = false;
}
