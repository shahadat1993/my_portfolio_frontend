import TLink from './TLink';
import Clock from './Clock';
import SocialIcon, { NAMES } from './SocialIcon';
import { useUI } from '../context/UI';
import { useSite } from '../context/Site';

/** Full-screen numbered menu (mobile + "Menu" button). */
export default function MenuOverlay() {
  const { menu } = useUI();
  const { settings: s, social } = useSite();
  const items = [['/', s.nav_home], ['/about', s.nav_about], ['/projects', s.nav_projects], ['/blogs', s.nav_blogs], ['/contact', s.nav_contact]];
  return (
    <div id="menu" className={menu ? 'on' : ''}>
      <div className="mn">{items.map(([to, t], i) => <TLink key={to} to={to}><i>0{i + 1}</i>{t}</TLink>)}</div>
      <div className="mi">
        <small className="mono">(Contact)</small><a href={`mailto:${s.public_email}`}>{s.public_email}</a>
        <small className="mono">(Local time)</small><Clock as="a" />
        <small className="mono">(Social)</small>
        {social.map((x) => <a key={x.url} href={x.url} target="_blank" rel="noreferrer"><SocialIcon platform={x.platform} /> {x.label || NAMES[x.platform]} ↗</a>)}
      </div>
    </div>
  );
}
