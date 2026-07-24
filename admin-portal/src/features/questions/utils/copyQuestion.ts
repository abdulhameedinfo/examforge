import type { QuestionDetail } from '../types';

export function formatQuestionForCopy(question: QuestionDetail): string {
  let text = `Question: ${question.text}\n`;
  text += `Type: ${question.type}\n`;
  text += `Marks: ${question.marks}\n`;
  text += `Subject: ${question.subject.name}\n`;
  
  if (question.chapter) {
    text += `Chapter: ${question.chapter.name}\n`;
  }
  
  text += `Difficulty: ${question.difficulty?.name || 'N/A'}\n`;
  
  if (question.type === 'MultipleChoice' && question.mcqOptions) {
    text += `\nOptions:\n`;
    text += `A) ${question.mcqOptions.optionA}\n`;
    text += `B) ${question.mcqOptions.optionB}\n`;
    text += `C) ${question.mcqOptions.optionC}\n`;
    text += `D) ${question.mcqOptions.optionD}\n`;
    text += `Correct: ${question.mcqOptions.correctOption}\n`;
  }
  
  if (question.type === 'TrueFalse' && question.trueFalseAnswer !== null) {
    text += `Answer: ${question.trueFalseAnswer ? 'True' : 'False'}\n`;
  }
  
  if (question.modelAnswer) {
    text += `\nModel Answer: ${question.modelAnswer}\n`;
  }
  
  if (question.type === 'FillInTheBlank' && question.blankAnswers.length > 0) {
    text += `\nBlank Answers: ${question.blankAnswers.join(', ')}\n`;
  }
  
  return text;
}

export async function copyQuestionToClipboard(question: QuestionDetail): Promise<boolean> {
  try {
    const text = formatQuestionForCopy(question);
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy question:', error);
    return false;
  }
}
