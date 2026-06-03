const ApiError = require("../utils/apiError");

const validate = (schema) => {
  return (req, res, next) => {
    try {
      console.log(req.body);
      
      req.body = schema.parse(req.body);

      next();
    } catch (error) {
      next(
        new ApiError(
          400,
          error || "Validation Error"
        )
      );
    }
  };
};

module.exports = validate;