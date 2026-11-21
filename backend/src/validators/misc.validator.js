const { z } = require("zod");

const groupParams = { params: z.object({ id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID") }) };
const notifParams = { params: z.object({ id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID") }) };

module.exports = {
  groupParams: z.object(groupParams),
  notifParams: z.object(notifParams),
};