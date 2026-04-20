import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';
import { NgClass } from '@angular/common';

export interface ITab {
  id: string;
  label: string;
  icon?: string;
  badge?: number | string;
  disabled?: boolean;
}

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="tabs-wrapper">
      <nav
        class="tabs"
        [ngClass]="'tabs--' + variant"
        role="tablist"
        [attr.aria-label]="ariaLabel"
      >
        @for (tab of tabs; track tab.id) {
          <button
            role="tab"
            type="button"
            class="tab"
            [ngClass]="{ 'tab--active': tab.id === activeId(), 'tab--disabled': !!tab.disabled }"
            [attr.aria-selected]="tab.id === activeId()"
            [attr.aria-controls]="'panel-' + tab.id"
            [disabled]="tab.disabled || null"
            [id]="'tab-' + tab.id"
            (click)="select(tab.id)"
            (keydown.arrowRight)="focusNext($index)"
            (keydown.arrowLeft)="focusPrev($index)"
          >
            @if (tab.icon) {
              <span class="tab__icon" aria-hidden="true">{{ tab.icon }}</span>
            }
            {{ tab.label }}
            @if (tab.badge !== undefined && tab.badge !== null) {
              <span class="tab__badge" aria-label="({{ tab.badge }})">{{ tab.badge }}</span>
            }
          </button>
        }
      </nav>

      <!-- Content panels are projected via ng-content; consumers use *ngIf or @if -->
      <div class="tabs__content">
        <ng-content />
      </div>
    </div>
  `,
  styleUrl: './tabs.component.scss',
})
export class TabsComponent {
  @Input() tabs: ITab[] = [];
  @Input() ariaLabel = 'Navegación por pestañas';
  @Input() variant: 'underline' | 'pills' | 'boxed' = 'underline';
  @Input() set activeTab(id: string) { this.activeId.set(id); }

  @Output() tabChange = new EventEmitter<string>();

  protected readonly activeId = signal('');

  protected select(id: string): void {
    this.activeId.set(id);
    this.tabChange.emit(id);
  }

  protected focusNext(currentIndex: number): void {
    const next = this.tabs.findIndex((t, i) => i > currentIndex && !t.disabled);
    if (next !== -1) this.selectByIndex(next);
  }

  protected focusPrev(currentIndex: number): void {
    const prev = [...this.tabs].reverse().findIndex((t, i) => {
      const origIndex = this.tabs.length - 1 - i;
      return origIndex < currentIndex && !t.disabled;
    });
    if (prev !== -1) this.selectByIndex(this.tabs.length - 1 - prev);
  }

  private selectByIndex(index: number): void {
    const tab = this.tabs[index];
    if (tab) this.select(tab.id);
  }
}
