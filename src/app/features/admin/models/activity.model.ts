export type ActivityType =
  | 'user_registered'
  | 'producer_approved'
  | 'producer_rejected'
  | 'order_placed'
  | 'category_created'
  | 'category_updated'
  | 'user_suspended'
  | 'product_flagged';

export interface IActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  actorName: string;
  iconEmoji: string;
  severity: 'info' | 'success' | 'warning' | 'danger';
}
