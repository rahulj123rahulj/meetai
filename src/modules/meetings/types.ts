import { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";


export type SingleMeetingType = inferRouterOutputs<AppRouter>['meetings']['getOne']
export type MeetingsType = inferRouterOutputs<AppRouter>['meetings']['getMany']["items"]
export enum MeetingStatus {
    Upcoming = "upcoming",
    Active = "active",
    Completed = "completed",
    Processing = "processing",
    Cancelled = "cancelled"
}

export type StreamTrancriptItem = {
    speaker_id: string;
    type: string;
    text: string;
    start_ts: number;
    stop_ts: number;
}