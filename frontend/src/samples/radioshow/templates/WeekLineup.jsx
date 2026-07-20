import { RadioBrand, RadioCta, rsVars } from '../shared/RadioChrome'
import { gridField, radioshow } from '../tokens'
import '../radioshow-templates.css'

const GUESTS = [
  { date: '13 JUN', name: 'Alex Rivera', role: 'Product engineer', time: '19H', tone: 'blue' },
  { date: '15 JUN', name: 'Jordan Blake', role: 'Voice actor', time: '19H', tone: 'green' },
  { date: '16 JUN', name: 'Sam Ortega', role: 'Graphic designer', time: '19H', tone: 'blue' },
]

/** Variation: orange grid + stacked weekly guest schedule cards */
export default function WeekLineup() {
  const t = radioshow

  return (
    <article
      className="rs rs-week"
      style={rsVars({
        ...gridField(t.colors.orange, t.colors.orangeGrid),
      })}
    >
      <div className="rs__safe">
        <div className="rs-week__titles" aria-hidden={false}>
          <span className="rs-week__plate rs-week__plate--top">This week&apos;s</span>
          <span className="rs-week__plate rs-week__plate--bot">lineup</span>
        </div>

        <div className="rs-week__list">
          {GUESTS.map((guest) => (
            <div
              key={guest.date + guest.name}
              className={`rs-week__row rs-week__row--${guest.tone}`}
            >
              <div className="rs-week__date">{guest.date}</div>
              <div className="rs-week__guest">
                <p className="rs-week__name">{guest.name}</p>
                <p className="rs-week__role">{guest.role}</p>
              </div>
              <div className="rs-week__time">{guest.time}</div>
            </div>
          ))}
        </div>

        <div className="rs-week__cta-wrap">
          <RadioCta tone="green" />
        </div>

        <div className="rs-week__footer">
          <RadioBrand ink="light" />
        </div>
      </div>
    </article>
  )
}
