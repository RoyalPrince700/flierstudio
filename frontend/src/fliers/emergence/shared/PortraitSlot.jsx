import { UserRound } from 'lucide-react'
import EditableImageSlot from '../../../components/studio/EditableImageSlot'
import EditableText from '../../../components/studio/EditableText'
import { editableTextProps } from '../../../components/studio/editableTextProps'
import './portrait-slot.css'

export default function PortraitSlot({
  name,
  title,
  accent = 'amber',
  size = 'md',
  ink = 'dark',
  src = '',
  namePath,
  titlePath,
  photoPath,
  studioEdit,
}) {
  const editable = Boolean(studioEdit?.enabled)
  const focusedPath = studioEdit?.focusedPath
  const accentClass = ['amber', 'orange', 'cyan'].includes(accent) ? accent : 'amber'

  const frame = (
    <div className="e-slot__stack">
      <span className={`e-slot__slab e-slot__slab--${accentClass}`} aria-hidden />
      <div className="e-slot__frame">
        {src ? (
          <img className="e-slot__img" src={src} alt={name || ''} />
        ) : (
          <UserRound className="e-slot__icon" strokeWidth={1.75} />
        )}
      </div>
    </div>
  )

  return (
    <div className={`e-slot e-slot--${size} e-slot--ink-${ink}`}>
      {editable && photoPath ? (
        <EditableImageSlot
          path={photoPath}
          editable
          focused={focusedPath === photoPath}
          hasImage={Boolean(src)}
          onFocusField={studioEdit.onFocusField}
          onPickImage={studioEdit.onPickImage}
        >
          {frame}
        </EditableImageSlot>
      ) : (
        frame
      )}

      <EditableText
        as="p"
        className="e-slot__name"
        value={name}
        {...editableTextProps(studioEdit, namePath)}
      />
      <EditableText
        as="p"
        className="e-slot__title"
        value={title}
        {...editableTextProps(studioEdit, titlePath)}
      />
    </div>
  )
}
