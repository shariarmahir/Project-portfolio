import { FramedPhoto } from "@/components/site/media";
import type { PhotoKey } from "@/lib/media";

/** Inner-page opener: kicker, title and lead, then a wide framed photo. */
export function PageIntro({
  kicker,
  title,
  lead,
  photo,
  children,
}: {
  kicker: string;
  title: React.ReactNode;
  lead: React.ReactNode;
  photo?: PhotoKey;
  children?: React.ReactNode;
}) {
  return (
    <header className="pt-16 sm:pt-24">
      <div className="container">
        <p className="kicker">{kicker}</p>
        <h1 className="h1 mt-4 max-w-[18ch]">{title}</h1>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <p className="measure text-lg sm:text-xl">{lead}</p>
          {children}
        </div>
      </div>
      {photo && (
        <div className="px-3 pt-14 sm:px-6">
          <FramedPhoto k={photo} className="aspect-[16/9] w-full sm:aspect-[21/8]" sizes="100vw" priority />
        </div>
      )}
    </header>
  );
}

export function SpecList({ rows }: { rows: readonly { k: string; v: string }[] }) {
  return (
    <dl>
      {rows.map((r) => (
        <div key={r.k} className="spec-row">
          <dt>{r.k}</dt>
          <dd>{r.v}</dd>
        </div>
      ))}
    </dl>
  );
}
