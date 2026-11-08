"use client";

/**
 * Section 5 — Our Story (Kisah Perjalanan Kami).
 *
 * Latar: gradasi biru tua polos (tanpa foto dekoratif).
 *
 * Konten: tiga cover card putih, masing-masing satu cerita:
 *   1. Perkenalan — 20 April 2026
 *   2. Lamaran
 *   3. Acara resepsi — 9 Januari, Padang
 *
 * Setiap card punya label kecil, judul script, dan paragraf cerita.
 * Pada batas atas section ada gradien brush dari navy gelap supaya
 * menyatu mulus dengan section 4 di atasnya.
 */

type Story = {
  /** nomor urut untuk label */
  index: string;
  /** judul cerita */
  title: string;
  /** tanggal/lokasi opsional di bawah judul */
  meta?: string;
  /** isi cerita */
  body: string;
  /** delay animasi */
  delay: string;
};

const STORIES: Story[] = [
  {
    index: "01",
    title: "Perkenalan",
    meta: "20 April 2026",
    body:
      "Tidak ada yang terjadi secara kebetulan di dunia ini, semua sudah diatur dengan sangat indah oleh Allah SWT. Kami tidak pernah menyangka, perkenalan singkat itu menumbuhkan rasa saling suka. Dari obrolan sederhana, perhatian kecil yang akhirnya kami merasakan saling nyaman, rasa sayang dan rasa ingin saling memiliki.",
    delay: "[animation-delay:100ms]",
  },
  {
    index: "02",
    title: "Lamaran",
    body:
      "Tidak ada acara khusus untuk yang namanya sebuah lamaran. Komitmen itu dimulai dengan pertemuan dengan keluarga besar, dan saling mengungkapkan keinginan untuk melangkah bersama di kehidupan yang akan datang.",
    delay: "[animation-delay:200ms]",
  },
  {
    index: "03",
    title: "Acara Resepsi",
    meta: "Padang, 9 Januari",
    body:
      "Perjalanan yang tentunya tidak selamanya mudah dan indah, penuh perjuangan untuk saling percaya, untuk saling jaga, dan berjanji untuk selalu bersama dalam berbagai kondisi. Akhirnya sampailah kami di gerbang besar kehidupan Rumah Tangga. Padang tanggal 9 Januari kami pilih untuk mengikat janji suci itu. Kami mengundang bapak/ibu untuk turut serta memberikan Do'a Restu untuk perjalanan kami.",
    delay: "[animation-delay:300ms]",
  },
];

export function StorySection() {
  return (
    <section
      id="story"
      aria-label="Kisah perjalanan kami"
      className="relative flex min-h-dvh flex-col items-center overflow-hidden px-5 py-20 text-white sm:px-6 sm:py-24"
    >
      {/* === Latar (gradasi biru tua polos) === */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,#2B51B0_0%,#1E3B8C_36%,#132B66_68%,#0A183F_100%)]"
      />
      {/* Cahaya lembut di tengah */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[44%] left-1/2 z-[2] h-[52vh] w-[88vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(78,124,236,0.24),rgba(78,124,236,0)_75%)]"
      />
      {/* Gradien brush di batas atas — menyatu dengan dasar gelap section 4 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-[36vh] bg-[linear-gradient(180deg,#0A183F_0%,rgba(10,24,63,0.9)_20%,rgba(10,24,63,0.5)_45%,rgba(10,24,63,0.15)_72%,rgba(10,24,63,0)_100%)]"
      />
      {/* Fade bawah */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[3] h-[22vh] bg-[linear-gradient(180deg,rgba(10,24,63,0)_0%,rgba(10,24,63,0.85)_100%)]"
      />

      {/* === Konten === */}
      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center">
        {/* Judul section */}
        <p className="anim-fade-down text-[11px] font-medium tracking-[0.42em] uppercase text-white/90 sm:text-sm">
          Our Story
        </p>
        <h2 className="anim-fade-down mt-3 font-script text-5xl leading-[1.1] text-white sm:text-6xl [animation-delay:100ms]">
          Kisah Kami
        </h2>
        {/* Garis dekoratif kecil */}
        <span
          aria-hidden
          className="anim-fade-in mt-5 block h-px w-24 bg-[linear-gradient(90deg,transparent,rgba(232,197,118,0.7),transparent)]"
        />

        {/* Daftar cerita */}
        <div className="mt-9 flex w-full flex-col gap-6">
          {STORIES.map((story) => (
            <article
              key={story.index}
              className={`anim-fade-up relative w-full rounded-[1.5rem] border border-white/50 bg-white/90 px-6 py-7 text-left shadow-[0_18px_50px_-12px_rgba(8,18,48,0.55)] backdrop-blur-md sm:px-8 sm:py-8 ${story.delay}`}
            >
              {/* Nomor urut + judul */}
              <div className="flex items-baseline gap-3">
                <span className="font-script text-2xl text-[#132B66]/35 sm:text-3xl">
                  {story.index}
                </span>
                <h3 className="font-script text-3xl leading-tight text-[#132B66] sm:text-4xl">
                  {story.title}
                </h3>
              </div>

              {/* Meta (tanggal/lokasi) */}
              {story.meta ? (
                <p className="mt-1.5 pl-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#3a4a78]">
                  {story.meta}
                </p>
              ) : null}

              {/* Garis pemisah kecil */}
              <span
                aria-hidden
                className="mt-3 block h-px w-12 bg-[linear-gradient(90deg,rgba(19,43,102,0.6),transparent)]"
              />

              {/* Isi cerita */}
              <p className="mt-4 text-[12.5px] font-light leading-[1.85] text-[#1c2a52] sm:text-sm sm:leading-[1.85]">
                {story.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
