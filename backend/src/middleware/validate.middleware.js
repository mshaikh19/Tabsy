const { AppError } = require("./error.middleware");

const validate = (schema) => {
  return async (req, res, next) => {
    try {
      if (schema.body) {
        req.body = await schema.body.parseAsync(req.body);
      }
      if (schema.query) {
        req.query = await schema.query.parseAsync(req.query);
      }
      if (schema.params) {
        req.params = await schema.params.parseAsync(req.params);
      }
      next();
    } catch (error) {
      if (error.name === "ZodError" && error.issues) {
        const details = error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        return next(new AppError("Validation failed", 400, "VALIDATION_ERROR", details));
      }
      next(error);
    }
  };
};

module.exports = validate;
