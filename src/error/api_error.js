export default class ApiError extends Error {
  constructor (message, status, error) {
    super(message)
    this.message = message
    this.status = status
    this.error = error
  }
}
