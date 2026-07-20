import { ImagePlaceholder } from '../../../components/placeholders'
import { MalikFooter, MalikHeader, mgVars } from '../shared/MalikChrome'
import '../malik-templates.css'

/** Variation: deep blue split — copy left, lifestyle crop right + quality seal */
export default function PocketSplit() {
  return (
    <article className="mg mg-pocket" style={mgVars()}>
      <div className="mg__safe">
        <MalikHeader ink="light" />
        <div className="mg-pocket__layout">
          <div className="mg-pocket__copy">
            <h1 className="mg__headline">
              Your pocket
              <br />
              deserves better
              <span className="mg__swoosh" aria-hidden />
            </h1>
            <p className="mg__support">Carry devices that keep up with your pace.</p>
          </div>
          <div className="mg-pocket__media">
            <span className="mg__badge">
              Quality pick
              <small>★★★</small>
            </span>
            <ImagePlaceholder
              label="Lifestyle"
              width={480}
              aspect="4 / 5"
              radius={28}
              style={{
                '--ph-surface': 'linear-gradient(160deg,#2a3a55,#121820)',
                '--ph-border': '0',
                '--ph-ink': 'rgba(255,255,255,0.7)',
              }}
            />
          </div>
        </div>
        <MalikFooter />
      </div>
    </article>
  )
}
