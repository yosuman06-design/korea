// Security rules verification matrix aligned with security_spec.md Dirty Dozen payloads.
export const DIRTY_DOZEN_SECURITY_CASES = [
  { id: 1, name: 'Unauthenticated profile read', path: '/users/userA', operation: 'get', expected: 'PERMISSION_DENIED' },
  { id: 2, name: 'Cross-user profile read', path: '/users/userB', operation: 'get', actor: 'userA', expected: 'PERMISSION_DENIED' },
  { id: 3, name: 'Unverified email profile create', path: '/users/userA', operation: 'create', emailVerified: false, expected: 'PERMISSION_DENIED' },
  { id: 4, name: 'Identity spoofing uid mismatch', path: '/users/userA', operation: 'create', payload: { uid: 'userB' }, expected: 'PERMISSION_DENIED' },
  { id: 5, name: 'Shadow field injection (isAdmin)', path: '/users/userA', operation: 'create', payload: { isAdmin: true }, expected: 'PERMISSION_DENIED' },
  { id: 6, name: 'Forged createdAt timestamp', path: '/users/userA', operation: 'create', payload: { createdAt: '2020-01-01T00:00:00Z' }, expected: 'PERMISSION_DENIED' },
  { id: 7, name: 'Immutable createdAt mutation', path: '/users/userA', operation: 'update', payload: { createdAt: '2020-01-01T00:00:00Z' }, expected: 'PERMISSION_DENIED' },
  { id: 8, name: 'Invalid level enum value', path: '/users/userA', operation: 'update', payload: { level: 'X9' }, expected: 'PERMISSION_DENIED' },
  { id: 9, name: 'Negative XP / unbounded array', path: '/users/userA', operation: 'update', payload: { xp: -1 }, expected: 'PERMISSION_DENIED' },
  { id: 10, name: 'Oversized dictionary entryId', path: `/users/userA/dictionary/${'a'.repeat(150)}`, operation: 'create', expected: 'PERMISSION_DENIED' },
  { id: 11, name: 'Orphan dictionary entry without parent user', path: '/users/userA/dictionary/word_1', operation: 'create', expected: 'PERMISSION_DENIED' },
  { id: 12, name: 'Cross-user dictionary list query', path: '/users/userB/dictionary', operation: 'list', actor: 'userA', expected: 'PERMISSION_DENIED' },
] as const;
