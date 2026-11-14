import type { ActivityKind } from "@/lib/itinerary";

const PATHS: Record<ActivityKind, React.ReactNode> = {
  trek: <path d="M3 19l5-8 4 5 3-4 6 7z" />,
  flight: <path d="M10.5 3h3l1 6 6 3v2l-7-1.8-1 4.3 3 2v1.5L12 19l-3.5.5V19l3-2-1-4.3-7 1.8v-2l6-3z" />,
  rail: <path d="M8 3h8v11H8zM8 14l-2 7M16 14l2 7M10 18h4" />,
  water: <path d="M3 17c2 0 2 2 4 2s2-2 4-2 2 2 4 2M12 4v9M8.5 9.5L12 13l3.5-3.5" />,
  wildlife: (
    <>
      <circle cx="7" cy="8" r="1.6" />
      <circle cx="12" cy="6.5" r="1.6" />
      <circle cx="17" cy="8" r="1.6" />
      <path d="M12 11c3 0 5 2 5 4s-2 3-5 3-5-1-5-3 2-4 5-4z" />
    </>
  ),
  heritage: <path d="M4 21h16M6 21V11l6-5 6 5v10M10 21v-6h4v6" />,
  transfer: <path d="M4 17h16M4 17v-4l2-5h12l2 5v4M4 13h16M7 17v2M17 17v2" />,
  leisure: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  sightseeing: <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" />,
};

export default function ActivityIcon({ kind, className = "" }: { kind: ActivityKind; className?: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[kind]}
    </svg>
  );
}
