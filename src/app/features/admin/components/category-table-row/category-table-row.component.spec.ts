import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryTableRowComponent } from './category-table-row.component';
import { IAdminCategory } from '../../models/admin-category.model';

const MOCK_CAT: IAdminCategory = {
  id: 'cat-1', name: 'Arábica', slug: 'arabica', description: 'Café arábica premium',
  productCount: 5, active: true, createdAt: '2025-01-01', iconEmoji: '☕',
};

describe('CategoryTableRowComponent', () => {
  let fixture: ComponentFixture<CategoryTableRowComponent>;
  let component: CategoryTableRowComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryTableRowComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(CategoryTableRowComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('category', MOCK_CAT);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('receives category input', () => {
    expect(component.category().name).toBe('Arábica');
    expect(component.category().active).toBe(true);
  });

  it('edit emits category object', () => {
    let emitted: IAdminCategory | undefined;
    component.edit.subscribe(c => (emitted = c));
    component.edit.emit(MOCK_CAT);
    expect(emitted).toEqual(MOCK_CAT);
  });

  it('toggleActive emits category id', () => {
    let emitted = '';
    component.toggleActive.subscribe(id => (emitted = id));
    component.toggleActive.emit('cat-1');
    expect(emitted).toBe('cat-1');
  });

  it('delete emits category id', () => {
    let emitted = '';
    component.delete.subscribe(id => (emitted = id));
    component.delete.emit('cat-1');
    expect(emitted).toBe('cat-1');
  });
});
