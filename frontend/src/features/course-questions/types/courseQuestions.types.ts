export type QuestionType = 'multiple_choice' | 'true_false';
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: number;
  module_id: number;
  question_type: QuestionType;
  text: string;
  topic: string;
  difficulty: QuestionDifficulty;
  options: string[];
  correct_option: string;
}

export interface QuestionCreatePayload {
  question_type: QuestionType;
  text: string;
  topic: string;
  difficulty: QuestionDifficulty;
  options: string[];
  correct_option: string;
}

export type QuestionUpdatePayload = Partial<QuestionCreatePayload>;