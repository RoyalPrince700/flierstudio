import {
  Bell,
  ChevronDown,
  Download,
  Frame,
  Hand,
  Image as ImageIcon,
  Layers,
  MousePointer2,
  Plus,
  Search,
  Type,
} from 'lucide-react'
import EditableText from '../../components/studio/EditableText'
import EditableImageSlot from '../../components/studio/EditableImageSlot'
import { editableTextProps } from '../../components/studio/editableTextProps'
import { fsTokens } from '../../design/flierStudioTokens'
import BoardShell from './BoardShell'
import { AppIconTile, LiftoffMark, LogoHorizontal, LogoStacked, Wordmark } from './FSLogo'
import './fs-apps.css'

const C = fsTokens.colors

/* ------------------------------------------------------------------ */
/* 15 — Social media profile & posts                                   */
/* ------------------------------------------------------------------ */
export function FSSocialBoard({
  headline = 'A feed that looks like one hand made it.',
  handle = '@flierstudio',
  bio = 'The design studio for social fliers. Start with a template — make it yours.',
  post1 = 'Start with a template.',
  post2 = 'Make it yours.',
  post3 = 'Now in the browser',
  post4 = 'Every brand, its own board.',
  post5 = 'Export at 3×.',
  avatarSrc = '',
  studioEdit,
}) {
  return (
    <BoardShell index="15" chapter="Social">
      <div className="fs-soc">
        <EditableText
          as="h1"
          className="fsb-display fs-soc__headline"
          value={headline}
          {...editableTextProps(studioEdit, 'headline')}
        />
        <div className="fs-soc__phone">
          <div className="fs-soc__profile">
            <EditableImageSlot
              path="avatarSrc"
              editable={Boolean(studioEdit?.enabled)}
              focused={studioEdit?.focusedPath === 'avatarSrc'}
              hasImage={Boolean(avatarSrc)}
              onFocusField={studioEdit?.onFocusField}
              onPickImage={studioEdit?.onPickImage}
              emptyHint="Avatar"
              filledHint="Replace"
              className="fs-soc__avatar-slot"
            >
              <div className="fs-soc__avatar">
                {avatarSrc ? (
                  <img src={avatarSrc} alt="" className="fs-soc__avatar-img" />
                ) : (
                  <AppIconTile size={104} />
                )}
              </div>
            </EditableImageSlot>
            <div className="fs-soc__profile-info">
              <EditableText
                as="p"
                className="fs-soc__handle"
                value={handle}
                {...editableTextProps(studioEdit, 'handle')}
              />
              <div className="fs-soc__stats">
                <span>
                  <b>214</b> posts
                </span>
                <span>
                  <b>86.2K</b> followers
                </span>
                <span>
                  <b>12</b> following
                </span>
              </div>
              <EditableText
                as="p"
                className="fs-soc__bio"
                value={bio}
                {...editableTextProps(studioEdit, 'bio')}
              />
            </div>
          </div>
          <div className="fs-soc__actions">
            <span className="fs-soc__btn fs-soc__btn--primary">Follow</span>
            <span className="fs-soc__btn">Message</span>
          </div>
          <div className="fs-soc__grid">
            <div className="fs-soc__post fs-soc__post--signal">
              <LiftoffMark size={40} base={C.ink} corner={C.paper} />
              <EditableText
                as="p"
                className="fs-soc__post-display"
                value={post1}
                {...editableTextProps(studioEdit, 'post1')}
              />
            </div>
            <div className="fs-soc__post fs-soc__post--ink">
              <EditableText
                as="p"
                className="fs-soc__post-display fs-soc__post-display--paper"
                value={post2}
                {...editableTextProps(studioEdit, 'post2')}
              />
              <span className="fs-soc__post-corner" />
            </div>
            <div className="fs-soc__post fs-soc__post--paper">
              <div className="fs-soc__post-hatch" />
              <EditableText
                as="p"
                className="fs-soc__post-caps"
                value={post3}
                {...editableTextProps(studioEdit, 'post3')}
              />
              <LogoStacked markSize={54} />
            </div>
            <div className="fs-soc__post fs-soc__post--cobalt">
              <EditableText
                as="p"
                className="fs-soc__post-display fs-soc__post-display--paper"
                value={post4}
                {...editableTextProps(studioEdit, 'post4')}
              />
            </div>
            <div className="fs-soc__post fs-soc__post--paper fs-soc__post--corners">
              {[0, 1, 2].map((i) => (
                <svg key={i} width="34" height="34" viewBox="0 0 96 96" fill="none">
                  <path
                    d="M59 6 L72 6 Q90 6 90 24 L90 37 Z"
                    fill={i === 1 ? C.signal : C.ink}
                    transform="translate(-101 27) scale(2)"
                  />
                </svg>
              ))}
            </div>
            <div className="fs-soc__post fs-soc__post--ink fs-soc__post--center">
              <EditableText
                as="p"
                className="fs-soc__post-display fs-soc__post-display--signal"
                value={post5}
                {...editableTextProps(studioEdit, 'post5')}
              />
            </div>
          </div>
        </div>
      </div>
    </BoardShell>
  )
}

