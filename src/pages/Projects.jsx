import { useState } from 'react';
import TLink from '../components/TLink';
import Ring3D from '../components/Ring3D';
import { Cards, Chips, CtaBand, K, Thumb } from '../components/Bits';
import { SplitChars } from '../lib/utils';
import { on } from '../lib/settings';
import { gsap } from '../lib/gsap';
import { useGsap, flipTitle, revealRv } from '../hooks/useGsap';
import { useApi } from '../hooks/useApi';
import { useSeo } from '../components/Seo';
import { useGo } from '../context/Transition';
import { useSite } from '../context/Site';
import { usePrefs } from '../context/Prefs';

export default function Projects() {
  const { settings: s, categories } = useSite();
  const { motion } = usePrefs();
  const go = useGo();
  const { data } = useApi('/projects');
  const [cat, setCat] = useState('all'), [q, setQ] = useState(''), [view, setView] = useState('3d'), [idx, setIdx] = useState(0);
  useSeo({ title: s.projects_seo_title || s.nav_projects, raw: !!s.projects_seo_title, description: s.projects_seo_description, image: s.projects_seo_image, noindex: s.projects_seo_noindex === '1' });
  const items = data || [];
  const match = (p) => (cat === 'all' || p.category === cat) && (!q || `${p.title} ${p.summary} ${p.tags.join(' ')}`.toLowerCase().includes(q.toLowerCase()));
  const cur = items[idx] || items[0];

  const ref = useGsap((root) => {
    flipTitle(root); revealRv(root);
    gsap.from('.stg', { rotationX: 25, scale: 0.7, opacity: 0, transformPerspective: 1000, duration: 1.4, ease: 'power4.out', delay: 0.3, clearProps: 'transform,opacity' });
  }, [items.length]);

  return (
    <div className="pg" ref={ref}>
      <section className="pt">
        <span className="mono">{s.projects_head_kicker}</span>
        <h1><SplitChars>{s.projects_head_title} <em>{s.projects_head_accent}</em></SplitChars></h1>
        <p className="lead rv">{s.projects_lead}</p>
        <div className="ctl rv">
          <label className="sf"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg><input value={q} onChange={(e) => setQ(e.target.value)} placeholder={s.projects_search} /></label>
          <div className="fl">{[{ slug: 'all', name: s.projects_all }, ...categories.project].map((c) => <button key={c.slug} className={cat === c.slug ? 'on' : ''} onClick={() => setCat(c.slug)}>{c.name}</button>)}</div>
          <div className="vw"><button className={view === '3d' ? 'on' : ''} onClick={() => setView('3d')}>{s.projects_3d}</button><button className={view === 'grid' ? 'on' : ''} onClick={() => setView('grid')}>{s.projects_grid}</button></div>
        </div>

        {view === '3d' && items.length > 0 && (
          <>
            <Ring3D items={items} motion={motion} dim={(p) => !match(p)} onActive={setIdx} onOpen={(i) => go(`/projects/${items[i].slug}`)}
              renderCard={(p) => <><Thumb src={p.cover} code={p.code} /><p>{p.title}</p><small className="mono">{p.category_name}</small></>} />
            {cur && (
              <div className="cp">
                <small className="mono">(0{idx + 1}) {cur.category_name}</small><h3>{cur.title}</h3><p>{cur.summary}</p>
                <div className="tg2">{cur.tags.map((t) => <span key={t}>{t}</span>)}</div>
                <TLink className="cta mag" to={`/projects/${cur.slug}`} data-c="OPEN">{s.projects_open}</TLink>
              </div>
            )}
          </>
        )}
        {view === 'grid' && (
          <div className="pg2 on">
            {items.map((p) => (
              <TLink key={p.slug} to={`/projects/${p.slug}`} className={`pc tilt ${match(p) ? '' : 'dim'}`} data-s="1" data-k=".5">
                <Thumb src={p.cover} code={p.code} />
                <div className="in"><h3>{p.title}</h3><p>{p.summary}</p><div className="tg2">{p.tags.map((t) => <span key={t}>{t}</span>)}</div></div>
              </TLink>
            ))}
          </div>
        )}
        {data && !items.length && <p className="lead">{s.projects_empty}</p>}
      </section>
      {on(s, 'projects_cap_show') && <section><K n="01" left={s.projects_cap_label} right={s.projects_cap_right} /><Chips items={s.projects_tools || []} /></section>}
      {on(s, 'projects_process_show') && <section><K n="02" left={s.projects_process_label} right={s.projects_process_right} /><Cards items={s.process_steps} /></section>}
      {on(s, 'projects_cta_show') && <CtaBand />}
    </div>
  );
}
