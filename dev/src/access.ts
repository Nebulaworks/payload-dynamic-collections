/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Access } from 'payload/config'
import type { FieldAccess } from 'payload/types'
import type { User } from './payload-types'

/**
 * Access control function to check if a user is an admin
 */
const isAdmin: Access | FieldAccess = async (props: { req: { user: User } }) => {
  const {
    req: { user },
  } = props

  return Boolean(user?.role?.includes('admin'))
}

/**
 * Access control function to check if a user is an admin or the user themselves
 */
const isAdminOrSelf: Access = async (props: { req: { user: User }; id?: string | number }) => {
  const {
    req: { user },
  } = props
  const { id } = props

  if (user) {
    if (user.role.includes('admin') || user.id === id) {
      return true
    }
  }

  return false
}

const collectionAccess = {
  isAdmin: isAdmin as Access, // Since isAdmin is also a FieldAccess, we need to cast it as an Access
  isAdminOrSelf,
}

const fieldAccess = {
  isAdmin: isAdmin as FieldAccess, // Since isAdmin is also an Access, we need to cast it as a FieldAccess
}

export { collectionAccess, fieldAccess }
