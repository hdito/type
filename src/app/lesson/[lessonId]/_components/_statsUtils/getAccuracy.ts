export function getAccuracy(countOfErrors: number, totalKeypresses: number) {
  const accuracy = (1 - countOfErrors / totalKeypresses) * 100;

  if (isNaN(accuracy)) {
    return "-";
  }
  return `${accuracy.toFixed()} %`;
}
