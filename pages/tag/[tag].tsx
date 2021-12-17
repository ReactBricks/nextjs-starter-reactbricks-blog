import classNames from 'classnames'
import { GetStaticPaths, GetStaticProps } from 'next'
import Axios from 'axios'
import Head from 'next/head'
import Link from 'next/link'
import { fetchPages, types } from 'react-bricks/frontend'
import BlogListItem from '../../components/BlogListItem'
import ErrorNoPage from '../../components/errorNoPage'
import Layout from '../../components/layout'
import config from '../../react-bricks/config'

interface PageProps {
  pages: types.Page[]
  populars: types.Page[]
  error: string
  externalTag: string
  allTags: string[]
}

const Page: React.FC<PageProps> = ({ externalTag, pages, populars, allTags, error }) => {
  return (
    <Layout>
      <Head>
        <title>{externalTag}</title>
        <meta name="description" content={externalTag} />
      </Head>
      <h1 className="text-center text-4xl sm:text-6xl lg:text-7xl leading-none font-black tracking-tight text-gray-900 pb-4 mt-10 sm:mt-12 mb-4">
        Blog
      </h1>
      <div className="max-w-6xl mx-auto px-8 py-16 flex space-x-24">
        <section className="flex-2 space-y-8">
          <h2 className="text-pink-500 uppercase mb-8 tracking-widest font-bold">{externalTag}</h2>
          {pages?.map((post) => (
            <BlogListItem key={post.id} title={post.name} href={post.slug} content={post.meta.description} />
          ))}
        </section>
        <section className="flex-1 space-y-16">
          <div>
            <h2 className="text-pink-500 uppercase mb-8 tracking-widest font-bold">Tags</h2>
            <div className="flex flex-wrap items-center">
              {/* T A G  */}
              {allTags
                ?.filter((tag) => tag !== 'popular')
                .map((tag) => (
                  <Link href={tag === externalTag ? '/' : `/tag/${tag}`} key={tag}>
                    <a
                      className={classNames(
                        'inline-block text-sm font-bold mr-2 mb-2 transform duration-200  rounded-md px-2 py-1',
                        tag === externalTag
                          ? 'text-blue-800 bg-blue-100 hover:bg-blue-200 hover:text-blue-900'
                          : 'text-cyan-800 bg-cyan-100 hover:bg-cyan-200 hover:text-cyan-900'
                      )}
                    >
                      <div className="" style={{ zIndex: -1 }} />
                      {tag}
                    </a>
                  </Link>
                ))}
              {/*  */}
            </div>
          </div>
          <div>
            <h2 className="text-pink-500 uppercase mb-8 tracking-widest font-bold">Most Popular</h2>
            <ul>
              {populars?.map((post) => (
                <li key={post.id}>
                  <Link href={`/${post.slug}`}>
                    <a className="text-gray-900 hover:text-cyan-600 font-bold text-lg leading-10 transition-colors">
                      {post.name}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
      {error === 'NOKEYS' && <ErrorNoPage />}
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  if (!config.apiKey) {
    return { props: { error: 'NOKEYS' } }
  }
  const { tag } = context.params
  try {
    const { data } = await Axios.get('https://api.reactbricks.com/v2/admin/tags', {
      headers: {
        authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJBRE1JTiJdLCJ1c2VyIjp7InVzZXJJZCI6IjFiMDliMTc2LTkxZWItNDhkYS1iNmMwLWIwZDk5ZTU3NTRhNCIsImFwcElkIjoiYWU2ZWJhYjMtYzVkNS00MGM1LWJmMjUtZmFlNjMwZTdiZjYxIiwiYWNjb3VudElkIjoiOWIyYmJjZDgtMmIxMS00ODBjLWE5ZjgtMTc5MGQxODgxOTI1IiwiZW1haWwiOiJmMkBmMi5uZXQiLCJyZWFkT25seSI6ZmFsc2UsImNhbkNyZWF0ZVBhZ2UiOnRydWUsImNhbkRlbGV0ZVBhZ2UiOnRydWUsImNhbkRlcGxveSI6dHJ1ZSwiY2FuRGVwbG95U3RhZ2luZyI6dHJ1ZSwiaXNWZXJpZmllZCI6dHJ1ZX0sImlhdCI6MTYzOTc1NzAxOCwiZXhwIjoxNjM5ODQzNDE4fQ.7rmbWCgiYIqe4xXImDCq5ZsAZN1JucmNXAEeagIwMaU`,
      },
    })

    data.sort(function (a, b) {
      if (a < b) {
        return -1
      }
      if (a > b) {
        return 1
      }
      return 0
    })
    const pages = await fetchPages(config.apiKey, { tag: tag.toString() })
    const populars = await fetchPages(config.apiKey, { type: 'blog', tag: 'popular' })
    return { props: { pages, externalTag: tag, populars, allTags: data } }
  } catch {
    return { props: {} }
  }
}

export const getStaticPaths: GetStaticPaths = async (context) => {
  if (!config.apiKey) {
    return { paths: [], fallback: false }
  }

  const { data } = await Axios.get('https://api.reactbricks.com/v2/admin/tags', {
    headers: {
      authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJBRE1JTiJdLCJ1c2VyIjp7InVzZXJJZCI6IjFiMDliMTc2LTkxZWItNDhkYS1iNmMwLWIwZDk5ZTU3NTRhNCIsImFwcElkIjoiYWU2ZWJhYjMtYzVkNS00MGM1LWJmMjUtZmFlNjMwZTdiZjYxIiwiYWNjb3VudElkIjoiOWIyYmJjZDgtMmIxMS00ODBjLWE5ZjgtMTc5MGQxODgxOTI1IiwiZW1haWwiOiJmMkBmMi5uZXQiLCJyZWFkT25seSI6ZmFsc2UsImNhbkNyZWF0ZVBhZ2UiOnRydWUsImNhbkRlbGV0ZVBhZ2UiOnRydWUsImNhbkRlcGxveSI6dHJ1ZSwiY2FuRGVwbG95U3RhZ2luZyI6dHJ1ZSwiaXNWZXJpZmllZCI6dHJ1ZX0sImlhdCI6MTYzOTc1NzAxOCwiZXhwIjoxNjM5ODQzNDE4fQ.7rmbWCgiYIqe4xXImDCq5ZsAZN1JucmNXAEeagIwMaU`,
    },
  })

  const paths = data.map((tag) => `/tag/${tag}`)

  return { paths, fallback: false }
}

export default Page
