import { promises as fs } from 'fs'
import path from 'path'

export default async function deleteStaticPageFiles(slug) {
  const staticPagesDirectory = path.join(process.cwd(), '.next/server/pages')
  const staticPagesFilenames = await fs.readdir(staticPagesDirectory)

  staticPagesFilenames.forEach((async (filename) => {
    if (filename === `${slug}.html` || filename === `${slug}.json`) {
      /**
       *  Example:
       *    /.next/server/pages/this-page-slug.html
       *    /.next/server/pages/this-page-slug.json
       */

      const filePath = path.join(staticPagesDirectory, filename)

      try {
        await fs.unlink(filePath)
      } catch (error) {
        console.log(error);
        return;
      }

      console.log(`DELETED: ${filePath}`)
    }
  }))
}
