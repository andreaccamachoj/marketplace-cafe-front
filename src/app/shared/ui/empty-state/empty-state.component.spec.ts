import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmptyStateComponent } from './empty-state.component';

@Component({
  standalone: true,
  imports: [EmptyStateComponent],
  template: `
    <app-empty-state
      [title]="title"
      [description]="description"
      [illustration]="illustration"
      [actionLabel]="actionLabel"
    >
      <button class="action-btn">Reintentar</button>
    </app-empty-state>
  `,
})
class TestHostComponent {
  title        = 'Sin datos';
  description  = '';
  illustration = '';
  actionLabel  = '';
}

describe('EmptyStateComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(TestHostComponent);
    host    = fixture.componentInstance;
    el      = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  it('renders the title', () => {
    expect(el.querySelector('.empty-state__title')?.textContent?.trim()).toBe('Sin datos');
  });

  it('shows default SVG when no illustration', () => {
    expect(el.querySelector('.empty-state__svg')).toBeTruthy();
  });

  it('shows illustration text instead of SVG when illustration provided', () => {
    host.illustration = '🛒';
    fixture.detectChanges();
    expect(el.querySelector('.empty-state__illustration')?.textContent?.trim()).toBe('🛒');
    expect(el.querySelector('.empty-state__svg')).toBeNull();
  });

  it('does not show description when empty', () => {
    expect(el.querySelector('.empty-state__desc')).toBeNull();
  });

  it('shows description when provided', () => {
    host.description = 'No hay productos';
    fixture.detectChanges();
    expect(el.querySelector('.empty-state__desc')?.textContent?.trim()).toBe('No hay productos');
  });

  it('renders ng-content when actionLabel is set', () => {
    host.actionLabel = 'retry';
    fixture.detectChanges();
    expect(el.querySelector('.action-btn')).toBeTruthy();
  });

  it('hides ng-content slot when actionLabel is empty', () => {
    expect(el.querySelector('.action-btn')).toBeNull();
  });
});
