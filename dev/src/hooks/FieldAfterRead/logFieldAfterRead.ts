import payload from 'payload'
import type { FieldHook } from 'payload/types'

const logFieldAfterRead: FieldHook = ({ value }) => {
  payload.logger.info(value)
  return value
}

export default logFieldAfterRead
