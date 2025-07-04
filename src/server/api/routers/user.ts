import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { users } from "~/server/db/schema";

export const userRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.users.findMany({
      orderBy: (users, { desc }) => [desc(users.createdAt)],
    });
  }),
  create: publicProcedure
    .input(z.object({ name: z.string().min(1), email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(users).values({
        name: input.name,
        email: input.email,
      });
    }),
}); 