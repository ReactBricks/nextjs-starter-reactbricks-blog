import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import { fetchPages, types } from 'react-bricks/frontend'
import { FaArrowRight } from 'react-icons/fa'
import classNames from 'classnames'
import BlogListItem from '../../components/BlogListItem'
import ErrorNoPage from '../../components/errorNoPage'
import Layout from '../../components/layout'
import config from '../../react-bricks/config'

interface PageProps {
  pages: types.Page[]
  error: string
  externalTag: string
}

const Page: React.FC<PageProps> = ({ externalTag, pages, error }) => {
  const tags = pages?.reduce((acc, post) => {
    post.tags.forEach((tag) => {
      if (!acc.find((accTag) => accTag === tag)) {
        acc.push(tag)
      }
    })
    return acc
  }, [])

  return (
    <Layout>
      <Head>
        <title>{externalTag}</title>
        <meta name="description" content={externalTag} />
      </Head>
      <h1 className="text-center text-4xl sm:text-6xl lg:text-7xl leading-none font-black tracking-tight text-gray-900 pb-4 mt-10 sm:mt-12 mb-4">
        <span className="text-transparent bg-clip-text decoration-clone px-2 bg-gradient-to-r from-red-400 to-pink-700">
          Blog
        </span>
      </h1>
      <div className="max-w-6xl mx-auto px-8 pt-16 flex space-x-24">
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
              {tags
                ?.filter((tag) => tag !== 'popular')
                .map((tag) => (
                  <a
                    href={`/tag/${tag}`}
                    key={tag}
                    className="text-sm font-bold relative isolate rounded-md px-2 py-1 group cursor-pointer flex justify-center mr-2 mb-2"
                  >
                    <div
                      className={classNames(
                        'transform duration-200 group-hover:scale-105 absolute inset-0 rounded-md px-2 py-1 border border-solid',
                        tag === externalTag
                          ? ' bg-blue-100 group-hover:bg-blue-200 border-blue-200'
                          : 'bg-cyan-100 group-hover:bg-cyan-200 border-cyan-200'
                      )}
                      style={{ zIndex: -1 }}
                    />
                    {tag}
                  </a>
                ))}
              {/*  */}
            </div>
          </div>
          <div>
            <h2 className="text-pink-500 uppercase mb-8 tracking-widest font-bold">Most Popular</h2>
            <ul>
              {pages
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
      {error === 'NOPAGE' && <ErrorNoPage />}
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  if (!config.apiKey) {
    return { props: { error: 'NOKEYS' } }
  }
  const { tag } = context.params
  try {
    const pages = await fetchPages(config.apiKey, { tag: tag.toString() })
    return { props: { pages, externalTag: tag } }
  } catch {
    return { props: { error: 'NOPAGE' } }
  }
}

export const getStaticPaths: GetStaticPaths = async (context) => {
  if (!config.apiKey) {
    return { paths: [], fallback: false }
  }

  const allPages = await fetchPages(config.apiKey)

  const paths = allPages
    .map((page) =>
      page.translations
        .filter((translation) => context.locales.indexOf(translation.language) > -1)
        .map((translation) => ({
          params: { slug: translation.slug },
          locale: translation.language,
        }))
    )
    .flat()

  return { paths: ['/tag/react'], fallback: false }
}

export default Page
