import type { CollectionConfig } from 'payload'

export const MenuItems: CollectionConfig = {
  slug: 'menu-items',
  admin: {
    useAsTitle: 'label',
    group: 'Content',
    description: 'Define navigation menu structure',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
    },
    {
      name: 'link',
      type: 'text',
      admin: {
        description: 'Leave empty for dropdown menus',
      },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      defaultValue: 0,
    },
    {
      name: 'megaMenu',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Enable full-width mega menu dropdown',
      },
    },
    {
      name: 'columns',
      type: 'array',
      admin: {
        condition: (data) => data.megaMenu,
      },
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'links',
          type: 'array',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'url',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              type: 'text',
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
      ],
    },
    {
      name: 'simpleDropdown',
      type: 'array',
      admin: {
        condition: (data) => !data.megaMenu && !data.link,
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'featured',
      type: 'group',
      admin: {
        condition: (data) => data.megaMenu,
      },
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'link',
          type: 'text',
        },
      ],
    },
  ],
}
