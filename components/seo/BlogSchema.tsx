import { Blog } from "@prisma/client";
import JsonLd from "./JsonLd";
import { getImageUrl } from "@/lib/utils";

export default function BlogSchema({ blog, locale }: { blog: Blog, locale: string }) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://luxuscarrental.com";
  const blogUrl = `${baseUrl}/${locale}/blog/${blog.slug}`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.title,
    "image": [
      getImageUrl(blog.cover)
    ],
    "datePublished": new Date(blog.createdAt).toISOString(),
    "dateModified": new Date(blog.updatedAt).toISOString(),
    "author": [{
      "@type": "Organization",
      "name": process.env.NEXT_PUBLIC_SITE_NAME,
      "url": baseUrl
    }],
    "publisher": {
      "@type": "Organization",
      "name": process.env.NEXT_PUBLIC_SITE_NAME,
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    },
    "description": blog.info,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": blogUrl
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${baseUrl}/${locale}`
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": `${baseUrl}/${locale}/blog`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": blog.title,
        "item": blogUrl
      }
    ]
  };

  return (
    <>
      <JsonLd data={schema} />
      <JsonLd data={breadcrumbSchema} />
    </>
  );
}
