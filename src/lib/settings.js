// Small helpers for reading admin-controlled content.
/** Replace {year} {name} {since} {city} placeholders in an admin-written string. */
export const fmt = (str = '', s = {}) =>
  String(str ?? '').replaceAll('{year}', new Date().getFullYear()).replaceAll('{name}', s.site_name || '').replaceAll('{since}', s.since_year || '').replaceAll('{city}', (s.location || '').split(',')[0]);
/** Toggle fields arrive as '1' / '0'. A missing field counts as ON. */
export const on = (s, k) => !(s[k] === '0' || s[k] === 0 || s[k] === false);
export const isExternal = (u = '') => /^(https?:|mailto:|tel:)/.test(u);
