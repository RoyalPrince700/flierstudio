import { Mic, Volume2 } from 'lucide-react'
import { RadioBrand, RadioCta, rsVars } from '../shared/RadioChrome'
import { gridField, radioshow } from '../tokens'
import '../radioshow-templates.css'

/** Variation: blue grid + black polygon slab + floating audio icons */
export default function OnAirSlab() {
  const t = radioshow

  return (
    <article
      className="rs rs-air"
      style={rsVars({
        ...gridField(t.colors.blue, t.colors.blueGrid),
      })}
    >
      <div className="rs__safe">
        <div className="rs-air__stage">
          <div className="rs-air__slab">
            <h1 className="rs-air__display">
              On
              <br />
              air
            </h1>
            <p className="rs-air__support">
              Real talks on craft, creativity, and building a career you mean.
            </p>
          </div>

          <div className="rs-air__cta">
            <RadioCta shadow={false} />
          </div>

          <div className="rs-air__icons" aria-hidden>
            <span className="rs-air__icon">
              <Volume2 size={52} strokeWidth={2.75} />
            </span>
            <span className="rs-air__icon rs-air__icon--green">
              <Mic size={52} strokeWidth={2.75} />
            </span>
            <span className="rs-air__icon rs-air__icon--dark">
              <Mic size={52} strokeWidth={2.75} />
            </span>
          </div>
        </div>

        <div className="rs-air__footer">
          <RadioBrand ink="light" />
        </div>
      </div>
    </article>
  )
}
