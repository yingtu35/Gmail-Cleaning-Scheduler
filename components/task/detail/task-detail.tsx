import { DetailGrid } from "./DetailGrid";

export function TaskDetail({ taskEntries }: { taskEntries: [string, any][] }) {
  return <DetailGrid entries={taskEntries} maxDepth={2} />;
}