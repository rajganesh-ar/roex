import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Categories } from './collections/Categories'
import { Products } from './collections/Products'
import { Pages } from './collections/Pages'
import { HeroSections } from './collections/HeroSections'
import { MenuItems } from './collections/MenuItems'
import { BlogPosts } from './collections/BlogPosts'
import { BlogCategories } from './collections/BlogCategories'
import { BlogTags } from './collections/BlogTags'
import { Colors } from './collections/Colors'
import { Sizes } from './collections/Sizes'
import { Tags } from './collections/Tags'
import { SpecificationDefinitions } from './collections/SpecificationDefinitions'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Categories,
    Colors,
    Sizes,
    Tags,
    SpecificationDefinitions,
    Products,
    Pages,
    HeroSections,
    MenuItems,
    BlogCategories,
    BlogTags,
    BlogPosts,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
      max: 10,
      idleTimeoutMillis: 60000,
      connectionTimeoutMillis: 10000,
      keepAlive: true,
      keepAliveInitialDelayMillis: 10000,
    },
    push: false, // Use migrations instead — skips slow schema introspection on startup
  }),
  sharp,
  plugins: [],
})
