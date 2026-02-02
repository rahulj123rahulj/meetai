import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";


export type SingleMeetingType = inferRouterOutputs<AppRouter>['meetings']['getOne']
export type MeetingsType = inferRouterOutputs<AppRouter>['meetings']['getMany']["items"]