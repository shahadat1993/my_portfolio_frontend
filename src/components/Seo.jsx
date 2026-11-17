import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSite } from '../context/Site';

const meta = (attr, name, content) => {
  let el = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!content) { el?.remove(); return; }
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, name); document.head.appendChild(el); }
  el.setAttribute('content', content);
};
const link = (rel, href) => {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!href) { el?.remove(); return; }
  if (!el) { el = document.createElement('link'); el.rel = rel; document.head.appendChild(el); }
  el.href = href;
};

/** Site-wide head tags: favicon, verification codes, Google Analytics / Tag Manager / Facebook Pixel (all from admin → Site settings → SEO). */
export function SeoGlobal() {
  const { settings: s } = useSite();
  const { pathname } = useLocation();
  useEffect(() => { if (s.favicon) link('icon', s.favicon); }, [s.favicon]);
  useEffect(() => { meta('name', 'google-site-verification', s.seo_verify_google); meta('name', 'msvalidate.01', s.seo_verify_bing); }, [s.seo_verify_google, s.seo_verify_bing]);
  useEffect(() => {
    const add = (id, src, code) => { if (document.getElementById(id)) return; const sc = document.createElement('script'); sc.id = id; if (src) { sc.async = true; sc.src = src; } if (code) sc.text = code; document.head.appendChild(sc); };
    if (s.analytics_ga) {
      add('ga-js', `https://www.googletagmanager.com/gtag/js?id=${s.analytics_ga}`);
      add('ga-init', null, `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${s.analytics_ga}',{send_page_view:false});`);
    }
    if (s.analytics_gtm) add('gtm-js', null, `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${s.analytics_gtm}');`);
    if (s.analytics_fb_pixel) add('fb-pixel', null, `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${s.analytics_fb_pixel}');`);
  }, [s.analytics_ga, s.analytics_gtm, s.analytics_fb_pixel]);
  useEffect(() => { // page views for a single-page app
    window.gtag?.('event', 'page_view', { page_path: pathname, page_title: document.title });
    window.fbq?.('track', 'PageView');
  }, [pathname]);
  return null;
}

/**
 * Per-page SEO: <title>, description, canonical, Open Graph, Twitter card, robots and JSON-LD.
 * Values fall back to Site settings → SEO. Example: useSeo({ title: 'About', description, image, noindex, jsonld })
 */
export function useSeo({ title, description, image, noindex, type = 'website', jsonld, raw = false } = {}) {
  const { settings: s, social } = useSite();
  const { pathname } = useLocation();
  useEffect(() => {
    const site = s.site_name;
    const full = !title ? `${site} — ${s.site_tagline}` : raw ? title : (s.seo_title_template || '{title} — {site}').replace('{title}', title).replace('{site}', site);
    const desc = description || s.seo_description || '';
    const base = (s.seo_canonical_base || window.location.origin).replace(/\/$/, '');
    const url = base + (pathname === '/' ? '' : pathname);
    const img = image || s.seo_og_image || '';
    document.title = full;
    meta('name', 'description', desc);
    meta('name', 'keywords', s.seo_keywords);
    meta('name', 'robots', noindex || s.seo_index === '0' ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');
    link('canonical', url);
    meta('property', 'og:type', type); meta('property', 'og:site_name', site); meta('property', 'og:title', full); meta('property', 'og:description', desc);
    meta('property', 'og:url', url); meta('property', 'og:image', img);
    meta('name', 'twitter:card', img ? 'summary_large_image' : 'summary'); meta('name', 'twitter:title', full); meta('name', 'twitter:description', desc); meta('name', 'twitter:image', img);
    meta('name', 'twitter:site', s.seo_twitter);
    let ld = document.getElementById('ld-json');
    const data = jsonld || (pathname === '/' ? { '@context': 'https://schema.org', '@type': 'Person', name: s.seo_person_name || site, jobTitle: s.seo_person_job, url: base, image: s.home_hero_photo || undefined, sameAs: social.filter((x) => /^https?:/.test(x.url)).map((x) => x.url) } : null);
    if (!data) { ld?.remove(); return; }
    if (!ld) { ld = document.createElement('script'); ld.id = 'ld-json'; ld.type = 'application/ld+json'; document.head.appendChild(ld); }
    ld.textContent = JSON.stringify(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, image, noindex, type, pathname, s]);
}
