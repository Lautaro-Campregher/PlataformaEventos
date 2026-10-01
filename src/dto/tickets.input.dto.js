export const createTicketInputDTO = {
  allowedFields: ["quantity"],

  requiredFields: ["quantity"],

  fieldTypes: {
    quantity: "integer",
  },

  dto: (body) => ({
    quantity: body.quantity,
  }),
};
