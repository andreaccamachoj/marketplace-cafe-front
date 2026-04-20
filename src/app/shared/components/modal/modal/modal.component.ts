import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})

export class ModalComponent implements OnChanges {
  @Input({ required: true }) title!: string;
  @Input() subtitle?: string;
  @Input({ required: true }) isOpen = false;

  @Output() isOpenChange = new EventEmitter<boolean>();

  @ViewChild('dialogRef') private dialogRef!: ElementRef<HTMLDialogElement>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']) {
      this.toggleModal(this.isOpen);
    }
  }

  private toggleModal(isOpen: boolean): void {
    const dialog = this.dialogRef?.nativeElement;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal(); // API nativa: atrapa el foco y crea el backdrop
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }

  closeModal(): void {
    this.isOpen = false;
    this.isOpenChange.emit(this.isOpen);
  }

  onBackdropClick(): void {
    // Maneja el cierre nativo con la tecla Escape
    this.closeModal();
  }
}
