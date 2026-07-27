// Every successful response follows the same envelope shape so the frontend
// can rely on a single response contract: { success, message, data }.
class ApiResponse {
  static send(res, { statusCode = 200, message = 'Success', data = null } = {}) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }
}

module.exports = ApiResponse;
