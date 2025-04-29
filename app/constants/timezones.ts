import timezones from "timezones-list";


export const timezonesMap = timezones.reduce((acc, tz) => {
  acc[tz.tzCode] = {
    label: tz.tzCode,
    value: `(UTC${tz.utc}) ${tz.tzCode}`
  };
  return acc;
}, {} as Record<string, { label: string; value: string }>);