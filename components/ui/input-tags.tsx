import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, InputProps } from "@/components/ui/input";
import { XIcon } from "lucide-react";
import { Dispatch, SetStateAction, forwardRef, useState } from "react";

type InputTagsProps = InputProps & {
  value: string[];
  onChange: Dispatch<SetStateAction<string[]>>;
};

export const InputTags = forwardRef<HTMLInputElement, InputTagsProps>(
  ({ value, onChange, ...props }, ref) => {
    const { disabled } = props;
    const [pendingDataPoint, setPendingDataPoint] = useState("");

    const addPendingDataPoint = () => {
      if (pendingDataPoint) {
        const newDataPoints = new Set([...value, pendingDataPoint]);
        onChange(Array.from(newDataPoints));
        setPendingDataPoint("");
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (["Enter", "Tab", ","].includes(e.key)) {
        e.preventDefault();
        addPendingDataPoint();
      }
    };

    return (
      <>
        <div className="flex">
          <Input
            value={pendingDataPoint}
            onChange={(e) => setPendingDataPoint(e.target.value)}
            onKeyDown={handleKeyDown}
            className="rounded-r-none"
            {...props}
            ref={ref}
          />
          <Button
            type="button"
            variant="secondary"
            className="rounded-l-none border border-l-0"
            onClick={addPendingDataPoint}
            disabled={disabled}
          >
            Add
          </Button>
        </div>
        <div className={`${value.length === 0 ? "bg-muted" : ""} border rounded-md min-h-[3rem] overflow-y-auto p-2 flex gap-2 flex-wrap items-center`}>
          {value.length === 0 && (
            <span className="text-sm text-muted-foreground">
              Empty
            </span>
          )}
          {value.map((item, idx) => (
            <Badge key={idx} variant="secondary">
              {item}
              <button
                type="button"
                className="w-3 ml-2"
                onClick={() => {
                  onChange(value.filter((i) => i !== item));
                }}
              >
                <XIcon className="w-3" />
              </button>
            </Badge>
          ))}
        </div>
      </>
    );
  }
);

InputTags.displayName = "InputTags"; 