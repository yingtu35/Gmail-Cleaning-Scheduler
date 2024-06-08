
export default function FormReview() {
  const formElement = document.getElementById('task-form') as HTMLFormElement;
  if (!formElement) {
    return <div>Form not found</div>
  }
  const formData = new FormData(formElement);
  const entries = Array.from(formData.entries());
  // console.log("entries", entries)
  const splitIndex = entries.findIndex(([key, value]) => key === 'from');
  const scheduleEntries = entries.slice(0, splitIndex);
  // console.log("scheduleEntries", scheduleEntries)
  const taskEntries = splitIndex !== -1 ? entries.slice(splitIndex) : [];
  // console.log("taskEntries", taskEntries)
  const aggregated: { [key: string]: string } = {}
  for (const [key, value] of taskEntries) {
    if (aggregated.hasOwnProperty(key)) {
      aggregated[key] += ` ${value}`;
    } else {
      aggregated[key] = String(value);
    }
  }
  // console.log("aggregated", aggregated)
  const aggregatedEntries = Object.entries(aggregated);
  // console.log("aggregatedEntries", aggregatedEntries)
  return (
    <div className="space-y-4 p-8">
      <h2 className="text-4xl">Review Task</h2>
      <div className="space-y-4 p-4 border">
        <h3 className="text-2xl">Schedule Detail</h3>
        <div className="grid grid-cols-3 gap-2">
          {scheduleEntries.map(([key, value]) => (
            <div key={key}>
              <p className="font-light">{key}</p>
              <p className="break-words">{String(value) === "" ? "-" : String(value)}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-4 p-4 border">
        <h3 className="text-2xl">Task Detail</h3>
        <div className="grid grid-cols-3">
          {aggregatedEntries.map(([key, value]) => (
            <div key={key}>
              <p className="font-light">{key}</p>
              <p className="break-words">{String(value) === "" ? "-" : String(value)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}