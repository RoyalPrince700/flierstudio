import BlankBrandFlier from '../../fliers/shared/BlankBrandFlier'
import { boardSize } from '../../lib/sizes'
import { createProject } from '../layout'

const post = boardSize('instagram-post')

/**
 * Femtech designs — keep only Femtech fliers in this folder.
 * Size each board from the brief via sizes.js (do not assume portrait).
 */
export default createProject({
  id: 'femtech',
  name: 'Femtech',
  brand: 'Femtech',
  description: 'Femtech campaign / social flier project.',
  color: '#FF5C8A',
  fliers: [
    {
      id: 'femtech-post-01',
      name: 'Campaign Post 01',
      group: 'Femtech',
      description: 'Placeholder — replace with a Femtech design',
      width: post.width,
      height: post.height,
      filename: 'femtech-post-01',
      Component: BlankBrandFlier,
      props: {
        ...post.props,
        brand: 'Femtech',
        title: 'Campaign Post 01',
        note: 'Drop Femtech assets in public/assets/femtech/ then prompt Cursor to design this board.',
      },
    },
  ],
})
