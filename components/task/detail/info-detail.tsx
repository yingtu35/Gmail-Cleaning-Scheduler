import { DetailGrid } from "../../DetailGrid";

export function InfoDetail({ infoEntries }: { infoEntries: [string, any][] }) {
  return <DetailGrid entries={infoEntries} maxDepth={3} />;
}