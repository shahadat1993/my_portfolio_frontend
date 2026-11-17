import { useState } from 'react';
import TLink from '../components/TLink';
import HeroCanvas from '../components/HeroCanvas';
import HeroPhoto from '../components/HeroPhoto';
import VizCanvas from '../components/VizCanvas';
import { K, Marquee } from '../components/Bits';
import { SplitWords } from '../lib/utils';
import { fmt, on } from '../lib/settings';
import { gsap } from '../lib/gsap';
import { useGsap, revealRv, scrubWords, countUp, introDelay } from '../hooks/useGsap';
import { useApi } from '../hooks/useApi';
import { useSeo } from '../components/Seo';
import { useSite } from '../context/Site';
import { usePrefs } from '../context/Prefs';

export default function Home() {
  const { settings: s, skills } = useSite();
  const { motion, prefs, isDark } = usePrefs();
  const { data: projects } = useApi('/projects');
  const tabs = s.home_tabs || [];
  const [tab, setTab] = useState(0);        // which tab text is shown
  const [mode, setMode] = useState(0);      // 0 = default animation until a tab is clicked
  useSeo({ title: s.home_seo_title, raw: true, description: s.home_seo_description, image: s.home_seo_image, noindex: s.home_seo_noindex === '1' });

  const count = parseInt(s.home_work_count, 10) || 3;
  const featured = projects ? (projects.filter((p) => p.featured).length ? projects.filter((p) => p.featured) : projects).slice(0, count) : [];
  const stats = [1, 2, 3].map((i) => ({ v: s[`stat${i}_value`], suf: s[`stat${i}_suffix`], l: s[`stat${i}_label`] }));
  const customWords = s.home_marquee_words || [];
  const words = customWords.length ? customWords : (skills.length ? skills.map((k) => k.name.replace(/\s*\(.*\)/, '')) : ['Laravel', 'React']);
  const vizImg = s[`home_viz_image_${mode}`] || s.home_viz_image_0;
  const vizLabel = mode === 0 ? s.home_viz_label_0 : tabs[mode - 1]?.label || '';
  const photoSrc = s.home_hero_photo_cors || s.home_hero_photo;
  const pixel = s.home_hero_effect !== 'photo';

  const ref = useGsap((root) => {
    gsap.set('#nm .c', { yPercent: 115, opacity: 0, rotate: 6 });
    gsap.timeline({ delay: introDelay() })
      .from('#hcv', { opacity: 0, scale: 1.08, duration: 1.6, ease: 'power3.out' })
      .to('#nm .c', { yPercent: 0, opacity: 1, rotate: 0, duration: 1.1, stagger: 0.04, ease: 'power4.out' }, 0.1)
      .from('#nm em,#hk,.hs,.hb>*,.lab,.hf>*', { y: 24, opacity: 0, stagger: 0.06, duration: 0.8 }, 0.5)
      .from('.stats>div', { y: 30, opacity: 0, stagger: 0.1 }, 0.9);
    const st = gsap.timeline({ scrollTrigger: { trigger: '#hero', scrub: 1, start: 'top top', end: 'bottom top' } })
      .to('.hm', { yPercent: -25, opacity: 0.15 }, 0).to('.lab', { opacity: 0 }, 0);
    if (root.querySelector('.hphoto')) st.to('.hphoto', { yPercent: -10, scale: 1.08, opacity: 0.2 }, 0);
    countUp(root); scrubWords(root); revealRv(root);
    gsap.from('.vz', { clipPath: 'inset(0 0 100% 0)', duration: 1.2, ease: 'power4.out', scrollTrigger: { trigger: '.vz', start: 'top 85%' } });
    gsap.from('.tabs button', { y: 30, opacity: 0, stagger: 0.1, scrollTrigger: { trigger: '.tabs', start: 'top 92%' } });
  }, []);
  const workRef = useGsap(() => {
    gsap.from('.pr', { y: 60, opacity: 0, stagger: 0.12, scrollTrigger: { trigger: '#fp', start: 'top 85%' } });
  }, [featured.length]);

  const t = tabs[tab];
  const glow = (e) => { const el = e.currentTarget.querySelector('.hphoto'); if (!el) return; const r = e.currentTarget.getBoundingClientRect(); el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`); el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 70}%`); };

  return (
    <div className="pg" ref={ref}>
      <div id="stage" className="dk">
        <section id="hero" style={{ paddingBottom: 0 }} onMouseMove={glow}>
          {pixel ? <HeroCanvas photo={photoSrc} motion={motion} scatter={on(s, 'home_hero_scatter')} /> : <HeroPhoto src={s.home_hero_photo} />}
          <div className="lab l1">{s.home_hero_left_label}<b>+</b>{(s.home_hero_left_lines || []).map((l, i) => <span key={i}>{l}<br /></span>)}</div>
          <div className="lab r1">{s.location}<br />{on(s, 'home_hero_available') && s.home_hero_available_text}</div>
          <div className="hm">
            <p className="mono" id="hk">{s.home_hero_kicker}</p>
            <h1 id="nm">{[...s.home_hero_name].map((c, i) => <span className="c" key={i}>{c}</span>)} <em>{s.home_hero_accent}</em></h1>
            <p className="hs">{s.home_hero_text}</p>
            <div className="hb">
              <TLink className="pbtn mag" to={s.home_hero_cta_link || '/projects'} data-c="VIEW">{s.home_hero_cta} <span>↓</span></TLink>
              <TLink className="ulk" to={s.home_hero_link2_url || '/contact'}>{s.home_hero_link2}</TLink>
            </div>
          </div>
          <div className="hf mono"><span>{s.home_hero_scroll}</span><span>{fmt(s.home_hero_since, s)}</span><span>{s.location}</span></div>
        </section>
        {on(s, 'home_stats_show') && (
          <div className="stats">
            {stats.map((x, i) => (
              <div key={i}><b><i data-n={x.v} style={{ fontStyle: 'normal' }}>{motion ? 0 : x.v}</i><sup>{x.suf}</sup></b><span className="mono">{x.l}</span></div>
            ))}
            <div><b style={{ fontSize: '1.6rem', paddingTop: 8 }}>{s.home_stat4_title} <em>{s.home_stat4_accent}</em></b><TLink className="mono" to="/projects">{s.home_stat4_link}</TLink></div>
          </div>
        )}
      </div>

      {on(s, 'home_present_show') && (
        <section id="pres">
          <K n="01" left={s.home_present_label} right={s.home_present_label_right} />
          <div className="pgr">
            <div className={`vz ${vizImg ? 'hasimg' : ''}`}>
              {vizImg && <img className="vzimg" key={vizImg} src={vizImg} alt="" />}
              {(!vizImg || on(s, 'home_viz_overlay')) && <VizCanvas mode={mode} accent={prefs.accent} dark={isDark} />}
              <small className="mono" id="vl">{vizLabel}</small>
            </div>
            <div className="pt2">
              <h2 className="ws"><SplitWords>{s.home_present_heading} <em>{s.home_present_accent}</em></SplitWords></h2>
              <p>{s.home_present_p1}</p>
              <p className="m">{fmt(s.home_present_p2, s)}</p>
              <TLink className="ulk" to={s.home_present_link_url || '/about'}>{s.home_present_link}</TLink>
            </div>
          </div>
          {tabs.length > 0 && <div className="tabs" style={{ gridTemplateColumns: `repeat(${tabs.length},1fr)` }}>{tabs.map((x, i) => <button key={i} className={i === tab ? 'on' : ''} onClick={() => { setTab(i); setMode(i + 1); }}><span>{x.name}</span><span>↗</span></button>)}</div>}
          {t && <div className="tx sw" key={tab}><h3>{t.heading}</h3><p>{t.text}</p>{t.link && <TLink className="ulk" to={t.url || '/'}>{t.link}</TLink>}</div>}
        </section>
      )}

      {on(s, 'home_work_show') && (
        <section id="work" ref={workRef}>
          <K n="02" left={s.home_work_label} right={s.home_work_label_right} />
          <h2 className="rv">{s.home_work_heading} <em>{s.home_work_accent}</em></h2>
          <div className="pl" id="fp">
            {featured.map((p, i) => (
              <TLink key={p.slug} className="pr" to={`/projects/${p.slug}`} data-p={`0${i + 1}`}>
                <small>0{i + 1}</small><h3>{p.title}</h3><span className="t mono">{p.tags.slice(0, 3).join(' · ')}</span>
              </TLink>
            ))}
          </div>
          {s.home_work_button && <p style={{ marginTop: 30 }}><TLink className="ulk" to="/projects">{s.home_work_button}</TLink></p>}
        </section>
      )}

      {on(s, 'home_marquee_show') && <Marquee words={words} />}
      {on(s, 'home_cta_show') && (
        <section className="cta2">
          <K n="03" left={s.home_cta_label} right={s.home_cta_label_right} />
          <h2 className="rv">{s.home_cta_heading} <em>{s.home_cta_accent}</em></h2><br />
          <TLink className="cta mag rv" to={s.home_cta_link || '/contact'} data-c="HI">{s.home_cta_button}</TLink>
        </section>
      )}
    </div>
  );
}
