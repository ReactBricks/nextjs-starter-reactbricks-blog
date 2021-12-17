import { GetStaticProps } from 'next'
import Head from 'next/head'
import { useContext, useState } from 'react'
import { cleanPage, fetchPage, fetchPages, ReactBricksContext, types } from 'react-bricks/frontend'
import ErrorNoHomePage from '../components/errorNoHomePage'
import ErrorNoKeys from '../components/errorNoKeys'

import BlogListItem from '../components/BlogListItem'
import Layout from '../components/layout'
import config from '../react-bricks/config'
import Link from 'next/link'
import axios from 'axios'

interface HomeProps {
  error: string
  tags: string[]
  posts: types.Page[]
}

const BlogList: React.FC<HomeProps> = ({ tags, posts, error }) => {
  return (
    <Layout>
      <Head>
        <title>Blog List</title>
        <meta name="description" content="React Bricks blog starter" />
      </Head>

      <h1 className="text-center text-4xl sm:text-6xl lg:text-7xl leading-none font-black tracking-tight text-gray-900 pb-4 mt-10 sm:mt-12 mb-4">
        Blog
      </h1>
      <div className="max-w-6xl mx-auto px-8 py-16 flex space-x-24">
        <section className="flex-2 space-y-8">
          <h2 className="text-pink-500 uppercase mb-8 tracking-widest font-bold">Recently published</h2>
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
                  <Link href={`/tag/${tag}`} key={tag}>
                    <a className="inline-block text-sm font-bold mr-2 mb-2 transform duration-200 text-cyan-800 bg-cyan-100 hover:bg-cyan-200 hover:text-cyan-900 rounded-md px-2 py-1">
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
              {posts
                ?.filter((post) => post.tags.find((tag) => tag === 'popular'))
                .map((post) => (
                  <li key={post.id}>
                    <a
                      href={post.slug}
                      className="text-gray-900 hover:text-cyan-600 font-bold text-lg leading-10 transition-colors"
                    >
                      {post.name}
                    </a>
                  </li>
                ))}
            </ul>
          </div>
        </section>
      </div>
      {error === 'NOKEYS' && <ErrorNoKeys />}
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  if (!config.apiKey) {
    return { props: { error: 'NOKEYS' } }
  }
  try {
    const { data } = await axios.get('https://api.reactbricks.com/v2/admin/tags', {
      headers: {
        authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJBRE1JTiJdLCJ1c2VyIjp7InVzZXJJZCI6IjFiMDliMTc2LTkxZWItNDhkYS1iNmMwLWIwZDk5ZTU3NTRhNCIsImFwcElkIjoiYWU2ZWJhYjMtYzVkNS00MGM1LWJmMjUtZmFlNjMwZTdiZjYxIiwiYWNjb3VudElkIjoiOWIyYmJjZDgtMmIxMS00ODBjLWE5ZjgtMTc5MGQxODgxOTI1IiwiZW1haWwiOiJmMkBmMi5uZXQiLCJyZWFkT25seSI6ZmFsc2UsImNhbkNyZWF0ZVBhZ2UiOnRydWUsImNhbkRlbGV0ZVBhZ2UiOnRydWUsImNhbkRlcGxveSI6dHJ1ZSwiY2FuRGVwbG95U3RhZ2luZyI6dHJ1ZSwiaXNWZXJpZmllZCI6dHJ1ZX0sImlhdCI6MTYzOTc1NzAxOCwiZXhwIjoxNjM5ODQzNDE4fQ.7rmbWCgiYIqe4xXImDCq5ZsAZN1JucmNXAEeagIwMaU`,
      },
    })
    data.sort()

    const posts = await fetchPages(process.env.API_KEY, { type: 'blog' })
    return { props: { posts, tags: data } }
  } catch {
    return { props: {} }
  }
}

export default BlogList
