import BlankBrandFlier from '../../fliers/shared/BlankBrandFlier'
import { createProject } from '../layout'

/**
 * Femtech designs — keep only Femtech fliers in this folder.
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
      width: 1080,
      height: 1350,
      filename: 'femtech-post-01',
      Component: BlankBrandFlier,
      props: {
        width: 1080,
        height: 1350,
        brand: 'Femtech',
        title: 'Campaign Post 01',
        note: 'Drop Femtech assets in public/assets/femtech/ then prompt Cursor to design this board.',
      },
    },
  ],
})
