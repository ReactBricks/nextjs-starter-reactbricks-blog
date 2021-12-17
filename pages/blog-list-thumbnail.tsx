import React from 'react'
// import Layout from '../components/layout'
import PostThumbnail from '../components/PostThumbnail'

// const blogList = () => {
//   return (
//     <Layout>
//       <div className="container max-w-5xl mx-auto py-16 px-6">
//         <h1 className="text-center text-4xl sm:text-6xl lg:text-7xl leading-none font-black tracking-tight text-gray-900 pb-4 mt-10 sm:mt-12 mb-4">
//           <span className="text-transparent bg-clip-text decoration-clone px-2 bg-gradient-to-r from-red-400 to-pink-700">
//             Blog
//           </span>
//         </h1>
//         <main className="py-10 flex flex-wrap">
//           <PostThumbnail
//             href="/"
//             title="Our Partnership With Brex"
//             description="We are pleased to announce our partnership with Brex. the category-leader in managing startup company spend and issuing credit cards."
//             date="20/12/2021"
//             image="https://images.pexels.com/photos/777211/winter-sunset-purple-sky-777211.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
//           />
//           <PostThumbnail
//             href="/"
//             title="How Do Startups Typically Allocate Shares?"
//             description="Learn how many shares you should authorize at the outset of your company, how to price them, and how to allocate them between founders, advisors, employees and contractors."
//             date="20/12/2021"
//             image="https://images.pexels.com/photos/87812/pexels-photo-87812.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
//           />
//           <PostThumbnail
//             href="/"
//             title="How to Register a US Company from the UK in 10 Minutes"
//             description="These are the steps founders based in the UK need to take to form a corporation in the US."
//             date="20/12/2021"
//             image="https://images.pexels.com/photos/635279/pexels-photo-635279.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
//           />
//         </main>
//       </div>
//     </Layout>
//   )
// }
//
// export default blogList

import { useContext } from 'react'
import { ReactBricksContext, PageViewer, fetchPage, cleanPage, types, fetchPages } from 'react-bricks/frontend'
import Head from 'next/head'
import { GetStaticProps } from 'next'

import config from '../react-bricks/config'
import Layout from '../components/layout'
import ErrorNoKeys from '../components/errorNoKeys'
import ErrorNoHomePage from '../components/errorNoHomePage'
import dayjs from 'dayjs'

interface blogListProps {
  page: types.Page
  error: string
  posts: types.Page[]
}

const blogList: React.FC<blogListProps> = ({ posts, page, error }) => {
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

export default blogList
