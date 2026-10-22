import test from 'node:test';
import assert from 'node:assert/strict';
import { extractConstraints } from '../src/services/ragPipeline.js';

test('Extracts canonical destination Agra from Taj Mahal query', () => {
  const result = extractConstraints('Plan 2 days visiting Taj Mahal with family');
  assert.equal(result.destination, 'Agra');
  assert.ok(result.allDestinations.includes('Agra'));
});

test('Extracts canonical destination Varanasi from Kashi or Banaras', () => {
  const result = extractConstraints('Want to visit Kashi temples for 3 days');
  assert.equal(result.destination, 'Varanasi');
});

test('Correctly identifies Prayagraj from historical Allahabad alias', () => {
  const result = extractConstraints('Take a trip to Allahabad Sangam');
  assert.equal(result.destination, 'Prayagraj');
});

test('Parses budget numbers with thousands suffix', () => {
  const result = extractConstraints('Trip to Lucknow for 3 days under 25k');
  assert.equal(result.budget, 25000);
});