/* ------------------------------------------------------------------ */
/* 16 — Website / landing application                                  */
/* ------------------------------------------------------------------ */
export function FSWebBoard({
  headline = 'The identity, live at flierstudio.design.',
  heroTitle = 'Start with a template. Make it yours.',
  heroSub = 'Thousands of layouts ready — change the words, photos, and colors.',
  heroCta = 'Open the studio',
  studioEdit,
}) {
  return (
    <BoardShell index="16" chapter="Web" theme="ink">
      <div className="fs-web">
        <EditableText
          as="h1"
          className="fsb-display fs-web__headline"
          value={headline}
          {...editableTextProps(studioEdit, 'headline')}
        />
        <div className="fs-web__browser">
          <div className="fs-web__chrome">
            <span className="fs-web__dot" />
            <span className="fs-web__dot" />
            <span className="fs-web__dot" />
            <span className="fs-web__url">
              <LiftoffMark size={14} base={C.paper} corner={C.signal} /> flierstudio.design
            </span>
          </div>
          <div className="fs-web__page">
            <div className="fs-web__nav">
              <LogoHorizontal height={30} base={C.ink} corner={C.signal} text={C.ink} />
              <div className="fs-web__nav-links">
                <span>Studio</span>
                <span>Samples</span>
                <span>Pricing</span>
                <span className="fs-web__nav-cta">Sign in</span>
              </div>
            </div>
            <div className="fs-web__hero">
              <div className="fs-web__hero-copy">
                <EditableText
                  as="h2"
                  className="fs-web__hero-title"
                  value={heroTitle}
                  {...editableTextProps(studioEdit, 'heroTitle')}
                />
                <EditableText
                  as="p"
                  className="fs-web__hero-sub"
                  value={heroSub}
                  {...editableTextProps(studioEdit, 'heroSub')}
                />
                <span className="fs-web__hero-btn">
                  <EditableText
                    as="span"
                    value={heroCta}
                    {...editableTextProps(studioEdit, 'heroCta')}
                  />
                </span>
              </div>
              <div className="fs-web__hero-art">
                <div className="fs-web__hero-board fs-web__hero-board--back" />
                <div className="fs-web__hero-board">
                  <LiftoffMark size={64} base={C.paper} corner={C.signal} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BoardShell>
  )
}

