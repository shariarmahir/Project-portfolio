"use client";
import * as React from "react";
import Image from "next/image";
import { ArrowUpRight, Check, Download, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { Dialog, DialogDescription, DialogTitle, DialogTrigger, ModalContent } from "@/components/ui/dialog";
import { SITE } from "@/lib/data";
import { cn } from "@/lib/utils";

/**
 * Static access password for the document downloads and the research drive. This is a courtesy
 * gate in the browser: the files themselves are still public static assets and the drive link is
 * in the page source, so do not rely on it for confidential material.
 */
const ACCESS_PASSWORD = "password";

export type GateDoc = {
  id: string;
  title: string;
  href: string | null;
  ext: string | null;
  size: string | null;
  length: string;
  cover: string;
};

function startDownload(href: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = href.split("/").pop() ?? "";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/** Google Drive glyph (three-colour triangle), used only to label the link to the shared drive. */
export function DriveGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 87.3 78" aria-hidden className={cn("shrink-0", className)}>
      <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da" />
      <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47" />
      <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335" />
      <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d" />
      <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc" />
      <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00" />
    </svg>
  );
}

/** Shared password form used by every gated action. */
function PasswordForm({ id, intro, action, icon, onUnlock }: { id: string; intro: string; action: string; icon: React.ReactNode; onUnlock: () => void }) {
  const [value, setValue] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [error, setError] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => inputRef.current?.focus(), []);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value === ACCESS_PASSWORD) {
      setError(false);
      onUnlock();
    } else {
      setError(true);
      inputRef.current?.select();
    }
  };
  return (
    <form onSubmit={submit} className="px-6 py-7 sm:px-8" noValidate>
      <DialogDescription className="text-[15px] text-body">{intro}</DialogDescription>
      <label htmlFor={`pw-${id}`} className="mt-6 block text-[14px] font-semibold text-ink">
        Access password
      </label>
      <div
        className={cn(
          "mt-2 flex h-14 items-center gap-3 rounded-2xl border bg-black/25 pl-4 pr-1.5 transition-colors focus-within:ring-4",
          error ? "border-red-400 focus-within:ring-red-400/15" : "border-white/15 focus-within:border-helios-300 focus-within:ring-helios/15"
        )}
      >
        <LockKeyhole className="size-5 shrink-0 text-muted" aria-hidden />
        <input
          ref={inputRef}
          id={`pw-${id}`}
          name="access-password"
          type={show ? "text" : "password"}
          autoComplete="off"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(false);
          }}
          aria-invalid={error}
          aria-describedby={error ? `pw-err-${id}` : undefined}
          className="h-full min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-muted"
          placeholder="Enter password"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="grid size-11 place-items-center rounded-xl text-body transition-colors hover:bg-white/10"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
        </button>
      </div>
      <p id={`pw-err-${id}`} role="alert" className="mt-2 min-h-[1.4rem] text-[14px] font-medium text-red-300">
        {error ? "That password is not correct. Check it and try again." : ""}
      </p>
      <button
        type="submit"
        disabled={!value}
        className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-full bg-helios text-[15px] font-semibold text-navy-900 transition-colors hover:bg-helios-300 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {icon} {action}
      </button>
    </form>
  );
}

function Done({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="px-6 py-8 sm:px-8">
      <p className="flex items-center gap-3 text-lg font-semibold tracking-snug text-ink">
        <span className="grid size-9 place-items-center rounded-full bg-leaf text-navy-900">
          <Check className="size-5" />
        </span>
        {title}
      </p>
      <DialogDescription className="mt-3 text-[15px] text-body">{children}</DialogDescription>
      <button type="button" onClick={onClose} className="glass mt-7 inline-flex h-12 w-full items-center justify-center rounded-full text-[15px] font-semibold text-ink hover:bg-white/10">
        Done
      </button>
    </div>
  );
}

