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
        <title>{page.title}</title>
      </Head>
      <Content content={page.content}></Content>
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

export async function getStaticPaths() {
  return {
    // Render ZERO pages at build time
    paths: [],
    fallback: true,
  }
}

export async function getStaticProps({ params, preview = false }) {
  let slug

  if (!params?.slug) {
    slug = 'home'
    console.log('--- SLUG ---', slug)
  } else {
    slug = params.slug.join('/')
  }

  let data

  try {
    data = await getPage(slug, preview)
    console.log('--- DATA ---', data)
  } catch (error) {
    console.log(error)
  }

  if (!data) {
    // notFound is not needed for fallback: false mode as only paths
    // returned from getStaticPaths will be pre-rendered.
    return {
      notFound: true,
    }
  }

  return {
    props: {
      preview,
      page: data.page,
    },
    revalidate: 1,
  }
}
