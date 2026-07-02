import { CurrencyCopPipe } from './currency-cop.pipe';

describe('CurrencyCopPipe', () => {
  let pipe: CurrencyCopPipe;

  beforeEach(() => { pipe = new CurrencyCopPipe(); });

  it('formats a positive integer with $ prefix', () => {
    const result = pipe.transform(1000);
    expect(result.startsWith('$ ')).toBeTrue();
    expect(result).toContain('1');
  });

  it('formats zero', () => {
    const result = pipe.transform(0);
    expect(result.startsWith('$ ')).toBeTrue();
    expect(result).toContain('0');
  });

  it('formats a negative number', () => {
    const result = pipe.transform(-500);
    expect(result.startsWith('$ ')).toBeTrue();
    expect(result).toContain('500');
  });

  it('formats a large number', () => {
    const result = pipe.transform(1000000);
    expect(result.startsWith('$ ')).toBeTrue();
    expect(result).toContain('1');
  });

  it('uses es-CO locale (uses . or , as separator depending on locale)', () => {
    const result = pipe.transform(1000);
    expect(result).toBe(`$ ${(1000).toLocaleString('es-CO')}`);
  });
});
