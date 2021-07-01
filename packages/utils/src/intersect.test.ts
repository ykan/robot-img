import { intersect } from './intersect';

test('测试一般情况', async () => {
  const container = {
    top: 0,
    bottom: 100,
    left: 0,
    right: 100,
  };

  const r1 = {
    top: 0,
    bottom: 90,
    left: 0,
    right: 90,
  };
  expect(intersect(r1, container)).toBe(true);

  const r2 = {
    top: -10,
    bottom: 90,
    left: 0,
    right: 90,
  };
  expect(intersect(r2, container)).toBe(true);

  const r3 = {
    top: -10,
    bottom: -1,
    left: 0,
    right: 90,
  };
  expect(intersect(r3, container)).toBe(false);

  const r4 = {
    top: 0,
    bottom: 90,
    left: -10,
    right: -1,
  };
  expect(intersect(r4, container)).toBe(false);

  const r5 = {
    top: 0,
    bottom: 90,
    left: 109,
    right: 110,
  };
  expect(intersect(r5, container)).toBe(false);
});

