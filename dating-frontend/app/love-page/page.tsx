'use client'
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const startDate = new Date("2026-01-27T00:00:00");

const highlights = [
    { label: "Moments cherished", value: "Countless" },
    { label: "Forever promise", value: "Always" },
    { label: "Favorite feeling", value: "Home" },
];

export default function LovePage() {
    const [time, setTime] = useState({ days: 0, h: 0, m: 0, s: 0 });

    const timerParts = [
        { label: "hours", value: time.h },
        { label: "minutes", value: time.m },
        { label: "seconds", value: time.s },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const diff = now.getTime() - startDate.getTime();

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const h = Math.floor(diff / (1000 * 60 * 60)) % 24;
            const m = Math.floor(diff / (1000 * 60)) % 60;
            const s = Math.floor(diff / 1000) % 60;

            setTime({ days, h, m, s });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <main className="relative min-h-screen overflow-hidden px-4 py-8 text-slate-700 sm:px-6 sm:py-10 lg:px-8">
            <div className="absolute inset-0 -z-10 opacity-70">
                <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-rose-300/30 blur-3xl" />
                <div className="absolute -bottom-16 left-1/3 h-96 w-96 rounded-full bg-red-200/40 blur-3xl" />
            </div>

            <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center justify-center">
                <motion.section
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="grid w-full gap-8 lg:grid-cols-[1.02fr_0.98fr] xl:gap-10"
                >
                    <div className="space-y-7 rounded-4xl border border-white/70 bg-white/62 p-7 shadow-[0_24px_80px_rgba(190,24,93,0.15)] backdrop-blur-2xl sm:p-10 lg:p-12">
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="inline-flex items-center gap-2 rounded-full border border-rose-200/70 bg-white/80 px-4 py-2 text-sm font-medium text-rose-700 shadow-sm">
                            <span className="text-base">💕</span>
                                A beautifully crafted love note
                            </div>
                            <span className="rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm text-slate-500">
                                A shared keepsake
                            </span>
                        </div>

                        <div className="space-y-4">
                            <motion.h1
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, duration: 0.7 }}
                                className="max-w-xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-6xl xl:text-[4.25rem] xl:leading-[1.02]"
                            >
                                Our love story, designed to feel timeless.
                            </motion.h1>
                            {/*<p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg">*/}
                            {/*    Every second we share deserves a space that feels elegant, warm,*/}
                            {/*    and unforgettable — a little digital keepsake of us.*/}
                            {/*</p>*/}
                        </div>

                        {/*<div className="grid gap-4 sm:grid-cols-3">*/}
                        {/*    {highlights.map((item, index) => (*/}
                        {/*        <motion.div*/}
                        {/*            key={item.label}*/}
                        {/*            initial={{ opacity: 0, y: 16 }}*/}
                        {/*            animate={{ opacity: 1, y: 0 }}*/}
                        {/*            transition={{ delay: 0.15 + index * 0.08, duration: 0.5 }}*/}
                        {/*            className="rounded-2xl border border-white/70 bg-white/78 p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"*/}
                        {/*        >*/}
                        {/*            <p className="text-sm text-slate-500">{item.label}</p>*/}
                        {/*            <p className="mt-1 text-lg font-bold text-slate-900">{item.value}</p>*/}
                        {/*        </motion.div>*/}
                        {/*    ))}*/}
                        </div>

                    {/*    <div className="flex flex-wrap gap-3 pt-2 text-sm font-medium">*/}
                    {/*        <button*/}
                    {/*            type="button"*/}
                    {/*            onClick={() => document.getElementById("counter")?.scrollIntoView({ behavior: "smooth", block: "start" })}*/}
                    {/*            className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-rose-500 to-pink-500 px-5 py-3 text-white shadow-lg shadow-rose-500/25 transition hover:-translate-y-0.5 hover:from-rose-600 hover:to-pink-600"*/}
                    {/*        >*/}
                    {/*            See our timer*/}
                    {/*        </button>*/}
                    {/*        <a*/}
                    {/*            href="/"*/}
                    {/*            className="inline-flex items-center justify-center rounded-full border border-rose-200 bg-white/80 px-5 py-3 text-rose-700 transition hover:-translate-y-0.5 hover:border-rose-300 hover:bg-white"*/}
                    {/*        >*/}
                    {/*            Back home*/}
                    {/*        </a>*/}
                    {/*    </div>*/}
                    {/*</div>*/}

                    <div className="relative">
                        

                        <section
                            id="counter"
                            className="relative overflow-hidden rounded-4xl border border-white/70 bg-slate-950/92 p-6 text-white shadow-[0_30px_90px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-8"
                        >
                            <div className="absolute inset-0 rounded-4xl bg-[radial-gradient(circle_at_top,rgba(251,113,133,0.4),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(244,114,182,0.22),transparent_40%)]" />
                            <div className="absolute right-8 top-8 h-24 w-24 rounded-full bg-white/10 blur-2xl" />

                            <div className="relative space-y-6">
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm uppercase tracking-[0.35em] text-rose-200/80">
                                            Together since
                                        </p>
                                        <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                                            Jan 27, 2026
                                        </h2>
                                    </div>
                                    <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-rose-100 backdrop-blur">
                                        Live countdown
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-[1.15fr_0.85fr]">
                                    <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
                                        <p className="text-sm text-rose-100/80">We have been together for</p>
                                        <div className="mt-4 flex items-end gap-3">
                                            <h3 className="text-6xl font-black leading-none text-white sm:text-7xl">
                                                {time.days}
                                            </h3>
                                            <span className="pb-1 text-lg font-medium text-rose-100/80">
                                                days
                                            </span>
                                        </div>
                                        <p className="mt-4 max-w-md text-sm leading-6 text-rose-100/70">
                                            Hehe ...
                                        </p>
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-1">
                                        {timerParts.map((item) => (
                                            <div
                                                key={item.label}
                                                className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                                            >
                                                <span className="text-sm uppercase tracking-[0.2em] text-rose-100/70">
                                                    {item.label}
                                                </span>
                                                <span className="text-2xl font-bold text-white">
                                                    {String(item.value).padStart(2, "0")}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/*<div className="grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-3">*/}
                                {/*    {[*/}
                                {/*        "Soft conversations",*/}
                                {/*        "Bright little moments",*/}
                                {/*        "A future worth waiting for",*/}
                                {/*    ].map((item) => (*/}
                                {/*        <div*/}
                                {/*            key={item}*/}
                                {/*            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-rose-50/90"*/}
                                {/*        >*/}
                                {/*            {item}*/}
                                {/*        </div>*/}
                                {/*    ))}*/}
                                {/*</div>*/}
                            </div>
                        </section>
                    </div>
                </motion.section>
            </div>
        </main>
    );
}