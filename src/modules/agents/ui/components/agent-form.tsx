import { useTRPC } from "@/trpc/client"
import { useForm } from "react-hook-form";
import { AgentType } from "../../types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { AgentFormSchema } from "../../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AgentFormProps {
    onSuccess?: () => void
    onCancel?: () => void,
    initialValues?: AgentType
}


const AgentForm = ({onSuccess, onCancel, initialValues}: AgentFormProps)=>{
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const form = useForm<z.infer<typeof AgentFormSchema>>({
        resolver: zodResolver(AgentFormSchema),
        defaultValues: {
            name: initialValues?.name ?? "",
            instructions: initialValues?.instructions ?? ""
        }
    })
    const createAgent = useMutation(trpc.agents.create.mutationOptions({
        onSuccess: ()=>{
            form.reset()
            queryClient.invalidateQueries(
                trpc.agents.getMany.queryOptions({})
            );
            if(initialValues?.id){
                queryClient.invalidateQueries(
                    trpc.agents.getOne.queryOptions({
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
    const updateAgent = useMutation(trpc.agents.update.mutationOptions({
        onSuccess: ()=>{
            form.reset()
            queryClient.invalidateQueries(
                trpc.agents.getMany.queryOptions({})
            );
            if(initialValues?.id){
                queryClient.invalidateQueries(
                    trpc.agents.getOne.queryOptions({
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
    const isPending = !!createAgent.isPending || !!updateAgent.isPending

    const onSubmit = (values: z.infer<typeof AgentFormSchema>)=>{
        if(isEdit){
            updateAgent.mutate({...values, id: initialValues?.id})
        }else{
            createAgent.mutate(values)
        }
    }

    return <>
        <Form {...form} >
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <GeneratedAvatar
                    seed={form.watch("name")}
                    variant="avataaarsNeutral"
                    className="border size-16"
                    />
                    <FormField
                        name="name"
                        control={form.control}
                        render={({field})=>(<FormItem>
                                <FormLabel>Agent Name</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="Agent Name" 
                                        {...field}
                                        />
                                </FormControl>
                            </FormItem>)
                        }
                    />
                    <FormField
                        name="instructions"
                        control={form.control}
                        render={({field})=>{
                            return <FormItem>
                                <FormLabel>Instructions</FormLabel>
                                <FormControl>
                                    <Textarea 
                                        placeholder="Write some instructions for the agent" 
                                        {...field}
                                        />
                                </FormControl>
                            </FormItem>
                        }}
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


export default AgentForm