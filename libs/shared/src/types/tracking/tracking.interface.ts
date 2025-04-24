import { ITrackingEvent } from './tracking-event.interface';

export interface ITracking {
  id?: string;
  trackingUrl: string;
  externalOrderId: string;
  providerOrderId: string;
  orderCreatedAt: Date;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  trackingEvents: ITrackingEvent[];
  createdAt?: Date;
  updatedAt?: Date;
  status: string;
  trackingLinkNotification?: string;
  shippingNotification?: string;
}
