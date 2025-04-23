export const getAverageScore = (overallScore: number, scores: number[]) => {
  return Math.round((overallScore / scores.length) * 100) / 100;
};
