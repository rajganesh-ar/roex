import * as migration_20260215_133358 from './20260215_133358'
import * as migration_20260216_180154 from './20260216_180154'
import * as migration_20260217_131343_add_sourceUrl from './20260217_131343_add_sourceUrl'
import * as migration_20260219_000000_add_availability_and_parent from './20260219_000000_add_availability_and_parent'

export const migrations = [
  {
    up: migration_20260215_133358.up,
    down: migration_20260215_133358.down,
    name: '20260215_133358',
  },
  {
    up: migration_20260216_180154.up,
    down: migration_20260216_180154.down,
    name: '20260216_180154',
  },
  {
    up: migration_20260217_131343_add_sourceUrl.up,
    down: migration_20260217_131343_add_sourceUrl.down,
    name: '20260217_131343_add_sourceUrl',
  },
  {
    up: migration_20260219_000000_add_availability_and_parent.up,
    down: migration_20260219_000000_add_availability_and_parent.down,
    name: '20260219_000000_add_availability_and_parent',
  },
]
