/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Access } from 'payload/config'
import type { FieldAccess } from 'payload/types'

/**
 * Allow access to all traffic
 */
const open: Access | FieldAccess = () => true

/**
 * Allow access to all authenticated users
 */
const allUsers: Access | FieldAccess = async (props: { req: { user: unknown } }) => {
  const {
    req: { user },
  } = props

  return Boolean(user)
}

const collectionAccess = {
  open: open as Access,
  allUsers: allUsers as Access,
}

const fieldAccess = {
  open: open as FieldAccess,
  allUsers: allUsers as FieldAccess,
}

export { collectionAccess, fieldAccess }
