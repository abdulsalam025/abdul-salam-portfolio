import { useJournal } from "../../hooks/useJournal";
import EngineeringRoadmap from "./EngineeringRoadmap";

export default function EngineeringJournal() {
  const journal = useJournal();
  return <EngineeringRoadmap journal={journal} />;
}