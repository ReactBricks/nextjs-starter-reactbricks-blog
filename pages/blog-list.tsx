import { GetStaticProps } from 'next'
import Head from 'next/head'
import { useContext } from 'react'
import { cleanPage, fetchPage, fetchPages, PageViewer, ReactBricksContext, types } from 'react-bricks/frontend'
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
      <div className="max-w-6xl mx-auto px-8 pt-16 flex">
        <section className="flex-2">
          <h2 className="text-pink-500 capitalize text-2xl font-bold mb-8">Heading</h2>
          {posts?.map((post) => (
            <BlogListItem title={post.name} href={post.slug} content={post.meta.description} />
          ))}
        </section>
        <section className="flex-1">Right Side</section>
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
