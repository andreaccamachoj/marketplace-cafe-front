import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgClass } from '@angular/common';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (open) {
      <!-- Backdrop -->
      <div
        class="modal-backdrop"
        [class.modal-backdrop--visible]="open"
        (click)="onBackdropClick()"
        aria-hidden="true"
      ></div>

      <!-- Dialog -->
      <div
        #dialogEl
        class="modal"
        [ngClass]="'modal--' + size"
        role="dialog"
        [attr.aria-modal]="true"
        [attr.aria-labelledby]="titleId"
        tabindex="-1"
      >
        <!-- Header -->
        @if (title || showClose) {
          <header class="modal__header">
            @if (title) {
              <h2 class="modal__title" [id]="titleId">{{ title }}</h2>
            }
            @if (showClose) {
              <button
                type="button"
                class="modal__close"
                aria-label="Cerrar"
                (click)="closeModal()"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                     stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            }
          </header>
        }

        <!-- Body -->
        <div class="modal__body">
          <ng-content />
        </div>

        <!-- Footer (projected via named slot) -->
        <ng-content select="[modal-footer]" />
      </div>
    }
  `,
  styleUrl: './modal.component.scss',
})
export class ModalComponent implements OnChanges, OnDestroy {
  @Input() open = false;
  @Input() title = '';
  @Input() size: ModalSize = 'md';
  @Input() showClose = true;
  @Input() closeOnBackdrop = true;

  @Output() closed = new EventEmitter<void>();

  @ViewChild('dialogEl') dialogEl?: ElementRef<HTMLElement>;

  protected readonly titleId = `modal-title-${Math.random().toString(36).slice(2, 8)}`;

  private readonly platformId = inject(PLATFORM_ID);
  private previouslyFocused: HTMLElement | null = null;

  /** WCAG 2.1.1 — Escape cierra el modal por teclado */
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.open) this.closeModal();
  }

  /** WCAG 2.1.2 — Focus trap: Tab/Shift+Tab quedan dentro del diálogo */
  @HostListener('document:keydown.tab', ['$event'])
  @HostListener('document:keydown.shift.tab', ['$event'])
  onTab(event: KeyboardEvent): void {
    if (!this.open || !isPlatformBrowser(this.platformId)) return;

    const dialog = this.dialogEl?.nativeElement;
    if (!dialog) return;

    const focusableSelectors = [
      'a[href]', 'button:not([disabled])', 'textarea:not([disabled])',
      'input:not([disabled])', 'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelectors))
      .filter(el => !el.closest('[disabled]') && el.offsetParent !== null);

    if (!focusable.length) { event.preventDefault(); return; }

    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (event.shiftKey) {
      // Shift+Tab: si el foco está en el primer elemento, saltar al último
      if (document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    } else {
      // Tab: si el foco está en el último elemento, saltar al primero
      if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (changes['open']) {
      if (this.open) {
        this.previouslyFocused = document.activeElement as HTMLElement;
        document.body.classList.add('modal-open');
        // Foco al diálogo después de que Angular renderice el @if
        setTimeout(() => {
          const dialog = this.dialogEl?.nativeElement;
          if (!dialog) return;
          // Intentar foco en el primer elemento focusable; si no, al diálogo
          const firstFocusable = dialog.querySelector<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          );
          (firstFocusable ?? dialog).focus();
        }, 50);
      } else {
        document.body.classList.remove('modal-open');
        this.previouslyFocused?.focus();
      }
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.remove('modal-open');
    }
  }

  protected onBackdropClick(): void {
    if (this.closeOnBackdrop) this.closeModal();
  }

  protected closeModal(): void {
    this.closed.emit();
  }
}
