import { AgeValue, FormValues, OccurrenceType, SizeValue, TimeValue } from "@/app/lib/definitions"
import { FormWrapper } from "./formWrapper"

function RenderComplexKeyValue({ keyField, value }: { keyField: string, value: any }) {
  // print the keyfield in one line, and all values in the next line
  return (
    <div>
      <p className="font-light">{keyField}</p>
      <p className="break-words">{Object.entries(value).map(([_, value]) => `${value}`).join(" ")}</p>
    </div>
  )
}

function RenderKeyValue({ keyField, value }: { keyField: string, value: any }) {
  if (keyField === "enabled") return null;
  return (
    <div>
      <p className="font-light">{keyField}</p>
      <p className="break-words">{Array.isArray(value) ? value.join(", ") : (String(value) === "" ? "-" : String(value))}</p>
    </div>
  )
}

function RenderObject({ value }: { value: any }) {
  const entries = Object.entries(value);
  return entries.map(([key, value]) => {
    if (key === "temp") return null;
    if (Array.isArray(value) || typeof value !== "object") {
      return (
        <RenderKeyValue key={key} keyField={key} value={value} />
      )
    } else if (value && ("unit" in value || "comparison" in value)) {
      return (
        <RenderComplexKeyValue key={key} keyField={key} value={value} />
      )
    } else {
      return (
        <RenderObject key={key} value={value} />
      )
    }
  })
}
export function ReviewForm({ formValues }: { formValues: FormValues }) {
  // convert formValues to an array of key-value pairs
  const aggregatedEntries = Object.entries(formValues)
  // extract the first 5 entries
  const scheduleEntries = aggregatedEntries.slice(0, 3)
  console.log('scheduleEntries', scheduleEntries)
  const taskEntries = aggregatedEntries.slice(3)
  console.log('taskEntries', taskEntries)
  return (
    <FormWrapper title="Schedule Review">
      <div className="space-y-4 p-4 border">
        <h3 className="text-2xl">Schedule Detail</h3>
        <div className="grid grid-cols-3 gap-2">
          {scheduleEntries.map(([key, value]) => {
            if (typeof value === "object") {
              if ('enabled' in value && !value.enabled) return null;
              return (
                <RenderObject key={key} value={value} />
              )
            } else {
              return (
                <RenderKeyValue key={key} keyField={key} value={value} />
              )
            }
          })}
        </div>
      </div>
      <div className="space-y-4 p-4 border">
        <h3 className="text-2xl">Task Detail</h3>
        <div className="grid grid-cols-3 gap-2">
          {taskEntries.map(([key, value]) => {
            if (typeof value === "object" && 'enabled' in value && value.enabled) {
              return (
                <RenderObject key={key} value={value} />
              )
            }
          })}
        </div>
      </div>
      {/* <div className="space-y-4 p-4 border">
        <h3 className="text-2xl">Task Detail</h3>
        <div className="grid grid-cols-3">
          {aggregatedEntries.map(([key, value]) => (
            <div key={key}>
              <p className="font-light">{key}</p>
              <p className="break-words">{String(value) === "" ? "-" : String(value)}</p>
            </div>
          ))}
        </div>
      </div> */}
    </FormWrapper>
  )
}