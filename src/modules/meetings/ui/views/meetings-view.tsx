"use client";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query";

const MeetingView = () =>{
    const trpc = useTRPC();
    const {data} = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}));
    return(
        <div>
            {JSON.stringify(data?.items, null, 2)}
        </div>
    )
}
export default MeetingView

export const MeetingsViewLoading = ()=>{
    return <LoadingState title="Loading Meetings" description="This may take a few seconds"/>
}

export const MeetingsViewError = ()=>{
    return <ErrorState title="Error Loading Meetings" description="Please try again later"/>
}