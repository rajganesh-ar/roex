import type { CollectionConfig } from 'payload'

export const Colors: CollectionConfig = {
  slug: 'colors',
  admin: {
    useAsTitle: 'name',
    group: 'Shop',
    defaultColumns: ['name', 'hex'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'hex',
      type: 'text',
      label: 'Hex Color Code',
      admin: {
        description: 'e.g. #000000',
      },
    },
  ],
}
