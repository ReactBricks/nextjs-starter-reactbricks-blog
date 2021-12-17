import { GetStaticProps } from 'next'
import Head from 'next/head'
import { useContext, useState } from 'react'
import { cleanPage, fetchPage, fetchPages, PageViewer, ReactBricksContext, types } from 'react-bricks/frontend'
import { FaArrowRight } from 'react-icons/fa'
import ErrorNoHomePage from '../components/errorNoHomePage'
import ErrorNoKeys from '../components/errorNoKeys'

import BlogListItem from '../components/BlogListItem'
import Layout from '../components/layout'
import config from '../react-bricks/config'

interface HomeProps {
  page: types.Page
  error: string
  posts: types.Page[]
}

const BlogList: React.FC<HomeProps> = ({ posts, page, error }) => {
  const tags = posts?.reduce((acc, post) => {
    post.tags.forEach((tag) => {
      if (!acc.find((accTag) => accTag === tag)) {
        acc.push(tag)
      }
    })
    return acc
  }, [])
  // Clean the received content
  // Removes unknown or not allowed bricks
  const { pageTypes, bricks } = useContext(ReactBricksContext)

  const pageOk = page ? cleanPage(page, pageTypes, bricks) : null

  return (
    <Layout>
      {pageOk && (
        <>
          <Head>
            <title>{page.meta.title}</title>
            <meta name="description" content={page.meta.description} />
          </Head>
        </>
      )}
      <h1 className="text-center text-4xl sm:text-6xl lg:text-7xl leading-none font-black tracking-tight text-gray-900 pb-4 mt-10 sm:mt-12 mb-4">
        <span className="text-transparent bg-clip-text decoration-clone px-2 bg-gradient-to-r from-red-400 to-pink-700">
          Blog
        </span>
      </h1>
      <div className="max-w-6xl mx-auto px-8 pt-16 flex space-x-24">
        <section className="flex-2 space-y-8">
          <h2 className="text-pink-500 uppercase mb-8 tracking-widest font-bold">Heading</h2>
          {posts?.map((post) => (
            <BlogListItem key={post.id} title={post.name} href={post.slug} content={post.meta.description} />
          ))}
        </section>
        <section className="flex-1 space-y-16">
          <div>
            <h2 className="text-pink-500 uppercase mb-8 tracking-widest font-bold">Tags</h2>
            <div className="flex flex-wrap items-center">
              {/* T A G  */}
              {tags
                ?.filter((tag) => tag !== 'popular')
                .map((tag) => (
                  <a
                  href={`/tag/${tag}`}
                    key={tag}
                    className="text-sm font-bold relative isolate rounded-md px-2 py-1 group cursor-pointer flex justify-center mr-2 mb-2"
                  >
                    <div
                      className="transform duration-200 group-hover:scale-105 absolute inset-0 bg-cyan-100 group-hover:bg-cyan-200 rounded-md px-2 py-1 border border-solid border-cyan-200"
                      style={{ zIndex: -1 }}
                    />
                    {tag}
                  </a>
                ))}
              <div className="text-sm font-bold relative isolate rounded-md px-2 py-1 group cursor-pointer flex justify-center mb-2">
                <div
                  className="transform duration-200 group-hover:scale-105 absolute inset-0 bg-purple-100 group-hover:bg-purple-200 rounded-md px-2 py-1 border border-solid border-purple-200"
                  style={{ zIndex: -1 }}
                />
                Reset tags
              </div>
              {/*  */}
            </div>
          </div>
          <div>
            <h2 className="text-pink-500 uppercase mb-8 tracking-widest font-bold">Most Popular</h2>
            <ul>
              {posts
                ?.filter((post) => post.tags.find((tag) => tag === 'popular'))
                .map((post) => (
                  <li key={post.id} className="">
                    <a href={post.slug} className="flex space-x-2 items-center group cursor-pointer">
                      <span className="transform duration-300 -translate-x-1 group-hover:translate-x-1">
                        <FaArrowRight className="text-pink-600 group-hover:text-pink-700" />
                      </span>
                      <div className="flex-1 text-gray-900 font-bold text-lg leading-10 capitalize">{post.name}</div>
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        </section>
      </div>
      {error === 'NOKEYS' && <ErrorNoKeys />}
      {error === 'NOPAGE' && <ErrorNoHomePage />}
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  if (!config.apiKey) {
    return { props: { error: 'NOKEYS' } }
  }
  try {
    const posts = await fetchPages(process.env.API_KEY, { type: 'blog' })
    const page = await fetchPage('blog-list', config.apiKey, context.locale)
    return { props: { page, posts } }
  } catch {
    return { props: { error: 'NOPAGE' } }
  }
}

export default BlogList
