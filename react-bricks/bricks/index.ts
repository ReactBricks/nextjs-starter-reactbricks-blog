import { types } from 'react-bricks/frontend'
import { website, blog } from 'react-bricks-ui'
import HeroUnit from './MyHeroUnit'

const bricks: types.Brick<any>[] = [
  ...website, // React Bricks UI
  ...blog,
  HeroUnit, // Example custom brick
  // Put here your other bricks...
]

export default bricks
