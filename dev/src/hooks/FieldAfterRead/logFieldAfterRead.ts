import payload from 'payload'
import type { FieldHook } from 'payload/types'

/**
 * This hook logs the value of the field after it has been read
 */
const logFieldAfterRead: FieldHook = ({ value }) => {
  payload.logger.info(value)
  return value
}

export default logFieldAfterRead
