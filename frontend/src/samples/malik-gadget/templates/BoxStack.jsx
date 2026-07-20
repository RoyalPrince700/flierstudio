import { Headphones, Smartphone } from 'lucide-react'
import { MalikFooter, MalikHeader, mgVars } from '../shared/MalikChrome'
import '../malik-templates.css'

/** Variation: white retail — strike-through headline + stacked product boxes */
export default function BoxStack() {
  return (
    <article className="mg" style={mgVars({ background: 'radial-gradient(circle at 50% 40%, #fff 0%, #eef0f4 75%)' })}>
      <div className="mg__safe">
        <MalikHeader />
        <div className="mg__headline-block">
          <h1 className="mg__headline">
            <span className="mg__blue">We sell gadgets,</span>
            <br />
            <span className="mg__strike">not problems</span>
          </h1>
          <p className="mg__support">Solid devices priced for real life.</p>
        </div>
        <div className="mg__stage">
          <div className="mg-boxes__stack">
            <div className="mg-boxes__card mg-boxes__card--a">Console</div>
            <div className="mg-boxes__card mg-boxes__card--b">Laptop</div>
            <div className="mg-boxes__card mg-boxes__card--c">Phone</div>
            <div className="mg__bubbles" aria-hidden>
              <span className="mg__bubble" style={{ left: -10, top: 120, '--bubble-bg': '#ffe3ef' }}>
                <Smartphone size={32} strokeWidth={1.75} />
              </span>
              <span className="mg__bubble" style={{ right: -10, top: 220, '--bubble-bg': '#dce8ff' }}>
                <Headphones size={32} strokeWidth={1.75} />
              </span>
            </div>
          </div>
        </div>
        <MalikFooter />
      </div>
    </article>
  )
}
