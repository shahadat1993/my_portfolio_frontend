import { useState } from "react";
import TLink from "./TLink";
import Logo from "./Logo";
import SocialIcon, { NAMES } from "./SocialIcon";
import { post } from "../api";
import { useSite } from "../context/Site";
import { fmt, on } from "../lib/settings";

/** Footer: newsletter, about text, page links, social links, contact info, giant word, copyright — all editable in admin. */
export default function Footer() {
  const { settings: s, social } = useSite();
  const [email, setEmail] = useState(""),
    [msg, setMsg] = useState("");
  const links = [
    ["/", s.nav_home],
    ["/about", s.nav_about],
    ["/projects", s.nav_projects],
    ["/blogs", s.nav_blogs],
    ["/contact", s.nav_contact],
  ];
  const big = s.footer_big_text || s.logo_text;

  const subscribe = async (e) => {
    e.preventDefault();
    try {
      const r = await post("/subscribe", { email });
      setMsg(r.message);
      setEmail("");
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <footer className="ft2">
      {on(s, "footer_show_newsletter") && (
        <div className="ftn">
          <div>
            <h3>{s.newsletter_title}</h3>
            <p>{s.newsletter_text}</p>
          </div>
          <form onSubmit={subscribe}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={s.newsletter_placeholder}
              aria-label="Email"
            />
            <button className="cta" data-c="JOIN">
              {s.newsletter_button}
            </button>
            {msg && <small className="mono">{msg}</small>}
          </form>
        </div>
      )}
       <div className="fb">
        {big}
        <i>.</i>
      </div>
      <div className="ftg">
        <div className="ftb">
          <TLink to="/" className="logo">
            <Logo big />
          </TLink>
          <p>{s.footer_about}</p>
          <div className="socials">
            {social.map((x) => (
              <a
                key={x.url}
                href={x.url}
                target="_blank"
                rel="noreferrer"
                aria-label={x.label || NAMES[x.platform]}
                title={x.label || NAMES[x.platform]}
              >
                <SocialIcon platform={x.platform} />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mono">{s.footer_links_title}</h4>
          {links.map(([to, t]) => (
            <TLink key={to} to={to}>
              {t}
            </TLink>
          ))}
        </div>
        <div>
          <h4 className="mono">{s.footer_social_title}</h4>
          {social.map((x) => (
            <a key={x.url} href={x.url} target="_blank" rel="noreferrer">
              {x.label || NAMES[x.platform]} ↗
            </a>
          ))}
        </div>
        <div>
          <h4 className="mono">{s.footer_contact_title}</h4>
          {s.public_email && (
            <a href={`mailto:${s.public_email}`}>{s.public_email}</a>
          )}
          {s.phone && <a href={`tel:${s.phone}`}>{s.phone}</a>}
          <span>{s.location}</span>
          <span>{s.availability_text}</span>
        </div>
      </div>
     
      <div className="ft mono">
        <span>{fmt(s.footer_copyright, s)}</span>
        <span>{s.footer_text}</span>
        <span>{s.footer_text2}</span>
      </div>
    </footer>
  );
}
