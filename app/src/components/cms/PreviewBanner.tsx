import { draftMode } from "next/headers";

export default async function PreviewBanner() {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return null;
  return (
    <aside role="status" className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
      <span>Draft preview — ordinary visitors cannot see unpublished content.</span>
      <form action="/api/admin/preview/exit" method="post"><button type="submit" className="rounded border border-amber-200/40 px-3 py-1.5">Exit preview</button></form>
    </aside>
  );
}
