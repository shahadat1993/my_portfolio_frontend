import { useEffect, useState } from "react";
import Clock from "../components/Clock";
import SocialIcon, { NAMES } from "../components/SocialIcon";
import { Cards, CtaBand, Faqs, K } from "../components/Bits";
import { SplitChars } from "../lib/utils";
import { fmt, on } from "../lib/settings";
import { post } from "../api";
import { useGsap, flipTitle, revealRv } from "../hooks/useGsap";
import { useSeo } from "../components/Seo";
import { useSite } from "../context/Site";

export default function Contact() {
  const { settings: s, faqs, social } = useSite();
  const types = s.contact_types || [],
    budgets = s.contact_budgets || [];
  const [f, setF] = useState({
    name: "",
    email: "",
    message: "",
    project_type: types[0] || "",
    budget: budgets[1] || budgets[0] || "",
    website: "",
  });
  const [state, setState] = useState({ busy: false, ok: null, msg: "" });
  useSeo({
    title: s.contact_seo_title || s.nav_contact,
    raw: !!s.contact_seo_title,
    description: s.contact_seo_description,
    image: s.contact_seo_image,
    noindex: s.contact_seo_noindex === "1",
  });
  useEffect(() => {
    setF((x) => ({
      ...x,
      project_type: x.project_type || types[0] || "",
      budget: x.budget || budgets[1] || budgets[0] || "",
    }));
  }, [s.contact_types, s.contact_budgets]); // eslint-disable-line
  const up = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const ref = useGsap((root) => {
    flipTitle(root);
    revealRv(root);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setState({ busy: true, ok: null, msg: "" });
    try {
      const r = await post("/contact", f);
      setState({
        busy: false,
        ok: true,
        msg: r.message || s.contact_f_success,
      });
      setF({ ...f, name: "", email: "", message: "" });
    } catch (err) {
      const first = err.errors ? Object.values(err.errors)[0][0] : err.message;
      setState({ busy: false, ok: false, msg: first });
    }
  };
  const Pick = ({ k, list }) => (
    <div className="chips sel">
      {list.map((v) => (
        <button
          type="button"
          key={v}
          className={f[k] === v ? "on" : ""}
          onClick={() => setF({ ...f, [k]: v })}
        >
          {v}
        </button>
      ))}
    </div>
  );

  return (
    <div className="pg" ref={ref}>
      <section className="pt">
        <span className="mono">{s.contact_head_kicker}</span>
        <h1>
          <SplitChars>
            {s.contact_head_title} <em>{s.contact_head_accent}</em>
          </SplitChars>
        </h1>
        <p className="lead rv">{s.contact_lead}</p>
        <div className="cg">
          <form className="fm" onSubmit={submit}>
            <input
              className="rv"
              placeholder={s.contact_f_name}
              required
              value={f.name}
              onChange={up("name")}
            />
            <input
              className="rv"
              type="email"
              placeholder={s.contact_f_email}
              required
              value={f.email}
              onChange={up("email")}
            />
            {types.length > 0 && (
              <div className="grp rv">
                <small className="mono">{s.contact_f_type_label}</small>
                <Pick k="project_type" list={types} />
              </div>
            )}
            {budgets.length > 0 && (
              <div className="grp rv">
                <small className="mono">{s.contact_f_budget_label}</small>
                <Pick k="budget" list={budgets} />
              </div>
            )}
            <textarea
              className="rv"
              rows="5"
              placeholder={s.contact_f_message}
              required
              minLength={10}
              value={f.message}
              onChange={up("message")}
            />
            <input
              className="hp"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={f.website}
              onChange={up("website")}
              placeholder="website"
            />
            <button
              className="cta mag rv"
              style={{ justifySelf: "start" }}
              data-c="SEND"
              disabled={state.busy}
            >
              {state.busy ? s.contact_f_sending : s.contact_f_button}
            </button>
            {state.ok !== null && (
              <div className={`form-msg ${state.ok ? "ok" : "bad"}`}>
                {state.msg}
              </div>
            )}
          </form>
          {on(s, "contact_info_show") && (
            <div className="ci rv">
              <div>
                <small className="mono">{fmt(s.contact_info_time, s)}</small>
                <Clock />
              </div>
              {s.public_email && (
                <a
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(s.public_email)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <small className="mono">{s.contact_info_email}</small>
                  {s.public_email}
                </a>
              )}

              {s.phone && (
                <a
                  href={`https://wa.me/${s.phone.replace(/[^0-9]/g, "").replace(/^0/, "880")}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <small className="mono">{s.contact_info_phone}</small>
                  {s.phone}
                </a>
              )}
              {social.map((x) => (
                <a key={x.url} href={x.url} target="_blank" rel="noreferrer">
                  <small className="mono">
                    ({(NAMES[x.platform] || x.platform).toUpperCase()})
                  </small>
                  <SocialIcon platform={x.platform} />{" "}
                  {x.label || NAMES[x.platform]} ↗
                </a>
              ))}
              {s.availability_text && (
                <div>
                  <small className="mono">{s.contact_info_avail}</small>
                  {s.availability_text}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      {on(s, "contact_steps_show") && (
        <section>
          <K
            n="01"
            left={s.contact_steps_label}
            right={s.contact_steps_right}
          />
          <Cards items={s.contact_steps} />
        </section>
      )}
      {on(s, "contact_engage_show") && (
        <section>
          <K
            n="02"
            left={s.contact_engage_label}
            right={s.contact_engage_right}
          />
          <Cards items={s.contact_engage} className="eng" />
        </section>
      )}
      {on(s, "contact_faq_show") && (
        <section>
          <K n="03" left={s.contact_faq_label} right={s.contact_faq_right} />
          <Faqs items={faqs.filter((q) => q.scope === "contact")} />
        </section>
      )}
      {on(s, "contact_cta_show") && <CtaBand />}
    </div>
  );
}
