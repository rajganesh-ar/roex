import type {
  CollectionConfig,
  CollectionBeforeChangeHook,
  CollectionBeforeValidateHook,
} from 'payload'
import {
  lexicalEditor,
  BlocksFeature,
  UploadFeature,
  HeadingFeature,
  LinkFeature,
  InlineCodeFeature,
  OrderedListFeature,
  UnorderedListFeature,
  ChecklistFeature,
  HorizontalRuleFeature,
} from '@payloadcms/richtext-lexical'

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Generate a URL-safe slug from a string */
function toSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Rough word count from a Lexical richText JSON tree */
function countWordsInLexical(node: any): number {
  if (!node) return 0
  let count = 0
  if (node.text && typeof node.text === 'string') {
    count += node.text.split(/\s+/).filter(Boolean).length
  }
  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      count += countWordsInLexical(child)
    }
  }
  if (node.root) {
    count += countWordsInLexical(node.root)
  }
  return count
}

// ── Hooks ────────────────────────────────────────────────────────────────────

const autoSlug: CollectionBeforeValidateHook = ({ data }) => {
  if (data && data.title && !data.slug) {
    data.slug = toSlug(data.title)
  }
  return data
}

const computeReadingTime: CollectionBeforeChangeHook = ({ data }) => {
  if (!data) return data
  let totalWords = 0

  // Count words in richText content
  if (data.content) {
    totalWords += countWordsInLexical(data.content)
  }

  // Count words in layout blocks
  if (Array.isArray(data.layout)) {
    for (const block of data.layout) {
      if (block.blockType === 'textBlock' && block.text) {
        totalWords += countWordsInLexical(block.text)
      }
      if (block.blockType === 'quoteBlock' && block.quoteText) {
        totalWords += block.quoteText.split(/\s+/).filter(Boolean).length
      }
    }
  }

  // Average 238 WPM reading speed
  data.readingTime = Math.max(1, Math.ceil(totalWords / 238))
  return data
}

const stampAuthor: CollectionBeforeChangeHook = ({ data, req, operation }) => {
  if (!data || !req.user) return data
  if (operation === 'create') {
    data.createdBy = req.user.id
  }
  data.updatedBy = req.user.id
  return data
}

const autoPublishScheduled: CollectionBeforeChangeHook = ({ data }) => {
  if (!data) return data
  if (
    data.status === 'scheduled' &&
    data.scheduledPublishDate &&
    new Date(data.scheduledPublishDate) <= new Date()
  ) {
    data.status = 'published'
    data.publishedDate = data.scheduledPublishDate
  }
  return data
}

