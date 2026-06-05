"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import type {
  Autonomy,
  DataAccessLevel,
  ReadinessStatus,
} from "@/lib/types";
import { StatusBadge } from "@/components/status-badge";

export interface RegistryRow {
  id: string;
  name: string;
  ownerName: string;
  ownerTeam: string;
  model: string;
  dataAccess: DataAccessLevel;
  autonomy: Autonomy;
  status: ReadinessStatus;
  score: number;
  estHoursSavedPerMonth: number;
}

type SortKey =
  | "name"
  | "owner"
  | "model"
  | "dataAccess"
  | "autonomy"
  | "score"
  | "hours";

type SortDir = "asc" | "desc";

// Rank maps so sorting reflects risk/sensitivity, not just alphabetical order.
const DATA_ACCESS_RANK: Record<DataAccessLevel, number> = {
  Public: 0,
  Internal: 1,
  Confidential: 2,
  "Customer/Regulated": 3,
};

const AUTONOMY_RANK: Record<Autonomy, number> = {
  "Read-only": 0,
  Suggest: 1,
  "Write-with-approval": 2,
  "Autonomous-write": 3,
};

const DATA_ACCESS_STYLE: Record<DataAccessLevel, string> = {
  Public: "text-ink-faint",
  Internal: "text-ink-muted",
  Confidential: "text-gold-soft",
  "Customer/Regulated": "text-review",
};

const AUTONOMY_STYLE: Record<Autonomy, string> = {
  "Read-only": "text-ink-muted",
  Suggest: "text-ink-muted",
  "Write-with-approval": "text-review",
  "Autonomous-write": "text-danger",
};

const COLUMNS: { key: SortKey; label: string; align?: "right" }[] = [
  { key: "name", label: "Agent" },
  { key: "owner", label: "Owner" },
  { key: "model", label: "Model" },
  { key: "dataAccess", label: "Data Access" },
  { key: "autonomy", label: "Autonomy" },
  { key: "score", label: "Readiness" },
  { key: "hours", label: "Hrs / mo", align: "right" },
];

function sortValue(row: RegistryRow, key: SortKey): string | number {
  switch (key) {
    case "name":
      return row.name.toLowerCase();
    case "owner":
      return row.ownerName.toLowerCase();
    case "model":
      return row.model.toLowerCase();
    case "dataAccess":
      return DATA_ACCESS_RANK[row.dataAccess];
    case "autonomy":
      return AUTONOMY_RANK[row.autonomy];
    case "score":
      return row.score;
    case "hours":
      return row.estHoursSavedPerMonth;
  }
}

export function RegistryTable({ rows }: { rows: RegistryRow[] }) {
  const router = useRouter();
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sortedRows = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = sortValue(a, sortKey);
      const bv = sortValue(b, sortKey);
      let cmp: number;
      if (typeof av === "number" && typeof bv === "number") {
        cmp = av - bv;
      } else {
        cmp = String(av).localeCompare(String(bv));
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [rows, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      // Numeric columns feel natural starting high → low; text starts A → Z.
      setSortDir(key === "score" || key === "hours" ? "desc" : "asc");
    }
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-hairline bg-surface">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-hairline">
            {COLUMNS.map((col) => {
              const active = col.key === sortKey;
              const SortIcon = !active
                ? ChevronsUpDown
                : sortDir === "asc"
                  ? ChevronUp
                  : ChevronDown;
              return (
                <th
                  key={col.key}
                  scope="col"
                  className={`px-4 py-3 font-medium ${
                    col.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleSort(col.key)}
                    className={`group inline-flex items-center gap-1.5 text-xs uppercase tracking-wider transition-colors ${
                      col.align === "right" ? "flex-row-reverse" : ""
                    } ${active ? "text-ink" : "text-ink-faint hover:text-ink-muted"}`}
                    aria-label={`Sort by ${col.label}`}
                  >
                    {col.label}
                    <SortIcon
                      className={`h-3.5 w-3.5 ${active ? "text-gold" : "opacity-60"}`}
                    />
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row) => (
            <tr
              key={row.id}
              onClick={() => router.push(`/registry/${row.id}`)}
              className="cursor-pointer border-b border-hairline/60 transition-colors last:border-0 hover:bg-surface-2"
            >
              <td className="px-4 py-3">
                <Link
                  href={`/registry/${row.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="font-medium text-ink hover:text-gold"
                >
                  {row.name}
                </Link>
                <div className="text-xs text-ink-faint">{row.id}</div>
              </td>
              <td className="px-4 py-3">
                <div className="text-ink-muted">{row.ownerName}</div>
                <div className="text-xs text-ink-faint">{row.ownerTeam}</div>
              </td>
              <td className="px-4 py-3 text-ink-muted">{row.model}</td>
              <td className={`px-4 py-3 ${DATA_ACCESS_STYLE[row.dataAccess]}`}>
                {row.dataAccess}
              </td>
              <td className={`px-4 py-3 ${AUTONOMY_STYLE[row.autonomy]}`}>
                {row.autonomy}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <StatusBadge status={row.status} />
                  <span className="text-xs tabular-nums text-ink-faint">
                    {row.score}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-right tabular-nums text-ink-muted">
                {row.estHoursSavedPerMonth}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
