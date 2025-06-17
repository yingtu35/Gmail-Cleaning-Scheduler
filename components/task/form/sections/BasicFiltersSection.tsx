import { Control, UseFormWatch, FieldErrors, FieldError } from "react-hook-form";
import { SectionWrapper } from "../wrapper/sectionWrapper";
import { FormValues } from "@/types/task";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { InputTags } from "@/components/ui/input-tags";
import { MultiSelect } from "@/components/ui/multi-select";
import { AGE_COMPARISON_ENUM, AGE_UNIT_ENUM } from "@/validations/form";
import { EMAIL_IS_OPTIONS } from "../constants/formValues";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface BasicFiltersSectionProps {
  control: Control<FormValues>;
  watch: UseFormWatch<FormValues>;
  errors: FieldErrors<FormValues> & { _taskConditions?: FieldError };
}

export function BasicFiltersSection({ control, watch, errors }: BasicFiltersSectionProps) {
  const watchFromEnabled = watch("from.enabled");
  const watchTitleEnabled = watch("title.enabled");
  const watchEmailIsEnabled = watch("emailIs.enabled");
  const watchAgeEnabled = watch("age.enabled");

  return (
    <SectionWrapper title="Basic Filters">
      <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
        {/* From */}
        <div className="flex space-x-4">
          <FormField
            control={control}
            name="from.enabled"
            render={({field}) => (
              <FormItem>
                <FormControl>
                  <Checkbox id="enableFrom" checked={field.value} onCheckedChange={field.onChange} />
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
                  <InputTags id="fromField" disabled={!watchFromEnabled} {...field} />
                </FormControl>
                <FormDescription>Enter email addresses of the sender</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Title */}
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
                  <InputTags id="titleField" disabled={!watchTitleEnabled} {...field} />
                </FormControl>
                <FormMessage />
                <FormDescription>Enter titles of the email</FormDescription>
              </FormItem>
            )}
          />
        </div>
        {/* EmailIs */}
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
        {/* Age */}
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
                  <FormDescription>How old the emails should be</FormDescription>
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
  );
} 