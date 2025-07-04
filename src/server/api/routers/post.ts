import { z } from "zod";
import { eq } from "drizzle-orm";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { posts } from "~/server/db/schema";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(z.object({
      name: z.string().min(1),
      content: z.string().min(1),
      published: z.boolean().optional().default(false),
      views: z.number().int().min(0).optional().default(0),
      publishedAt: z.union([z.string().datetime(), z.null()]).optional(),
      category: z.enum(["tech", "life", "news", "other"]),
      imageUrl: z.string().url().optional().nullable(),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(posts).values({
        name: input.name, 
        content: input.content,
        published: input.published ?? false,
        views: input.views ?? 0,
        publishedAt: input.publishedAt ? new Date(input.publishedAt) : null,
        category: input.category,
        imageUrl: input.imageUrl ?? null,
      });
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });

    return post ?? null;
  }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.posts.findMany({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
  }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(posts).where(eq(posts.id, input.id));
    }),

  update: publicProcedure
    .input(z.object({ id: z.number(), name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.update(posts)
        .set({ name: input.name })
        .where(eq(posts.id, input.id));
    }),
});