// ── Collection ───────────────────────────────────────────────────────────────

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  admin: {
    useAsTitle: 'title',
    group: 'Blog',
    defaultColumns: ['title', 'author', 'status', 'publishedDate'],
    description: 'Blog posts with rich content, taxonomy, SEO, and scheduling',
  },
  access: {
    read: () => true,
  },
  timestamps: true,
  hooks: {
    beforeValidate: [autoSlug],
    beforeChange: [computeReadingTime, stampAuthor, autoPublishScheduled],
  },

  fields: [
    // ── Core ──────────────────────────────────────────────────────────────
    {
      name: 'title',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        description: 'Auto-generated from title if left blank',
        position: 'sidebar',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      maxLength: 300,
      admin: {
        description: 'Short summary for cards and SEO (max 300 chars)',
      },
    },

    // ── Featured Image ────────────────────────────────────────────────────
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Primary hero image for the post',
      },
    },

    // ── Gallery ───────────────────────────────────────────────────────────
    {
      name: 'gallery',
      type: 'array',
      label: 'Gallery',
      admin: {
        description: 'Additional images/videos for the post',
      },
      fields: [
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
          admin: { description: 'Overrides the media alt text if provided' },
        },
        {
          name: 'caption',
          type: 'textarea',
        },
      ],
    },

    // ── Rich Text Content ─────────────────────────────────────────────────
    {
      name: 'content',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          UploadFeature({
            collections: {
              media: {
                fields: [
                  {
                    name: 'caption',
                    type: 'textarea',
                  },
                ],
              },
            },
          }),
        ],
      }),
    },

    // ── Layout Blocks ─────────────────────────────────────────────────────
    {
      name: 'layout',
      type: 'blocks',
      label: 'Content Blocks',
      admin: {
        description: 'Add modular content sections',
      },
      blocks: [
        // Text block
        {
          slug: 'textBlock',
          labels: { singular: 'Text', plural: 'Text Blocks' },
          fields: [
            {
              name: 'text',
              type: 'richText',
              required: true,
            },
          ],
        },
        // Image block
        {
          slug: 'imageBlock',
          labels: { singular: 'Image', plural: 'Image Blocks' },
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'caption',
              type: 'text',
            },
            {
              name: 'size',
              type: 'select',
              defaultValue: 'full',
              options: [
                { label: 'Full Width', value: 'full' },
                { label: 'Half Width', value: 'half' },
                { label: 'Third Width', value: 'third' },
              ],
            },
          ],
        },
        // Video block
        {
          slug: 'videoBlock',
          labels: { singular: 'Video', plural: 'Video Blocks' },
          fields: [
            {
              name: 'video',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Upload a video file (mp4, webm)' },
            },
            {
              name: 'externalUrl',
              type: 'text',
              admin: { description: 'Or provide a direct video URL' },
            },
            {
              name: 'caption',
              type: 'text',
            },
          ],
        },
        // Quote block
        {
          slug: 'quoteBlock',
          labels: { singular: 'Quote', plural: 'Quote Blocks' },
          fields: [
            {
              name: 'quoteText',
              type: 'textarea',
              required: true,
            },
            {
              name: 'attribution',
              type: 'text',
              admin: { description: 'Person or source of the quote' },
            },
          ],
        },
        // Embed block (YouTube, etc.)
        {
          slug: 'embedBlock',
          labels: { singular: 'Embed', plural: 'Embed Blocks' },
          fields: [
            {
              name: 'embedUrl',
              type: 'text',
              required: true,
              admin: { description: 'YouTube, Vimeo, or other embed URL' },
            },
            {
              name: 'caption',
              type: 'text',
            },
            {
              name: 'aspectRatio',
              type: 'select',
              defaultValue: '16:9',
              options: [
                { label: '16:9', value: '16:9' },
                { label: '4:3', value: '4:3' },
                { label: '1:1', value: '1:1' },
              ],
            },
          ],
        },
      ],
    },

    // ── Taxonomy ──────────────────────────────────────────────────────────
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        description: 'Post author',
      },
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'blog-categories',
      hasMany: true,
      index: true,
      admin: {
        description: 'Assign one or more blog categories',
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'blog-tags',
      hasMany: true,
      admin: {
        description: 'Tags for filtering and discovery',
      },
    },

    // ── Related Posts ─────────────────────────────────────────────────────
    {
      name: 'relatedPosts',
      type: 'relationship',
      relationTo: 'blog-posts',
      hasMany: true,
      admin: {
        description: 'Related posts shown at the end for further reading',
      },
    },

    // ── Publishing Controls ───────────────────────────────────────────────
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      index: true,
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Scheduled', value: 'scheduled' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Publication status',
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
      index: true,
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
        description: 'Date the post was/will be published',
      },
    },
    {
      name: 'scheduledPublishDate',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
        description: 'Set a future date to auto-publish',
        condition: (data) => data?.status === 'scheduled',
      },
    },

    // ── Engagement ────────────────────────────────────────────────────────
    {
      name: 'readingTime',
      type: 'number',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Auto-calculated reading time (minutes)',
      },
    },
    {
      name: 'viewCount',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Total page views',
      },
    },
    {
      name: 'allowComments',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Allow reader comments on this post',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Featured posts appear prominently on homepage',
      },
    },

    // ── SEO ───────────────────────────────────────────────────────────────
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      admin: {
        position: 'sidebar',
        description: 'Search engine and social media controls',
      },
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          maxLength: 70,
          admin: {
            description: 'Override the page title for search engines (max 70 chars)',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          maxLength: 160,
          admin: {
            description: 'Meta description for search results (max 160 chars)',
          },
        },
        {
          name: 'metaImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Open Graph / social preview image',
          },
        },
        {
          name: 'canonicalURL',
          type: 'text',
          admin: {
            description: 'Override canonical URL if cross-posting',
          },
        },
        {
          name: 'keywords',
          type: 'text',
          admin: {
            description: 'Comma-separated keywords for meta tag',
          },
        },
      ],
    },

    // ── Audit ─────────────────────────────────────────────────────────────
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'User who created this post',
      },
    },
    {
      name: 'updatedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'User who last updated this post',
      },
    },
  ],
}
