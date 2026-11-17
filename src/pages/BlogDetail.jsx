import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import TLink from '../components/TLink';
import { CtaBand, K, Prose } from '../components/Bits';
import { SplitChars, withToc } from '../lib/utils';
import { useGsap, flipTitle, revealRv } from '../hooks/useGsap';
import { gsap } from '../lib/gsap';
import { useApi } from '../hooks/useApi';
import { useSeo } from '../components/Seo';
import { useSite } from '../context/Site';
import { on } from '../lib/settings';
import { useScroll } from '../context/Smooth';

export default function BlogDetail() {
  const { slug } = useParams();
  const { data: p, loading, error } = useApi(`/posts/${slug}`);
  const scroll = useScroll();
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const { settings: t } = useSite();
  useSeo({ title: p ? p.seo_title || p.title : t.site_name, description: p?.seo_description || p?.excerpt, image: p?.cover, type: 'article',
    jsonld: p ? { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: p.title, description: p.excerpt, image: p.cover, datePublished: p.date, author: { '@type': 'Person', name: p.author || t.seo_person_name }, publisher: { '@type': 'Organization', name: t.site_name } } : undefined });
  const { html, toc } = useMemo(() => withToc(p?.content), [p]);

  // highlight the section currently on screen in the "On this page" list
  useEffect(() => {
    if (!toc.length) return undefined;
    const f = () => { let a = 0; toc.forEach((t, i) => { const el = document.getElementById(t.id); if (el && el.getBoundingClientRect().top < innerHeight * 0.4) a = i; }); setActive(a); };
    addEventListener('scroll', f, { passive: true }); f();
    return () => removeEventListener('scroll', f);
  }, [toc]);

  const ref = useGsap((root) => {
    flipTitle(root); revealRv(root);
    gsap.from('.hcover', { scale: 0.92, opacity: 0, duration: 1.2, ease: 'power3.out', delay: 0.3 });
    gsap.from('.toc', { x: -40, opacity: 0, duration: 0.9, delay: 0.5 });
  }, [p?.slug]);

  if (loading) return <div className="pg"><section className="pt"><span className="mono">Loading…</span></section></div>;
  if (error || !p) return <div className="pg"><section className="pt"><h1>Not found</h1><p className="lead">This article does not exist. <TLink className="ulk" to="/blogs">{t.bd_back}</TLink></p></section></div>;

  return (
    <div className="pg" ref={ref}>
      <section className="pt">
        <TLink className="ulk" to="/blogs">{t.bd_back}</TLink><div style={{ height: 28 }} />
        <span className="mono">{p.category_name} · {p.date} · {p.minutes} min read</span>
        <h1 className="art-t"><SplitChars>{p.title}</SplitChars></h1>
        {p.excerpt && <p className="lead">{p.excerpt}</p>}
      </section>
      <section className="art" style={{ paddingTop: 20 }}>
        <aside className="toc">
          <small className="mono">{t.bd_toc}</small>
          {toc.map((t, i) => <a key={t.id} href={`#${t.id}`} className={i === active ? 'on' : ''} onClick={(e) => { e.preventDefault(); scroll.to(document.getElementById(t.id), -100); }}>{t.text}</a>)}
          <button className="rs" onClick={() => { navigator.clipboard?.writeText(location.href); setCopied(true); }}>{copied ? t.bd_copied : t.bd_copy}</button>
        </aside>
        <article>
          {p.cover && <img className="hcover" src={p.cover} alt={p.title} />}
          <Prose html={html} />
          {p.tags.length > 0 && <div className="chips">{p.tags.map((t) => <span key={t}>{t}</span>)}</div>}
          <div className="author rv" style={{ marginTop: 50 }}><b>{(p.author || 'S')[0]}</b><div><strong>{p.author}</strong><p>{t.bd_author_bio}</p></div></div>
        </article>
      </section>
      {p.related.length > 0 && (
        <section>
          <K n="→" left={t.bd_related} right={t.bd_related_right} />
          {p.related.map((x) => <TLink key={x.slug} className="bl rv" to={`/blogs/${x.slug}`}><small>{x.date.toUpperCase()}</small><h3>{x.title}</h3><small>{x.category_name?.toUpperCase()} · {x.minutes} MIN</small></TLink>)}
        </section>
      )}
      {on(t, 'blogs_cta_show') && <CtaBand />}
    </div>
  );
}
