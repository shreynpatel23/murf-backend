function getErrorResponse(error) {
  return {
    error: error,
    data: null,
  };
}

module.exports = { getErrorResponse };
