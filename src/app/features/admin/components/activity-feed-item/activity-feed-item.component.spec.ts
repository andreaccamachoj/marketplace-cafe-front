import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { ActivityFeedItemComponent } from './activity-feed-item.component';
import { IActivityItem } from '../../models/activity.model';

const MOCK_ITEM: IActivityItem = {
  id: 'act-1', type: 'user_registered', title: 'Nuevo usuario',
  description: 'Ana García se registró.', timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
  actorName: 'Ana García', iconEmoji: '📋', severity: 'info',
};

describe('ActivityFeedItemComponent', () => {
  let fixture: ComponentFixture<ActivityFeedItemComponent>;
  let component: ActivityFeedItemComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityFeedItemComponent],
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    }).compileComponents();
    fixture = TestBed.createComponent(ActivityFeedItemComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('item', MOCK_ITEM);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('receives item input', () => {
    expect(component.item().title).toBe('Nuevo usuario');
  });

  it('relativeTime returns Ahora mismo for sub-minute timestamps', () => {
    const now = new Date().toISOString();
    expect(component.relativeTime(now)).toBe('Ahora mismo');
  });

  it('relativeTime returns Hace N min for timestamps within an hour', () => {
    const thirtyMinAgo = new Date(Date.now() - 30 * 60000).toISOString();
    expect(component.relativeTime(thirtyMinAgo)).toBe('Hace 30 min');
  });

  it('relativeTime returns Hace N h for timestamps within a day', () => {
    const threeHoursAgo = new Date(Date.now() - 3 * 3600000).toISOString();
    expect(component.relativeTime(threeHoursAgo)).toBe('Hace 3 h');
  });

  it('relativeTime returns Hace 1 día for single day', () => {
    const oneDayAgo = new Date(Date.now() - 1 * 86400001).toISOString();
    expect(component.relativeTime(oneDayAgo)).toBe('Hace 1 día');
  });

  it('relativeTime returns Hace N días for multiple days within 30', () => {
    const fiveDaysAgo = new Date(Date.now() - 5 * 86400001).toISOString();
    expect(component.relativeTime(fiveDaysAgo)).toBe('Hace 5 días');
  });

  it('relativeTime returns empty string on server platform', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [ActivityFeedItemComponent],
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    });
    const svrFixture = TestBed.createComponent(ActivityFeedItemComponent);
    svrFixture.componentRef.setInput('item', MOCK_ITEM);
    svrFixture.detectChanges();
    expect(svrFixture.componentInstance.relativeTime(MOCK_ITEM.timestamp)).toBe('');
  });
});
