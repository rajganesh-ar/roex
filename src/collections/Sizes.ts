import type { CollectionConfig } from 'payload'

export const Sizes: CollectionConfig = {
  slug: 'sizes',
  admin: {
    useAsTitle: 'label',
    group: 'Shop',
    defaultColumns: ['label', 'value', 'sortOrder'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      admin: {
        description: 'Display label (e.g. "Large", "1.5m")',
      },
    },
    {
      name: 'value',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        description: 'Machine-readable value (e.g. "lg", "1.5m")',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Controls display ordering',
      },
    },
  ],
}
