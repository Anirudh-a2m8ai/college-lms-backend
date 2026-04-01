export function evaluateAnswer(question: any, userAnswer: any): boolean {
  const correct = question.correctAnswer as any;
  const isEmptyAnswer = !userAnswer || (typeof userAnswer === 'object' && Object.keys(userAnswer).length === 0);

  if (isEmptyAnswer) {
    return false;
  }
  switch (question.questionType) {
    case 'MCQ':
      return userAnswer?.option === correct?.option;

    case 'MULTI_SELECT': {
      const sortedA = [...userAnswer.multiOptions].sort();
      const sortedB = [...correct.multiOptions].sort();
      return sortedA.every((val, index) => val === sortedB[index]);
    }

    case 'TRUE_OR_FALSE':
      return userAnswer?.answer === correct?.answer;

    case 'FILL_IN_THE_BLANKS':
      return JSON.stringify(userAnswer) === JSON.stringify(correct);

    case 'SHORT_ANSWER':
      return String(userAnswer?.option).trim().toLowerCase() === String(correct?.option).trim().toLowerCase();

    default:
      throw new Error('Unsupported question type');
  }
}
