export function getLeastAccurateKeys(
  correctlyPressedKeys: Map<string, number>,
  incorrectlyPressedKeys: Map<string, number>,
) {
  const keys = new Set<string>();
  const keysWithAccuracy: { key: string; accuracy: number }[] = [];
  correctlyPressedKeys.forEach((_, key) => keys.add(key));
  incorrectlyPressedKeys.forEach((_, key) => keys.add(key));
  keys.forEach((key) => {
    const accuracy =
      (1 -
        (incorrectlyPressedKeys.get(key) ?? 0) /
          ((correctlyPressedKeys.get(key) ?? 0) +
            (incorrectlyPressedKeys.get(key) ?? 0))) *
      100;
    keysWithAccuracy.push({ key, accuracy });
  });

  const fiveLEastAccurateKeys = keysWithAccuracy
    .sort((key1, key2) => key1.accuracy - key2.accuracy)
    .slice(0, 5)
    .map((key) => ({ ...key, accuracy: `${key.accuracy.toFixed()} %` }));
  return fiveLEastAccurateKeys;
}
