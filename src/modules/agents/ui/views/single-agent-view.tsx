"use client"
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import SingleAgentViewHeader from "../components/single-agent-view-header";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";
import { VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { useState } from "react";
import UpdateAgentDialog from "../components/update-agent-dialog";

interface Props {
    agentId: string
}

const SingleAgentView = ({agentId}:Props) =>{
    const router  = useRouter();
    const queryClient  = useQueryClient();
    const trpc =  useTRPC();

    const [updateAgentDialogOpen, setUpdateAgentDialogOpen] = useState(false);

    const {data: agent} = useSuspenseQuery(trpc.agents.getOne.queryOptions({id: agentId}))

    const removeAgent = useMutation(trpc.agents.remove.mutationOptions({
        onSuccess: async ()=>{
            await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));
            router.push("/agents")
        },
        onError : (error)=>{
            toast.error(error.message)
        }
    }))

    const [RemoveConfirmation, confirmRemove] = useConfirm(
        "Are you sure?",
        `The following action will remove ${agent.meetingCount} associated meetings`
    );

    const handleRemoveAgent = async ()=>{
        const ok  = await confirmRemove();
        if(!ok) return;
        await removeAgent.mutateAsync({id: agentId})
    }

    return (<>
        <RemoveConfirmation/>
        <UpdateAgentDialog 
            open={updateAgentDialogOpen}
            onOpenChange={setUpdateAgentDialogOpen}
            initialValues={agent}
        />
        <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
           <SingleAgentViewHeader
            agentId = {agentId}
            agentName={agent.name}
            onEdit = {()=>{setUpdateAgentDialogOpen(true)}}
            onRemove = {handleRemoveAgent}
            />
            <div className="bg-white rounded-lg border">
                <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
                    <div className="flex items-center gap-x-3">
                        <GeneratedAvatar 
                            variant="avataaarsNeutral"
                            seed={agent.name}
                            className="w-16 h-16 rounded-full"
                        />
                        <h2 className="text-2xl font-medium">{agent.name}</h2>
                    </div>
                    <Badge
                        variant="outline"
                        className="flex items-center gap-x-2 [&>svg]:size-4"
                    >
                        <VideoIcon className="text-blue-700" />
                        {agent.meetingCount} {agent.meetingCount === 1 ? "meeting" : "meetings"}
                    </Badge>
                    <div className="flex flex-col gap-y-4">
                        <p className="text-lg font-medium">Instructions</p>
                        <p className="text-neutral-800">{agent.instructions}</p>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export const SingleAgentViewLoading = ()=>{
    return <LoadingState title="Loading Agent" description="This may take a few seconds"/>
}

export const SingleAgentViewError = ()=>{
    return <ErrorState title="Error Loading Agent" description="Please try again later"/>
}

export default SingleAgentView;