import EditableText from '../../components/studio/EditableText'
import { editableTextProps } from '../../components/studio/editableTextProps'
import { fsTokens } from '../../design/flierStudioTokens'
import BoardShell from './BoardShell'
import { MARK_CORNER_PATH, MARK_TILE_PATH, Wordmark } from './FSLogo'
import './fs-boards.css'

const C = fsTokens.colors

function Frame1() {
  return (
    <svg width="100%" viewBox="0 0 96 96" fill="none">
      <rect x="24" y="24" width="48" height="48" rx="12" stroke={C.paper} strokeWidth="1.4" strokeDasharray="4 4" opacity="0.5" />
    </svg>
  )
}
function Frame2() {
  return (
    <svg width="100%" viewBox="0 0 96 96" fill="none">
      <g transform="translate(48 48) scale(0.86) translate(-48 -48)">
        <rect x="12" y="12" width="72" height="72" rx="18" fill={C.paper} />
      </g>
    </svg>
  )
}
function Frame3() {
  return (
    <svg width="100%" viewBox="0 0 96 96" fill="none">
      <rect x="12" y="12" width="72" height="72" rx="18" fill={C.paper} />
      <line x1="46" y1="10" x2="86" y2="50" stroke={C.signal} strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
function Frame4() {
  return (
    <svg width="100%" viewBox="0 0 96 96" fill="none">
      <path d={MARK_TILE_PATH} fill={C.paper} />
      <path d="M55 10 L68 10 Q86 10 86 28 L86 41 Z" fill={C.signal} />
      <path d="M63 2 L76 2 Q94 2 94 20 L94 33 Z" fill={C.signal} opacity="0.28" />
    </svg>
  )
}
function Frame5() {
  return (
    <svg width="100%" viewBox="0 0 96 96" fill="none">
      <path d={MARK_TILE_PATH} fill={C.paper} />
      <path d={MARK_CORNER_PATH} fill={C.signal} />
    </svg>
  )
}

const FRAMES = [
  ['00:00', 'Empty artboard — dashed frame breathes in', Frame1],
  ['00:12', 'The tile lands · scale 86 → 100 · ease-out-quint', Frame2],
  ['00:26', 'The slice — a Signal stroke cuts the 45° diagonal', Frame3],
  ['00:34', 'Liftoff — corner peels up-right with motion trail', Frame4],
  ['00:48', 'Settle · wordmark fades in · hold & loop', Frame5],
]

/* ------------------------------------------------------------------ */
/* 14 — Motion-logo storyboard                                         */
/* ------------------------------------------------------------------ */
export default function FSMotionBoard({
  headline = 'The mark animates the way the product feels.',
  note = 'One idea, 1.2 seconds: the artboard lands, the diagonal cuts, the corner lifts off. Peels use ease-out-quint (240 ms in product UI); nothing bounces, nothing spins. The loop idles by drifting the corner ±4 px along its diagonal every 6 s.',
  studioEdit,
}) {
  return (
    <BoardShell index="14" chapter="Motion" theme="ink">
      <div className="fs-mot">
        <EditableText
          as="h1"
          className="fsb-display fs-mot__headline"
          value={headline}
          {...editableTextProps(studioEdit, 'headline')}
        />
        <EditableText
          as="p"
          className="fsb-copy fsb-copy--muted fs-mot__note"
          value={note}
          {...editableTextProps(studioEdit, 'note')}
        />
        <div className="fs-mot__frames">
          {FRAMES.map(([time, caption, Comp], i) => (
            <div key={time} className="fs-mot__frame">
              <div className="fs-mot__stage">
                <Comp />
                {i === 4 ? (
                  <div className="fs-mot__stage-word">
                    <Wordmark size={13} color={C.paper} />
                  </div>
                ) : null}
              </div>
              <span className="fs-mot__time">{time}</span>
              <span className="fs-mot__caption">{caption}</span>
            </div>
          ))}
        </div>
        <div className="fs-mot__principles">
          {[
            ['Purposeful', 'Motion explains — reveals, transitions, exports. Never idle decoration.'],
            ['Diagonal', 'Things enter and exit along the 45° liftoff axis.'],
            ['Fast', '240 ms standard · 480 ms for hero reveals · ease-out-quint.'],
          ].map(([title, copy]) => (
            <div key={title} className="fs-mot__principle">
              <span className="fs-mot__principle-title">{title}</span>
              <span className="fs-mot__principle-copy">{copy}</span>
            </div>
          ))}
        </div>
      </div>
    </BoardShell>
  )
}
