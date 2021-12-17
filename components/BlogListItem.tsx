import React from 'react'
import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'

interface BlogListItemProps {
  title: string
  href: string
  content: string
}

const BlogListItem: React.FC<BlogListItemProps> = ({ title, href, content }) => {
  return (
    <Link href={href}>
      <a className="flex-1 block group py-4 text-gray-900 hover:bg-gray-50 transition-colors duration-300 p-6 -m-6 rounded">
        <h3 className="font-bold text-2xl">
          {title}
        </h3>
        <p className="mt-4 leading-6 text-lg">{content}</p>
        <div className="flex items-center mt-4 text-cyan-500 group-hover:text-cyan-600 font-semibold">
          <div className="mr-2 group-hover:mr-4 transition-all duration-300">Read More</div>
          <FiArrowRight />
        </div>
      </a>
    </Link>
  )
}

export default BlogListItem
