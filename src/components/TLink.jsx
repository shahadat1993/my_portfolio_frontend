import { useGo } from '../context/Transition';
import { isExternal } from '../lib/settings';

/** Link for ANY url the admin may type: internal paths get the page-transition curtain, https:// links open in a new tab. */
export default function TLink({ to = '/', children, onClick, ...rest }) {
  const go = useGo();
  const external = isExternal(to);
  const newTab = /^https?:/.test(to);
  return (
    <a
      href={to}
      {...(newTab ? { target: '_blank', rel: 'noreferrer' } : {})}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (external || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        go(to);
      }}
    >
      {children}
    </a>
  );
}
