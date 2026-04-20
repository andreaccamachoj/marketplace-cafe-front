import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
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
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }

  closeModal(): void {
    this.isOpen = false;
    this.isOpenChange.emit(this.isOpen);
  }

  onBackdropClick(): void {
    this.closeModal();
  }
}
