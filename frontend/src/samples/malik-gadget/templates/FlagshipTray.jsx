import { ImagePlaceholder } from '../../../components/placeholders'
import { MalikFooter, MalikHeader, mgVars } from '../shared/MalikChrome'
import '../malik-templates.css'

/** Variation: glossy brand tray with three product slots */
export default function FlagshipTray() {
  return (
    <article className="mg" style={mgVars({ background: 'linear-gradient(180deg, #f7f8fa 0%, #eef0f4 100%)' })}>
      <div className="mg__safe">
        <MalikHeader />
        <div className="mg__headline-block">
          <h1 className="mg__headline">Which one fits you?</h1>
          <p className="mg__support">Every flagship has a different vibe.</p>
        </div>
        <div className="mg__stage">
          <div className="mg-tray__shelf">
            <div className="mg-tray__logos">
              <span className="mg-tray__logo-chip">A</span>
              <span className="mg-tray__logo-chip">S</span>
              <span className="mg-tray__logo-chip">G</span>
            </div>
            {[0, 1, 2].map((i) => (
              <div key={i} className="mg-tray__slot">
                <ImagePlaceholder
                  label="Phone"
                  width={180}
                  aspect="9 / 16"
                  radius={18}
                  style={{
                    '--ph-surface': 'rgba(255,255,255,0.2)',
                    '--ph-border': '1px solid rgba(255,255,255,0.35)',
                    '--ph-ink': '#fff',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        <MalikFooter />
      </div>
    </article>
  )
}
