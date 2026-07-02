import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { BadgeComponent } from './badge.component';

@Component({
  standalone: true,
  imports: [BadgeComponent],
  template: `<app-badge [color]="color">{{ label }}</app-badge>`,
})
class TestHostComponent {
  color: BadgeComponent['color'] = 'primary';
  label = 'New';
}

describe('BadgeComponent', () => {
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

  it('renders a span with class "badge"', () => {
    expect(el.querySelector('span.badge')).toBeTruthy();
  });

  it('applies badge--primary by default', () => {
    expect(el.querySelector('span')!.className).toContain('badge--primary');
  });

  it('applies badge--green when color="green"', () => {
    host.color = 'green';
    fixture.detectChanges();
    expect(el.querySelector('span')!.className).toContain('badge--green');
  });

  it('applies badge--amber when color="amber"', () => {
    host.color = 'amber';
    fixture.detectChanges();
    expect(el.querySelector('span')!.className).toContain('badge--amber');
  });

  it('applies badge--blue when color="blue"', () => {
    host.color = 'blue';
    fixture.detectChanges();
    expect(el.querySelector('span')!.className).toContain('badge--blue');
  });

  it('projects content via ng-content', () => {
    expect(el.querySelector('span')!.textContent?.trim()).toBe('New');
  });

  it('projects updated content', () => {
    host.label = 'Sale';
    fixture.detectChanges();
    expect(el.querySelector('span')!.textContent?.trim()).toBe('Sale');
  });
});
