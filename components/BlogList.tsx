import { ReactNode } from 'react'

interface BlogListProps {
  children?: ReactNode
}

const BlogList: React.FC<BlogListProps> = ({ children }) => {
  return <div className="max-w-6xl mx-auto px-8 pt-16 flex">{children}</div>
}

export default BlogList
