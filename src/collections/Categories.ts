import type { CollectionConfig, CollectionBeforeValidateHook } from 'payload'

const autoGenerateSlug: CollectionBeforeValidateHook = async ({ data, operation, req }) => {
  if (!data) return data

  if ((operation === 'create' || operation === 'update') && data.name) {
    const incoming = data.slug?.trim()
    const base =
      incoming ||
      data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')

    let candidate = base
    let counter = 1
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const existing = await req.payload.find({
        collection: 'categories',
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

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'name',
    group: 'Shop',
    defaultColumns: ['name', 'parent', 'slug', 'featured'],
    listSearchableFields: ['name', 'slug'],
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeValidate: [autoGenerateSlug],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Auto-generated from name. Override manually if needed.',
      },
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        description:
          'Parent category – leave empty for top-level categories. Set a parent to make this a subcategory.',
      },
      filterOptions: ({ id }) => ({
        id: { not_equals: id },
      }),
    },
    {
      name: 'children',
      type: 'join',
      collection: 'categories',
      on: 'parent',
      admin: {
        description: 'Subcategories under this category',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Category icon or image',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Featured categories appear on the homepage',
      },
    },
  ],
}
