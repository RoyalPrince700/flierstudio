import { ImagePlaceholder } from '../../../components/placeholders'
import { MalikFooter, MalikHeader, mgVars } from '../shared/MalikChrome'
import '../malik-templates.css'

const ITEMS = [
  { top: 40, left: 80, w: 220, aspect: '16 / 10', label: 'Laptop' },
  { top: 60, right: 70, w: 160, aspect: '9 / 16', label: 'Phone' },
  { top: 210, left: 40, w: 150, aspect: '1 / 1', label: 'Watch' },
  { top: 200, right: 40, w: 180, aspect: '4 / 3', label: 'Console' },
  { top: 360, left: 180, w: 170, aspect: '9 / 16', label: 'Phone' },
  { top: 340, right: 160, w: 200, aspect: '16 / 10', label: 'Tablet' },
]

/** Variation: black premium burst — floating product placeholders + dual-tone headline */
export default function GadgetBurst() {
  return (
    <article className="mg mg-burst" style={mgVars()}>
      <div className="mg__safe">
        <MalikHeader ink="light" />
        <div className="mg__headline-block">
          <h1 className="mg__headline">
            <span className="mg__yellow">The wishlist</span>
            <br />
            <span className="mg__gradient-text">can finally rest</span>
          </h1>
          <p className="mg__support">Claim the gear sitting on your shortlist.</p>
        </div>
        <div className="mg__stage">
          <div className="mg-burst__cluster">
            <span className="mg__badge">
              Quality pick
              <small>★★★</small>
            </span>
            {ITEMS.map((item) => (
              <div
                key={item.label + item.top}
                className="mg-burst__item"
                style={{ top: item.top, left: item.left, right: item.right }}
              >
                <ImagePlaceholder
                  label={item.label}
                  width={item.w}
                  aspect={item.aspect}
                  radius={16}
                  showLabel={false}
                  style={{
                    '--ph-surface': 'linear-gradient(160deg,#2a3340,#12161c)',
                    '--ph-border': '1px solid rgba(120,170,255,0.35)',
                    '--ph-ink': 'rgba(255,255,255,0.55)',
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
