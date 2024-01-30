import type { Hidden } from '../types'

/**
 * This dynamic collection will always be hidden in the admin console
 */
const always: Hidden = () => true

/**
 * This dynamic collection will always be visible in the admin console
 */
const never: Hidden = () => false

export default { always, never }
