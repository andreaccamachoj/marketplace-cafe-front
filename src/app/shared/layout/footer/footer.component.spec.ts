import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let fixture: ComponentFixture<FooterComponent>;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent, RouterTestingModule],
    }).compileComponents();
    fixture = TestBed.createComponent(FooterComponent);
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('renders footer element', () => {
    expect(el.querySelector('footer.footer')).toBeTruthy();
  });

  it('renders brand name', () => {
    expect(el.querySelector('.footer-logo-name')!.textContent?.trim()).toBe('World Coffee Marketplace');
  });

  it('renders copyright with current year', () => {
    const year = new Date().getFullYear().toString();
    expect(el.querySelector('.footer-copy')!.textContent).toContain(year);
  });

  it('renders login link', () => {
    const links = el.querySelectorAll('a');
    const loginLink = Array.from(links).find(a => a.textContent?.trim() === 'Iniciar sesión');
    expect(loginLink).toBeTruthy();
  });

  it('renders register link', () => {
    const links = el.querySelectorAll('a');
    const registerLink = Array.from(links).find(a => a.textContent?.trim() === 'Registrarse');
    expect(registerLink).toBeTruthy();
  });

  it('renders catalog link', () => {
    const links = el.querySelectorAll('a');
    const catalogLink = Array.from(links).find(a => a.textContent?.trim() === 'Catálogo');
    expect(catalogLink).toBeTruthy();
  });

  it('renders certification badges', () => {
    expect(el.querySelector('.footer-certs')).toBeTruthy();
    expect(el.querySelectorAll('.footer-cert').length).toBeGreaterThan(0);
  });

  it('footer has role="contentinfo"', () => {
    expect(el.querySelector('footer')!.getAttribute('role')).toBe('contentinfo');
  });
});
