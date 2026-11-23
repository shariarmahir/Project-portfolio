import { FramedPhoto } from "@/components/site/media";
import type { PhotoKey } from "@/lib/media";

/** Inner-page opener: title and lead, an optional action, then an optional wide photo. */
export function PageIntro({
  title,
  lead,
  photo,
  children,
}: {
  title: React.ReactNode;
  lead: React.ReactNode;
  photo?: PhotoKey;
  children?: React.ReactNode;
}) {
  return (
    <header className="pt-10 sm:pt-14">
      <div className="container">
        <h1 className="h1">{title}</h1>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-12">
          <p className="lead sm:text-xl">{lead}</p>
          {children}
        </div>
      </div>
      {photo && (
        <div className="px-3 pt-10 sm:px-5 sm:pt-12">
          <FramedPhoto k={photo} className="aspect-[16/9] w-full sm:aspect-[21/7]" sizes="100vw" priority />
        </div>
      )}
    </header>
  );
}

export { SectionNav } from "@/components/site/section-nav";

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
