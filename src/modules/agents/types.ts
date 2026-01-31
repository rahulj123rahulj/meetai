import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";


export type AgentType = inferRouterOutputs<AppRouter>['agents']['getOne']