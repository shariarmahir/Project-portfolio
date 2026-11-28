import { SceneCanvas } from "@/components/three/scene-canvas";
import type { Preset } from "@/components/three/solar-scene";
import { RENDERS, type RenderKey } from "@/lib/media";

/** Inner-page opener: title and lead under the fixed header, an optional action, then an optional live 3D band. */
export function PageIntro({
  title,
  lead,
  scene,
  children,
}: {
  title: React.ReactNode;
  lead: React.ReactNode;
  scene?: Preset & RenderKey;
  children?: React.ReactNode;
}) {
  return (
    <header className="relative isolate overflow-hidden pt-32 sm:pt-36">
      <div aria-hidden className="sun-rays absolute -right-[18vmax] -top-[34vmax] -z-10 size-[80vmax] opacity-50" />
      <div className="container">
        <h1 className="h1">{title}</h1>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-12">
          <p className="lead sm:text-xl">{lead}</p>
          {children}
        </div>
      </div>
      {scene && (
        <div className="container pt-10 sm:pt-12">
          <SceneCanvas
            preset={scene}
            sunDisc={false}
            fovScale={scene === "plant" ? 0.78 : 1}
            still={RENDERS[scene].src}
            className="glass aspect-[16/10] w-full rounded-slab sm:aspect-[21/8]"
          />
        </div>
      )}
    </header>
  );
}

export { SectionNav } from "@/components/site/section-nav";

/** Key-value rows. With `fill`, the rows spread over the height of their card. */
export function SpecList({ rows, fill }: { rows: readonly { k: string; v: string }[]; fill?: boolean }) {
  return (
    <dl className={fill ? "flex h-full flex-col justify-between" : undefined}>
      {rows.map((r) => (
        <div key={r.k} className="spec-row">
          <dt>{r.k}</dt>
          <dd>{r.v}</dd>
        </div>
      ))}
    </dl>
  );
}
