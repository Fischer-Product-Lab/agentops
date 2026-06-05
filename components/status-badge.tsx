import type { ReadinessStatus } from "@/lib/types";

const STATUS_STYLES: Record<ReadinessStatus, string> = {
  Launch: "border-launch/30 bg-launch/10 text-launch",
  Conditional: "border-gold/30 bg-gold/10 text-gold-soft",
  "Needs Review": "border-review/30 bg-review/10 text-review",
  "Do Not Launch": "border-danger/30 bg-danger/10 text-danger",
};

/** Raw hex per status — handy for chart fills (Recharts) later. */
export const STATUS_HEX: Record<ReadinessStatus, string> = {
  Launch: "#5fd6a0",
  Conditional: "#c9a45c",
  "Needs Review": "#e6a560",
  "Do Not Launch": "#e8736f",
};

export function StatusBadge({
  status,
  className = "",
}: {
  status: ReadinessStatus;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap ${STATUS_STYLES[status]} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
