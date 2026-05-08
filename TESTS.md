# TESTS.md

## Test Strategy

All tests live in the `tests/` directory and run with Vitest.
Run tests with: `npm run test:run`

---

## What We Test and Why

### Audit Engine (Core Business Logic)
The audit engine is the most critical part of the app — wrong calculations mean wrong
recommendations, which destroys user trust. Every calculation function has unit tests.

### What We Don't Test
- UI components (covered by Lighthouse + manual testing)
- API routes (covered by integration testing manually)
- Supabase queries (covered by Supabase's own test suite)

---

## Test Files

### `tests/audit-engine.test.ts`

Tests the core savings calculation logic:

```typescript
// Test 1: Single tool over-spend detection
// Given: User paying for Cursor Business ($40) with 1 seat
// Expected: Recommend downgrade to Pro ($20), savings = $20/month

// Test 2: Team plan break-even calculation
// Given: 3 people on ChatGPT Plus ($20 each = $60/month)
// Expected: Team plan ($30 × 3 = $90) is MORE expensive — keep Plus

// Test 3: Duplicate tool detection
// Given: Paying for both Cursor Pro AND GitHub Copilot Individual
// Expected: Recommend dropping Copilot (Cursor is a superset)

// Test 4: Total savings aggregation
// Given: 3 tools with individual savings of $20, $15, $40
// Expected: totalMonthlySavings = $75, totalAnnualSavings = $900

// Test 5: Zero savings — happy path
// Given: User on optimal plans for their team size
// Expected: All recommendations = 'keep', totalMonthlySavings = 0

// Test 6: API spend tools (pay-as-you-go)
// Given: User enters $200/month for Anthropic API
// Expected: No plan recommendation, just usage optimization tip
```

### `tests/utils.test.ts`

Tests utility functions:

```typescript
// Test 1: formatCurrency — 1234.5 → "$1,235"
// Test 2: generateSlug — returns 8-char alphanumeric string
// Test 3: generateSlug — two calls never return same value (probabilistic)
// Test 4: clamp — clamp(150, 0, 100) → 100
// Test 5: clamp — clamp(-5, 0, 100) → 0
```

---

## Running Tests

```bash
# Run all tests once
npm run test:run

# Run in watch mode during development
npm run test

# Run with coverage report
npx vitest run --coverage
```

---

## CI Integration

Tests run automatically on every push to main via GitHub Actions.
The workflow uses `--passWithNoTests` flag so CI doesn't fail before
tests are written (Day 1–2). Tests are added progressively from Day 3.

Current status: ✅ CI passing