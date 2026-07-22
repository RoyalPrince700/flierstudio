import { motion } from 'framer-motion'
import { Check, CheckCircle2, FileImage } from 'lucide-react'
import { fadeUp, viewportOnce } from '../motion'

export default function FeatureExport() {
  return (
    <section className="landing-section" id="export">
      <div className="landing-wrap landing-section__grid">
        <motion.div
          className="landing-section__copy"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <p className="landing-eyebrow">HD export</p>
          <h2 className="landing-h2">Pixel-perfect files, every time</h2>
          <p className="landing-lead">
            One shortcut renders your artboard at up to 4× resolution — studio
            chrome stripped, edits baked in, ready to post the second it
            downloads.
          </p>
          <ul className="landing-feature-list">
            <li>
              <Check size={17} strokeWidth={2.6} />
              <span>
                <strong>PNG or JPG.</strong> Transparent-safe PNG or lean JPG
                with a clean white base.
              </span>
            </li>
            <li>
              <Check size={17} strokeWidth={2.6} />
              <span>
                <strong>2×, 3× and 4× scales.</strong> A 1080 × 1350 portrait
                exports as sharp as 4320 × 5400.
              </span>
            </li>
            <li>
              <Check size={17} strokeWidth={2.6} />
              <span>
                <strong>True 1:1 render.</strong> What you designed is exactly
                what leaves the studio — no resampling surprises.
              </span>
            </li>
          </ul>
        </motion.div>

        <motion.div
          className="export-visual"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="export-panel">
            <div className="export-panel__row">
              <span className="export-panel__label">Format</span>
              <div className="export-panel__chips">
                <span className="export-chip export-chip--on">PNG</span>
                <span className="export-chip">JPG</span>
              </div>
            </div>
            <div className="export-panel__row">
              <span className="export-panel__label">HD scale</span>
              <div className="export-panel__chips">
                <span className="export-chip">2×</span>
                <span className="export-chip export-chip--on">3×</span>
                <span className="export-chip">4×</span>
              </div>
            </div>

            <div className="export-panel__res">
              3240 × 4050 <small>from 1080 × 1350</small>
            </div>

            <div className="export-panel__barTrack">
              <motion.div
                className="export-panel__barFill"
                initial={{ width: '0%' }}
                whileInView={{ width: '100%' }}
                viewport={viewportOnce}
                transition={{ duration: 1.6, ease: 'easeInOut', delay: 0.4 }}
              />
            </div>

            <motion.div
              className="export-panel__done"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={viewportOnce}
              transition={{ delay: 2.1, duration: 0.4 }}
            >
              <CheckCircle2 size={16} />
              emergence-classic.png downloaded
            </motion.div>
          </div>

          <div className="export-files">
            <span className="export-file">
              <FileImage size={15} />
              emergence-classic.png
            </span>
            <span className="export-file">
              <FileImage size={15} />
              flagship-tray.jpg
            </span>
            <span className="export-file">
              <FileImage size={15} />
              compass-onair.png
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