/* ------------------------------------------------------------------ */
/* 17 — Product UI (desktop studio + mobile)                           */
/* ------------------------------------------------------------------ */
export function FSProductBoard({
  headline = 'Chrome recedes. Work glows.',
  note = 'Ink surfaces, Paper text, one Signal accent for the active tool and primary action — the interface borrows the poster palette but stays quiet so the user’s flier is the loudest thing on screen.',
  studioEdit,
}) {
  return (
    <BoardShell index="17" chapter="Product">
      <div className="fs-prod">
        <EditableText
          as="h1"
          className="fsb-display fs-prod__headline"
          value={headline}
          {...editableTextProps(studioEdit, 'headline')}
        />
        <EditableText
          as="p"
          className="fsb-copy fsb-copy--muted fs-prod__note"
          value={note}
          {...editableTextProps(studioEdit, 'note')}
        />
        <div className="fs-prod__stage">
          <div className="fs-prod__desktop">
            <div className="fs-prod__topbar">
              <span className="fs-prod__topbar-brand">
                <LiftoffMark size={20} base={C.paper} corner={C.signal} />
                <span>Flier Studio</span>
              </span>
              <span className="fs-prod__topbar-doc">
                Emergence 3.0 <ChevronDown size={12} strokeWidth={2.4} />
              </span>
              <span className="fs-prod__topbar-actions">
                <Bell size={13} strokeWidth={2} />
                <span className="fs-prod__export">
                  <Download size={12} strokeWidth={2.4} /> Export
                </span>
              </span>
            </div>
            <div className="fs-prod__work">
              <div className="fs-prod__rail">
                <span className="fs-prod__tool fs-prod__tool--active">
                  <MousePointer2 size={15} strokeWidth={2} />
                </span>
                <span className="fs-prod__tool">
                  <Hand size={15} strokeWidth={2} />
                </span>
                <span className="fs-prod__tool">
                  <Type size={15} strokeWidth={2} />
                </span>
                <span className="fs-prod__tool">
                  <ImageIcon size={15} strokeWidth={2} />
                </span>
                <span className="fs-prod__tool">
                  <Frame size={15} strokeWidth={2} />
                </span>
              </div>
              <div className="fs-prod__canvas">
                <div className="fs-prod__artboard">
                  <span className="fs-prod__artboard-label">Instagram Portrait · 1080×1350</span>
                  <div className="fs-prod__artboard-inner">
                    <span className="fs-prod__mini-eyebrow">AUG 30 · LAGOS</span>
                    <span className="fs-prod__mini-title">Emergence</span>
                    <span className="fs-prod__mini-cta" />
                  </div>
                  <span className="fs-prod__handle fs-prod__handle--tl" />
                  <span className="fs-prod__handle fs-prod__handle--br" />
                </div>
              </div>
              <div className="fs-prod__inspector">
                <span className="fs-prod__inspector-title">
                  <Layers size={12} strokeWidth={2.2} /> Inspector
                </span>
                <span className="fs-prod__field" />
                <span className="fs-prod__field fs-prod__field--short" />
                <span className="fs-prod__swatch-row">
                  <i style={{ background: C.signal }} />
                  <i style={{ background: C.cobalt }} />
                  <i style={{ background: C.ink }} />
                  <i style={{ background: C.paper }} />
                </span>
              </div>
            </div>
          </div>
          <div className="fs-prod__mobile">
            <div className="fs-prod__mobile-notch" />
            <div className="fs-prod__mobile-head">
              <LiftoffMark size={18} base={C.paper} corner={C.signal} />
              <Search size={13} strokeWidth={2.2} />
            </div>
            <p className="fs-prod__mobile-title">Your boards</p>
            <div className="fs-prod__mobile-cards">
              <div className="fs-prod__mobile-card" style={{ background: C.signal }} />
              <div className="fs-prod__mobile-card" style={{ background: C.cobalt }} />
              <div className="fs-prod__mobile-card fs-prod__mobile-card--hatch" />
              <div className="fs-prod__mobile-card" style={{ background: C.graphite }} />
            </div>
            <span className="fs-prod__mobile-fab">
              <Plus size={16} strokeWidth={2.6} />
            </span>
          </div>
        </div>
      </div>
    </BoardShell>
  )
}

/* ------------------------------------------------------------------ */
/* 18 — Business card & stationery                                     */
/* ------------------------------------------------------------------ */
export function FSStationeryBoard({
  headline = 'Print is the origin story.',
  name = 'Ada Okoye',
  role = 'Brand Design Lead',
  email = 'ada@flierstudio.design',
  studioEdit,
}) {
  return (
    <BoardShell index="18" chapter="Stationery" theme="ink">
      <div className="fs-stat">
        <EditableText
          as="h1"
          className="fsb-display fs-stat__headline"
          value={headline}
          {...editableTextProps(studioEdit, 'headline')}
        />
        <div className="fs-stat__stage">
          <div className="fs-stat__card fs-stat__card--front">
            <LiftoffMark size={58} base={C.paper} corner={C.signal} />
            <div className="fs-stat__card-foot">
              <Wordmark size={21} color={C.paper} />
              <span className="fs-stat__card-url">flierstudio.design</span>
            </div>
          </div>
          <div className="fs-stat__card fs-stat__card--back">
            <div className="fs-stat__card-id">
              <EditableText
                as="p"
                className="fs-stat__card-name"
                value={name}
                {...editableTextProps(studioEdit, 'name')}
              />
              <EditableText
                as="p"
                className="fs-stat__card-role"
                value={role}
                {...editableTextProps(studioEdit, 'role')}
              />
            </div>
            <EditableText
              as="p"
              className="fs-stat__card-email"
              value={email}
              {...editableTextProps(studioEdit, 'email')}
            />
            <span className="fs-stat__card-corner" />
          </div>
          <div className="fs-stat__letter">
            <div className="fs-stat__letter-head">
              <LogoHorizontal height={26} />
              <span className="fs-stat__letter-date">21 · 07 · 2026</span>
            </div>
            <div className="fs-stat__letter-lines">
              {[92, 100, 96, 88, 100, 62].map((w, i) => (
                <span key={i} style={{ width: `${w}%` }} />
              ))}
            </div>
            <span className="fs-stat__letter-foot">flierstudio.design · brand@flierstudio.design</span>
          </div>
        </div>
      </div>
    </BoardShell>
  )
}