/** A download control that asks for the access password in a dialog before the file is sent. */
export function DownloadButton({
  doc,
  className,
  children,
  "aria-label": ariaLabel,
}: {
  doc: GateDoc;
  className?: string;
  children: React.ReactNode;
  "aria-label"?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [done, setDone] = React.useState(false);

  if (!doc.href) {
    return (
      <span aria-disabled="true" className={cn(className, "cursor-not-allowed opacity-60")}>
        Coming soon
      </span>
    );
  }
  const href = doc.href;

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setDone(false);
      }}
    >
      <DialogTrigger asChild>
        <button type="button" className={className} aria-label={ariaLabel}>
          {children}
        </button>
      </DialogTrigger>
      <ModalContent closeLabel="Close download dialog" onOpenAutoFocus={(e) => e.preventDefault()}>
        <div className="flex items-center gap-5 border-b border-white/10 bg-white/[0.04] px-6 pb-6 pt-7 sm:px-8">
          <div className="relative h-[92px] w-[68px] shrink-0 overflow-hidden rounded-md bg-white shadow-float ring-1 ring-white/20">
            <Image src={doc.cover} alt="" width={68} height={92} className="size-full object-cover object-top" />
          </div>
          <div className="min-w-0 pr-8">
            <DialogTitle className="text-[1.2rem] leading-snug tracking-snug">{doc.title}</DialogTitle>
            <p className="num mt-1.5 text-[14px] font-medium text-muted">
              {doc.ext} · {doc.length} · {doc.size}
            </p>
          </div>
        </div>
        {done ? (
          <Done title="Your download has started" onClose={() => setOpen(false)}>
            If it does not begin, your browser may have blocked it.{" "}
            <button type="button" onClick={() => startDownload(href)} className="font-semibold text-helios-300 underline-offset-4 hover:underline">
              Download again
            </button>
            .
          </Done>
        ) : (
          <PasswordForm
            id={doc.id}
            intro="The documents are shared with examiners and reviewers. Enter the access password to download this file."
            action="Unlock and download"
            icon={<Download className="size-[18px]" />}
            onUnlock={() => {
              setDone(true);
              startDownload(href);
            }}
          />
        )}
      </ModalContent>
    </Dialog>
  );
}

/** Opens the shared Google Drive folder after the same access password. */
export function DriveButton({ className, children, "aria-label": ariaLabel }: { className?: string; children: React.ReactNode; "aria-label"?: string }) {
  const [open, setOpen] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const openDrive = () => window.open(SITE.drive, "_blank", "noopener,noreferrer");
  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setDone(false);
      }}
    >
      <DialogTrigger asChild>
        <button type="button" className={className} aria-label={ariaLabel}>
          {children}
        </button>
      </DialogTrigger>
      <ModalContent closeLabel="Close drive dialog" onOpenAutoFocus={(e) => e.preventDefault()}>
        <div className="flex items-center gap-5 border-b border-white/10 bg-white/[0.04] px-6 pb-6 pt-7 sm:px-8">
          <span className="grid size-[68px] shrink-0 place-items-center rounded-2xl bg-white shadow-float">
            <DriveGlyph className="w-9" />
          </span>
          <div className="min-w-0 pr-8">
            <DialogTitle className="text-[1.2rem] leading-snug tracking-snug">Research drive</DialogTitle>
            <p className="mt-1.5 text-[14px] font-medium text-muted">All documents, source files and data in one Google Drive folder</p>
          </div>
        </div>
        {done ? (
          <Done title="The drive is open in a new tab" onClose={() => setOpen(false)}>
            If no tab opened, your browser blocked the pop-up.{" "}
            <a href={SITE.drive} target="_blank" rel="noopener noreferrer" className="font-semibold text-helios-300 underline-offset-4 hover:underline">
              Open the drive
            </a>
            .
          </Done>
        ) : (
          <PasswordForm
            id="drive"
            intro="The shared drive holds every document of this work. Enter the same access password as the downloads to open it."
            action="Unlock and open drive"
            icon={<ArrowUpRight className="size-[18px]" />}
            onUnlock={() => {
              setDone(true);
              openDrive();
            }}
          />
        )}
      </ModalContent>
    </Dialog>
  );
}
