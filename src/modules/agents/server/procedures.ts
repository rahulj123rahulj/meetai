import { db } from '@/db';
import { agents } from '@/db/schema';
import { baseProcedure, createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { AgentFormSchema } from '../schema';
import { eq } from 'drizzle-orm';
import z from 'zod';
export const agentsRouter = createTRPCRouter({
    getOne: protectedProcedure.input(z.object({
        id: z.string()
    })).query(async ({input}) => {
        const [data] = await db
                            .select()
                            .from(agents)
                            .where(
                                eq(agents.id, input.id)
                            );
        return data
    }),
    // TODO: Update to use Protected route 
    getMany: baseProcedure.query(async () => {
        const data = await db
                            .select()
                            .from(agents);
        return data;
    }),
    create : protectedProcedure
        .input(AgentFormSchema)
        .mutation(async ({input, ctx})=>{
            const [createdAgent] = await db
                .insert(agents)
                .values({
                    ...input,
                    userId: ctx.auth.user.id
                }).returning();
        return createdAgent
    })   
})

export type AgentsRouter = typeof agentsRouter;
