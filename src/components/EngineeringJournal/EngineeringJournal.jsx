import { useJournal } from "../../hooks/useJournal";
import BuildLog from "./BuildLog";
import EngineeringRoadmap from "./EngineeringRoadmap";

export default function EngineeringJournal() {
  const journal = useJournal();
  return (
    <>
      <BuildLog journal={journal} />
      <EngineeringRoadmap journal={journal} />
    </>
  );
}