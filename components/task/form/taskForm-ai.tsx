import { Control } from "react-hook-form";

import { AIFormValues } from "@/types/task";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea";

import { FormWrapper } from "./wrapper/formWrapper"
import { SectionWrapper } from "./wrapper/sectionWrapper";

type TaskFormAIProps = {
  title: string;
  control: Control<AIFormValues>;
};

export default function TaskFormAI({
  title,
  control
}: TaskFormAIProps) {
  return (
    <FormWrapper title={title}>
      <SectionWrapper title="What kind of emails would you like to delete?">
        <FormField
          control={control}
          name="prompt.taskPrompt"
          render={({ field }) => (
            <FormItem>
              <FormDescription>
                e.g. emails from John Doe, and emails older than 3 months
              </FormDescription>
              <FormControl>
                <Textarea 
                  placeholder="emails from John Doe, and emails older than 3 months"
                  rows={6} 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </SectionWrapper>
    </FormWrapper>
  )
}