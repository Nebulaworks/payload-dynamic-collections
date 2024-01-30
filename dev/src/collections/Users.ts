import type { CollectionConfig, FieldAccess } from 'payload/types'
import { collectionAccess, fieldAccess } from '../access'

const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  access: {
    update: collectionAccess.isAdminOrSelf,
    delete: collectionAccess.isAdmin,
    create: collectionAccess.isAdmin,
    read: collectionAccess.isAdminOrSelf,
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
        { label: 'Container', value: 'container' },
      ],
      access: {
        create: fieldAccess.isAdmin as FieldAccess,
        update: fieldAccess.isAdmin as FieldAccess,
      },
      required: true,
      defaultValue: 'user',
    },
    {
      name: 'name',
      type: 'text',
    },
  ],
}

export default Users
