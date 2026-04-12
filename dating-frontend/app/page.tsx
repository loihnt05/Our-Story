import Link from "next/link";

export default function Home() {
  const features = [
    {
      title: "Elegant storytelling",
      description: "A calm, romantic layout that feels curated instead of crowded.",
    },
    {
      title: "Live shared memories",
      description: "A dynamic timer that keeps your special milestone front and center.",
    },
    {
      title: "Soft premium styling",
      description: "Glassmorphism, gradients, and spacing tuned for a polished look.",
    },
  ];

  const stats = [
    { label: "Mood", value: "Romantic" },
    { label: "Style", value: "Premium" },
    { label: "Focus", value: "Memorable" },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8 text-slate-700 sm:px-6 sm:py-10 lg:px-8">
      {/*<div className="absolute inset-0 -z-10 opacity-80">*/}
      {/*  <div className="absolute left-10 top-16 h-72 w-72 rounded-full bg-rose-300/35 blur-3xl" />*/}
      {/*  <div className="absolute right-8 top-1/2 h-80 w-80 rounded-full bg-pink-300/30 blur-3xl" />*/}
      {/*  <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-red-200/35 blur-3xl" />*/}
      {/*</div>*/}
      
      {/*<div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center">*/}
      {/*  <section className="grid w-full gap-8 lg:grid-cols-[1.08fr_0.92fr] xl:gap-10">*/}
      {/*    <div className="space-y-8 rounded-4xl border border-white/70 bg-white/62 p-7 shadow-[0_24px_80px_rgba(190,24,93,0.12)] backdrop-blur-2xl sm:p-10 lg:p-12">*/}
      {/*      <div className="flex flex-wrap items-center gap-3">*/}
      {/*        <div className="inline-flex items-center gap-2 rounded-full border border-rose-200/70 bg-white/80 px-4 py-2 text-sm font-medium text-rose-700 shadow-sm">*/}
      {/*          <span>✨</span>*/}
      {/*          Our Story*/}
      {/*        </div>*/}
      {/*        <span className="rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm text-slate-500">*/}
      {/*          A polished digital keepsake*/}
      {/*        </span>*/}
      {/*      </div>*/}
      
      {/*      <div className="space-y-5">*/}
      {/*        <h1 className="max-w-2xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl xl:text-[4.25rem] xl:leading-[1.02]">*/}
      {/*          A romantic space that feels warm, modern, and beautifully designed.*/}
      {/*        </h1>*/}
      {/*        <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">*/}
      {/*          This little experience is designed like a keepsake: minimal, elegant,*/}
      {/*          and full of feeling. Open the love page to see the live countdown and*/}
      {/*          the polished presentation in action.*/}
      {/*        </p>*/}
      {/*      </div>*/}
      
      {/*      <div className="flex flex-wrap gap-3">*/}
      {/*        <Link*/}
      {/*          href="/love-page"*/}
      {/*          className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-rose-500 to-pink-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 transition hover:-translate-y-0.5 hover:from-rose-600 hover:to-pink-600"*/}
      {/*        >*/}
      {/*          Open the love page*/}
      {/*        </Link>*/}
      {/*        <button*/}
      {/*          type="button"*/}
      {/*          onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth", block: "start" })}*/}
      {/*          className="inline-flex items-center justify-center rounded-full border border-rose-200 bg-white/80 px-6 py-3 text-sm font-semibold text-rose-700 transition hover:-translate-y-0.5 hover:border-rose-300 hover:bg-white"*/}
      {/*        >*/}
      {/*          View features*/}
      {/*        </button>*/}
      {/*      </div>*/}
      
      {/*      <div className="grid gap-4 sm:grid-cols-3">*/}
      {/*        {stats.map((item) => (*/}
      {/*          <div*/}
      {/*            key={item.label}*/}
      {/*            className="rounded-2xl border border-white/70 bg-white/78 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"*/}
      {/*          >*/}
      {/*            <p className="text-sm text-slate-500">{item.label}</p>*/}
      {/*            <p className="mt-1 text-lg font-bold text-slate-900">{item.value}</p>*/}
      {/*          </div>*/}
      {/*        ))}*/}
      {/*      </div>*/}
      {/*    </div>*/}
      
      {/*    <section id="features" className="grid gap-4 content-start">*/}
      {/*      <div className="rounded-4xl border border-white/70 bg-slate-950/92 p-7 text-white shadow-[0_30px_90px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-8">*/}
      {/*        <p className="text-sm uppercase tracking-[0.35em] text-rose-200/80">*/}
      {/*          Designed to impress*/}
      {/*        </p>*/}
      {/*        <h2 className="mt-4 text-2xl font-bold sm:text-3xl">*/}
      {/*          Clean structure, soft contrast, and subtle luxury.*/}
      {/*        </h2>*/}
      {/*        <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300 sm:text-base">*/}
      {/*          The UI now feels like a proper experience, with richer spacing,*/}
      {/*          softer colors, and a stronger visual hierarchy throughout the app.*/}
      {/*        </p>*/}
      
      {/*        <div className="mt-6 grid gap-3 sm:grid-cols-3">*/}
      {/*          {[*/}
      {/*            "Curated layout",*/}
      {/*            "Soft-glow accents",*/}
      {/*            "Elegant motion",*/}
      {/*          ].map((item) => (*/}
      {/*            <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-rose-50/90">*/}
      {/*              {item}*/}
      {/*            </div>*/}
      {/*          ))}*/}
      {/*        </div>*/}
      {/*      </div>*/}
      
      {/*      {features.map((feature) => (*/}
      {/*        <div*/}
      {/*          key={feature.title}*/}
      {/*          className="rounded-[1.75rem] border border-white/70 bg-white/78 p-6 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md"*/}
      {/*        >*/}
      {/*          <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>*/}
      {/*          <p className="mt-2 leading-7 text-slate-600">{feature.description}</p>*/}
      {/*        </div>*/}
      {/*      ))}*/}
      {/*    </section>*/}
      {/*  </section>*/}
      {/*</div>*/}
      HO NGUYEN TAI LOI
    </main>
  );
}
