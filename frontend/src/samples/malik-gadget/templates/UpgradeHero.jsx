import { Headphones, Smartphone } from 'lucide-react'
import { PortraitPlaceholder } from '../../../components/placeholders'
import { MalikFooter, MalikHeader, mgVars } from '../shared/MalikChrome'
import '../malik-templates.css'

/** Variation: lifestyle person hero + highlight mark on headline words */
export default function UpgradeHero() {
  return (
    <article className="mg" style={mgVars({ background: 'linear-gradient(180deg, #fafafa 0%, #eceef2 100%)' })}>
      <div className="mg__safe">
        <MalikHeader />
        <div className="mg__headline-block">
          <h1 className="mg__headline">
            Your next <span className="mg__mark">upgrade is</span> closer than you think.
          </h1>
          <p className="mg__support">Premium devices, fair prices, zero stress.</p>
        </div>
        <div className="mg__stage">
          <div className="mg-upgrade__hero">
            <div className="mg-upgrade__glow" aria-hidden />
            <PortraitPlaceholder
              name=""
              width={420}
              aspect="3 / 4"
              shape="soft"
              variant="flat"
              accent="#ff2d7b"
              style={{ '--ph-surface': '#f3d5e4', position: 'relative', zIndex: 1 }}
            />
            <div className="mg__bubbles" aria-hidden>
              <span className="mg__bubble" style={{ left: 80, top: 80, '--bubble-bg': '#ffe3ef' }}>
                <Smartphone size={34} strokeWidth={1.75} />
              </span>
              <span className="mg__bubble" style={{ right: 60, top: 180, '--bubble-bg': '#e8f0ff' }}>
                <Headphones size={34} strokeWidth={1.75} />
              </span>
            </div>
          </div>
        </div>
        <MalikFooter />
      </div>
    </article>
  )
}
