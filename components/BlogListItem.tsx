import React from 'react'

interface BlogListItemProps {
  title: string
  href: string
  content: string
}

const BlogListItem: React.FC<BlogListItemProps> = ({ title, href, content }) => {
  return (
    <div className="flex-1 h-full group">
      <a href={href} className="block relative text-gray-900 h-full w-full">
        <h3 className="font-bold text-xl capitalize group-hover:text-pink-600">{title}</h3>
        <p className="mt-4 leading-6 text-lg">{content}</p>
        <div className="mt-6 group-hover:font-bold">Read More {`->`} </div>
      </a>
    </div>
  )
}

export default BlogListItem
