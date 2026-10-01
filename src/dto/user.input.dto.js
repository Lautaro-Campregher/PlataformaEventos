export const registerUserInputDTO = {
  allowedFields: ["first_name", "last_name", "email", "password"],

  requiredFields: ["first_name", "last_name", "email", "password"],

  fieldTypes: {
    first_name: "string",
    last_name: "string",
    email: "string",
    password: "string",
  },

  dto: (body) => ({
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    password: body.password,
  }),
};

export const loginUserInputDTO = {
  allowedFields: ["email", "password"],

  requiredFields: ["email", "password"],

  fieldTypes: {
    email: "string",
    password: "string",
  },

  dto: (body) => ({
    email: body.email,
    password: body.password,
  }),
};
