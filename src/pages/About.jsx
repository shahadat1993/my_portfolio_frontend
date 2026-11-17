import { CtaBand, Cards, Chips, Faqs, K } from '../components/Bits';
import Acc from '../components/Accordion';
import { SplitChars, SplitWords } from '../lib/utils';
import { on } from '../lib/settings';
import { gsap } from '../lib/gsap';
import { useGsap, flipTitle, revealRv, scrubWords, countUp } from '../hooks/useGsap';
import { useSeo } from '../components/Seo';
import { useSite } from '../context/Site';
import { usePrefs } from '../context/Prefs';

export default function About() {
  const { settings: s, services, skills, timeline, faqs } = useSite();
  const { motion } = usePrefs();
  useSeo({ title: s.about_seo_title || s.nav_about, raw: !!s.about_seo_title, description: s.about_seo_description, image: s.about_seo_image, noindex: s.about_seo_noindex === '1' });
  const stats = [[s.stat1_value, s.stat1_suffix, s.stat1_label], [s.stat2_value, s.stat2_suffix, s.stat2_label], [s.stat3_value, s.stat3_suffix, s.stat3_label], [s.about_stat4_value, s.about_stat4_suffix, s.about_stat4_label]];

  const ref = useGsap((root) => {
    flipTitle(root); revealRv(root); scrubWords(root); countUp(root);
    gsap.from('.hcard', { scale: 0.8, rotationY: -40, opacity: 0, transformPerspective: 1000, duration: 1.3, ease: 'power4.out', clearProps: 'transform,opacity' });
    gsap.from('.stats>div', { y: 40, opacity: 0, stagger: 0.1, scrollTrigger: { trigger: '.stats', start: 'top 90%' } });
    root.querySelectorAll('.sk>div').forEach((d) => gsap.from(d, { '--p': '0%', duration: 1.4, ease: 'power3.out', scrollTrigger: { trigger: d, start: 'top 92%' } }));
    gsap.to('.tl .f', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.tl', scrub: true, start: 'top 70%', end: 'bottom 70%' } });
    root.querySelectorAll('.tl .s').forEach((el) => gsap.from(el, { x: -50, opacity: 0, scrollTrigger: { trigger: el, start: 'top 88%' } }));
  }, [skills.length, timeline.length]);

  return (
    <div className="pg" ref={ref}>
      <section className="pt"><span className="mono">{s.about_head_kicker}</span><h1><SplitChars>{s.about_head_title} <em>{s.about_head_accent}</em></SplitChars></h1></section>
      {on(s, 'about_intro_show') && (
        <section style={{ paddingTop: 30 }}>
          <div className="ab">
            <div className="tilt hcard" data-k="1">
              <div className="cd" style={{ background: 'linear-gradient(160deg,#7c5cff,var(--a))' }}>
                <div className="gl" />
                {s.about_photo ? <img src={s.about_photo} alt={s.site_name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} /> : <b className="init ly" data-d="22">{(s.logo_text || 'S').slice(0, 2).toUpperCase()}</b>}
                {s.about_chip1 && <span className="chip c1 ly" data-d="40">{s.about_chip1}</span>}
                {s.about_chip2 && <span className="chip c3 ly" data-d="30">{s.about_chip2}</span>}
              </div>
            </div>
            <div>
              <p className="ws"><SplitWords>{s.about_lead}</SplitWords></p>
              <p className="rv">{s.about_p1}</p>
              <p className="rv">{s.about_p2}</p>
              <div className="facts rv">
                <div><small className="mono">Based in</small>{s.about_fact_based}</div><div><small className="mono">Focus</small>{s.about_fact_focus}</div>
                <div><small className="mono">Experience</small>{s.about_fact_experience}</div><div><small className="mono">Status</small>{s.about_fact_status}</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {on(s, 'about_services_show') && services.length > 0 && (
        <section>
          <K n="01" left={s.about_services_label} right={s.about_services_right} />
          {services.map((v, i) => <Acc key={v.title} n={`0${i + 1}`} q={v.title} a={v.description}><div className="tg2">{v.tags.map((t) => <span key={t}>{t}</span>)}</div></Acc>)}
        </section>
      )}

      {on(s, 'about_stats_show') && (
        <div className="dk stats">
          {stats.map(([v, suf, l], i) => <div key={i}><b><i data-n={v} style={{ fontStyle: 'normal' }}>{motion ? 0 : v}</i><sup>{suf}</sup></b><span className="mono">{l}</span></div>)}
        </div>
      )}

      {on(s, 'about_toolbox_show') && (
        <section>
          <K n="02" left={s.about_toolbox_label} right={s.about_toolbox_right} />
          <div className="sk">{skills.map((k) => <div key={k.name} style={{ '--p': `${k.level}%` }}><span>{k.name} <b>{k.level}%</b></span><i style={{ '--p': `${k.level}%` }} /></div>)}</div>
          <Chips items={s.about_tools || []} />
        </section>
      )}

      {on(s, 'about_process_show') && <section><K n="03" left={s.about_process_label} right={s.about_process_right} /><Cards items={s.process_steps} /></section>}

      {on(s, 'about_journey_show') && timeline.length > 0 && (
        <section>
          <K n="04" left={s.about_journey_label} right={s.about_journey_right} />
          <div className="tl"><div className="f" />
            {timeline.map((t) => <div className="s" key={t.title}><small className="mono">{t.label}</small><h3>{t.title}</h3><p>{t.description}</p></div>)}
          </div>
        </section>
      )}

      {on(s, 'about_faq_show') && <section><K n="05" left={s.about_faq_label} right={s.about_faq_right} /><Faqs items={faqs.filter((f) => f.scope === 'about')} /></section>}
      {on(s, 'about_cta_show') && <CtaBand />}
    </div>
  );
}
