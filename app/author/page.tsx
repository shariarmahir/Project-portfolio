import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CopyCitation } from "@/components/author/copy-citation";
import { FramedPhoto } from "@/components/site/media";
import { Bolt } from "@/components/site/marks";
import { Button } from "@/components/ui/button";
import { AUTHOR, THESIS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Author",
  description: "Asif Rabbi, MSc researcher in Electrical & Electronic Engineering at the University of Asia Pacific.",
};

export default function AuthorPage() {
  return (
    <>
      <header className="container grid gap-14 pt-16 sm:pt-24 lg:grid-cols-[1.2fr_1fr] lg:items-end">
        <div>
          <p className="kicker">Author</p>
          <h1 className="h1 mt-4">{AUTHOR.name}</h1>
          <p className="mt-5 text-xl font-semibold tracking-snug text-ink">{AUTHOR.role}</p>
          <p className="measure mt-8 text-lg">{AUTHOR.bio}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild variant="navy">
              <Link href="/downloads">
                Read the thesis <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/research">See the results</Link>
            </Button>
          </div>
        </div>
        <FramedPhoto k="dhakaAerial" className="aspect-[4/5] w-full lg:aspect-[4/4.4]" priority />
      </header>

      <section aria-labelledby="record" className="container grid gap-14 py-28 lg:grid-cols-2 lg:gap-20">
        <div>
          <h2 id="record" className="h2">
            Academic record
          </h2>
          <dl className="mt-10">
            {[
              ["Programme", THESIS.degree],
              ["Department", THESIS.dept],
              ["University", THESIS.university],
              ["Student ID", THESIS.studentId],
              ["Supervisor", THESIS.supervisor],
              ["Thesis defense", THESIS.defense],
              ["Thesis submitted", THESIS.submitted],
            ].map(([k, v]) => (
              <div key={k} className="spec-row">
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 flex items-center gap-4 rounded-panel bg-white p-6 ring-1 ring-line">
            <Image src="/images/uap-logo.png" alt="University of Asia Pacific logo" width={56} height={50} />
            <p className="text-[15px]">
              Department of Electrical &amp; Electronic Engineering, University of Asia Pacific, Dhaka.
            </p>
          </div>
        </div>
        <div>
          <h2 className="h2">Thesis</h2>
          <p className="statement mt-10">{THESIS.title}</p>
          <h3 className="mt-12 text-xl tracking-display">Tools and methods</h3>
          <ul className="mt-5 space-y-4">
            {AUTHOR.tools.map((t) => (
              <li key={t} className="flex items-center gap-4 text-lg font-semibold tracking-snug text-ink">
                <Bolt className="h-5 w-3.5" /> {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="cite" className="container">
        <h2 id="cite" className="h2 max-w-[14ch]">
          Cite this work
        </h2>
        <div className="mt-10 max-w-4xl">
          <CopyCitation text={AUTHOR.bibtex} />
        </div>
      </section>
    </>
  );
}
