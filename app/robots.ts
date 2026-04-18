import { MetadataRoute } from 'next'
import { METADATA_BASE_URL } from '@/lib/utils'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = METADATA_BASE_URL

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
