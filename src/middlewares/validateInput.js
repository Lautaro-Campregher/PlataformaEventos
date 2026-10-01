export const validateInput = ({
  dto,
  allowedFields,
  requiredFields = [],
  fieldTypes = {},
}) => {
  return (req, res, next) => {
    const body = req.body;

    const unexpectedFields = Object.keys(body).filter(
      (field) => !allowedFields.includes(field),
    );

    if (unexpectedFields.length > 0) {
      return res.status(400).json({
        status: "error",
        message: `Campos no permitidos: ${unexpectedFields.join(", ")}`,
      });
    }

    for (const field of requiredFields) {
      if (
        body[field] === undefined ||
        body[field] === null ||
        body[field] === ""
      ) {
        return res.status(400).json({
          status: "error",
          message: `El campo ${field} es obligatorio`,
        });
      }
    }

    for (const [field, type] of Object.entries(fieldTypes)) {
      if (body[field] === undefined || body[field] === null) {
        continue;
      }

      const value = body[field];

      if (type === "string" && typeof value !== "string") {
        return res.status(400).json({
          status: "error",
          message: `El campo ${field} debe ser un texto`,
        });
      }

      if (type === "number" && typeof value !== "number") {
        return res.status(400).json({
          status: "error",
          message: `El campo ${field} debe ser un número`,
        });
      }

      if (type === "integer" && !Number.isInteger(value)) {
        return res.status(400).json({
          status: "error",
          message: `El campo ${field} debe ser un número entero`,
        });
      }

      if (type === "date") {
        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
          return res.status(400).json({
            status: "error",
            message: `El campo ${field} debe contener una fecha válida`,
          });
        }
      }
    }

    req.body = dto(body);

    next();
  };
};
