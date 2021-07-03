async function fetchAPI(query, { variables, preview } = {}) {
  const res = await fetch(process.env.GRAPHCMS_CONTENT_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${
        preview
          ? process.env.GRAPHCMS_DRAFT_AUTH_TOKEN
          : process.env.GRAPHCMS_PUBLISHED_AUTH_TOKEN
      }`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })
  const json = await res.json()

  if (json.errors) {
    // console.log(process.env.NEXT_EXAMPLE_CMS_GCMS_PROJECT_ID)
    console.error(json.errors)
    throw new Error('Failed to fetch API')
  }

  return json.data
}

export async function getPage(slug, preview) {
  const data = await fetchAPI(
    `
    query PageBySlug($slug: String!, $stage: Stage!) {
      page(stage: $stage, where: {slug: $slug}) {
        id
        createdAt
        updatedAt
        publishedAt
        title
        content {
          html
        }
        slug
      }
    }
  `,
    {
      preview,
      variables: {
        stage: preview ? 'DRAFT' : 'PUBLISHED',
        slug,
      },
    }
  )

  return data
}
