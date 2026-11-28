import { Hero } from "@/components/landing/hero";
import { Cases, KeyNumbers, Problem } from "@/components/landing/story";
import { HubSection } from "@/components/landing/hub";
import { ChargeMap } from "@/components/landing/map";
import { DocsCta, Impact, Money, RealityLens } from "@/components/landing/results";
import { Faq } from "@/components/landing/faq";
import { FAQ } from "@/lib/data";

export default function Home() {
  return (
    <>
      <Hero />
      <KeyNumbers />
      <Problem />
      <Cases />
      <HubSection />
      <ChargeMap />
      <Money />
      <Impact />
      <RealityLens />
      <Faq items={FAQ} />
      <DocsCta />
    </>
  );
}
