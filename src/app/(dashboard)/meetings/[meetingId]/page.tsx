import { auth } from "@/lib/auth"
import SingleMeetingView, { SingleMeetingErrorState, SingleMeetingLoadingState } from "@/modules/meetings/ui/views/single-meeting-view"
import { getQueryClient, trpc } from "@/trpc/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { ErrorBoundary } from "react-error-boundary"

interface Props {
    params: Promise<{
        meetingId: string
    }>
}

const Page = async ({ params }: Props) => {
    const { meetingId } = await params
    const session  = auth.api.getSession({
        headers: await headers()
    })
    if(!session){
        redirect("/sign-in")
    }
    const queryClient = getQueryClient(); 
    void queryClient.prefetchQuery(
        trpc.meetings.getOne.queryOptions({id: meetingId})
    ); 

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<SingleMeetingLoadingState />}>
                <ErrorBoundary fallback={<SingleMeetingErrorState />}>
                    <SingleMeetingView meetingId={meetingId} />
                </ErrorBoundary>
            </Suspense>

        </HydrationBoundary>
    )}

export default Page