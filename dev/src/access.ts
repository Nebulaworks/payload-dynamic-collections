/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Access } from 'payload/config'
import type { FieldAccess } from 'payload/types'
import type { User } from './payload-types'

const isAdmin: Access | FieldAccess = async (props: { req: { user: User } }) => {
  const {
    req: { user },
  } = props

  return Boolean(user?.role?.includes('admin'))
}

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
  isAdmin: isAdmin as Access,
  isAdminOrSelf,
}

const fieldAccess = {
  isAdmin: isAdmin as FieldAccess,
}

export { collectionAccess, fieldAccess }
