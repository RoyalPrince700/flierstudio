import { PortraitPlaceholder } from '../../../components/placeholders'
import { MalikFooter, MalikHeader, mgVars } from '../shared/MalikChrome'
import '../malik-templates.css'

/** Variation: motivational lifestyle — two-tone headline + person hero */
export default function WeekPlans() {
  return (
    <article className="mg" style={mgVars({ background: 'linear-gradient(180deg, #f7f8fb 0%, #e9edf4 100%)' })}>
      <div className="mg__safe">
        <MalikHeader />
        <div className="mg__headline-block">
          <h1 className="mg__headline">
            New week
            <br />
            <span className="mg__blue">bigger plans</span>
          </h1>
          <p className="mg__support">Start sharp. The right device sets the tone.</p>
        </div>
        <div className="mg__stage">
          <div className="mg-week__hero">
            <div className="mg-week__sky" aria-hidden />
            <PortraitPlaceholder
              name=""
              width={460}
              aspect="3 / 4"
              shape="soft"
              variant="flat"
              accent="#0b5fff"
              style={{ '--ph-surface': '#d7e4ff', position: 'relative', zIndex: 1 }}
            />
          </div>
        </div>
        <MalikFooter />
      </div>
    </article>
  )
}
