import { UseFormWatch } from "react-hook-form";
import { useFormState } from "react-dom";

import { formatFields } from "@/app/utils/schedule";
import { getSearchQueryExplanation } from "@/app/lib/actions";
import { FormValues } from "@/app/lib/definitions"
import { Button } from "@/components/ui/button";

import { FormWrapper } from "./formWrapper"
import { SectionWrapper } from "./sectionWrapper";

function RenderKeyValue({ keyField, value }: { keyField: string, value: any }) {
  if (keyField === "enabled") return null;
  const lastKey = keyField.split('.').pop();
  if (!lastKey) return null;
  // Split the key at every capital letter and capitalize the first letter
  const formattedKey = lastKey.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  return (
    <div>
      <p className="font-light">{formattedKey}</p>
      <p className="break-words">{Array.isArray(value) ? value.join(", ") : (String(value) === "" ? "-" : String(value))}</p>
    </div>
  )
}

function RenderAggregatedValues({ keyField, value }: { keyField: string; value: any }) {
  const parsedValue = Object.values(value).map((v: any) => {
    // Check if the value is a date
    if (v instanceof Date) {
      return v.toLocaleString().split(',')[0];
    }
    return v;
  });
  
  const joined = parsedValue.join(' ')
  return <RenderKeyValue keyField={keyField} value={joined} />
}


// New component for ScheduleDetail aggregation at depth 3
function RenderField({ keyField, value, maxDepth }: { keyField: string; value: any; maxDepth: number }) {
  const parts = keyField.split('.')
  if (parts.length === maxDepth && value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
    return <RenderAggregatedValues keyField={keyField} value={value} />
  }
  // Primitive or array
  if (value instanceof Date) {
    return <RenderKeyValue keyField={keyField} value={value.toLocaleString().split(',')[0]} />;
  }
  if (Array.isArray(value) || typeof value !== 'object' || value === null) {
    return <RenderKeyValue keyField={keyField} value={value} />;
  }
  // Regular object
  const entries = Object.entries(value);
  if ('enabled' in value) {
    // Only show children when enabled
    if (!value.enabled) return null;
    return entries
      .filter(([k]) => k !== 'enabled')
      .map(([k, v]) => <RenderField key={`${keyField}.${k}`} keyField={`${keyField}.${k}`} value={v} maxDepth={maxDepth} />);
  }
  // Object without enabled: render all
  return entries.map(([k, v]) => <RenderField key={`${keyField}.${k}`} keyField={`${keyField}.${k}`} value={v} maxDepth={maxDepth} />);
}

interface ReviewFormProps {
  watch: UseFormWatch<FormValues>;
}

export function ScheduleDetail({ scheduleEntries }: { scheduleEntries: [string, any][] }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {scheduleEntries.map(([key, value]) => (
        <RenderField key={key} keyField={key} value={value} maxDepth={3} />
      ))}
    </div>
  );
}

export function TaskDetail({ taskEntries }: { taskEntries: [string, any][] }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {taskEntries.map(([key, value]) => (
        <RenderField key={key} keyField={key} value={value} maxDepth={2} />
      ))}
    </div>
  );
}

export function ReviewForm({ watch }: ReviewFormProps) {
  const formValues = watch();
  const aggregatedEntries = Object.entries(formValues);
  const scheduleEntries = aggregatedEntries.slice(0, 3);
  const taskEntries = aggregatedEntries.slice(3);

  // TODO: Stream the explanation to the UI
  const [result, action] = useFormState(getSearchQueryExplanation, null);
  const fullSearchQueries = formatFields(formValues);
  return (
    <>
      <FormWrapper title="Schedule Review">
        <SectionWrapper title="AI Explanation">
          <div>
            <p className="font-muted-foreground">
              This is the AI generated explanation of the search query. It is based on the form values you provided.
            </p>
            {!result && (
              <Button
                variant="default"
                type="button"
                onClick={() => action(fullSearchQueries)}
                // className="bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Generate
              </Button>
            )}
            {result && <p>{result}</p>}
          </div>
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