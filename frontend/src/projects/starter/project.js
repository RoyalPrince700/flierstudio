import InstagramPostFlier from '../../fliers/instagram/InstagramPostFlier'
import { createProject } from '../layout'

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
      width: 1080,
      height: 1080,
      filename: 'starter-instagram-post',
      Component: InstagramPostFlier,
      props: { width: 1080, height: 1080 },
    },
    {
      id: 'starter-instagram-portrait',
      name: 'Instagram Portrait',
      group: 'Instagram',
      description: '1080×1350 starter portrait template',
      width: 1080,
      height: 1350,
      filename: 'starter-instagram-portrait',
      Component: InstagramPostFlier,
      props: { width: 1080, height: 1350, meta: 'Instagram Portrait · 1080×1350' },
    },
  ],
})
