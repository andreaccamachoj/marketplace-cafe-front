import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadZoneComponent } from './upload-zone.component';

function makeFile(name: string, type: string, sizeMb = 1): File {
  const bytes = new Uint8Array(sizeMb * 1024 * 1024);
  return new File([bytes], name, { type });
}

describe('UploadZoneComponent', () => {
  let fixture: ComponentFixture<UploadZoneComponent>;
  let component: UploadZoneComponent;
  let el: HTMLElement;

  function create(inputs: Partial<UploadZoneComponent> = {}) {
    fixture   = TestBed.createComponent(UploadZoneComponent);
    component = fixture.componentInstance;
    Object.assign(component, inputs);
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [UploadZoneComponent] }).compileComponents();
  });

  it('renders the drop zone', () => {
    create();
    expect(el.querySelector('.drop-zone')).toBeTruthy();
  });

  it('no preview grid when no files', () => {
    create();
    expect(el.querySelector('.preview-grid')).toBeNull();
  });

  it('accepts valid image file via writeValue', () => {
    create();
    const file = makeFile('photo.jpg', 'image/jpeg');
    component.writeValue([file]);
    fixture.detectChanges();
    expect(component['files']().length).toBe(1);
  });

  it('rejects invalid file type', () => {
    create();
    const invalidFile = makeFile('doc.pdf', 'application/pdf');
    component['addFiles']([invalidFile]);
    fixture.detectChanges();
    expect(component['files']().length).toBe(0);
    expect(component['validationError']()).toContain('JPG, PNG o WebP');
  });

  it('rejects file exceeding maxSizeMb', () => {
    create({ maxSizeMb: 1 });
    const bigFile = makeFile('big.png', 'image/png', 2);
    component['addFiles']([bigFile]);
    fixture.detectChanges();
    expect(component['files']().length).toBe(0);
    expect(component['validationError']()).toContain('tamaño máximo');
  });

  it('shows validation error in DOM', () => {
    create();
    const invalidFile = makeFile('doc.pdf', 'application/pdf');
    component['addFiles']([invalidFile]);
    fixture.detectChanges();
    expect(el.querySelector('.upload-error')).toBeTruthy();
  });

  it('emits filesChange when valid file added', () => {
    create();
    const spy = jasmine.createSpy('filesChange');
    component.filesChange.subscribe(spy);
    component['addFiles']([makeFile('img.png', 'image/png')]);
    expect(spy).toHaveBeenCalled();
  });

  it('calls onChange when file added', () => {
    create();
    const spy = jasmine.createSpy('onChange');
    component.registerOnChange(spy);
    component['addFiles']([makeFile('img.webp', 'image/webp')]);
    expect(spy).toHaveBeenCalled();
  });

  it('removeFile removes the file by name', () => {
    create();
    component.writeValue([makeFile('a.jpg', 'image/jpeg')]);
    fixture.detectChanges();
    component['removeFile']('a.jpg');
    fixture.detectChanges();
    expect(component['files']().length).toBe(0);
  });

  it('setDisabledState sets isDisabled signal', () => {
    create();
    component.setDisabledState(true);
    expect(component['isDisabled']()).toBeTrue();
  });

  it('drop-zone--error class applied when hasError=true', () => {
    create({ hasError: true });
    expect(el.querySelector('.drop-zone')!.classList).toContain('drop-zone--error');
  });

  it('drop-zone--disabled class applied when disabled', () => {
    create();
    component.setDisabledState(true);
    fixture.detectChanges();
    expect(el.querySelector('.drop-zone')!.classList).toContain('drop-zone--disabled');
  });

  it('adds multiple valid files without overwriting existing ones', () => {
    create();
    component['addFiles']([makeFile('a.jpg', 'image/jpeg')]);
    component['addFiles']([makeFile('b.png', 'image/png')]);
    expect(component['files']().length).toBe(2);
  });
});
