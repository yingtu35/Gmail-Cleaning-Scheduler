import { UseFormWatch } from "react-hook-form";
import { useCompletion } from '@ai-sdk/react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useState } from "react";

import log from "@/utils/log";
import { formatFields } from "@/utils/schedule";
import { FormValues } from "@/types/task"
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScheduleDetail } from "@/components/task/detail/schedule-detail";
import { TaskDetail } from "@/components/task/detail/task-detail";
import { Loader } from "@/components/loader";

import { FormWrapper } from "./wrapper/formWrapper"
import { SectionWrapper } from "./wrapper/sectionWrapper";
import { useAIExplanationFeedback } from "./hooks/useAIExplanationFeedback";
function AIExplanation({
  result,
  error,
  onGenerateButtonClicked,
  isLoading,
}: {
  result: string | null;
  error: Error | undefined;
  onGenerateButtonClicked: () => void;
  isLoading: boolean;
}) {
  const { handleFeedback, isFeedbackDisliked, isFeedbackLiked } = useAIExplanationFeedback(result);

  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <p className="text-sm text-muted-foreground">
          What is the AI explanation?
        </p>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="ml-1" size="icon">
              <svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512"><path fill-rule="nonzero" d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" side="right" align="end">
            <p className="text-sm text-muted-foreground">
              The AI explanation provides a detailed breakdown of the generated Gmail cleaning task. <br/>
              You can check if the task is what you expected.
            </p>
          </PopoverContent>
        </Popover>
      </div>
      {!result && (
        <Button
          variant="default"
          type="button"
          onClick={onGenerateButtonClicked}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader />
              <span>Generating</span>
            </div>
          ) : (
            "Generate"
          )}
        </Button>
      )}
      {result && (
        <>
          <p>{result}</p>
          {!isLoading && (
            <div className="flex items-center gap-2">
              {!isFeedbackDisliked && (
                <Button
                  variant={isFeedbackLiked ? "default" : "ghost"}
                  size="icon"
                  type="button"
                  onClick={() => handleFeedback(true)}
                  disabled={isFeedbackLiked}
                >
                  <ThumbsUp />
                </Button>
              )}
              {!isFeedbackLiked && (
                <Button
                  variant={isFeedbackDisliked ? "default" : "ghost"}
                  size="icon"
                  type="button"
                  onClick={() => handleFeedback(false)}
                  disabled={isFeedbackDisliked}
                >
                  <ThumbsDown />
                </Button>
              )}
            </div>
          )}
        </>
      )}
      {error && <p className="text-red-500">{error.message}</p>}
    </div>
  );
}

interface ReviewFormProps {
  watch: UseFormWatch<FormValues>;
}

export function ReviewForm({ watch }: ReviewFormProps) {
  const { complete, completion, isLoading, error } = useCompletion({
    api: '/api/tasks/explanation',
    // TODO: implement logging
    onError: (error: Error) => {
      log.error(`[ReviewForm] onError: ${error}`);
    },
    onFinish: (prompt, completion) => {
      log.info(`[ReviewForm] onFinish: ${prompt}, ${completion}`);
    },
  });

  const formValues = watch();
  const aggregatedEntries = Object.entries(formValues);
  const scheduleEntries = aggregatedEntries.slice(0, 3);
  const taskEntries = aggregatedEntries.slice(3);

  const onGenerateButtonClicked = async () => {
    const fullSearchQueries = formatFields(formValues);
    await complete(fullSearchQueries);
  };

  return (
    <>
      <FormWrapper title="Schedule Review">
        <SectionWrapper title="AI Explanation">
          <AIExplanation
            result={completion}
            error={error}
            isLoading={isLoading}
            onGenerateButtonClicked={onGenerateButtonClicked}
          />
        </SectionWrapper>         
        <SectionWrapper title="Schedule">
          <ScheduleDetail scheduleEntries={scheduleEntries} />
        </SectionWrapper>
        <SectionWrapper title="Task">
          <TaskDetail taskEntries={taskEntries} />
        </SectionWrapper>
      </FormWrapper>
    </>
  );
}