/**
 * Error thrown by the service layer. Mirrors an HTTP error response so that
 * components handle the in-memory store and the Part 2 REST API the same way.
 */
export default class ApiError extends Error {
  constructor(status, message, fieldErrors = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}
