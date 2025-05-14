import { useRef, useEffect } from "react";
import { Control, UseFormWatch, useFormContext } from "react-hook-form";
import timezones from "timezones-list";
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { cn } from "@/utils/cn"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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
import { DEFAULT_SCHEDULE, DATE_THREE_YEARS_FROM_NOW } from "@/components/task/form/constants/formValues";
import { FormValues } from "@/types/task";

import { SectionWrapper } from "./wrapper/sectionWrapper";
import { FormWrapper } from "./wrapper/formWrapper"


interface ScheduleFormProps {
  title: string;
  control: Control<FormValues>;
  watch: UseFormWatch<FormValues>;
}
export function ScheduleForm({
  title,
  control,
  watch
}: ScheduleFormProps) {
  const { setValue } = useFormContext<FormValues>();
  // refs to remember user-entered values
  const oneTimeRef = useRef<any>();
  const recurringRef = useRef<any>();

  const occurrenceType = watch("occurrence.Occurrence");
  const schedule = watch("occurrence.Schedule");
  // update refs whenever schedule changes
  useEffect(() => {
    if (occurrenceType === 'One-time') {
      oneTimeRef.current = schedule;
    } else {
      recurringRef.current = schedule;
    }
  }, [schedule, occurrenceType]);

  return (
    <FormWrapper title={title}>
      {/* Schedule Detail */}
      <SectionWrapper title="Schedule name and description">
        {/* Name */}
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Name
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter your schedule name" {...field} />
              </FormControl>
              <FormDescription>
                Use only letters, numbers, dashes, dots or underscores. Max 64 characters
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description - optional</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter your schedule description"
                  rows={6} 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Maximum length is 512 characters
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </SectionWrapper>
      <SectionWrapper title="Schedule pattern">
      {/* Schedule */}
      <FormField
        control={control}
        name="occurrence.Occurrence"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel className="flex items-center">
              Occurrence
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className="ml-1" size="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512"><path fill-rule="nonzero" d="M256 0c70.69 0 134.69 28.66 181.02 74.98C483.34 121.3 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.69 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.69 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-9.96 161.03c0-4.28.76-8.26 2.27-11.91 1.5-3.63 3.77-6.94 6.79-9.91 3-2.95 6.29-5.2 9.84-6.7 3.57-1.5 7.41-2.28 11.52-2.28 4.12 0 7.96.78 11.49 2.27 3.54 1.51 6.78 3.76 9.75 6.73 2.95 2.97 5.16 6.26 6.64 9.91 1.49 3.63 2.22 7.61 2.22 11.89 0 4.17-.73 8.08-2.21 11.69-1.48 3.6-3.68 6.94-6.65 9.97-2.94 3.03-6.18 5.32-9.72 6.84-3.54 1.51-7.38 2.29-11.52 2.29-4.22 0-8.14-.76-11.75-2.26-3.58-1.51-6.86-3.79-9.83-6.79-2.94-3.02-5.16-6.34-6.63-9.97-1.48-3.62-2.21-7.54-2.21-11.77zm13.4 178.16c-1.11 3.97-3.35 11.76 3.3 11.76 1.44 0 3.27-.81 5.46-2.4 2.37-1.71 5.09-4.31 8.13-7.75 3.09-3.5 6.32-7.65 9.67-12.42 3.33-4.76 6.84-10.22 10.49-16.31.37-.65 1.23-.87 1.89-.48l12.36 9.18c.6.43.73 1.25.35 1.86-5.69 9.88-11.44 18.51-17.26 25.88-5.85 7.41-11.79 13.57-17.8 18.43l-.1.06c-6.02 4.88-12.19 8.55-18.51 11.01-17.58 6.81-45.36 5.7-53.32-14.83-5.02-12.96-.9-27.69 3.06-40.37l19.96-60.44c1.28-4.58 2.89-9.62 3.47-14.33.97-7.87-2.49-12.96-11.06-12.96h-17.45c-.76 0-1.38-.62-1.38-1.38l.08-.48 4.58-16.68c.16-.62.73-1.04 1.35-1.02l89.12-2.79c.76-.03 1.41.57 1.44 1.33l-.07.43-37.76 124.7zm158.3-244.93c-41.39-41.39-98.58-67-161.74-67-63.16 0-120.35 25.61-161.74 67-41.39 41.39-67 98.58-67 161.74 0 63.16 25.61 120.35 67 161.74 41.39 41.39 98.58 67 161.74 67 63.16 0 120.35-25.61 161.74-67 41.39-41.39 67-98.58 67-161.74 0-63.16-25.61-120.35-67-161.74z"/></svg>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" side="right" align="start">
                  <p className="text-sm text-muted-foreground">
                    <span className="text-foreground">One-time schedule</span> is a single occurrence of the task at a specific date and time. <br/>
                    <span className="text-foreground">Recurring schedule</span> is a task that occurs at regular intervals.
                  </p>
                </PopoverContent>
              </Popover>
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={(val) => {
                  // swap to preserved values or defaults
                  if (val === 'One-time') {
                    setValue('occurrence.Schedule', oneTimeRef.current ?? DEFAULT_SCHEDULE.oneTime);
                  } else {
                    setValue('occurrence.Schedule', recurringRef.current ?? DEFAULT_SCHEDULE.recurring);
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
                    One Time Schedule
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="Recurring" />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">
                    Recurring Schedule
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
      {/* One-time schedule pattern */}
      {occurrenceType === "One-time" && (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormField
          control={control}
          name="occurrence.TimeZone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time Zone</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your time zone" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz.tzCode} value={`(UTC${tz.utc}) ${tz.tzCode}`}>
                      (UTC{tz.utc}) {tz.tzCode}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Time zone of the schedule
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="occurrence.Schedule.date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "flex items-center h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date < new Date() || date > DATE_THREE_YEARS_FROM_NOW
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Date for the schedule to be executed
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="occurrence.Schedule.time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time</FormLabel>
              <FormControl>
                <Input
                  type="time"
                  placeholder="Select your time"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Time for the schedule to be executed
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      )}
      {/* Recurring schedule pattern */}
      {occurrenceType === "Recurring" && (
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
          <FormField
            control={control}
            name="occurrence.TimeZone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time Zone</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your time zone" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz.tzCode} value={`(UTC${tz.utc}) ${tz.tzCode}`}>
                        (UTC{tz.utc}) {tz.tzCode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Time zone of the schedule
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-start space-x-4">
            <FormField
              control={control}
              name="occurrence.Schedule.rate.value"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Rate Value</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="30"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    How often the schedule should repeat
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="occurrence.Schedule.rate.unit"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Unit</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="days" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["minutes", "hours", "days"].map((unit) => (
                        <SelectItem key={unit} value={unit}>
                          {unit}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-start space-x-4">
            <FormField
              control={control}
              name="occurrence.Schedule.startDateAndTime.date"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "flex items-center h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a start date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || date > DATE_THREE_YEARS_FROM_NOW
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                  <FormDescription>
                    Describe when the schedule should start
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="occurrence.Schedule.startDateAndTime.time"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Time</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      placeholder="Select your time"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex items-start space-x-4">
            <FormField
              control={control}
              name="occurrence.Schedule.endDateAndTime.date"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "flex items-center h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a end date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || date > DATE_THREE_YEARS_FROM_NOW
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                  <FormDescription>
                    Describe when the schedule should end
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="occurrence.Schedule.endDateAndTime.time"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Time</FormLabel>
                  <FormControl>
                    <Input
                      type="time"
                      placeholder="Select your time"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      )}
      </SectionWrapper>
    </FormWrapper>
  )
}