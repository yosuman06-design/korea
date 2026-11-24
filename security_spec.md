# Security Specification — Korean Journey (한국어)

## 1. Data Invariants
1. **Owner-Only Profile Isolation (PII Protection)**: A `/users/{userId}` document contains PII (`email`, `displayName`, `photoURL`) and may only be read, created, or updated by the verified authenticated owner (`request.auth.uid == userId && request.auth.token.email_verified == true`). No blanket `list` queries on `/users` are allowed.
2. **Master Gate Dictionary Ownership**: A `/users/{userId}/dictionary/{entryId}` document cannot exist without a valid parent `/users/{userId}` document belonging to the same verified user (`exists(/databases/$(database)/documents/users/$(userId))`).
3. **Strict Schema & Key Containment**: Every create and update enforces exact key allowlists (`keys().hasAll(...) && keys().hasOnly(...)` on create, `affectedKeys().hasOnly(...)` on update) and full `isValidUserProfile()` / `isValidDictionaryEntry()` validation.
4. **Temporal Integrity**: `createdAt` and `updatedAt` must strictly equal `request.time` on creation; `createdAt` is immutable on update and `updatedAt` must equal `request.time`.
5. **Bounded Arrays & Strings**: Every string enforces `.size()` bounds; `completedLessons` is bounded to `<= 100` items and `unlockedAchievements` is bounded to `<= 30` items.

## 2. The "Dirty Dozen" Payloads (Expected: PERMISSION_DENIED)
1. **Unauthenticated read of `/users/userA`** -> Denied (`request.auth == null`).
2. **Cross-user read of `/users/userB` as `userA`** -> Denied (`uid != userId`).
3. **Unverified email write to `/users/userA`** (`email_verified: false`) -> Denied.
4. **Identity spoofing on create** (`/users/userA` with `uid: "userB"`) -> Denied.
5. **Shadow field injection on create** (`/users/userA` with extra `isAdmin: true`) -> Denied (`hasOnly` check).
6. **Client-forged timestamp on create** (`createdAt: "2020-01-01T00:00:00Z"`) -> Denied (`!= request.time`).
7. **Mutating immutable `uid` or `createdAt` on update** -> Denied (`affectedKeys().hasOnly` & immutability check).
8. **Invalid proficiency level** (`level: "MASTER_GOD"`) -> Denied (enum check).
9. **Negative XP or oversized array DoS** (`xp: -500` or `completedLessons` length 101) -> Denied.
10. **Path ID poisoning** (`/users/userA/dictionary/${"a".repeat(200)}`) -> Denied (`isValidId` regex & size check).
11. **Orphan dictionary entry without parent `/users/userA`** -> Denied (Master Gate `exists()` check).
12. **Blanket `list` query on `/users`** -> Denied (no `allow list` on `/users`), and cross-user `list` on `/users/userB/dictionary` as `userA` -> Denied (`resource.data.userId == request.auth.uid`).
