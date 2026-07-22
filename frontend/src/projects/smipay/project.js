import BlankBrandFlier from '../../fliers/shared/BlankBrandFlier'
import { boardSize } from '../../lib/sizes'
import { createProject } from '../layout'

const post = boardSize('instagram-post')
const story = boardSize('instagram-story')

/**
 * Smipay social media designs — keep only Smipay fliers in this folder.
 * Add new boards by appending to `fliers` below (or new components under src/fliers/smipay/).
 * Pick each board’s size from sizes.js to match the platform.
 */
export default createProject({
  id: 'smipay',
  name: 'Smipay',
  brand: 'Smipay',
  description: 'Smipay social media flier project. Add brand-specific boards here.',
  color: '#00C2A8',
  fliers: [
    {
      id: 'smipay-post-01',
      name: 'Social Post 01',
      group: 'Smipay',
      description: 'Placeholder — replace with a Smipay design',
      width: post.width,
      height: post.height,
      filename: 'smipay-post-01',
      Component: BlankBrandFlier,
      props: {
        ...post.props,
        brand: 'Smipay',
        title: 'Social Post 01',
        note: 'Drop Smipay assets in public/assets/smipay/ then prompt Cursor to design this board.',
      },
    },
    {
      id: 'smipay-story-01',
      name: 'Story 01',
      group: 'Smipay',
      description: 'Placeholder story board for Smipay',
      width: story.width,
      height: story.height,
      filename: 'smipay-story-01',
      Component: BlankBrandFlier,
      props: {
        ...story.props,
        brand: 'Smipay',
        title: 'Story 01',
        note: 'Instagram story size — ready for a Smipay design.',
      },
    },
  ],
})
