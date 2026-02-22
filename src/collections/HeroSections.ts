import type { CollectionConfig } from 'payload'

export const HeroSections: CollectionConfig = {
  slug: 'hero-sections',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    description:
      'Manage hero slides. Recommended image size: 1920 × 1080 px (16:9). Use high-quality AVIF or WebP for best performance.',
    defaultColumns: ['title', 'order', 'mediaType', 'active'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'textarea',
    },
    {
      name: 'mediaType',
      type: 'select',
      required: true,
      defaultValue: 'image',
      options: [
        { label: 'Image', value: 'image' },
        { label: 'Video', value: 'video' },
      ],
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (data) => data.mediaType === 'image',
      },
    },
    {
      name: 'backgroundVideo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Upload an mp4 or webm video file',
        condition: (data) => data.mediaType === 'video',
      },
    },
    {
      name: 'backgroundVideoUrl',
      type: 'text',
      admin: {
        description: 'Or paste an external video URL instead of uploading',
        condition: (data) => data.mediaType === 'video',
      },
    },
    {
      name: 'overlayOpacity',
      type: 'number',
      min: 0,
      max: 100,
      defaultValue: 40,
      admin: {
        description: 'Overlay darkness (0-100)',
      },
    },
    {
      name: 'textAlignment',
      type: 'select',
      defaultValue: 'center',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
    {
      name: 'ctaButtons',
      type: 'array',
      maxRows: 2,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'link',
          type: 'text',
          required: true,
        },
        {
          name: 'style',
          type: 'select',
          defaultValue: 'primary',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
            { label: 'Outline', value: 'outline' },
          ],
        },
      ],
    },
    {
      name: 'height',
      type: 'select',
      defaultValue: 'full',
      options: [
        { label: 'Full Screen', value: 'full' },
        { label: 'Large (80vh)', value: 'large' },
        { label: 'Medium (60vh)', value: 'medium' },
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Slide order — lower numbers appear first. Use 1, 2, 3…',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
