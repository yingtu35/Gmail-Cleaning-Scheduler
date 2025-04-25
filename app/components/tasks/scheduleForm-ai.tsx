import { useEffect, useRef } from 'react';
import { Control, UseFormWatch, useFormContext } from 'react-hook-form';

import { AIFormValues } from '@/app/lib/definitions';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea";

import { FormWrapper } from './formWrapper';
import { SectionWrapper } from './sectionWrapper';

type ScheduleFormAIProps = {
  title: string;
  control: Control<AIFormValues>;
  watch: UseFormWatch<AIFormValues>;
}

export default function ScheduleFormAI({
  title,
  control,
  watch,
}: ScheduleFormAIProps) {
  const { setValue } = useFormContext<AIFormValues>();
  // refs to remember user-entered values
  const oneTimeRef = useRef<any>();
  const recurringRef = useRef<any>();
  const occurrenceType = watch("prompt.schedulePrompt.Occurrence");
  const prompt = watch("prompt.schedulePrompt.Prompt");

// update refs whenever schedule changes
  useEffect(() => {
    if (occurrenceType === 'One-time') {
      oneTimeRef.current = prompt;
    } else {
      recurringRef.current = prompt;
    }
  }, [prompt, occurrenceType]);
  return (
    <FormWrapper title={title}>
      <SectionWrapper title="Schedule Description">
        <FormField
          control={control}
          name="prompt.schedulePrompt.Occurrence"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Do you want your schedule one-time only or recurring?</FormLabel>
              <FormControl>
              <RadioGroup
                onValueChange={(val) => {
                  // swap to preserved values or defaults
                  if (val === 'One-time') {
                    setValue('prompt.schedulePrompt.Prompt', oneTimeRef.current ?? "");
                  } else {
                    setValue('prompt.schedulePrompt.Prompt', recurringRef.current ?? "");
                  }
                  field.onChange(val);
                }}
                value={field.value}
                className="flex space-x-4"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="One-time" />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">
                    One Time
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="Recurring" />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">
                    Recurring
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
            <FormDescription>
              Select the schedule type
            </FormDescription>
          </FormItem>
          )}
        />
        {occurrenceType === 'One-time' ? (
          <OneTimeFormAI control={control} />
        ) : (
          <RecurringFormAI control={control} />
        )}
      </SectionWrapper>
    </FormWrapper>
  )
}

function OneTimeFormAI({ 
  control
} : {
  control: Control<AIFormValues>;
}) {
  return (
    <FormField
      control={control}
      name="prompt.schedulePrompt.Prompt"
      render={({ field }) => (
        <FormItem>
          <FormLabel>When do you want to schedule your task?</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="e.g. 2024-12-31 23:59, 3 days from now, same time next month, etc."
              rows={6} 
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function RecurringFormAI({ 
  control
} : {
  control: Control<AIFormValues>;
}) {
  return (
    <FormField
      control={control}
      name="prompt.schedulePrompt.Prompt"
      render={({ field }) => (
        <FormItem>
          <FormLabel>How often do you want to repeat this schedule?</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="e.g. every 3 months, starting from next month, and ending in 6 months"
              rows={6} 
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}