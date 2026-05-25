import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvatarComponent } from './avatar.component';

describe('AvatarComponent', () => {
  let fixture: ComponentFixture<AvatarComponent>;
  let component: AvatarComponent;
  let el: HTMLElement;

  function create(inputs: Partial<AvatarComponent> = {}) {
    fixture   = TestBed.createComponent(AvatarComponent);
    component = fixture.componentInstance;
    Object.assign(component, inputs);
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AvatarComponent] }).compileComponents();
  });

  it('renders the avatar container', () => {
    create();
    expect(el.querySelector('.avatar')).toBeTruthy();
  });

  it('applies size class — default md', () => {
    create();
    expect(el.querySelector('.avatar')!.className).toContain('avatar--md');
  });

  it('applies custom size class', () => {
    create({ size: 'lg' });
    expect(el.querySelector('.avatar')!.className).toContain('avatar--lg');
  });

  it('shows image when src is provided', () => {
    create({ src: 'https://example.com/photo.jpg', name: 'Ana' });
    expect(el.querySelector('img.avatar__img')).toBeTruthy();
  });

  it('shows initials when name provided and no src', () => {
    create({ name: 'Ana López' });
    expect(el.querySelector('.avatar__initials')?.textContent?.trim()).toBe('AL');
  });

  it('shows single-word initial when name has one word', () => {
    create({ name: 'Carlos' });
    expect(el.querySelector('.avatar__initials')?.textContent?.trim()).toBe('C');
  });

  it('shows fallback SVG when no src and no name', () => {
    create({ src: '', name: '' });
    expect(el.querySelector('.avatar__fallback')).toBeTruthy();
  });

  it('does not show status dot when online is null', () => {
    create({ online: null });
    expect(el.querySelector('.avatar__status-dot')).toBeNull();
  });

  it('shows status dot and online class when online=true', () => {
    create({ online: true });
    expect(el.querySelector('.avatar__status-dot')).toBeTruthy();
    expect(el.querySelector('.avatar')!.className).toContain('avatar--online');
  });

  it('shows status dot and offline class when online=false', () => {
    create({ online: false });
    expect(el.querySelector('.avatar__status-dot')).toBeTruthy();
    expect(el.querySelector('.avatar')!.className).toContain('avatar--offline');
  });

  it('sets aria-label from name', () => {
    create({ name: 'Pedro' });
    expect(el.querySelector('.avatar')!.getAttribute('aria-label')).toBe('Pedro');
  });

  it('falls back to "Avatar" aria-label when no name', () => {
    create({ name: '' });
    expect(el.querySelector('.avatar')!.getAttribute('aria-label')).toBe('Avatar');
  });

  it('shows initials after image error', () => {
    create({ src: 'bad.jpg', name: 'María García' });
    // Simulate image load error
    const img = el.querySelector('img')!;
    img.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(el.querySelector('.avatar__initials')?.textContent?.trim()).toBe('MG');
  });
});
