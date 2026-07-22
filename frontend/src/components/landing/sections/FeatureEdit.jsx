import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, ImagePlus } from 'lucide-react'
import { fadeUp, viewportOnce } from '../motion'

const HEADLINES = ['EMERGENCE', 'LAUNCH DAY', 'ON AIR 9PM', 'BIG DROP']

/** Types each headline out, holds it, deletes it, then moves to the next. */
function useTypewriter(words, { typeMs = 90, holdMs = 1600, deleteMs = 45 } = {}) {
  const [wordIndex, setWordIndex] = useState(0)
  const [text, setText] = useState('')
  const [phase, setPhase] = useState('typing')

  useEffect(() => {
    const word = words[wordIndex]
    let timer

    if (phase === 'typing') {
      if (text.length < word.length) {
        timer = setTimeout(() => setText(word.slice(0, text.length + 1)), typeMs)
      } else {
        timer = setTimeout(() => setPhase('deleting'), holdMs)
      }
    } else if (text.length > 0) {
      timer = setTimeout(() => setText(word.slice(0, text.length - 1)), deleteMs)
    } else {
      setWordIndex((i) => (i + 1) % words.length)
      setPhase('typing')
    }

    return () => clearTimeout(timer)
  }, [text, phase, wordIndex, words, typeMs, holdMs, deleteMs])

  return text
}

export default function FeatureEdit() {
  const headline = useTypewriter(HEADLINES)

  return (
    <section className="landing-section" id="editing">
      <div className="landing-wrap landing-section__grid landing-section__grid--flip">
        <motion.div
          className="edit-visual"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="edit-card">
            <div className="edit-card__kicker">KINESIS · 2026</div>
            <div className="edit-card__headline">
              <span className="edit-card__tag">Editing headline</span>
              {headline}
              <motion.span
                className="edit-card__caret"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </div>
            <p className="edit-card__body">
              Click any line of copy on the artboard and type. The layout holds
              itself together while you write.
            </p>
            <div className="edit-card__slot">
              <ImagePlus size={15} />
              Click to add speaker photo
            </div>
            <span className="edit-card__chip">REGISTER FREE</span>
          </div>
        </motion.div>

        <motion.div
          className="landing-section__copy"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <p className="landing-eyebrow">In-place editing</p>
          <h2 className="landing-h2">Click any text. It&rsquo;s yours.</h2>
          <p className="landing-lead">
            No dialogs, no forms. Headlines, dates, speaker names — everything
            on the flier is live text you edit right on the canvas, exactly
            where it will print.
          </p>
          <ul className="landing-feature-list">
            <li>
              <Check size={17} strokeWidth={2.6} />
              <span>
                <strong>Editable image slots.</strong> Drop in photos and logos
                with a click — upload chrome disappears on export.
              </span>
            </li>
            <li>
              <Check size={17} strokeWidth={2.6} />
              <span>
                <strong>Inspector panel.</strong> Prefer typing in a sidebar?
                Every field is mirrored in the studio inspector.
              </span>
            </li>
            <li>
              <Check size={17} strokeWidth={2.6} />
              <span>
                <strong>Undo everything.</strong> Full history per artboard, so
                you can experiment without fear.
              </span>
            </li>
          </ul>
        </motion.div>
      </div>
    </section>
  )
}
