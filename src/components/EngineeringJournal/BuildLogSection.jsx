import { useJournal } from "../../hooks/useJournal";
import BuildLog from "./BuildLog";

export default function BuildLogSection() {
  const journal = useJournal();
  return <BuildLog journal={journal} />;
}