import type {
  CollectionConfig,
  CollectionBeforeChangeHook,
  CollectionBeforeValidateHook,
} from 'payload'

// ─── Slug auto-generation with uniqueness enforcement ────────────────────────
const autoGenerateSlug: CollectionBeforeValidateHook = async ({ data, operation, req }) => {
  if (!data) return data

  // Only auto-generate when creating or when `name` changed without a manual slug edit
  if ((operation === 'create' || operation === 'update') && data.name) {
    const incoming = data.slug?.trim()
    const base =
      incoming ||
      data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

    // Ensure uniqueness by querying existing docs
    let candidate = base
    let counter = 1
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const existing = await req.payload.find({
        collection: 'products',
        where: { slug: { equals: candidate } },
        limit: 1,
      })
      const collision = existing.docs?.[0]
      if (!collision || (operation === 'update' && collision.id === data.id)) break
      candidate = `${base}-${counter++}`
    }
    data.slug = candidate
  }
  return data
}

// ─── Audit: auto-populate createdBy / updatedBy ──────────────────────────────
const stampUser: CollectionBeforeChangeHook = async ({ data, req, operation }) => {
  if (!data) return data
  const userId = req.user?.id
  if (userId) {
    if (operation === 'create') data.createdBy = userId
    data.updatedBy = userId
  }
  return data
}

// ═════════════════════════════════════════════════════════════════════════════
// Products Collection
// ═════════════════════════════════════════════════════════════════════════════
export const Products: CollectionConfig = {
  slug: 'products',
  timestamps: true, // createdAt / updatedAt
  admin: {
    useAsTitle: 'name',
    group: 'Shop',
    defaultColumns: ['name', 'sku', 'availability', 'featured', 'active', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeValidate: [autoGenerateSlug],
    beforeChange: [stampUser],
  },

  fields: [
    // ── Core info ──────────────────────────────────────────────────────────
    {
      name: 'name',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Auto-generated from name. Override manually if needed.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'longDescription',
      type: 'richText',
      label: 'Long Description',
    },

    // ── Availability ──────────────────────────────────────────────────────
    {
      name: 'availability',
      type: 'select',
      required: true,
      defaultValue: 'available',
      options: [
        { label: 'Available', value: 'available' },
        { label: 'Unavailable', value: 'unavailable' },
      ],
      admin: {
        description: 'Unavailable products show a "Coming Soon" tag',
      },
    },

    // ── Categorisation & taxonomy (relationships) ─────────────────────────
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      index: true,
      admin: {
        description: 'Assign one or more categories',
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: {
        description: 'Assign tags for filtering & search',
      },
    },

    // ── Rich media gallery (with alt & caption, drag-ordered) ─────────────
    {
      name: 'images',
      type: 'array',
      required: true,
      minRows: 1,
      admin: {
        description: 'Drag to reorder. First image is the hero.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
          admin: {
            description: 'Accessibility alt text – overrides the media alt if provided',
          },
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },

    // ── SKU ───────────────────────────────────────────────────────────────
    {
      name: 'sku',
      type: 'text',
      label: 'SKU',
      unique: true,
      index: true,
    },

    // ── Variants (colour, size & media) ────────────────────────────────────
    {
      name: 'variants',
      type: 'array',
      label: 'Product Variants',
      admin: {
        description: 'Add colour/size combinations',
      },
      fields: [
        {
          name: 'sku',
          type: 'text',
          required: true,
          unique: true,
          label: 'Variant SKU',
        },
        {
          name: 'color',
          type: 'relationship',
          relationTo: 'colors',
        },
        {
          name: 'size',
          type: 'relationship',
          relationTo: 'sizes',
        },
        {
          name: 'variantImages',
          type: 'array',
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
          ],
        },
      ],
    },

    // ── Feature flags & merchandising ─────────────────────────────────────
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Show on homepage featured section',
      },
    },
    {
      name: 'newArrival',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Flag as a new arrival',
      },
    },
    {
      name: 'bestSeller',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Flag as a best seller',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Uncheck to hide the product without deleting it',
      },
    },
    {
      name: 'publishDate',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'Scheduled release date',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },

    // ── Structured specifications (relationship-based) ────────────────────
    {
      name: 'specifications',
      type: 'array',
      admin: {
        description: 'Add standardised specifications using predefined definitions',
      },
      fields: [
        {
          name: 'definition',
          type: 'relationship',
          relationTo: 'specification-definitions',
          admin: {
            description: 'Pick a spec type (e.g. "Weight", "Impedance")',
          },
        },
        {
          name: 'label',
          type: 'text',
          admin: {
            description: 'Specification label (auto-filled from definition if linked)',
          },
        },
        {
          name: 'value',
          type: 'text',
          required: true,
        },
      ],
    },

    // ── Documents (PDFs, manuals, datasheets) ─────────────────────────────
    {
      name: 'documents',
      type: 'array',
      label: 'Digital Assets & Documents',
      admin: {
        description: 'Attach PDFs, manuals, spec sheets, etc.',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },

    // ── SEO metadata (sidebar group) ──────────────────────────────────────
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          admin: { description: 'Falls back to product name if blank' },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          admin: { description: 'Falls back to product description if blank' },
        },
        {
          name: 'metaImage',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Social share / OG image' },
        },
        {
          name: 'keywords',
          type: 'text',
          admin: { description: 'Comma-separated keywords' },
        },
      ],
    },

    // ── Import tracking ───────────────────────────────────────────────────
    {
      name: 'sourceUrl',
      type: 'text',
      label: 'Source URL',
      index: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Original URL if imported from an external website',
      },
    },

    // ── Audit fields ──────────────────────────────────────────────────────
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Auto-populated',
      },
    },
    {
      name: 'updatedBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Auto-populated',
      },
    },
  ],
}
