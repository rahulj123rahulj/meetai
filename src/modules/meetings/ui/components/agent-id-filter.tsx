import { useTRPC } from "@/trpc/client";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CommandSelect } from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";




export const AgentIdFilter = () => {
    const [filters, setFilters] = useMeetingsFilters();
    const trpc = useTRPC();
    const [ agentSearch, setAgentSearch] = useState("");
    const { data, error } = useQuery(trpc.agents.getMany.queryOptions({
        pageSize: 10,
        search: agentSearch,
        page: 1
    }));

    console.log(error)

    return <CommandSelect 
    className="h-9 "
    placeholder="Agent"
    options={(data?.items ?? []).map((agent) => ({
        id: agent.id,
        value: agent.id,
        children: (
            <div className="flex items-center gap-x-2">
                <GeneratedAvatar
                    variant="avataaarsNeutral"
                    seed={agent.name}
                    className="size-4"
                />
                {agent.name}
            </div>
        )
    }))}
    value={filters.agentId ?? ""}
    onSelect={(value) => setFilters({agentId: value})} 
    onSearch={setAgentSearch}/>
} 