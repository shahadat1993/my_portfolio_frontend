/** "Clean photo" hero effect: your photo with a soft breathing zoom, a vignette and a glow that follows the cursor. */
export default function HeroPhoto({ src }) {
  return <div id="hcv" className="hphoto" aria-hidden="true">{src && <img src={src} alt="" />}</div>;
}
