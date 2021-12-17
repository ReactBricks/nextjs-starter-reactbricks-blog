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
  const tags = posts.reduce((acc, post) => {
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

  const [filter, setFilter] = useState<boolean | string>(true)

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
      <div className="max-w-6xl mx-auto px-8 pt-16 flex space-x-24">
        <section className="flex-2 space-y-8">
          <h2 className="text-pink-500 capitalize text-xl mb-8">Heading</h2>
          {posts
            .filter((post) => post.tags.find((tag) => (typeof filter === 'boolean' ? filter : tag === filter)))
            .map((post) => (
              <BlogListItem key={post.id} title={post.name} href={post.slug} content={post.meta.description} />
            ))}
        </section>
        <section className="flex-1 space-y-8">
          <div>
            <h2 className="text-pink-500 capitalize text-xl mb-8">Tags</h2>
            <div className="flex flex-wrap space-x-4">
              {/* T A G  */}
              {tags
                .filter((tag) => tag !== 'popoular')
                .map((tag) => (
                  <div
                    key={tag}
                    className="text-md font-bold relative isolate rounded-xl px-2 py-1 group cursor-pointer flex justify-center mb-2"
                    onClick={() => setFilter(tag)}
                  >
                    <div
                      className="transform duration-200 group-hover:scale-105 absolute inset-0 bg-pink-400 group-hover:bg-pink-300 rounded-xl px-2 py-1 border border-solid border-pink-500"
                      style={{ zIndex: -1 }}
                    />
                    {tag}
                  </div>
                ))}
                <div

                    className="text-md font-bold relative isolate rounded-xl px-2 py-1 group cursor-pointer flex justify-center mb-2"
                    onClick={() => setFilter(true)}
                  >
                    <div
                      className="transform duration-200 group-hover:scale-105 absolute inset-0 bg-purple-400 group-hover:bg-purple-300 rounded-xl px-2 py-1 border border-solid border-purple-500"
                      style={{ zIndex: -1 }}
                    />
                    Reset tags
                  </div>
              {/*  */}
            </div>
          </div>
          <div>
            <h2 className="text-pink-500 capitalize text-xl mb-8">Most Popoular</h2>
            <ul>
              {posts
                .filter((post) => post.tags.find((tag) => tag === 'popoular'))
                .map((post) => (
                  <li key={post.id} className="">
                    <a href={post.slug} className="flex space-x-2 items-center group py-2 cursor-pointer">
                      <span className="transform duration-300 -translate-x-1 group-hover:translate-x-1">
                        <FaArrowRight className="group-hover:text-pink-700" />
                      </span>
                      <div className="flex-1 text-gray-900 font-bold text-xl leading-10 capitalize">{post.name}</div>
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
