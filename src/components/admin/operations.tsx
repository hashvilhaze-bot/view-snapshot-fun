import type { ReactNode } from "react";
import { friendlyError } from "@/lib/cms";
export function FetchState({
  query,
}: {
  query: { isPending: boolean; isError: boolean; error: unknown; refetch: () => unknown };
}) {
  if (query.isPending) return <p role="status">טוענים נתונים…</p>;
  if (query.isError)
    return (
      <div role="alert">
        <p>{friendlyError(query.error)}</p>
        <button onClick={() => query.refetch()}>טעינה מחדש</button>
      </div>
    );
  return null;
}
export function Module({
  title,
  tools,
  children,
}: {
  title: string;
  tools?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="cms-module ops">
      <div className="ops-head">
        <h2 className="p-h2">{title}</h2>
        {tools}
      </div>
      {children}
    </section>
  );
}
export function Period({ value, change }: { value: number; change: (n: number) => void }) {
  return (
    <label>
      תקופת הדוח
      <select value={value} onChange={(e) => change(Number(e.target.value))}>
        {[7, 30, 90, 365].map((n) => (
          <option key={n} value={n}>
            {n} הימים האחרונים
          </option>
        ))}
      </select>
    </label>
  );
}
export function Pager({
  page,
  more,
  change,
}: {
  page: number;
  more: boolean;
  change: (n: number) => void;
}) {
  if (!page && !more) return null;
  return (
    <nav className="ops-pager" aria-label="דפדוף">
      <button disabled={!page} onClick={() => change(page - 1)}>
        הקודם
      </button>
      <span>עמוד {page + 1}</span>
      <button disabled={!more} onClick={() => change(page + 1)}>
        הבא
      </button>
    </nav>
  );
}
