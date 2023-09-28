import { render } from '@testing-library/react';
import Kronash from '@kronash/core';

import KronashProvider from './KronashProvider';

describe('React', () => {
  it('should render successfully', () => {
    const client = new Kronash();

    const { baseElement } = render(
      <KronashProvider client={client}>
        <div>Test</div>
      </KronashProvider>
    );

    expect(baseElement).toBeTruthy();
  });
});
