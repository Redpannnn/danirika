"use client";

import Image from "next/image";

type CoverProps = {
  /** "cover" = sampul dengan undangan tamu, "opening" = isi setelah buka undangan */
  mode?: "cover" | "opening";
  /** Dipanggil saat tombol "Buka Undangan" ditekan (hanya mode cover) */
  onOpen?: () => void;
};

/**
 * Sampul undangan: judul di tengah atas, foto mempelai setengah keluar
 * frame di kiri & kanan, lalu gradasi biru di bawah.
 *
 * Mode "cover" menampilkan teks undangan tamu + tombol "Buka Undangan",
 * sedangkan mode "opening" menampilkan ayat QS. Ar-Rum: 21 sebagai
 * pembuka isi undangan (muncul setelah tombol ditekan).
 */
export function Cover({ mode = "cover", onOpen }: CoverProps) {
  const isOpening = mode === "opening";

  return (
    <section
      id={isOpening ? "opening" : "cover"}
      aria-label={
        isOpening
          ? "Pembuka undangan pernikahan Dani dan Rika"
          : "Sampul undangan pernikahan Dani dan Rika"
      }
      className="relative flex min-h-dvh flex-col overflow-hidden text-white"
    >
      {/* Latar gradasi biru */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,#2B51B0_0%,#1E3B8C_36%,#132B66_68%,#0A183F_100%)]"
      />
      {/* Cahaya lembut di tengah */}
      <div
        aria-hidden
        className="absolute top-[44%] left-1/2 h-[52vh] w-[88vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(78,124,236,0.28),rgba(78,124,236,0)_75%)]"
      />

      {/* Foto mempelai pria - setengah keluar frame kiri (di atas foto kanan) */}
      <div className="anim-fade-in absolute top-[21%] left-0 z-[11] -translate-x-[48%] [animation-delay:500ms]">
        <Image
          src="/images/dani.png"
          alt="Foto mempelai pria, Dani"
          width={942}
          height={1046}
          priority
          className="h-[83vh] w-auto max-w-none object-contain [filter:saturate(0.92)_brightness(0.88)] [mask-image:linear-gradient(to_bottom,black_0%,black_70%,transparent_97%)] md:h-[88.5vh]"
        />
      </div>

      {/* Foto mempelai wanita - setengah keluar frame kanan (di belakang foto kiri) */}
      <div className="anim-fade-in absolute top-[21%] right-0 z-10 translate-x-[48%] [animation-delay:650ms]">
        <Image
          src="/images/rika.png"
          alt="Foto mempelai wanita, Rika"
          width={960}
          height={1170}
          priority
          className="h-[83vh] w-auto max-w-none object-contain [filter:saturate(0.92)_brightness(0.88)] [mask-image:linear-gradient(to_bottom,black_0%,black_70%,transparent_97%)] md:h-[88.5vh]"
        />
      </div>

      {/* Gradasi biru di bawah foto, menyatu dengan bagian bawah */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[46vh] bg-[linear-gradient(180deg,rgba(10,24,63,0)_0%,rgba(13,30,80,0.5)_40%,rgba(10,24,63,0.94)_75%,#0A183F_100%)]"
      />

      {/* Judul */}
      <header className="relative z-30 px-6 pt-12 text-center sm:pt-14">
        <p className="anim-fade-down text-[11px] font-medium tracking-[0.42em] uppercase text-white/90 sm:text-sm [animation-delay:100ms]">
          The Wedding Of
        </p>
        <h1 className="anim-fade-down mt-4 font-script text-5xl leading-[1.15] text-white sm:text-6xl md:text-7xl [animation-delay:250ms]">
          Dani &amp; Rika
        </h1>
        <p className="anim-fade-down mt-4 text-[11px] font-light tracking-[0.32em] uppercase text-white/85 sm:text-sm [animation-delay:400ms]">
          Sabtu, 09 Januari 2027
        </p>
      </header>

      {isOpening ? (
        /* Ayat pembuka (QS. Ar-Rum: 21) */
        <div className="anim-fade-up relative z-30 mt-auto px-5 pb-[max(2.5rem,env(safe-area-inset-bottom))] text-center [animation-delay:850ms] sm:px-6">
          <p
            dir="rtl"
            lang="ar"
            className="font-arabic text-xs leading-[2.1] text-white sm:text-2xl sm:leading-[1.95]"
          >
            وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ
          </p>
          <p className="mx-auto mt-4 max-w-xl text-[11px] font-light leading-relaxed text-white/85 sm:text-sm">
            &ldquo;Di antara tanda-tanda (kebesaran)-Nya ialah bahwa Dia
            menciptakan pasangan-pasangan untukmu dari jenismu sendiri agar
            kamu merasa tenteram kepadanya. Dia menjadikan di antaramu rasa
            cinta dan kasih sayang. Sesungguhnya pada yang demikian itu
            benar-benar terdapat tanda-tanda bagi kaum yang berpikir.&rdquo;
          </p>
          <p className="anim-fade-up mt-4 text-[11px] font-medium tracking-[0.3em] uppercase text-white/90 [animation-delay:1100ms] sm:text-xs">
            (QS. Ar-Rum: 21)
          </p>
        </div>
      ) : (
        /* Undangan tamu + tombol */
        <div className="anim-fade-up relative z-30 mt-auto px-6 text-center [animation-delay:850ms]">
          <p className="text-sm font-light text-white/85">Kepada Yth;</p>
          <p className="mt-0.5 text-sm font-light text-white/85">
            Bapak/Ibu/Saudara/i
          </p>
          <p className="mt-1.5 text-lg font-semibold md:text-xl">
            Tamu Undangan
          </p>
          <p className="mt-0.5 text-sm font-light text-white/85">Di Tempat</p>
          <button
            type="button"
            onClick={onOpen}
            aria-label="Buka undangan pernikahan Dani dan Rika"
            className="mt-7 mb-[max(3rem,env(safe-area-inset-bottom))] inline-block cursor-pointer rounded-full border border-white/40 bg-white/10 px-10 py-3.5 text-xs font-medium tracking-[0.3em] uppercase backdrop-blur-sm transition-all duration-300 hover:border-white/70 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-4 focus-visible:outline-white/70"
          >
            Buka Undangan
          </button>
        </div>
      )}
    </section>
  );
}
