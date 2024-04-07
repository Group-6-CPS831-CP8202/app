import { z } from "zod";

const QuerySchema = z.object({
  id: z
    .string()
    .transform((val) => Number.parseInt(val, 10))
    .refine((val) => !Number.isNaN(val) && val >= 0, {
      message: "ID must be a non-negative number",
    })
    .optional(),
  created: z.string().datetime().optional(),
  updated: z.string().datetime().optional(),
  name: z.string().default("My Query").optional(),
  limit: z
    .string()
    .transform((val) => Number.parseInt(val, 10))
    .refine((val) => !Number.isNaN(val) && val > 0, {
      message: "Limit must be a positive number",
    })
    .default("10"),
  offset: z
    .string()
    .transform((val) => Number.parseInt(val, 10))
    .refine((val) => !Number.isNaN(val) && val >= 0, {
      message: "Offset must be a non-negative number",
    })
    .default("0"),
});

type Query = z.infer<typeof QuerySchema>;

export { QuerySchema };
export type { Query };
