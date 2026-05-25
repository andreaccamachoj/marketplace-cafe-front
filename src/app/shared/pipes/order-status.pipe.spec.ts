import { OrderStatusPipe } from './order-status.pipe';

describe('OrderStatusPipe', () => {
  let pipe: OrderStatusPipe;

  beforeEach(() => { pipe = new OrderStatusPipe(); });

  it('returns "Pendiente" for "pending"', () => {
    expect(pipe.transform('pending')).toBe('Pendiente');
  });

  it('returns "Confirmado" for "confirmed"', () => {
    expect(pipe.transform('confirmed')).toBe('Confirmado');
  });

  it('returns "En preparación" for "preparing"', () => {
    expect(pipe.transform('preparing')).toBe('En preparación');
  });

  it('returns "Enviado" for "shipped"', () => {
    expect(pipe.transform('shipped')).toBe('Enviado');
  });

  it('returns "Entregado" for "delivered"', () => {
    expect(pipe.transform('delivered')).toBe('Entregado');
  });

  it('returns "Cancelado" for "cancelled"', () => {
    expect(pipe.transform('cancelled')).toBe('Cancelado');
  });

  it('is case-insensitive', () => {
    expect(pipe.transform('PENDING')).toBe('Pendiente');
  });

  it('returns the raw value for unknown status', () => {
    expect(pipe.transform('unknown_status')).toBe('unknown_status');
  });

  it('returns the raw value for empty string', () => {
    expect(pipe.transform('')).toBe('');
  });
});
