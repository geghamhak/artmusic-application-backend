export const getOverallScore = (scores: number[]): number => {
  return scores.reduce((total: number, current: number) => {
    return total + current;
  }, 0);
};
