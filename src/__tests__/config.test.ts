import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getApps, getApp, initializeApp } from 'firebase/app';
import { initFirebase } from '../config';

vi.mock('firebase/app', () => ({
  getApps: vi.fn(),
  getApp: vi.fn(),
  initializeApp: vi.fn(),
}));

describe('initFirebase', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return existing app if already initialized', () => {
    const mockApp = { name: 'existing' };
    vi.mocked(getApps).mockReturnValue([mockApp] as any);
    vi.mocked(getApp).mockReturnValue(mockApp as any);

    const result = initFirebase({});
    
    expect(result).toBe(mockApp);
    expect(initializeApp).not.toHaveBeenCalled();
  });

  it('should initialize new app if none exist', () => {
    const mockApp = { name: 'new' };
    vi.mocked(getApps).mockReturnValue([]);
    vi.mocked(initializeApp).mockReturnValue(mockApp as any);

    const config = { apiKey: 'test' };
    const result = initFirebase(config);
    
    expect(result).toBe(mockApp);
    expect(initializeApp).toHaveBeenCalledWith(config);
  });
});
