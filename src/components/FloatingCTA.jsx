import { useSite } from '../context/Site';
import SocialIcon, { BRAND } from './SocialIcon';
import { on } from '../lib/settings';

const href = (type, v, msg) => {
  v = (v || '').trim();
  if (!v) return null;
  switch (type) {
    case 'whatsapp': return `https://wa.me/${v.replace(/\D/g, '')}${msg ? `?text=${encodeURIComponent(msg)}` : ''}`;
    case 'phone': return `tel:${v}`;
    case 'email': return `mailto:${v}`;
    case 'messenger': return v.startsWith('http') ? v : `https://m.me/${v}`;
    case 'telegram': return v.startsWith('http') ? v : `https://t.me/${v.replace('@', '')}`;
    default: return v;
  }
};

/** Up to 3 round buttons in the bottom corner (WhatsApp, Facebook, Instagram…) — all set in admin → Site settings → Floating buttons. */
export default function FloatingCTA() {
  const { settings: s } = useSite();
  if (!on(s, 'float_enabled')) return null;
  const items = [1, 2, 3].map((n) => ({ on: s[`float${n}_enabled`] === '1', type: s[`float${n}_type`], url: href(s[`float${n}_type`], s[`float${n}_value`], s.float_wa_message), label: s[`float${n}_label`] })).filter((x) => x.on && x.url);
  if (!items.length) return null;
  return (
    <div className={`fcta ${s.float_position === 'right' ? 'right' : 'left'}`}>
      {items.map((x, i) => (
        <a key={i} href={x.url} target={/^https?:/.test(x.url) ? '_blank' : undefined} rel="noreferrer" aria-label={x.label} style={{ '--bc': BRAND[x.type] || 'var(--a)', animationDelay: `${i * 0.12}s` }}>
          <SocialIcon platform={x.type} /><span>{x.label}</span>
        </a>
      ))}
    </div>
  );
}
