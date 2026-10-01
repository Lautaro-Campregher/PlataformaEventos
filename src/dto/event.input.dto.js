export const createEventInputDTO = {
  allowedFields: [
    "title",
    "description",
    "category",
    "date",
    "location",
    "capacity",
    "price",
  ],

  requiredFields: [
    "title",
    "description",
    "category",
    "date",
    "location",
    "capacity",
    "price",
  ],

  fieldTypes: {
    title: "string",
    description: "string",
    category: "string",
    date: "date",
    location: "string",
    capacity: "integer",
    price: "number",
  },

  dto: (body) => ({
    title: body.title,
    description: body.description,
    category: body.category,
    date: body.date,
    location: body.location,
    capacity: body.capacity,
    price: body.price,
  }),
};

export const updateEventInputDTO = {
  allowedFields: [
    "title",
    "description",
    "category",
    "date",
    "location",
    "capacity",
    "price",
  ],

  requiredFields: [],

  fieldTypes: {
    title: "string",
    description: "string",
    category: "string",
    date: "date",
    location: "string",
    capacity: "integer",
    price: "number",
  },

  dto: (body) => ({
    title: body.title,
    description: body.description,
    category: body.category,
    date: body.date,
    location: body.location,
    capacity: body.capacity,
    price: body.price,
  }),
};

export const changeEventStatusInputDTO = {
  allowedFields: ["status"],

  requiredFields: ["status"],

  fieldTypes: {
    status: "string",
  },

  dto: (body) => ({
    status: body.status,
  }),
};
