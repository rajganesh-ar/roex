import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: { useAsTitle: 'title', group: 'Content' },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'URL path for this page (e.g., "about", "contact")' },
    },
    {
      name: 'pageType',
      type: 'select',
      required: true,
      options: [
        { label: 'Home', value: 'home' },
        { label: 'About Us', value: 'about' },
        { label: 'Contact', value: 'contact' },
        { label: 'Shop', value: 'shop' },
        { label: 'Custom', value: 'custom' },
      ],
    },

    /* ─── Hero Section ─── */
    {
      name: 'hero',
      type: 'group',
      admin: { description: 'Hero section at the top of the page' },
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'subheading', type: 'text' },
        { name: 'backgroundImage', type: 'upload', relationTo: 'media' },
        { name: 'backgroundVideo', type: 'text', admin: { description: 'Video URL (mp4)' } },
        {
          name: 'mediaType',
          type: 'select',
          defaultValue: 'image',
          options: [
            { label: 'Image', value: 'image' },
            { label: 'Video', value: 'video' },
            { label: 'Shader', value: 'shader' },
          ],
        },
        { name: 'overlayOpacity', type: 'number', min: 0, max: 100, defaultValue: 40 },
        {
          name: 'ctaButtons',
          type: 'array',
          maxRows: 3,
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'link', type: 'text', required: true },
            {
              name: 'style',
              type: 'select',
              defaultValue: 'primary',
              options: [
                { label: 'Primary', value: 'primary' },
                { label: 'Outline', value: 'outline' },
              ],
            },
          ],
        },
      ],
    },

    /* ─── Hero Slides (for homepage carousel) ─── */
    {
      name: 'heroSlides',
      type: 'array',
      admin: { description: 'Hero carousel slides (homepage)' },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'imageUrl', type: 'text', admin: { description: 'External image URL (fallback)' } },
        { name: 'title', type: 'text', required: true },
        { name: 'subtitle', type: 'text' },
        { name: 'ctaLabel', type: 'text' },
        { name: 'ctaLink', type: 'text' },
      ],
    },

    /* ─── Page Sections ─── */
    {
      name: 'sections',
      type: 'array',
      fields: [
        {
          name: 'sectionType',
          type: 'select',
          required: true,
          options: [
            { label: 'Hero', value: 'hero' },
            { label: 'Featured Products', value: 'featured-products' },
            { label: 'Product Carousel', value: 'product-carousel' },
            { label: 'Categories', value: 'categories' },
            { label: 'Content Block', value: 'content' },
            { label: 'Gallery', value: 'gallery' },
            { label: 'Contact Form', value: 'contact-form' },
            { label: 'Stats', value: 'stats' },
            { label: 'Testimonials', value: 'testimonials' },
            { label: 'Inspiration', value: 'inspiration' },
            { label: 'Shader Section', value: 'shader' },
            { label: 'Video Section', value: 'video' },
            { label: 'Newsletter', value: 'newsletter' },
            { label: 'Full-Width Image', value: 'full-width-image' },
            { label: 'Two Column Text', value: 'two-col-text' },
            { label: 'Benefits / Why Buy', value: 'benefits' },
            { label: 'Team Grid', value: 'team' },
            { label: 'Timeline', value: 'timeline' },
            { label: 'FAQ', value: 'faq' },
            { label: 'CTA Banner', value: 'cta-banner' },
          ],
        },
        { name: 'heading', type: 'text' },
        { name: 'subheading', type: 'text' },
        { name: 'label', type: 'text', admin: { description: 'Small label above the heading' } },
        { name: 'content', type: 'richText' },
        { name: 'bodyText', type: 'textarea', admin: { description: 'Plain text content' } },
        {
          name: 'secondaryText',
          type: 'textarea',
          admin: { description: 'Secondary paragraph text' },
        },
        { name: 'image', type: 'upload', relationTo: 'media' },
        { name: 'imageUrl', type: 'text', admin: { description: 'External image URL' } },
        {
          name: 'images',
          type: 'array',
          fields: [
            { name: 'image', type: 'upload', relationTo: 'media' },
            { name: 'imageUrl', type: 'text' },
            { name: 'caption', type: 'text' },
            { name: 'title', type: 'text' },
            { name: 'subtitle', type: 'text' },
          ],
        },
        { name: 'buttonText', type: 'text' },
        { name: 'buttonLink', type: 'text' },
        {
          name: 'backgroundColor',
          type: 'select',
          options: [
            { label: 'White', value: 'white' },
            { label: 'Light Gray', value: 'gray' },
            { label: 'Black', value: 'black' },
          ],
          defaultValue: 'white',
        },
        /* Stats items */
        {
          name: 'stats',
          type: 'array',
          admin: { condition: (_, siblingData) => siblingData?.sectionType === 'stats' },
          fields: [
            { name: 'value', type: 'text', required: true },
            { name: 'label', type: 'text', required: true },
          ],
        },
        /* Testimonials */
        {
          name: 'testimonials',
          type: 'array',
          admin: { condition: (_, siblingData) => siblingData?.sectionType === 'testimonials' },
          fields: [
            { name: 'quote', type: 'textarea', required: true },
            { name: 'author', type: 'text', required: true },
            { name: 'role', type: 'text' },
            { name: 'rating', type: 'number', min: 1, max: 5, defaultValue: 5 },
          ],
        },
        /* Benefits */
        {
          name: 'benefits',
          type: 'array',
          admin: { condition: (_, siblingData) => siblingData?.sectionType === 'benefits' },
          fields: [
            {
              name: 'icon',
              type: 'select',
              options: [
                { label: 'Truck (Delivery)', value: 'truck' },
                { label: 'Return', value: 'return' },
                { label: 'Shield (Warranty)', value: 'shield' },
                { label: 'Headphones', value: 'headphones' },
                { label: 'Star', value: 'star' },
              ],
            },
            { name: 'title', type: 'text', required: true },
            { name: 'description', type: 'text', required: true },
          ],
        },
        /* Team members */
        {
          name: 'teamMembers',
          type: 'array',
          admin: { condition: (_, siblingData) => siblingData?.sectionType === 'team' },
          fields: [
            { name: 'name', type: 'text', required: true },
            { name: 'role', type: 'text' },
            { name: 'photo', type: 'upload', relationTo: 'media' },
            { name: 'photoUrl', type: 'text' },
          ],
        },
        /* Timeline milestones */
        {
          name: 'milestones',
          type: 'array',
          admin: { condition: (_, siblingData) => siblingData?.sectionType === 'timeline' },
          fields: [
            { name: 'year', type: 'text', required: true },
            { name: 'event', type: 'text', required: true },
          ],
        },
        /* FAQ items */
        {
          name: 'faqItems',
          type: 'array',
          admin: { condition: (_, siblingData) => siblingData?.sectionType === 'faq' },
          fields: [
            { name: 'question', type: 'text', required: true },
            { name: 'answer', type: 'textarea', required: true },
          ],
        },
        /* Inspiration items */
        {
          name: 'inspirationItems',
          type: 'array',
          admin: { condition: (_, siblingData) => siblingData?.sectionType === 'inspiration' },
          fields: [
            { name: 'image', type: 'upload', relationTo: 'media' },
            { name: 'imageUrl', type: 'text' },
            { name: 'title', type: 'text' },
            { name: 'subtitle', type: 'text' },
            { name: 'link', type: 'text' },
          ],
        },
        /* Video URL */
        { name: 'videoUrl', type: 'text', admin: { description: 'Video URL or embed' } },
      ],
    },

    /* ─── SEO ─── */
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'metaTitle', type: 'text' },
        { name: 'metaDescription', type: 'textarea' },
        { name: 'metaImage', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
