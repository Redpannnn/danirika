"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";

/**
 * Section 4 — Jadwal Acara (Akad & Resepsi).
 *
 * Latar: sama dengan section 2 (gradasi biru + foto mempelai dekoratif
 * di kiri & kanan setengah keluar frame). Semua teks pembuka section 2
 * (The Wedding Of, nama, tanggal, ayat Ar-Rum) dihilangkan.
 *
 * Konten:
 *  - Cover card putih opacity 30% (samar) memenuhi hampir seluruh halaman.
 *  - Di atasnya, cover card putih solid berbentuk CAPSULE (pill) dengan
 *    garis tengah sebagai pembatas:
 *      • Bagian atas → Akad (Sabtu, 09 Januari 2027 · 10.00 - selesai)
 *      • Bagian bawah → Resepsi (Minggu, 10 Januari 2027)
 *  - Setiap bagian punya tombol Google Maps yang mengarah ke link yang
 *    sama (lokasi akad = resepsi).
 */

const MAPS_URL = "https://maps.app.goo.gl/QJa58BLKQVhLnRwJ8";

/** Tombol Google Maps — anchor ke peta lokasi */
function MapsButton() {
  return (
    <a
      href={MAPS_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#132B66] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_8px_20px_-6px_rgba(8,18,48,0.6)] transition-colors duration-300 hover:bg-[#1E3B8C] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#132B66]"
    >
      <MapPin className="h-3.5 w-3.5" aria-hidden />
      Lihat Lokasi
    </a>
  );
}

export function EventSection() {
  return (
    <section
      id="event"
      aria-label="Jadwal acara Akad dan Resepsi"
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-5 text-white sm:px-6"
    >
      {/* === Latar (sama dengan section 2) === */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,#2B51B0_0%,#1E3B8C_36%,#132B66_68%,#0A183F_100%)]"
      />
      {/* Foto mempelai pria dekoratif — kiri, setengah keluar frame */}
      <div
        aria-hidden
        className="absolute top-[18%] left-0 z-[1] -translate-x-[48%]"
      >
        <Image
          src="/images/dani.png"
          alt=""
          width={942}
          height={1046}
          className="h-[83vh] w-auto max-w-none object-contain [filter:saturate(0.92)_brightness(0.88)] md:h-[88.5vh]"
        />
    </div>
      {/* Foto mempelai wanita dekoratif — kanan, setengah keluar frame */}
      <div
        aria-hidden
        className="absolute top-[18%] right-0 z-[1] translate-x-[48%]"
      >
        <Image
          src="/images/rika.png"
          alt=""
          width={960}
          height={1170}
          className="h-[83vh] w-auto max-w-none object-contain [filter:saturate(0.92)_brightness(0.88)] md:h-[88.5vh]"
        />
    </div>
      {/* Cahaya lembut di tengah */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[44%] left-1/2 z-[2] h-[52vh] w-[88vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(78,124,236,0.28),rgba(78,124,236,0)_75%)]"
      />
      {/* Gradien brush di batas atas — menyatu dengan dasar gelap section 3 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-[40vh] bg-[linear-gradient(180deg,#0A183F_0%,rgba(10,24,63,0.9)_20%,rgba(10,24,63,0.55)_45%,rgba(10,24,63,0.2)_72%,rgba(10,24,63,0)_100%)]"
      />
      {/* Fade bawah */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-[20vh] bg-[linear-gradient(180deg,rgba(10,24,63,0)_0%,rgba(10,24,63,0.85)_100%)]"
      />

      {/* === Cover card putih opacity 20% (samar) — memenuhi full page, tanpa blur === */}
      <div
        aria-hidden
        className="absolute inset-0 z-[4] bg-white/20"
      />

      {/* === Konten === */}
      <div className="relative z-10 w-full max-w-md">
        {/* Cover card putih berbentuk capsule — lapisan depan, opacity 90% */}
        <div className="relative w-full max-w-[290px] mx-auto rounded-full bg-white/90 px-7 py-14 text-center shadow-[0_24px_60px_-15px_rgba(8,18,48,0.65)] sm:max-w-[300px] sm:py-16">
            {/* === Bagian atas: Akad === */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#3a4a78]">
                Acara
              </p>
              <h3 className="mt-1 font-script text-4xl leading-tight text-[#132B66] sm:text-[2.75rem]">
                Akad
              </h3>
              <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.18em] text-[#3a4a78]">
                Sabtu, 09 Januari 2027
              </p>
              <p className="mt-1.5 text-sm font-semibold text-[#1c2a52]">
                10.00 &ndash; selesai
              </p>
              <p className="mt-2 text-[11px] font-medium leading-relaxed text-[#3a4a78]">
                Jl. Rimbo Tarok Gunung Sarik.
                <br />
                Kuranji Padang
              </p>
              <MapsButton />
            </div>

            {/* === Garis tengah pembatas (dengan ornamen diamond) === */}
            <div
              aria-hidden
              className="relative my-8 flex items-center justify-center"
            >
              <div className="h-px w-3/4 bg-[linear-gradient(90deg,transparent,rgba(19,43,102,0.4),transparent)]" />
              <span className="absolute h-1.5 w-1.5 rotate-45 bg-[#132B66]/55" />
            </div>

            {/* === Bagian bawah: Resepsi === */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#3a4a78]">
                Acara
              </p>
              <h3 className="mt-1 font-script text-4xl leading-tight text-[#132B66] sm:text-[2.75rem]">
                Resepsi
              </h3>
              <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.18em] text-[#3a4a78]">
                Minggu, 10 Januari 2027
              </p>
              <p className="mt-1.5 text-sm font-semibold text-[#1c2a52]">
                10.00 &ndash; 18.00
              </p>
              <p className="mt-2 text-[11px] font-medium leading-relaxed text-[#3a4a78]">
                Jl. Rimbo Tarok Gunung Sarik.
                <br />
                Kuranji Padang
              </p>
              <MapsButton />
            </div>
          </div>
    </div>
    </section>
  );
}
