import { useEffect, useRef } from 'react';
import TLink from './TLink';
import Acc from './Accordion';
import { useSite } from '../context/Site';

/** "01 / Title ........ right text" section label row */
export const K = ({ n, left, right }) => (
  <div className="k mono"><span><b>{n}</b> / {left}</span><span>{right}</span></div>
);


/** Numbered tilt cards (process steps, engagement types) */
export const Cards = ({ items, className = 'proc' }) => (
  <div className={className}>
    {(items || []).map(({ title: t, text: d }, i) => (
      <div className="pcard tilt rv" data-s="1" data-k=".7" key={t}><b>0{i + 1}</b><div><h3>{t}</h3><p>{d}</p></div></div>
    ))}
  </div>
);

export const Chips = ({ items }) => <div className="chips">{items.map((t) => <span key={t}>{t}</span>)}</div>;
export const Faqs = ({ items }) => <div>{items.map((f) => <Acc key={f.question} q={f.question} a={f.answer} />)}</div>;

export function CtaBand() {
  const { settings: s } = useSite();
  return (
    <section className="cta2">
      <K n="→" left={s.cta_label} right={s.cta_label_right} />
      <h2 className="rv">{s.cta_heading} <em>{s.cta_accent}</em></h2><br />
      <TLink className="cta mag rv" to={s.cta_link || '/contact'} data-c="HI">{s.cta_button}</TLink>
    </section>
  );
}

/** Scroll-velocity marquee: speeds up and reverses with your scroll. */
export function Marquee({ words }) {
  const box = useRef(null), inner = useRef(null);
  useEffect(() => {
    let raf, x = 0, dir = -1, sy = scrollY, sv = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!box.current || !inner.current) return; // can fire once after unmount, before cleanup runs
      const r = box.current.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
      sv += ((scrollY - sy) - sv) * 0.2; sy = scrollY;
      if (sv > 0.8) dir = -1; else if (sv < -0.8) dir = 1;
      x += dir * (0.7 + Math.abs(sv) * 0.3);
      const half = inner.current.scrollWidth / 2;
      if (x <= -half) x += half; if (x > 0) x -= half;
      inner.current.style.transform = `translateX(${x}px)`;
      box.current.style.transform = `skewX(${Math.max(-8, Math.min(8, -sv * 0.35))}deg)`;
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, []);
  const list = [...words, ...words];
  return <div className="mq" ref={box}><div ref={inner}>{list.map((w, i) => <span key={i}>{w}</span>)}</div></div>;
}

/** Rich-text HTML coming from the admin editor */
export const Prose = ({ html, wide }) => (html ? <div className={`prose ${wide ? 'wide' : ''}`} dangerouslySetInnerHTML={{ __html: html }} /> : null);

/** Image (or initials fallback) inside a gradient thumbnail */
export const Thumb = ({ src, code, className = '' }) => (
  <div className={`th ${src ? 'has' : ''} ${className}`}>{src ? <img className="rimg" src={src} alt="" loading="lazy" /> : code}</div>
);
