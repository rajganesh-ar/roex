import type { CollectionConfig } from 'payload'

export const SpecificationDefinitions: CollectionConfig = {
  slug: 'specification-definitions',
  admin: {
    useAsTitle: 'label',
    group: 'Shop',
    defaultColumns: ['label', 'unit', 'group'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      index: true,
      admin: {
        description: 'e.g. "Frequency Response", "Weight", "Impedance"',
      },
    },
    {
      name: 'unit',
      type: 'text',
      admin: {
        description: 'e.g. "Hz", "kg", "Ohm"',
      },
    },
    {
      name: 'group',
      type: 'select',
      options: [
        { label: 'General', value: 'general' },
        { label: 'Electrical', value: 'electrical' },
        { label: 'Physical', value: 'physical' },
        { label: 'Performance', value: 'performance' },
      ],
      defaultValue: 'general',
    },
  ],
}
