import { CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, ResponsiveCommandDialog } from "@/components/ui/command";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";

interface Props {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
}
const DashboardCommand = ({ open, setOpen }: Props) => {
    const trpc = useTRPC();
    const [search, setSearch] = useState("");
    const router = useRouter();
    const meetings = useQuery(
        trpc.meetings.getMany.queryOptions({
            search,
            pageSize: 100
        })
    )
    const agents = useQuery(
        trpc.agents.getMany.queryOptions({
            search,
            pageSize: 100
        })
    )
    
    return ( <>
        <ResponsiveCommandDialog shouldFilter={false} open={open} onOpenChange={setOpen}>
            <CommandInput
                value={search}
                onValueChange={(value) => setSearch(value)}
                placeholder="Find a meeting or agent..."
            />
            <CommandList>
                <CommandGroup heading="Meetings">
                    <CommandEmpty >
                        <span className="text-muted-foreground text-sm">
                            No meetings found
                        </span>
                    </CommandEmpty>
                    {meetings.data?.items.map((meeting) => (
                        <CommandItem 
                            key={meeting.id} 
                            onSelect={() =>{
                                router.push(`/meetings/${meeting.id}`)
                                setOpen(false)
                                }}>
                                {meeting.name}
                            </CommandItem>
                        ))
                    }
                </CommandGroup>
                <CommandGroup heading="Agents">
                    <CommandEmpty >
                        <span className="text-muted-foreground text-sm">
                            No agents found
                        </span>
                    </CommandEmpty>
                    {agents.data?.items.map((agent) => (
                        <CommandItem 
                            key={agent.id} 
                            onSelect={() =>{
                                router.push(`/agents/${agent.id}`)
                                setOpen(false)
                                }}>
                                {agent.name}
                            </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </ResponsiveCommandDialog>
    </> );
}
 
export default DashboardCommand;