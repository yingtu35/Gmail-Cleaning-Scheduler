'use client'

import { Control, UseFormWatch, FieldErrors, FieldError } from "react-hook-form";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { InputTags } from "@/components/ui/input-tags";
import { 
  EMAIL_IS_OPTIONS,
  HAS_OPTIONS,
  CATEGORY_OPTIONS,
  EMAIL_IN_OPTIONS,
 } from "@/components/task/form/constants/formValues";
 import {
  SIZE_COMPARISON_ENUM,
  SIZE_UNIT_ENUM,
  AGE_COMPARISON_ENUM,
  AGE_UNIT_ENUM,
  TIME_COMPARISON_ENUM,
 } from "@/validations/form";
 import { FormValues } from "@/types/task";
 import { cn } from "@/utils/cn";

 import { SectionWrapper } from "./wrapper/sectionWrapper";
 import { FormWrapper } from "./wrapper/formWrapper"
import { BasicFiltersSection } from "./sections/BasicFiltersSection";
import { ProFiltersSection } from "./sections/ProFiltersSection";

interface TaskFormProps {
  title: string;
  control: Control<FormValues>;
  watch: UseFormWatch<FormValues>;
  errors: FieldErrors<FormValues> & { _taskConditions?: FieldError };
}

export function TaskForm({
  title,
  control,
  watch,
  errors,
}: TaskFormProps) {
  return (
    <FormWrapper title={title}>
      {errors._taskConditions && (
        <div className="mb-4 p-4 border border-red-500 bg-red-50 text-red-700 rounded">
          <p>{errors._taskConditions.message}</p>
        </div>
      )}
      <BasicFiltersSection control={control} watch={watch} errors={errors} />
      <ProFiltersSection control={control} watch={watch} errors={errors} />
    </FormWrapper>
  );
}