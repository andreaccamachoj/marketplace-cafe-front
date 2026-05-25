import { CertificationLabelPipe } from './certification-label.pipe';

describe('CertificationLabelPipe', () => {
  let pipe: CertificationLabelPipe;

  beforeEach(() => { pipe = new CertificationLabelPipe(); });

  it('returns "Orgánico" for "organic"', () => {
    expect(pipe.transform('organic')).toBe('Orgánico');
  });

  it('returns "Comercio Justo" for "fair_trade"', () => {
    expect(pipe.transform('fair_trade')).toBe('Comercio Justo');
  });

  it('returns "Rainforest Alliance" for "rainforest"', () => {
    expect(pipe.transform('rainforest')).toBe('Rainforest Alliance');
  });

  it('returns "UTZ Certified" for "utz"', () => {
    expect(pipe.transform('utz')).toBe('UTZ Certified');
  });

  it('returns "Bird Friendly" for "bird_friendly"', () => {
    expect(pipe.transform('bird_friendly')).toBe('Bird Friendly');
  });

  it('is case-insensitive', () => {
    expect(pipe.transform('ORGANIC')).toBe('Orgánico');
  });

  it('returns the raw value for unknown certification', () => {
    expect(pipe.transform('unknown_cert')).toBe('unknown_cert');
  });

  it('returns the raw value for empty string', () => {
    expect(pipe.transform('')).toBe('');
  });
});
