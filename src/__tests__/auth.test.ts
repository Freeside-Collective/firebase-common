import { describe, it, expect, vi } from 'vitest';
import { onAuthStateChanged } from 'firebase/auth';
import { observeAuth } from '../auth';

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  onAuthStateChanged: vi.fn(),
}));

describe('observeAuth', () => {
  it('should call onAuthStateChanged', () => {
    const mockAuth = {} as any;
    const mockCallback = vi.fn();
    const mockUnsubscribe = vi.fn();
    vi.mocked(onAuthStateChanged).mockReturnValue(mockUnsubscribe as any);

    const result = observeAuth(mockAuth, mockCallback);
    
    expect(onAuthStateChanged).toHaveBeenCalledWith(mockAuth, mockCallback);
    expect(result).toBe(mockUnsubscribe);
  });
});
