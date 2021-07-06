import { getPage } from '../../lib/graphcms'

export default async function handler(req, res) {
  const { method, body } = req

  // Only allow POST requests
  if (req.method.toUpperCase() !== 'POST') {
    res.setHeader('Allow', ['POST'])
    console.log(`Method ${method} Not Allowed`)
    res.status(405).end(`Method ${method} Not Allowed`)
    return
  }

  const { slug } = JSON.parse(body)
  let data

  // Check if page with slug exists
  try {
    data = await getPage(slug)

    if (!data.page) {
      throw new Error(`Page with slug: '${slug}' does not exist`)
    }
  } catch (error) {
    res.status(404).json({ error: error.message })
    return
  }

  // Trigger page build with a GET requst to the local page URL
  try {
    const fetchResponse = await fetch(`http://localhost:3000/${slug}`)
    let { status } = fetchResponse
    // Send the API page data back with response
    res.status(status).json({ status, data })
  } catch (error) {
    console.log('Error:', error)
    res.status(404).json({ error: error.message })
    return
  }
}
