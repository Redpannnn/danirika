"use client";

import { useState } from "react";
import { Gift, ChevronDown, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/**
 * Section 7 — Wedding Gift (kecil).
 *
 * Latar: gradasi biru tua polos. Di tengah ada kata-kata singkat,
 * lalu tombol "Hadiah". Saat tombol ditekan, detail hadiah muncul
 * (collapse/expand): E-Wallet Seabank & Rekening Mandiri, masing-
 * masing dengan tombol salin nomor.
 */

type GiftItem = {
  /** Jenis (E-Wallet / Rekening) */
  type: string;
  /** Platform/bank */
  bank: string;
  /** Nama pemilik */
  name: string;
  /** Nomor */
  number: string;
};

const GIFTS: GiftItem[] = [
  {
    type: "E-Wallet",
    bank: "SeaBank",
    name: "Muhamad Ismail Mardani",
    number: "901542696786",
  },
  {
    type: "Nomor Rekening",
    bank: "Mandiri",
    name: "Rika Mariska MY",
    number: "1330029459138",
  },
];

function GiftCard({ gift }: { gift: GiftItem }) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(gift.number);
      setCopied(true);
      toast({ title: "Tersalin", description: "Nomor rekening disalin." });
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast({
        title: "Gagal menyalin",
        description: "Silakan salin manual.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="rounded-2xl border border-white/50 bg-white/90 px-5 py-4 text-left shadow-[0_10px_30px_-10px_rgba(0,0,0,0.55)] backdrop-blur-md">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#3a4a78]">
        {gift.type} &middot; {gift.bank}
      </p>
      <p className="mt-1.5 font-script text-2xl leading-tight text-[#132B66] sm:text-3xl">
        {gift.name}
      </p>
      <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-[#132B66]/15 bg-white px-3.5 py-2.5">
        <p className="select-all font-mono text-sm font-semibold tracking-wide text-[#132B66]">
          {gift.number}
        </p>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={`Salin nomor ${gift.bank} ${gift.name}`}
          className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[#132B66] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#1E3B8C]"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" /> Salin
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" /> Salin
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export function GiftSection() {
  const [open, setOpen] = useState(false);

  return (
    <section
      id="gift"
      aria-label="Wedding gift"
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-5 py-20 text-white sm:px-6"
    >
      {/* === Latar (gradasi biru tua polos) === */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,#2B51B0_0%,#1E3B8C_36%,#132B66_68%,#0A183F_100%)]"
      />
      {/* Cahaya lembut di tengah */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[46%] left-1/2 z-[2] h-[52vh] w-[88vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(78,124,236,0.26),rgba(78,124,236,0)_75%)]"
      />
      {/* Gradien brush di batas atas — menyatu dengan section 6 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-[34vh] bg-[linear-gradient(180deg,#0A183F_0%,rgba(10,24,63,0.85)_22%,rgba(10,24,63,0.4)_50%,rgba(10,24,63,0)_100%)]"
      />
      {/* Fade bawah */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-[22vh] bg-[linear-gradient(180deg,rgba(10,24,63,0)_0%,rgba(10,24,63,0.85)_100%)]"
      />

      {/* === Konten === */}
      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center text-center">
        {/* Ikon hadiah */}
        <span
          aria-hidden
          className="anim-fade-down flex h-14 w-14 items-center justify-center rounded-full border border-[#e8c576]/40 bg-white/5 text-[#e8c576]"
        >
          <Gift className="h-6 w-6" />
        </span>

        {/* Judul */}
        <h2 className="anim-fade-down mt-5 font-script text-4xl leading-tight text-white sm:text-5xl [animation-delay:100ms]">
          Wedding Gift
        </h2>
        <span
          aria-hidden
          className="anim-fade-in mt-4 block h-px w-20 bg-[linear-gradient(90deg,transparent,rgba(232,197,118,0.7),transparent)]"
        />

        {/* Kata-kata */}
        <p className="anim-fade-up mt-4 max-w-xs text-[12.5px] font-light leading-relaxed text-white/85 [animation-delay:150ms]">
          Doa restu Anda adalah hadiah terindah. Namun bila ingin memberikan
          tanda kasih, kami menyediakan opsi berikut.
        </p>

        {/* Tombol Hadiah */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="gift-details"
          className="anim-fade-up mt-6 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-7 py-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-sm transition-colors hover:bg-white/20 [animation-delay:200ms]"
        >
          Hadiah
          <ChevronDown
            className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </button>

        {/* Detail hadiah (collapse) */}
        {open ? (
          <div
            id="gift-details"
            className="anim-fade-up mt-6 flex w-full flex-col gap-3"
          >
            {GIFTS.map((g) => (
              <GiftCard key={g.number} gift={g} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
