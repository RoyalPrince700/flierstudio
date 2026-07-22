import {
  Download,
  Frame,
  Hand,
  Image as ImageIcon,
  Layers,
  MousePointer2,
  Type,
} from 'lucide-react'
import EditableText from '../../../components/studio/EditableText'
import { editableTextProps } from '../../../components/studio/editableTextProps'
import { fsTokens } from '../../../design/flierStudioTokens'
import { AppIconTile, LiftoffMark, LogoHorizontal, LogoStacked, Wordmark } from '../FSLogo'
import LandscapeShell from './LandscapeShell'
import './fs-l-boards.css'

const C = fsTokens.colors

/* ------------------------------------------------------------------ */
/* 14 — Digital applications (social + web)                            */
/* ------------------------------------------------------------------ */
export function LDigitalBoard({
  headline = 'A feed and a homepage that look like one hand made them.',
  handle = '@flierstudio',
  bio = 'The design studio for social fliers.',
  heroTitle = 'Start with a template. Make it yours.',
  heroSub = 'Thousands of layouts ready — change the words, photos, and colors.',
  studioEdit,
}) {
  return (
    <LandscapeShell index="14" chapter="Digital">
      <div className="fl-dig">
        <EditableText
          as="h1"
          className="fsl-display fl-dig__headline"
          value={headline}
          {...editableTextProps(studioEdit, 'headline')}
        />
        <div className="fl-dig__stage">
          <div className="fl-dig__phone">
            <div className="fl-dig__profile">
              <AppIconTile size={64} />
              <div>
                <EditableText
                  as="p"
                  className="fl-dig__handle"
                  value={handle}
                  {...editableTextProps(studioEdit, 'handle')}
                />
                <EditableText
                  as="p"
                  className="fl-dig__bio"
                  value={bio}
                  {...editableTextProps(studioEdit, 'bio')}
                />
              </div>
            </div>
            <div className="fl-dig__grid">
              <div className="fl-dig__post fl-dig__post--signal">
                <LiftoffMark size={28} base={C.ink} corner={C.paper} />
                <span>Start with a template.</span>
              </div>
              <div className="fl-dig__post fl-dig__post--ink">
                <span>Make it yours.</span>
              </div>
              <div className="fl-dig__post fl-dig__post--paper">
                <LogoStacked markSize={40} />
              </div>
              <div className="fl-dig__post fl-dig__post--cobalt">
                <span>Export at 3×.</span>
              </div>
            </div>
          </div>
          <div className="fl-dig__browser">
            <div className="fl-dig__chrome">
              <span className="fl-dig__dot" />
              <span className="fl-dig__dot" />
              <span className="fl-dig__dot" />
              <span className="fl-dig__url">flierstudio.design</span>
            </div>
            <div className="fl-dig__page">
              <div className="fl-dig__nav">
                <LogoHorizontal height={22} />
                <span className="fl-dig__nav-cta">Sign in</span>
              </div>
              <EditableText
                as="h2"
                className="fl-dig__hero-title"
                value={heroTitle}
                {...editableTextProps(studioEdit, 'heroTitle')}
              />
              <EditableText
                as="p"
                className="fl-dig__hero-sub"
                value={heroSub}
                {...editableTextProps(studioEdit, 'heroSub')}
              />
              <span className="fl-dig__hero-btn">Open the studio</span>
            </div>
          </div>
        </div>
      </div>
    </LandscapeShell>
  )
}

/* ------------------------------------------------------------------ */
/* 15 — Product + print applications                                   */
/* ------------------------------------------------------------------ */
export function LApplicationsBoard({
  headline = 'Chrome recedes. Work glows. Print remembers.',
  note = 'Ink surfaces, Paper text, one Signal accent — then stationery and merch that stay typographic and flat.',
  teeLine = 'STOP THE SCROLL',
  name = 'Ada Okoye',
  role = 'Brand Design Lead',
  studioEdit,
}) {
  return (
    <LandscapeShell index="15" chapter="Applications">
      <div className="fl-app">
        <div className="fl-app__head">
          <EditableText
            as="h1"
            className="fsl-display fl-app__headline"
            value={headline}
            {...editableTextProps(studioEdit, 'headline')}
          />
          <EditableText
            as="p"
            className="fsl-copy fsl-copy--muted"
            value={note}
            {...editableTextProps(studioEdit, 'note')}
          />
        </div>
        <div className="fl-app__stage">
          <div className="fl-app__desktop">
            <div className="fl-app__topbar">
              <span className="fl-app__brand">
                <LiftoffMark size={16} base={C.paper} corner={C.signal} />
                Flier Studio
              </span>
              <span className="fl-app__export">
                <Download size={11} strokeWidth={2.4} /> Export
              </span>
            </div>
            <div className="fl-app__work">
              <div className="fl-app__rail">
                <span className="fl-app__tool fl-app__tool--active">
                  <MousePointer2 size={13} strokeWidth={2} />
                </span>
                <span className="fl-app__tool">
                  <Type size={13} strokeWidth={2} />
                </span>
                <span className="fl-app__tool">
                  <Hand size={13} strokeWidth={2} />
                </span>
                <span className="fl-app__tool">
                  <ImageIcon size={13} strokeWidth={2} />
                </span>
                <span className="fl-app__tool">
                  <Frame size={13} strokeWidth={2} />
                </span>
              </div>
              <div className="fl-app__canvas">
                <div className="fl-app__artboard">
                  <span className="fl-app__artboard-label">1080×1350</span>
                  <span className="fl-app__mini-title">Emergence</span>
                </div>
              </div>
              <div className="fl-app__inspector">
                <span>
                  <Layers size={11} /> Inspector
                </span>
                <span className="fl-app__field" />
                <span className="fl-app__field fl-app__field--short" />
              </div>
            </div>
          </div>
          <div className="fl-app__print">
            <div className="fl-app__card">
              <LiftoffMark size={40} base={C.paper} corner={C.signal} />
              <div>
                <EditableText
                  as="p"
                  className="fl-app__card-name"
                  value={name}
                  {...editableTextProps(studioEdit, 'name')}
                />
                <EditableText
                  as="p"
                  className="fl-app__card-role"
                  value={role}
                  {...editableTextProps(studioEdit, 'role')}
                />
              </div>
            </div>
            <div className="fl-app__tee">
              <LiftoffMark size={32} base={C.paper} corner={C.signal} />
              <EditableText
                as="span"
                className="fl-app__tee-line"
                value={teeLine}
                {...editableTextProps(studioEdit, 'teeLine')}
              />
            </div>
            <div className="fl-app__tote">
              <LogoStacked markSize={48} base={C.ink} corner={C.signal} text={C.ink} />
            </div>
            <div className="fl-app__doc">
              <LiftoffMark size={28} base={C.ink} corner={C.signal} />
              <Wordmark size={18} color={C.ink} />
              <span>Brand Guidelines</span>
            </div>
          </div>
        </div>
      </div>
    </LandscapeShell>
  )
}
