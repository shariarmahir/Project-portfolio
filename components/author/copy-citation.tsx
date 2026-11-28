"use client";
import * as React from "react";
import { Check, Copy } from "lucide-react";

export function CopyCitation({ text }: { text: string }) {
  const [state, setState] = React.useState<"idle" | "copied" | "failed">("idle");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      setState("failed");
    }
    setTimeout(() => setState("idle"), 2200);
  };
  return (
    <div className="glass-strong overflow-hidden rounded-panel">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-4">
        <span className="text-[15px] font-semibold text-white">BibTeX</span>
        <button
          onClick={copy}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-helios px-4 text-[14px] font-semibold text-navy-900 transition-colors hover:bg-helios-300"
        >
          {state === "copied" ? <Check className="size-4" /> : <Copy className="size-4" />}
          {state === "copied" ? "Copied" : state === "failed" ? "Select and copy manually" : "Copy citation"}
        </button>
      </div>
      <pre className="overflow-x-auto p-6 font-code text-[13px] leading-relaxed text-white/85">
        <code>{text}</code>
      </pre>
      <p className="sr-only" aria-live="polite">
        {state === "copied" ? "Citation copied to clipboard" : ""}
      </p>
    </div>
  );
}
