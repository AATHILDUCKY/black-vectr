import {
  Network,
  Cloud,
  ScanSearch,
  Radar,
  Boxes,
  Crosshair,
  ShieldCheck,
  Bug,
  Swords,
  Binary,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";

// Maps the icon "key" stored on a Service/Solution to a Lucide component.
const MAP: Record<string, LucideIcon> = {
  Network,
  Cloud,
  ScanSearch,
  Radar,
  Boxes,
  Crosshair,
  ShieldCheck,
  Bug,
  Swords,
  Binary,
  GraduationCap,
};

export function ServiceIcon({
  name,
  className,
}: {
  name?: string | null;
  className?: string;
}) {
  const Icon = (name && MAP[name]) || ShieldCheck;
  return <Icon className={className} />;
}
