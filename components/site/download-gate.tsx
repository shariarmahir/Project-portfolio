"use client";
import * as React from "react";
import Image from "next/image";
import { Check, Download, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { Dialog, DialogDescription, DialogTitle, DialogTrigger, ModalContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/**
 * Static access password for the document downloads. This is a courtesy gate in the browser:
 * the files themselves are still public static assets, so do not rely on it for confidential material.
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
  const [value, setValue] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [done, setDone] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const reset = () => {
    setValue("");
    setShow(false);
    setError(false);
    setDone(false);
  };

  if (!doc.href) {
    return (
      <span aria-disabled="true" className={cn(className, "cursor-not-allowed opacity-60")}>
        Coming soon
      </span>
    );
  }
  const href = doc.href;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value === ACCESS_PASSWORD) {
      setError(false);
      setDone(true);
      startDownload(href);
    } else {
      setError(true);
      inputRef.current?.select();
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) reset();
      }}
    >
      <DialogTrigger asChild>
        <button type="button" className={className} aria-label={ariaLabel}>
          {children}
        </button>
      </DialogTrigger>
      <ModalContent
        closeLabel="Close download dialog"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          inputRef.current?.focus();
        }}
      >
        <div className="flex items-center gap-5 bg-tint px-6 pb-6 pt-7 sm:px-8">
          <div className="relative h-[92px] w-[68px] shrink-0 overflow-hidden rounded-md bg-white shadow-[0_10px_24px_-12px_rgba(10,37,64,0.5)] ring-1 ring-black/5">
            <Image src={doc.cover} alt="" width={68} height={92} className="size-full object-cover object-top" />
          </div>
          <div className="min-w-0 pr-8">
            <DialogTitle className="text-[1.2rem] leading-snug tracking-snug">{doc.title}</DialogTitle>
            <p className="mt-1.5 text-[14px] font-medium text-muted">
              {doc.ext} · {doc.length} · {doc.size}
            </p>
          </div>
        </div>

        {done ? (
          <div className="px-6 py-8 sm:px-8">
            <p className="flex items-center gap-3 text-lg font-semibold tracking-snug text-ink">
              <span className="grid size-9 place-items-center rounded-full bg-cobalt text-white">
                <Check className="size-5" />
              </span>
              Your download has started
            </p>
            <DialogDescription className="mt-3 text-[15px] text-body">
              If it does not begin, your browser may have blocked it.{" "}
              <button type="button" onClick={() => startDownload(href)} className="font-semibold text-cobalt underline-offset-4 hover:underline">
                Download again
              </button>
              .
            </DialogDescription>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-7 inline-flex h-12 w-full items-center justify-center rounded-full bg-navy text-[15px] font-semibold text-white transition-colors hover:bg-cobalt"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="px-6 py-7 sm:px-8" noValidate>
            <DialogDescription className="text-[15px] text-body">
              The documents are shared with examiners and reviewers. Enter the access password to download this file.
            </DialogDescription>
            <label htmlFor={`pw-${doc.id}`} className="mt-6 block text-[14px] font-semibold text-ink">
              Access password
            </label>
            <div
              className={cn(
                "mt-2 flex h-14 items-center gap-3 rounded-2xl border bg-white pl-4 pr-1.5 transition-colors focus-within:ring-4",
                error ? "border-red-600 focus-within:ring-red-600/10" : "border-line focus-within:border-cobalt focus-within:ring-cobalt/10"
              )}
            >
              <LockKeyhole className="size-5 shrink-0 text-muted" aria-hidden />
              <input
                ref={inputRef}
                id={`pw-${doc.id}`}
                name="access-password"
                type={show ? "text" : "password"}
                autoComplete="off"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  if (error) setError(false);
                }}
                aria-invalid={error}
                aria-describedby={error ? `pw-err-${doc.id}` : undefined}
                className="h-full min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-muted"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="grid size-11 place-items-center rounded-xl text-navy transition-colors hover:bg-tint"
                aria-label={show ? "Hide password" : "Show password"}
              >
                {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
            <p id={`pw-err-${doc.id}`} role="alert" className="mt-2 min-h-[1.4rem] text-[14px] font-medium text-red-700">
              {error ? "That password is not correct. Check it and try again." : ""}
            </p>
            <button
              type="submit"
              disabled={!value}
              className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-full bg-navy text-[15px] font-semibold text-white transition-colors hover:bg-cobalt disabled:cursor-not-allowed disabled:bg-navy/40"
            >
              <Download className="size-[18px]" /> Unlock and download
            </button>
          </form>
        )}
      </ModalContent>
    </Dialog>
  );
}
