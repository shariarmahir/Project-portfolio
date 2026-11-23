import Image from "next/image";
import { Bolt } from "@/components/site/marks";
import { authorPhoto } from "@/lib/author-photo";
import { AUTHOR } from "@/lib/data";
import { cn } from "@/lib/utils";

/** Author portrait: the real photo when one is supplied, otherwise a designed monogram. */
export function AuthorPortrait({ className, sizes = "(min-width:1024px) 40vw, 100vw", priority }: { className?: string; sizes?: string; priority?: boolean }) {
  const src = authorPhoto();
  const initials = AUTHOR.name
    .split(" ")
    .map((w) => w[0])
    .join("");
  return (
    <div className={cn("relative overflow-hidden bg-cobalt", className)}>
      {src ? (
        <Image src={src} alt={`Portrait of ${AUTHOR.name}`} fill sizes={sizes} priority={priority} className="object-cover object-top" />
      ) : (
        <div role="img" aria-label={`${AUTHOR.name} monogram`} className="absolute inset-0 grid place-items-center">
          <svg aria-hidden viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
            <circle cx="330" cy="70" r="150" fill="#2B5CE6" />
            <circle cx="40" cy="470" r="190" fill="#1A40B0" />
            <path d="M232 60 118 232h70l-22 208 140-200h-72z" fill="#F59E0B" opacity="0.95" />
          </svg>
          <span className="relative font-semibold tracking-display text-white [font-size:clamp(4rem,9vw,7.5rem)] [text-shadow:0_8px_30px_rgba(6,24,43,0.35)]">
            {initials}
          </span>
          <Bolt className="absolute bottom-6 right-6 h-8 w-5 fill-white/90" />
        </div>
      )}
    </div>
  );
}
