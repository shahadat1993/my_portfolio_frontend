import { useSite } from '../context/Site';
import { usePrefs } from '../context/Prefs';

/** Image logo when "Use an IMAGE logo" is ON in admin (Site settings → Logo & branding), otherwise the text logo. */
export default function Logo({ big = false }) {
  const { settings: s } = useSite();
  const { isDark } = usePrefs();
  const img = s.logo_use_image === '1' ? ((!isDark && s.logo_image_light) || s.logo_image) : null;
  if (img) return <img className="logo-img" src={img} alt={s.site_name} style={big ? { maxHeight: 54 } : undefined} />;
  return <>{s.logo_text}{s.logo_accent && <em>{s.logo_accent}</em>}</>;
}
