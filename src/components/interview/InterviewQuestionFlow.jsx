import { useState } from 'react';
import { HiOutlineClock, HiOutlineArrowRight, HiOutlineCheck } from 'react-icons/hi';
import { useElapsedTimer, formatDuration } from '../../hooks/useElapsedTimer';

export default function InterviewQuestionFlow({ interview, onComplete, isSubmitting }) {
  const { questions } = interview;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [questionIndex]: { answerText, timeTakenSeconds } }
  const [currentAnswer, setCurrentAnswer] = useState('');

  const { seconds } = useElapsedTimer(currentIndex);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const commitCurrentAnswer = () => ({
    ...answers,
    [currentIndex]: { answerText: currentAnswer, timeTakenSeconds: seconds },
  });

  const handleNext = () => {
    const updatedAnswers = commitCurrentAnswer();
    setAnswers(updatedAnswers);
    setCurrentAnswer('');
    setCurrentIndex((i) => i + 1);
  };

  const handleFinish = () => {
    const updatedAnswers = commitCurrentAnswer();
    const formattedAnswers = Object.entries(updatedAnswers).map(([questionIndex, value]) => ({
      questionIndex: Number(questionIndex),
      answerText: value.answerText,
      timeTakenSeconds: value.timeTakenSeconds,
    }));
    onComplete(formattedAnswers);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Progress bar */}
      <div>
        <div className="mb-2 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <span>
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span className="flex items-center gap-1 font-medium text-brand-600">
            <HiOutlineClock className="h-4 w-4" />
            {formatDuration(seconds)}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-brand-600 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="card space-y-4">
        <span className="tag border-brand-300 text-brand-700 dark:border-brand-700 dark:text-brand-300">
          {currentQuestion.category}
        </span>
        <p className="text-lg font-semibold leading-relaxed">{currentQuestion.questionText}</p>

        <textarea
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          rows={8}
          placeholder="Type your answer here… Be specific and structure your response clearly."
          className="input-field resize-none"
        />

        <div className="flex justify-end">
          {isLastQuestion ? (
            <button
              type="button"
              onClick={handleFinish}
              disabled={isSubmitting}
              className="btn-primary"
            >
              <HiOutlineCheck className="h-5 w-5" />
              {isSubmitting ? 'Evaluating your answers…' : 'Finish & Get AI Feedback'}
            </button>
          ) : (
            <button type="button" onClick={handleNext} className="btn-primary">
              Next Question
              <HiOutlineArrowRight className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
