import { motion } from 'framer-motion'
import { FolderOpen, PenLine, Send } from 'lucide-react'
import { childUp, fadeUp, staggerChildren, viewportOnce } from '../motion'

const STEPS = [
  {
    icon: FolderOpen,
    num: '01',
    title: 'Open a brand board',
    copy: 'Pick a project — or start from the sample library — and the studio drops you onto its artboards, sized for the platform you post on.',
  },
  {
    icon: PenLine,
    num: '02',
    title: 'Make it yours',
    copy: 'Click headlines and type. Click image slots and upload. Your drafts save automatically as you go, per artboard.',
  },
  {
    icon: Send,
    num: '03',
    title: 'Export and post',
    copy: 'Hit Ctrl + E, choose PNG or JPG at up to 4× resolution, and your flier lands in downloads ready for the feed.',
  },
]

export default function Workflow() {
  return (
    <section className="landing-section">
      <div className="landing-wrap">
        <motion.div
          className="workflow-head"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <p className="landing-eyebrow">How it works</p>
          <h2 className="landing-h2">From brief to feed in three moves</h2>
          <p className="landing-lead">
            The studio does the layout thinking. You bring the words and the
            photos.
          </p>
        </motion.div>

        <motion.div
          className="workflow-grid"
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {STEPS.map((step) => (
            <motion.div className="workflow-card" key={step.num} variants={childUp}>
              <span className="workflow-card__num">
                <step.icon size={19} />
              </span>
              <h3>
                <span>{step.num}</span>
                {step.title}
              </h3>
              <p>{step.copy}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
