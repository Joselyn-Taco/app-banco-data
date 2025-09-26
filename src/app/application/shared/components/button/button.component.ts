import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: false,
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() label: string = 'Click';
  @Input() size: string = '14px';
  @Input() customClass: string = 'btn_default';
  @Input() disabled = false;

  @Output() clicked = new EventEmitter<void>();

  onClick() {
    this.clicked.emit(); // emite el evento hacia el padre
  }
}
