const { z } = require("zod");

const categories = [
  "TI",
  "RH",
  "COMPRAS",
  "FINANCEIRO",
  "INFRAESTRUTURA",
];

const statuses = [
  "ABERTO",
  "EM_ATENDIMENTO",
  "CONCLUIDO",
];

const createRequestSchema = z.object({
  title: z
    .string()
    .min(3)
    .max(150),

  description: z
    .string()
    .min(5),

  category: z
    .enum(categories),
});

const updateRequestSchema = z.object({
  title: z
    .string()
    .min(3)
    .max(150),

  description: z
    .string()
    .min(5),

  category: z
    .enum(categories),
});

const statusSchema = z.object({
  status: z.enum(statuses),
});

module.exports = {
  createRequestSchema,
  updateRequestSchema,
  statusSchema,
};