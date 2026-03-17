# Content Publishing Guide

## How Blog Posts Work

All blog posts live in a single file: `src/data/blog.ts`

Posts are published automatically by a daily cron job that rebuilds the site at **22:00 UTC** every day.

| Timezone | Publish Time |
|---|---|
| Florida / NY / NJ (EDT) | 6:00 PM |
| San Diego (PDT) | 3:00 PM |

## Adding a New Blog Post

1. Add the post object to the `blogPosts` array in `src/data/blog.ts`
2. Set the `publishDate` field (see format below)
3. Commit and push to git
4. The post goes live automatically at the next scheduled rebuild after its `publishDate`

## publishDate Format

**Date only** (goes live at midnight on that date):
```typescript
publishDate: '2026-03-25'
```

**Date and time in UTC** (goes live at an exact time):
```typescript
publishDate: '2026-03-25T22:00'  // 6 PM Eastern, 3 PM Pacific
```

**No publishDate** (goes live immediately on next build):
```typescript
// Simply omit the publishDate field
```

## Example Post

```typescript
{
  slug: 'spring-roofing-tips',
  title: '5 Spring Roofing Tips Every Homeowner Should Know',
  excerpt: 'A short description for search results and social sharing.',
  category: 'Local SEO',
  author: 'Web Wise Team',
  authorBio: 'Author credentials here.',
  date: 'Mar 25, 2026',
  publishDate: '2026-03-25T22:00',  // Goes live 6 PM Eastern
  readTime: '10 min read',
  featured: false,
  keywords: ['roofing tips', 'spring roof maintenance'],
  image: 'https://images.unsplash.com/photo-example?w=1200&h=630&fit=crop',
  imageAlt: 'Descriptive alt text for the featured image',
  relatedServiceUrl: '/local-seo',
  relatedServiceName: 'Local SEO',
  tldr: [
    'Key takeaway one',
    'Key takeaway two',
    'Key takeaway three',
  ],
  faqs: [
    { question: 'FAQ question here?', answer: 'Answer here.' },
  ],
  content: `## Your First H2 as a Question?

Your 40-60 word answer here. Then expand below.

### Subheading

More content...
  `,
}
```

## Content Structure Rules

Every post must follow this structure:

1. **TL;DR box** - 3 to 6 key takeaway bullet points (optimized for AI Overviews)
2. **Question-based H2s** - Every H2 heading is a question with a 40-60 word direct answer
3. **Internal links** - Link to at least one service page AND one related blog post in the first paragraph
4. **FAQ section** - 5 to 7 FAQs with question/answer pairs (renders as schema markup automatically)
5. **~1,800 words** target length
6. **No long dashes** in content, **no colons** in titles
7. **Title tag format** - `Post Title - Web Wise` (use `-` not `|`)

## Schema Markup

Schema is generated automatically from the post data:
- **Article schema** - from title, excerpt, author, date, image
- **FAQ schema** - from the `faqs` array
- **BreadcrumbList schema** - from the URL structure
- **Service schema** - auto-detected from keywords (for industry-specific posts)

No manual schema setup needed.

## Sitemap

Posts are automatically added to `/sitemap.xml` when published. Unpublished (future-dated) posts are excluded from the sitemap until their `publishDate` arrives and the site rebuilds.
