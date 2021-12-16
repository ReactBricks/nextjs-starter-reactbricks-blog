import { types } from 'react-bricks/frontend'

const pageTypes: types.IPageType[] = [
  {
    name: 'page',
    pluralName: 'pages',
    defaultLocked: false,
    defaultStatus: types.PageStatus.Published,
    getDefaultContent: () => [],
  },
  {
    name: 'blog',
    pluralName: 'Blog',
    getDefaultContent: () => [],
    allowedBlockTypes: ['title', 'paragraph', 'video', 'image', 'quote', 'social-embed', 'code-block', 'twitter-light'],
  },
]

export default pageTypes
