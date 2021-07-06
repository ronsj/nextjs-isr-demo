import { useRouter } from 'next/router'
import Head from 'next/head'
import { getPage } from '../lib/graphcms'

export default function Slug({ preview, page }) {
  const router = useRouter()

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <h1>Loading...</h1>
  }

  return (
    <div style={{ padding: '2rem' }}>
      <Head>
        <title>{page?.title}</title>
      </Head>
      <Content content={page?.content}></Content>
      <Json data={page} />
    </div>
  )
}

function Content({ content }) {
  if (!content) {
    return null
  }

  return <div dangerouslySetInnerHTML={{ __html: content.html }} />
}

function Json({ data, tabSize = 2 }) {
  return <pre>{JSON.stringify(data, null, tabSize)}</pre>
}

/**
 *
 *  INCREMENTAL STATIC REGENERATION
 *  https://nextjs.org/docs/basic-features/data-fetching#incremental-static-regeneration
 *
 */

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// the path has not been generated.
export async function getStaticPaths() {
  return {
    // Render ZERO pages at build time
    paths: [],
    // { fallback: blocking } will server-render pages
    // on-demand if the path doesn't exist. So all of our pages
    // will be built on-demand.
    fallback: 'blocking',
  }
}

// https://nextjs.org/docs/basic-features/data-fetching#incremental-static-regeneration
// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export async function getStaticProps({ params, preview = false }) {
  let slug

  // Special case: home page
  if (!params?.slug) {
    slug = 'home'
    console.log('--- SLUG ---', slug)
  } else {
    slug = params.slug.join('/')
  }

  let data
  // Check for page with matching slug
  try {
    data = await getPage(slug, preview)
    console.log('--- DATA ---', data)
  } catch (error) {
    console.log('--- ERROR ---', error)
    return
  }

  if (!data) {
    // `notFound` is an optional boolean value to allow the page to return a 404 status and page.
    return {
      notFound: true,
    }
  }

  return {
    props: {
      preview,
      page: data.page,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 10,
  }
}
