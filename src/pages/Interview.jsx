import { useState } from 'react';
import toast from 'react-hot-toast';
import { interviewService } from '../services/interviewService';
import InterviewSetup from '../components/interview/InterviewSetup';
import InterviewQuestionFlow from '../components/interview/InterviewQuestionFlow';
import InterviewResults from '../components/interview/InterviewResults';

// Simple stage machine: setup -> in_progress -> completed
const STAGE = {
  SETUP: 'setup',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
};

export default function Interview() {
  const [stage, setStage] = useState(STAGE.SETUP);
  const [interview, setInterview] = useState(null);
  const [isStarting, setIsStarting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStart = async (payload) => {
    setIsStarting(true);
    try {
      const { data } = await interviewService.start(payload);
      setInterview(data.data.interview);
      setStage(STAGE.IN_PROGRESS);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start interview. Please try again.');
    } finally {
      setIsStarting(false);
    }
  };

  const handleComplete = async (answers) => {
    setIsSubmitting(true);
    try {
      const { data } = await interviewService.submit(interview._id, { answers });
      setInterview(data.data.interview);
      setStage(STAGE.COMPLETED);
      toast.success('Your interview has been evaluated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to evaluate interview. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {stage === STAGE.SETUP && (
        <div>
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold">AI Mock Interview</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Tell us who you're interviewing with, and we'll generate tailored questions.
            </p>
          </div>
          <InterviewSetup onStart={handleStart} isStarting={isStarting} />
        </div>
      )}

      {stage === STAGE.IN_PROGRESS && interview && (
        <InterviewQuestionFlow
          interview={interview}
          onComplete={handleComplete}
          isSubmitting={isSubmitting}
        />
      )}

      {stage === STAGE.COMPLETED && interview && <InterviewResults interview={interview} />}
    </div>
  );
}
