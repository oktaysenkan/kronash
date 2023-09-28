import Kronash from './kronash';

describe('core', () => {
  it('should work', () => {
    const kronash = new Kronash();

    expect(kronash.tasks).toEqual([]);
  });
});