/* ------------------------------------------------------------------ */
/* 19 — Presentation / document cover                                  */
/* ------------------------------------------------------------------ */
export function FSCoverBoard({
  title = 'Brand Guidelines',
  edition = 'Version 1.0 — 2026',
  studioEdit,
}) {
  return (
    <BoardShell index="19" chapter="Collateral" theme="signal" markBase={C.ink} markCorner={C.paper}>
      <div className="fs-cov">
        <div className="fs-cov__doc">
          <div className="fs-cov__doc-head">
            <LiftoffMark size={54} base={C.ink} corner={C.signal} />
            <span className="fs-cov__doc-index">FS·01</span>
          </div>
          <div className="fs-cov__doc-body">
            <Wordmark size={54} color={C.ink} />
            <EditableText
              as="p"
              className="fs-cov__doc-title"
              value={title}
              {...editableTextProps(studioEdit, 'title')}
            />
          </div>
          <div className="fs-cov__doc-foot">
            <EditableText
              as="span"
              value={edition}
              {...editableTextProps(studioEdit, 'edition')}
            />
            <span>flierstudio.design</span>
          </div>
          <span className="fs-cov__doc-corner" />
        </div>
        <div className="fs-cov__shadow" />
      </div>
    </BoardShell>
  )
}

/* ------------------------------------------------------------------ */
/* 20 — Merch & environment                                            */
/* ------------------------------------------------------------------ */
export function FSMerchBoard({
  headline = 'Worn by people who ship.',
  note = 'Merch stays typographic and flat — the mark, the wordmark, one color per item. Chosen for a digital studio: laptop stickers, a launch tee, and the conference tote.',
  teeLine = 'STOP THE SCROLL',
  studioEdit,
}) {
  return (
    <BoardShell index="20" chapter="Merch">
      <div className="fs-mer">
        <EditableText
          as="h1"
          className="fsb-display fs-mer__headline"
          value={headline}
          {...editableTextProps(studioEdit, 'headline')}
        />
        <EditableText
          as="p"
          className="fsb-copy fsb-copy--muted fs-mer__note"
          value={note}
          {...editableTextProps(studioEdit, 'note')}
        />
        <div className="fs-mer__stage">
          <div className="fs-mer__tee">
            <div className="fs-mer__tee-shape">
              <div className="fs-mer__tee-print">
                <LiftoffMark size={44} base={C.paper} corner={C.signal} />
                <EditableText
                  as="span"
                  className="fs-mer__tee-line"
                  value={teeLine}
                  {...editableTextProps(studioEdit, 'teeLine')}
                />
              </div>
            </div>
            <span className="fsb-label">Launch tee</span>
          </div>
          <div className="fs-mer__col">
            <div className="fs-mer__stickers">
              <span className="fs-mer__sticker fs-mer__sticker--tile">
                <AppIconTile size={74} />
              </span>
              <span className="fs-mer__sticker fs-mer__sticker--word">
                <Wordmark size={19} color={C.paper} />
              </span>
              <span className="fs-mer__sticker fs-mer__sticker--corner">
                <svg width="52" height="52" viewBox="0 0 96 96" fill="none">
                  <path
                    d="M59 6 L72 6 Q90 6 90 24 L90 37 Z"
                    fill={C.signal}
                    transform="translate(-101 5) scale(2)"
                  />
                </svg>
              </span>
            </div>
            <span className="fsb-label">Sticker sheet</span>
          </div>
          <div className="fs-mer__tote">
            <div className="fs-mer__tote-shape">
              <span className="fs-mer__tote-handle" />
              <div className="fs-mer__tote-print">
                <LogoStacked markSize={64} base={C.ink} corner={C.signal} text={C.ink} />
              </div>
            </div>
            <span className="fsb-label">Conference tote</span>
          </div>
        </div>
      </div>
    </BoardShell>
  )
}
