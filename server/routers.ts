import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from 'zod';
import { getDb } from './db';
import { visitors } from '../drizzle/schema';
import { desc, eq, inArray } from 'drizzle-orm';

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Visitors management
  visitors: router({
    list: protectedProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      
      const result = await db
        .select()
        .from(visitors)
        .orderBy(desc(visitors.updatedAt));
      
      return result.map(v => ({
        ...v,
        formData: v.formData ? JSON.parse(v.formData) : {},
      }));
    }),
    
    markAsRead: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) return { success: false };
        
        await db
          .update(visitors)
          .set({ isRead: 1 })
          .where(eq(visitors.id, input.id));
        
        return { success: true };
      }),
    
    toggleFavorite: protectedProcedure
      .input(z.object({ id: z.number(), isFavorite: z.boolean() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) return { success: false };
        
        await db
          .update(visitors)
          .set({ isFavorite: input.isFavorite ? 1 : 0 })
          .where(eq(visitors.id, input.id));
        
        return { success: true };
      }),
    
    delete: protectedProcedure
      .input(z.object({ ids: z.array(z.number()) }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) return { success: false };
        
        await db
          .delete(visitors)
          .where(inArray(visitors.id, input.ids));
        
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
