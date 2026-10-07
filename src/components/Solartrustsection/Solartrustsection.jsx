import { useEffect, useRef } from "react";
import "./Solartrustsection.css";

function useCountUp(ref, target, suffix, delay) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      el.textContent = target + suffix;
      return;
    }

    const duration = 1400;
    let start = null;
    let frame;

    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    const timeout = setTimeout(() => {
      frame = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, [ref, target, suffix, delay]);
}

export default function SolarTrustSection() {
  const topStatRef = useRef(null);
  const bottomStatRef = useRef(null);

  useCountUp(topStatRef, 200, "+", 300);
  useCountUp(bottomStatRef, 10, "k+", 480);

  return (
    <section className="stst-bg min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-[1240px] grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-14 lg:gap-[72px] items-center">

        {/* LEFT: sun-disc stat cluster */}
        <div className="relative h-[400px] sm:h-[480px] lg:h-[560px] max-w-[460px] lg:max-w-none mx-auto lg:mx-0 w-full">
          <div className="stst-disc absolute rounded-full border border-white/[0.07] w-[380px] h-[380px] sm:w-[420px] sm:h-[420px] lg:w-[480px] lg:h-[480px] -left-10 top-6 lg:top-10 opacity-55" />
          <div className="stst-disc absolute rounded-full border border-white/[0.07] w-[260px] h-[260px] sm:w-[300px] sm:h-[300px] lg:w-[340px] lg:h-[340px] left-10 sm:left-14 lg:left-[60px] bottom-0 opacity-70" />

          <div className="stst-orb stst-orb-top absolute flex flex-col items-center justify-center text-center rounded-full border border-white/[0.07] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]
            w-[260px] h-[260px] left-10 top-0 p-7
            sm:w-[300px] sm:h-[300px] sm:left-[70px] sm:p-9
            lg:w-[340px] lg:h-[340px] lg:left-[90px] lg:p-11">
            <div
              ref={topStatRef}
              className="font-sora font-extrabold text-[#ff7a29] leading-none tracking-tight text-[2.6rem] sm:text-[3rem] lg:text-[3.6rem]"
            >
              0
            </div>
            <div className="font-sora font-bold text-lg mt-2.5 text-[#f6f2ea]">
              Solar Solutions
            </div>
            <p className="text-sm leading-relaxed mt-3 text-[#9a938a] max-w-[220px]">
              We've installed solar systems for many clients, solving their
              energy challenges efficiently.
            </p>
          </div>

          <div className="stst-orb stst-orb-bottom absolute flex flex-col items-center justify-center text-center rounded-full border border-white/[0.07] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)]
            w-[210px] h-[210px] -left-2 bottom-0 p-6
            sm:w-[260px] sm:h-[260px] sm:-left-6 sm:p-8
            lg:w-[300px] lg:h-[300px] lg:-left-[30px] lg:bottom-2.5 lg:p-9">
            <div
              ref={bottomStatRef}
              className="font-sora font-extrabold text-[#ff7a29] leading-none tracking-tight text-[2.2rem] sm:text-[2.6rem] lg:text-[3.1rem]"
            >
              0
            </div>
            <div className="font-sora font-bold text-lg mt-2.5 text-[#f6f2ea]">
              Happy Customers
            </div>
            <p className="text-sm leading-relaxed mt-3 text-[#9a938a] max-w-[220px]">
              Trust our reliable solar installations and great service for
              long term savings.
            </p>
          </div>

          <span className="stst-dot absolute w-2.5 h-2.5 rounded-full bg-[#ffb648] right-[4%] bottom-[6%] shadow-[0_0_18px_4px_rgba(255,182,72,0.65)]" />
        </div>

        {/* RIGHT: testimonial panel */}
        <div className="flex flex-col gap-7">
          <div className="inline-flex items-center gap-2.5 w-fit font-sora text-[0.8rem] font-semibold">
            <span className="penel  text-[#1a0d02] px-3.5 py-1.5 rounded-full">
              Customer
            </span>
            <span className="text-[#ff5c00] px-0.5 py-1.5">Testimonials</span>
          </div>

          <h1 className="font-sora font-bold leading-[1.12] tracking-tight text-[2rem] sm:text-[2.4rem] lg:text-[2.9rem] max-w-[14ch]">
            Trusted by customers across Pakistan
          </h1>

          <p className="border-l-2 border-[#fff]/40 pl-5 text-[1.1rem] lg:text-[1.15rem] leading-relaxed text-[#d9d3c8] max-w-[46ch]">
            "madni solar is very reliable brand in Pakistan. I received
            excellent customer service from them. Highly recommended."
          </p>
          <p className="text-sm text-[#6f6a63] -mt-4">
            — Verified madni solar customer
          </p>

          <div className="flex items-center gap-3 mt-1">
            <div className="font-sora font-bold text-2xl text-[#f6f2ea] border border-white/[0.16] rounded-xl px-5 py-3.5 bg-[#1a1512]">
              4.9/5
            </div>
            <div>
              <strong className="block font-sora font-bold text-base mb-0.5">
                Trust score rated
              </strong>
              <span className="text-sm text-[#9a938a]">
                Rated by over 2000 customers
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}