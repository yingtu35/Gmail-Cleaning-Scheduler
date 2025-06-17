'use client'

import { Control, UseFormWatch, FieldErrors, FieldError } from "react-hook-form";
import { type Session } from "next-auth";
import Link from "next/link";

 import { FormValues } from "@/types/task";
 import { Button } from "@/components/ui/button";

 import { FormWrapper } from "./wrapper/formWrapper"
import { BasicFiltersSection } from "./sections/BasicFiltersSection";
import { ProFiltersSection } from "./sections/ProFiltersSection";
interface TaskFormProps {
  title: string;
  control: Control<FormValues>;
  watch: UseFormWatch<FormValues>;
  errors: FieldErrors<FormValues> & { _taskConditions?: FieldError };
  session: Session;
}

export function TaskForm({
  title,
  control,
  watch,
  errors,
  session,
}: TaskFormProps) {
  const { user } = session;
  const { subscriptionDetails } = user;
  const tierDetails = subscriptionDetails?.tierDetails;
  const isPro = tierDetails?.name === "pro";
  const isSubscriptionActive = subscriptionDetails?.status === "active";

  const shouldShowProFilters = isPro && isSubscriptionActive;
  return (
    <FormWrapper title={title}>
      {errors._taskConditions && (
        <div className="mb-4 p-4 border border-red-500 bg-red-50 text-red-700 rounded">
          <p>{errors._taskConditions.message}</p>
        </div>
      )}
      <BasicFiltersSection control={control} watch={watch} errors={errors} />
      <div className="relative">
        <div className={
          shouldShowProFilters
            ? ''
            : 'blur-sm pointer-events-none select-none'
        }>
          <ProFiltersSection control={control} watch={watch} errors={errors} />
        </div>
        {!shouldShowProFilters && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10 rounded">
            <div className="flex flex-col items-center gap-2">
              <span className="text-gray-500 font-semibold">Upgrade to Pro to unlock more filters</span>
              <Link href="/pricing">
                <Button>Upgrade</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </FormWrapper>
  );
}