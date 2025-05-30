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
  const watchFromEnabled = watch("from.enabled");
  const watchToEnabled = watch("to.enabled");
  const watchTitleEnabled = watch("title.enabled");
  const watchDoesntHaveEnabled = watch("doesntHave.enabled");
  const watchLabelsEnabled = watch("labels.enabled");
  const watchEmailIsEnabled = watch("emailIs.enabled");
  const watchEmailInEnabled = watch("emailIn.enabled");
  const watchHasEnabled = watch("has.enabled");
  const watchCategoryEnabled = watch("category.enabled");
  const watchSizeEnabled = watch("size.enabled");
  const watchAgeEnabled = watch("age.enabled");
  const watchTimeEnabled = watch("time.enabled");

  return (
    <FormWrapper title={title}>
      {errors._taskConditions && (
        <div className="mb-4 p-4 border border-red-500 bg-red-50 text-red-700 rounded">
          <p>{errors._taskConditions.message}</p>
        </div>
      )}
      <SectionWrapper title="Participant Filters">
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex space-x-4">
            <FormField
              control={control}
              name="from.enabled"
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <Checkbox
                      id="enableFrom"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="from.from"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>From</FormLabel>
                  <FormControl>
                    <InputTags
                      id="fromField"
                      disabled={!watchFromEnabled}
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Enter email addresses of the sender
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex space-x-4">
            <FormField
              control={control}
              name="to.enabled"
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <Checkbox id="enableTo" checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="to.to"
              render={({field}) => (
                <FormItem className="flex-1">
                  <FormLabel>To</FormLabel>
                  <FormControl>
                    <InputTags
                      id="toField"
                      disabled={!watchToEnabled}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>Enter the email addresses of the recipient</FormDescription>
                </FormItem>
              )}
            />
          </div>
        </div>
      </SectionWrapper>
      <SectionWrapper title="Content Filters">
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex space-x-4">
            <FormField
              control={control}
              name="title.enabled"
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <Checkbox id="enableTitle" checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="title.title"
              render={({field}) => (
                <FormItem className="flex-1">
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <InputTags
                      id="titleField"
                      disabled={!watchTitleEnabled}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>Enter titles of the email</FormDescription>
                </FormItem>
              )}
            />
          </div>
          <div className="flex space-x-4">
            <FormField
              control={control}
              name="has.enabled"
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <Checkbox id="enableHas" checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="has.has"
              render={({field}) => (
                <FormItem className="flex-1">
                  <FormLabel>Has</FormLabel>
                  <FormControl></FormControl>
                    <MultiSelect
                      id="hasField"
                      options={HAS_OPTIONS}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!watchHasEnabled}
                    />
                  <FormMessage />
                  <FormDescription>Specify emails that include certain type of content</FormDescription>
                </FormItem>
              )}
            />
          </div>
          <div className="flex space-x-4">
            <FormField
              control={control}
              name="doesntHave.enabled"
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <Checkbox id="enableDoesntHave" checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="doesntHave.doesntHave"
              render={({field}) => (
                <FormItem className="flex-1">
                  <FormLabel>Doesn&apos;t have</FormLabel>
                  <FormControl>
                    <InputTags
                      id="doesntHaveField"
                      disabled={!watchDoesntHaveEnabled}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>Emails that contain specified text will not be included</FormDescription>
                </FormItem>
              )}
            />
          </div>
        </div>
      </SectionWrapper>
      <SectionWrapper title="Classification Filters">
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex space-x-4">
            <FormField
              control={control}
              name="emailIs.enabled"
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <Checkbox id="enableEmailIs" checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="emailIs.emailIs"
              render={({field}) => (
                <FormItem className="flex-1">
                  <FormLabel>Emails are</FormLabel>
                  <FormControl>
                    <MultiSelect
                      id="emailIsField"
                      options={EMAIL_IS_OPTIONS}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!watchEmailIsEnabled}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>Choose the status of the emails</FormDescription>
                </FormItem>
              )}
            />
          </div>
          <div className="flex space-x-4">
            <FormField
              control={control}
              name="labels.enabled"
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <Checkbox id="enableLabels" checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="labels.labels"
              render={({field}) => (
                <FormItem className="flex-1">
                  <FormLabel>Labels</FormLabel>
                  <FormControl>
                    <InputTags
                      id="labelsField"
                      disabled={!watchLabelsEnabled}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>Enter labels that emails are tagged with</FormDescription>
                </FormItem>
              )}
            />
          </div>
          <div className="flex space-x-4">
            <FormField
              control={control}
              name="category.enabled"
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <Checkbox id="enableCategory" checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="category.category"
              render={({field}) => (
                <FormItem className="flex-1">
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <MultiSelect
                      id="categoryField"
                      options={CATEGORY_OPTIONS}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!watchCategoryEnabled}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>Specify categories to filter emails</FormDescription>
                </FormItem>
              )}
            />
          </div>
          <div className="flex space-x-4">
            <FormField
              control={control}
              name="emailIn.enabled"
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <Checkbox id="enableEmailIn" checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="emailIn.emailIn"
              render={({field}) => (
                <FormItem className="flex-1">
                  <FormLabel>Email In</FormLabel>
                  <FormControl>
                    <MultiSelect
                      id="emailInField"
                      options={EMAIL_IN_OPTIONS}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!watchEmailInEnabled}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>Specify the location of the emails</FormDescription>
                </FormItem>
              )}
            />
          </div>
        </div>
      </SectionWrapper>
      <SectionWrapper title="Quantitative Filters">
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex space-x-4">
            <FormField
              control={control}
              name="time.enabled"
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <Checkbox id="enableTime" checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex items-start space-x-4 flex-1">
              <FormField
                control={control}
                name="time.time.comparison"
                render={({field}) => (
                  <FormItem className="flex-1">
                    <FormLabel>Time</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={!watchTimeEnabled}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TIME_COMPARISON_ENUM.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      A specific time to filter emails
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="time.time.value"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            disabled={!watchTimeEnabled}
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
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <FormField
              control={control}
              name="size.enabled"
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <Checkbox id="enableSize" checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex items-start space-x-4">
              <FormField
                control={control}
                name="size.size.comparison"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Size</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={!watchSizeEnabled}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SIZE_COMPARISON_ENUM.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Specify the size of the email
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="size.size.value"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                      <Input
                        id="sizeValueField"
                        type="number"
                        min={1}
                        disabled={!watchSizeEnabled}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="size.size.unit"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!watchSizeEnabled}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {SIZE_UNIT_ENUM.map((unit) => (
                            <SelectItem key={unit} value={unit}>
                              {unit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <FormField
              control={control}
              name="age.enabled"
              render={({field}) => (
                <FormItem>
                  <FormControl>
                    <Checkbox id="enableAge" checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex items-start space-x-4">
              <FormField
                control={control}
                name="age.age.comparison"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      disabled={!watchAgeEnabled}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {AGE_COMPARISON_ENUM.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How old the emails should be
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="age.age.value"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Value</FormLabel>
                    <FormControl>
                      <Input
                        id="ageValueField"
                        type="number"
                        min={1}
                        disabled={!watchAgeEnabled}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="age.age.unit"
                render={({field}) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!watchAgeEnabled}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {AGE_UNIT_ENUM.map((unit) => (
                            <SelectItem key={unit} value={unit}>
                              {unit}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </SectionWrapper>
    </FormWrapper>
  )
}