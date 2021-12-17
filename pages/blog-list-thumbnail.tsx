import React from 'react'
// import Layout from '../components/layout'
import PostThumbnail from '../components/PostThumbnail'

import { useContext } from 'react'
import {
  ReactBricksContext,
  PageViewer,
  fetchPage,
  cleanPage,
  types,
  fetchPages,
} from 'react-bricks/frontend'
import Head from 'next/head'
import { GetStaticProps } from 'next'

import config from '../react-bricks/config'
import Layout from '../components/layout'
import ErrorNoKeys from '../components/errorNoKeys'
import ErrorNoHomePage from '../components/errorNoHomePage'
import dayjs from 'dayjs'

interface BlogListThumbnailsProps {
  page: types.Page
  error: string
  posts: types.Page[]
}

const BlogListThumbnails: React.FC<BlogListThumbnailsProps> = ({ posts, page, error }) => {
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
          <PageViewer page={pageOk} />
        </>
      )}

      <div className="container max-w-5xl mx-auto py-16 px-6">
        <h1 className="text-center text-4xl sm:text-6xl lg:text-7xl leading-none font-black tracking-tight text-gray-900 pb-4 mt-10 sm:mt-12 mb-4">
          <span className="text-transparent bg-clip-text decoration-clone px-2 bg-gradient-to-r from-red-400 to-pink-700">
            Blog
          </span>
        </h1>
        <div className="py-10 flex flex-wrap">
          {posts.map((post) => (
            <PostThumbnail
              href={post.slug}
              title={post.name}
              description={post.meta.description}
              date={dayjs(post.publishedAt).format('DD/MM/YYYY')}
              image={
                post.meta.featuredImage ||
                'https://images.reactbricks.com/original/8b1974a0-91a8-4ab4-b014-83f60192f9b5.svg'
              }
            />
          ))}
        </div>
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
    const page = await fetchPage('blog-list-thumbnail', config.apiKey, context.locale)
    return { props: { page, posts } }
  } catch {
    return { props: { error: 'NOPAGE' } }
  }
}

export default BlogListThumbnails
