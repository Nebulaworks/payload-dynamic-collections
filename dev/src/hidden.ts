import type { Hidden } from '../../src/types'
import type { User } from './payload-types'

interface hiddenProps {
  user: User
}

/**
 * This example hidden only shows the collection in the admin console if the user is an admin
 */
const isAdmin: Hidden = props => {
  const { user } = props as hiddenProps
  if (user?.role === 'admin') {
    return false
  }

  return true
}

export default { isAdmin }
