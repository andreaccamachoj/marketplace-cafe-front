import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () => {
  let pipe: TruncatePipe;

  beforeEach(() => { pipe = new TruncatePipe(); });

  it('returns the original string when shorter than limit', () => {
    expect(pipe.transform('Hello', 10)).toBe('Hello');
  });

  it('returns the original string when equal to limit', () => {
    const str = 'a'.repeat(100);
    expect(pipe.transform(str)).toBe(str);
  });

  it('truncates and appends "..." when longer than default limit (100)', () => {
    const long = 'a'.repeat(101);
    const result = pipe.transform(long);
    expect(result).toBe('a'.repeat(100) + '...');
  });

  it('truncates with custom limit', () => {
    expect(pipe.transform('Hello World', 5)).toBe('Hello...');
  });

  it('uses custom trail string', () => {
    expect(pipe.transform('Hello World', 5, '…')).toBe('Hello…');
  });

  it('returns empty string unchanged', () => {
    expect(pipe.transform('', 10)).toBe('');
  });

  it('does not truncate when length equals limit exactly', () => {
    expect(pipe.transform('12345', 5)).toBe('12345');
  });
});
