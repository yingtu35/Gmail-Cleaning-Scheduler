import { DetailGrid } from "../../DetailGrid";

export function ScheduleDetail({ scheduleEntries }: { scheduleEntries: [string, any][] }) {
  return <DetailGrid entries={scheduleEntries} maxDepth={3} />;
}