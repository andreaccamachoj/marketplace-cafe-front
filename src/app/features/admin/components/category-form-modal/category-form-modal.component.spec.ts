import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryFormModalComponent } from './category-form-modal.component';
import { IAdminCategory } from '../../models/admin-category.model';

const MOCK_CAT: IAdminCategory = {
  id: 'cat-1', name: 'Arábica', slug: 'arabica', description: 'Café arábica premium',
  productCount: 5, active: true, createdAt: '2025-01-01', iconEmoji: '☕',
};

describe('CategoryFormModalComponent', () => {
  let fixture: ComponentFixture<CategoryFormModalComponent>;
  let component: CategoryFormModalComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryFormModalComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(CategoryFormModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('starts with empty fields in create mode', () => {
    expect(component['name']).toBe('');
    expect(component['description']).toBe('');
    expect(component['iconEmoji']).toBe('☕');
    expect(component['active']).toBe(true);
  });

  it('ngOnChanges hydrates fields from category input in edit mode', () => {
    fixture.componentRef.setInput('category', MOCK_CAT);
    fixture.detectChanges();
    component.ngOnChanges({ category: {} as any });
    expect(component['name']).toBe('Arábica');
    expect(component['slug']).toBe('arabica');
    expect(component['description']).toBe('Café arábica premium');
  });

  it('ngOnChanges resets fields when category is null', () => {
    component['name'] = 'Test';
    fixture.componentRef.setInput('category', null);
    fixture.detectChanges();
    component.ngOnChanges({ category: {} as any });
    expect(component['name']).toBe('');
  });

  it('onNameChange auto-generates slug from name', () => {
    component['name'] = 'Café Especial';
    component.onNameChange();
    expect(component['slug']).toBe('caf-especial');
  });

  it('onSubmit does nothing when name is empty', () => {
    let emitted = false;
    component.saved.subscribe(() => (emitted = true));
    component['name'] = '';
    component['description'] = 'Valid description';
    component.onSubmit();
    expect(emitted).toBe(false);
  });

  it('onSubmit does nothing when description is empty', () => {
    let emitted = false;
    component.saved.subscribe(() => (emitted = true));
    component['name'] = 'Arábica';
    component['description'] = '';
    component.onSubmit();
    expect(emitted).toBe(false);
  });

  it('onSubmit emits saved payload when name and description are set', () => {
    let payload: Partial<IAdminCategory> | undefined;
    component.saved.subscribe(p => (payload = p));
    component['name'] = 'Robusta';
    component['slug'] = 'robusta';
    component['description'] = 'Café robusta';
    component['iconEmoji'] = '🌿';
    component['active'] = true;
    component.onSubmit();
    expect(payload).toEqual({ name: 'Robusta', slug: 'robusta', description: 'Café robusta', iconEmoji: '🌿', active: true });
  });

  it('emojiOptions contains expected emojis', () => {
    expect(component['emojiOptions']).toContain('☕');
    expect(component['emojiOptions']).toContain('🌿');
  });

  it('closed emits when triggered', () => {
    let count = 0;
    component.closed.subscribe(() => count++);
    component.closed.emit();
    expect(count).toBe(1);
  });
});
