import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumberOnly]',
  standalone: true,
})
export class NumberOnlyDirective {
  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    const allowed = ['Backspace','Delete','Tab','Escape','Enter','ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'];
    if (allowed.includes(event.key)) return;
    if ((event.ctrlKey || event.metaKey) && ['a','c','v','x','z'].includes(event.key.toLowerCase())) return;
    if (!/^\d$/.test(event.key)) event.preventDefault();
  }
}
