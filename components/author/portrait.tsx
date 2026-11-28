import Image from "next/image";
import { LogoMark } from "@/components/site/marks";
import { authorPhoto } from "@/lib/author-photo";
import { AUTHOR } from "@/lib/data";
import { cn } from "@/lib/utils";

/**
 * Author portrait in a yellow duotone, as in the resume layout. Drop the portrait at
 * public/images/author.jpg (or .png / .webp) and it replaces the monogram automatically.
 */
export function AuthorPortrait({ className, sizes = "(min-width:1024px) 30vw, 100vw", priority }: { className?: string; sizes?: string; priority?: boolean }) {
  const src = authorPhoto();
  const initials = AUTHOR.name
    .split(" ")
    .map((w) => w[0])
    .join("");
  return (
    <div className={cn("relative overflow-hidden bg-navy-900", className)}>
      {src ? (
        <>
          <Image src={src} alt={`Portrait of ${AUTHOR.name}`} fill sizes={sizes} priority={priority} className="object-cover object-top contrast-[1.08] grayscale" />
          {/* yellow duotone, the colour of the resume reference */}
          <div aria-hidden className="absolute inset-0 bg-[#F6CE48] mix-blend-multiply" />
        </>
      ) : (
        <div role="img" aria-label={`${AUTHOR.name} monogram`} className="absolute inset-0 grid place-items-center">
          <div aria-hidden className="sun-rays absolute left-1/2 top-1/2 size-[160%] -translate-x-1/2 -translate-y-1/2 opacity-90" />
          <div className="relative flex flex-col items-center">
            <LogoMark className="size-24 sm:size-28" />
            <span className="mt-4 font-semibold tracking-display text-white [font-size:clamp(3rem,6vw,4.5rem)]">{initials}</span>
          </div>
        </div>
      )}
    </div>
  );
}
