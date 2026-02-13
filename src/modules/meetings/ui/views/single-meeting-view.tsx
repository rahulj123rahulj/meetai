"use client"
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import SingleMeetingViewHeader from "../components/single-meeting-view-header";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";
import UpdateMeetingDialog from "../components/update-meeting-dialog";
import { useState } from "react";
import { UpcomingState } from "../components/upcoming-state";
import { ActiveState } from "../components/active-state";
import { ProcessingState } from "../components/processing-state";
import { CancelledState } from "../components/cancelled-state";
import { CompletedState } from "../components/completed-state";

interface Props {
    meetingId: string
}

const SingleMeetingView = ({ meetingId }: Props) => {
    const trpc = useTRPC();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [openEdit, setOpenEdit] = useState(false); 
    const { data } = useSuspenseQuery(trpc.meetings.getOne.queryOptions({ id: meetingId }))

    const [RemoveConfirmation, confirmRemove] = useConfirm(
        "Are you sure?",
        `The following action will remove this meeting`
    );

    const removeMeeting = useMutation(
        trpc.meetings.remove.mutationOptions({ 
            onSuccess: async () => {
                await queryClient.invalidateQueries(
                    trpc.meetings.getMany.queryOptions({})
                );
                router.push("/meetings")
            },
            onError: (error) => {
                toast.error(error.message)
                console.log(error)
            }
         })
    )

    const handleRemoveMeeting = async () => {
        const ok = await confirmRemove();
        if (!ok) return;
        await removeMeeting.mutateAsync({ id: meetingId })
    }

    const isActive = data.status === "active";
    const isUpcoming = data.status === "upcoming";
    const isCancelled = data.status === "cancelled";
    const isCompleted = data.status === "completed";
    const isProcessing = data.status === "processing";

    return (<>
        <RemoveConfirmation />
        <UpdateMeetingDialog 
            open={openEdit}
            onOpenChange={(open) => {setOpenEdit(open)}}
            initialValues={data}
        />
        <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
            <SingleMeetingViewHeader
                meetingId={meetingId} 
                meetingName={data.name} 
                onEdit={() => {
                    setOpenEdit(true)
                 }} 
                onRemove={handleRemoveMeeting} 
            />
            {
                isCancelled && <CancelledState />
            }
            {
                isCompleted && <CompletedState data={data} />
            }
            {
                isProcessing && <ProcessingState />
            }
            {
                isUpcoming && <UpcomingState
                    meetingId={meetingId}
                 />
            }
            {
                isActive && <ActiveState
                    meetingId={meetingId}
                 />
            }
        </div>
        </>
    )
}

export default SingleMeetingView

export const SingleMeetingLoadingState = () => {
    return <LoadingState
        title="Loading Meeting"
        description="This may take a few seconds" />
}
export const SingleMeetingErrorState = () => {
    return <ErrorState
        title="Error Loading Meeting"
        description="Please try again later" />
}