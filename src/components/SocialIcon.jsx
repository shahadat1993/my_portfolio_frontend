/** Boxicons class for each platform you can pick in the admin (Social links + Floating buttons). */
export const ICONS = {
  whatsapp: 'bxl-whatsapp', facebook: 'bxl-facebook-circle', instagram: 'bxl-instagram', linkedin: 'bxl-linkedin', github: 'bxl-github', x: 'bxl-twitter',
  youtube: 'bxl-youtube', telegram: 'bxl-telegram', messenger: 'bxl-messenger', tiktok: 'bxl-tiktok', behance: 'bxl-behance', dribbble: 'bxl-dribbble',
  medium: 'bxl-medium', devto: 'bxl-dev-to', discord: 'bxl-discord-alt', email: 'bx-envelope', phone: 'bx-phone', link: 'bx-link',
};
export const BRAND = { whatsapp: '#25d366', facebook: '#1877f2', instagram: '#e1306c', linkedin: '#0a66c2', youtube: '#ff0000', telegram: '#229ed9', messenger: '#0084ff', tiktok: '#111111', x: '#111111', github: '#24292f', discord: '#5865f2' };
export const NAMES = { whatsapp: 'WhatsApp', facebook: 'Facebook', instagram: 'Instagram', linkedin: 'LinkedIn', github: 'GitHub', x: 'X', youtube: 'YouTube', telegram: 'Telegram', messenger: 'Messenger', tiktok: 'TikTok', behance: 'Behance', dribbble: 'Dribbble', medium: 'Medium', devto: 'DEV', discord: 'Discord', email: 'Email', phone: 'Phone', link: 'Website' };

export default function SocialIcon({ platform }) {
  return <i className={`bx ${ICONS[platform] || 'bx-link'}`} aria-hidden="true" />;
}
