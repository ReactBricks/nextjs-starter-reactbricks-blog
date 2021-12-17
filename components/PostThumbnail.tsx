import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
// import dayjs from 'dayjs'
// import useHover from './blog/hooks/useHover'
import { FiArrowRight } from 'react-icons/fi'

interface ArticleCardProps {
  href: string
  title: string
  description: string
  date: string
  image: any
}

const ArticleCard: React.FC<ArticleCardProps> = ({ href, title, description, date, image }) => {
  return (
    <article className="w-1/2 mb-8 p-8 group cursor-pointer">
      <Link href={href}>
        <a className="block relative h-60 transform duration-300 scale-100 group-hover:scale-105 rounded">
          <img src={image} className="block w-full h-60 object-cover object-center transition-transform rounded" />
          <div className="absolute top-0 bottom-0 left-0 right-0 bg-cyan-500 opacity-0 group-hover:opacity-40 transition-opacity rounded"></div>
        </a>
      </Link>
      <div className="my-4 text-xs uppercase text-gray-500">
        {/* {dayjs(date).format('MMMM, DD YYYY')} */}
        {date}
      </div>
      <Link href={href}>
        <a className="block group">
          <h3 className="mb-3 text-2xl font-extrabold text-gray-900 group-hover:text-cyan-500 transition-colors">
            {title}
          </h3>
        </a>
      </Link>
      <p className="text-gray-700 mb-4">{description}</p>
      {/* <Link href={href}>
        <a className="text-cyan-500 flex items-center font-semibold group">
          <div className="mr-2 group-hover:mr-4 transition-all">Read More</div>
          <FiArrowRight />
        </a>
      </Link> */}
    </article>
  )
}

export default ArticleCard
