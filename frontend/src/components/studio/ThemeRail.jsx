import {
  DEFAULT_EMERGENCE_COLOR_THEME,
  EMERGENCE_COLOR_THEMES,
} from '../../design/emergenceThemes'

/**
 * Compact vertical theme swatches beside the artboard (mobile).
 * Tap applies immediately so the flier updates live without opening the sheet.
 */
export default function ThemeRail({ activeThemeId, onChange }) {
  const active = activeThemeId || DEFAULT_EMERGENCE_COLOR_THEME

  return (
    <div className="studio-theme-rail" role="listbox" aria-label="Color theme">
      {EMERGENCE_COLOR_THEMES.map((theme) => {
        const selected = active === theme.id
        const primary = theme.swatch[0] || theme.colors?.royalMid || '#1E42A3'
        return (
          <button
            key={theme.id}
            type="button"
            role="option"
            aria-selected={selected}
            className={`studio-theme-rail__swatch${selected ? ' is-active' : ''}`}
            title={theme.label}
            aria-label={theme.label}
            style={{ background: primary }}
            onClick={() => onChange?.(theme.id)}
          />
        )
      })}
    </div>
  )
}
