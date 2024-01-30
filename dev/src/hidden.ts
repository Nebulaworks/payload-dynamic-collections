import type { Hidden } from '../../src/types'
import type { User } from './payload-types'

// eslint-disable-next-line no-unused-vars

interface hiddenProps {
  user: User
}

const isAdmin: Hidden = props => {
  const { user } = props as hiddenProps
  if (user?.role === 'admin') {
    return false
  }

  return true
}

export default { isAdmin }
