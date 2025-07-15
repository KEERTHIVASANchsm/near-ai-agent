import { renderHook, waitFor } from '@testing-library/react';
import { useNear } from '../hooks/useNear';

describe('useNear hook', () => {
  it('should initialize wallet', async () => {
    const { result } = renderHook(() => useNear());
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(result.current.wallet).toBeDefined();
    expect(result.current.error).toBeNull();
  });
});