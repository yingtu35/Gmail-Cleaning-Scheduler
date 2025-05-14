import { cn } from "@/libs/utils";

interface DetailGridProps {
  entries: [string, any][];
  className?: string;
  maxDepth?: number;
}

export function DetailGrid({
  entries,
  className,
  maxDepth = 3,
}: DetailGridProps) {
  return (
    <div className={cn("grid md:grid-cols-2 lg:grid-cols-3 gap-4", className)}>
      {entries.map(([key, value]) => (
        <RenderField key={key} keyField={key} value={value} maxDepth={maxDepth} />
      ))}
    </div>
  )
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

function RenderKeyValue({ keyField, value }: { keyField: string, value: any }) {
  if (keyField === "enabled") return null;
  const lastKey = keyField.split('.').pop();
  if (!lastKey) return null;
  // Split the key at every capital letter and capitalize the first letter
  const formattedKey = lastKey.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  return (
    <div>
      <p className="text-sm text-muted-foreground">{formattedKey}</p>
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