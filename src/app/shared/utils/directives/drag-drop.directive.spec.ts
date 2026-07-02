import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DragDropDirective } from './drag-drop.directive';

@Component({
  standalone: true,
  imports: [DragDropDirective],
  template: `<div appDragDrop (fileDropped)="onDrop($event)"></div>`,
})
class TestHostComponent {
  droppedFiles: FileList | null = null;
  onDrop(files: FileList) { this.droppedFiles = files; }
}

function makeDragEvent(type: string, files?: File[]): DragEvent {
  const dt = {
    files: files
      ? Object.assign(files, { item: (i: number) => files[i] })
      : null,
  } as unknown as DataTransfer;
  const event = new DragEvent(type, { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'dataTransfer', { value: dt });
  return event;
}

describe('DragDropDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.debugElement.query(By.directive(DragDropDirective)).nativeElement as HTMLElement;
  });

  it('adds drag-over class on dragover', () => {
    el.dispatchEvent(makeDragEvent('dragover'));
    fixture.detectChanges();
    expect(el.classList.contains('drag-over')).toBeTrue();
  });

  it('prevents default on dragover', () => {
    const event = makeDragEvent('dragover');
    spyOn(event, 'preventDefault');
    el.dispatchEvent(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('removes drag-over class on dragleave', () => {
    el.dispatchEvent(makeDragEvent('dragover'));
    fixture.detectChanges();
    el.dispatchEvent(makeDragEvent('dragleave'));
    fixture.detectChanges();
    expect(el.classList.contains('drag-over')).toBeFalse();
  });

  it('prevents default on dragleave', () => {
    const event = makeDragEvent('dragleave');
    spyOn(event, 'preventDefault');
    el.dispatchEvent(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('emits fileDropped with files on drop', () => {
    const file = new File(['content'], 'test.png', { type: 'image/png' });
    el.dispatchEvent(makeDragEvent('drop', [file]));
    fixture.detectChanges();
    expect(host.droppedFiles).not.toBeNull();
    expect(host.droppedFiles?.length).toBe(1);
  });

  it('removes drag-over class after drop', () => {
    el.dispatchEvent(makeDragEvent('dragover'));
    fixture.detectChanges();
    const file = new File([''], 'a.txt');
    el.dispatchEvent(makeDragEvent('drop', [file]));
    fixture.detectChanges();
    expect(el.classList.contains('drag-over')).toBeFalse();
  });

  it('does not emit fileDropped when no files are dropped', () => {
    const spy = spyOn(host, 'onDrop');
    el.dispatchEvent(makeDragEvent('drop', []));
    expect(spy).not.toHaveBeenCalled();
  });
});
