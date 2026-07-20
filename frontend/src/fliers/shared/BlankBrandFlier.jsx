import EditableText from '../../components/studio/EditableText'
import { editableTextProps } from '../../components/studio/editableTextProps'
import './blank-brand-flier.css'

/** Placeholder artboard for a brand project until real fliers are designed */
export default function BlankBrandFlier({
  width = 1080,
  height = 1350,
  brand = 'Brand',
  title = 'New Flier',
  note = 'Prompt Cursor to design this board. Assets go in public/assets/<brand>/',
  fonts,
  studioEdit,
}) {
  return (
    <article
      className="blank-flier"
      style={{
        width,
        height,
        ...(fonts?.display ? { '--blank-display': fonts.display } : null),
        ...(fonts?.body ? { '--blank-body': fonts.body } : null),
      }}
    >
      <EditableText
        as="p"
        className="blank-flier__brand"
        value={brand}
        {...editableTextProps(studioEdit, 'brand')}
      />
      <EditableText
        as="h1"
        className="blank-flier__title"
        value={title}
        {...editableTextProps(studioEdit, 'title')}
      />
      <EditableText
        as="p"
        className="blank-flier__note"
        value={note}
        {...editableTextProps(studioEdit, 'note')}
      />
      <p className="blank-flier__size">
        {width}×{height}
      </p>
    </article>
  )
}
