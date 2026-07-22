import InstagramPostFlier from '../../fliers/instagram/InstagramPostFlier'
import { boardSize } from '../../lib/sizes'
import { createProject } from '../layout'

const post = boardSize('instagram-post')
const portrait = boardSize('instagram-portrait')

/** Generic Instagram starter — sandbox / non-branded experiments */
export default createProject({
  id: 'starter',
  name: 'Starter',
  brand: 'Sandbox',
  description: 'Generic Instagram starter boards for quick experiments.',
  color: '#E8FF47',
  fliers: [
    {
      id: 'starter-instagram-post',
      name: 'Instagram Post',
      group: 'Instagram',
      description: '1080×1080 starter post template',
      width: post.width,
      height: post.height,
      filename: 'starter-instagram-post',
      Component: InstagramPostFlier,
      props: post.props,
    },
    {
      id: 'starter-instagram-portrait',
      name: 'Instagram Portrait',
      group: 'Instagram',
      description: '1080×1350 starter portrait template',
      width: portrait.width,
      height: portrait.height,
      filename: 'starter-instagram-portrait',
      Component: InstagramPostFlier,
      props: portrait.props,
    },
  ],
})
