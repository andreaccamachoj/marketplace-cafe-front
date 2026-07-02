import { RelativeTimePipe } from './relative-time.pipe';

describe('RelativeTimePipe', () => {
  let pipe: RelativeTimePipe;

  beforeEach(() => { pipe = new RelativeTimePipe(); });

  function dateSecondsAgo(s: number): Date {
    return new Date(Date.now() - s * 1000);
  }

  it('returns "Hace un momento" for < 60 seconds ago', () => {
    expect(pipe.transform(dateSecondsAgo(30))).toBe('Hace un momento');
  });

  it('returns minutes for 1-59 minutes ago', () => {
    expect(pipe.transform(dateSecondsAgo(120))).toBe('Hace 2 min');
  });

  it('returns hours for 1-23 hours ago', () => {
    expect(pipe.transform(dateSecondsAgo(7200))).toBe('Hace 2 h');
  });

  it('returns days for 1-6 days ago', () => {
    expect(pipe.transform(dateSecondsAgo(172800))).toBe('Hace 2 días');
  });

  it('returns locale date string for >= 7 days ago', () => {
    const old = new Date(Date.now() - 8 * 86400 * 1000);
    expect(pipe.transform(old)).toBe(old.toLocaleDateString('es-CO'));
  });

  it('accepts an ISO string as input', () => {
    const date = dateSecondsAgo(30);
    expect(pipe.transform(date.toISOString())).toBe('Hace un momento');
  });

  it('returns exactly 1 minute label', () => {
    expect(pipe.transform(dateSecondsAgo(61))).toBe('Hace 1 min');
  });

  it('returns exactly 1 hour label', () => {
    expect(pipe.transform(dateSecondsAgo(3601))).toBe('Hace 1 h');
  });
});
