import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appDragDrop]',
  standalone: true // Muy importante en Angular moderno
})
export class DragDropDirective {
  // Aquí definimos que nuestro Output emite ESTRICTAMENTE un FileList
  @Output() fileDropped = new EventEmitter<FileList>();

  // Vinculamos una clase CSS cuando el archivo está sobre la zona
  @HostBinding('class.drag-over') fileOver = false;

  @HostListener('dragover', ['$event'])
  onDragOver(evt: DragEvent): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = true; // Activa el estilo visual en el SCSS
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(evt: DragEvent): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false; // Desactiva el estilo visual
  }

  @HostListener('drop', ['$event'])
  onDrop(evt: DragEvent): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.fileOver = false;

    // Extraemos los archivos del evento nativo y los emitimos limpios
    const files = evt.dataTransfer?.files;
    if (files && files.length > 0) {
      this.fileDropped.emit(files);
    }
  }
}
