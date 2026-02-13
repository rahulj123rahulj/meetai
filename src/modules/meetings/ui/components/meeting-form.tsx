import { useTRPC } from "@/trpc/client"
import { useForm } from "react-hook-form";
import { SingleMeetingType } from "../../types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { MeetingInsertSchema } from "../../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { CommandSelect } from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";
import NewAgentDialog from "@/modules/agents/ui/components/new-agent-dialog";
import { useRouter } from "next/navigation";

interface MeetingFormProps {
    onSuccess?: (id?: string) => void
    onCancel?: () => void,
    initialValues?: SingleMeetingType
}


const MeetingForm = ({onSuccess, onCancel, initialValues}: MeetingFormProps)=>{
    const trpc = useTRPC();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [agentSearch, setAgentSearch] = useState("");
    const [openAgentDialog, setOpenNewAgentDialog] = useState(false);
    const agents = useQuery(
        trpc.agents.getMany.queryOptions({
            pageSize: 100,
            search: agentSearch
        })
    )

    const form = useForm<z.infer<typeof MeetingInsertSchema>>({
        resolver: zodResolver(MeetingInsertSchema),
        defaultValues: {
            name: initialValues?.name ?? "",
            agentId: initialValues?.agentId ?? ""
        }
    })
    const createMeeting = useMutation(trpc.meetings.create.mutationOptions({
        onSuccess:async (data)=>{
            form.reset()
            await queryClient.invalidateQueries(
                trpc.meetings.getMany.queryOptions({})
            );
            await queryClient.invalidateQueries(
                trpc.premium.getFreeUsage.queryOptions()
            );
            if(data?.id){
                queryClient.invalidateQueries(
                    trpc.meetings.getOne.queryOptions({
                        id: data.id
                    })
                )
            }
            onSuccess?.(data?.id)
        },
        onError: (error)=>{
            toast.error(error.message)

            if(error.data?.code === "FORBIDDEN"){
                router.push("/upgrade")
            }
            console.log(error)
        }
    }))
    const updateMeeting = useMutation(trpc.meetings.update.mutationOptions({
        onSuccess: async ()=>{
            form.reset()
            await queryClient.invalidateQueries(
                trpc.meetings.getMany.queryOptions({})
            );
            if(initialValues?.id){
                queryClient.invalidateQueries(
                    trpc.meetings.getOne.queryOptions({
                        id: initialValues.id
                    })
                )
            }
            onSuccess?.()
        },
        onError: (error)=>{
            toast.error(error.message)
            console.log(error)
        }
    }))

    const isEdit = !!initialValues
    const isPending = !!createMeeting.isPending || !!updateMeeting.isPending

    const onSubmit = (values: z.infer<typeof MeetingInsertSchema>)=>{
        if(isEdit){
            updateMeeting.mutate({...values, id: initialValues?.id})
        }else{
            createMeeting.mutate(values)
        }
    }

    return <>
        <NewAgentDialog 
            open={openAgentDialog}
            onOpenChange={setOpenNewAgentDialog}
        />
        <Form {...form} >
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        name="name"
                        control={form.control}
                        render={({field})=>(<FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="e.g. Math consultation" 
                                        {...field}
                                        />
                                </FormControl>
                            </FormItem>)
                        }
                    />
                    <FormField
                        name="agentId"
                        control={form.control}
                        render={({field})=>(<FormItem>
                                <FormLabel>Agent</FormLabel>
                                <FormControl>
                                    <CommandSelect
                                        options={agents.data?.items.map((agent)=>({
                                            id: agent.id,
                                            value: agent.id,
                                            children : (
                                                <div className="flex items-center gap-x-2">
                                                    <GeneratedAvatar
                                                     variant="avataaarsNeutral"
                                                     seed={agent.name}
                                                     className="border size-6"
                                                     />
                                                     <span>{agent.name}</span>
                                                </div>
                                            )
                                        })) ?? []}
                                        value={field.value}
                                        onSelect={field.onChange}
                                        onSearch={setAgentSearch}
                                        placeholder="Select an agent"
                                        />
                                </FormControl>
                                <FormDescription>
                                    Not found what you&apos;re looking for? <button type="button" className="text-primary hover:underline" onClick={()=>setOpenNewAgentDialog(true)}>Create new agent</button>
                                </FormDescription>
                            </FormItem>)
                        }
                    />
                <div className="flex justify-end gap-x-2">
                    {onCancel &&
                        <Button
                            variant={"ghost"}
                            type="button"
                            onClick={onCancel}
                            disabled={isPending}
                            >
                            Cancel
                        </Button>
                    }
                    <Button
                        disabled={isPending}
                        >
                        Create
                    </Button>
                </div>
            </form>
        </Form>
    </>
}


export default MeetingForm