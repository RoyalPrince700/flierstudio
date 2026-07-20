import { ImagePlaceholder } from '../../../components/placeholders'
import { RadioBrand, RadioCta, rsVars } from '../shared/RadioChrome'
import { gridField, radioshow } from '../tokens'
import '../radioshow-templates.css'

/** Variation: green grid + long-shadow title + mic hero */
export default function MicHero() {
  const t = radioshow

  return (
    <article
      className="rs rs-mic"
      style={rsVars({
        ...gridField(t.colors.green, t.colors.greenGrid),
      })}
    >
      <div className="rs__safe">
        <div className="rs-mic__layout">
          <div className="rs-mic__copy">
            <h1 className="rs-mic__display">
              Best
              <br />
              podcast
            </h1>
            <p className="rs-mic__support">Real content. No filler.</p>
            <RadioCta shadow={false} />
          </div>

          <div className="rs-mic__prop">
            <div className="rs-mic__prop-frame">
              <ImagePlaceholder
                label="Mic"
                width={400}
                height={740}
                aspect="400 / 740"
                radius={0}
                showLabel
                style={{
                  width: '100%',
                  height: '100%',
                  background: 'transparent',
                }}
              />
            </div>
          </div>
        </div>

        <div className="rs-mic__footer">
          <RadioBrand ink="dark" />
        </div>
      </div>
    </article>
  )
}
