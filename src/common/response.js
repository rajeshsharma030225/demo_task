function SuccessResponse(StatusCode = 200, message, data = {}) {
  return {
    success: true,
    statusCodes: StatusCode,
    message,
    data,
  };
}

function ErrorResponse(StatusCode = 400, message, data = {}) {
  return {
    success: false,
    statusCodes: StatusCode,
    message,
    data,
  };
}

module.exports = {
  SuccessResponse,
  ErrorResponse,
};
