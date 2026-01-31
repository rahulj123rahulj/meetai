"use client"

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import NewAgentDialog from "./new-agent-dialog";
import { useState } from "react";

const AgentsListHeader = () => {
    const [open, setOpen] = useState(false);
    return(<>
        <NewAgentDialog open={open} onOpenChange={() => {setOpen(!open)}}/>
        <div className="py-4 px-4 md:px-8 flex flex-col items-center gap-y-4">
            <div className="flex items-center justify-between w-full">
                <h5 className="font-semibold">My Agents</h5>
                <Button
                    onClick={() => {setOpen(true)}}
                >
                    <PlusIcon/>
                    Add New Agent
                </Button>
            </div>
        </div>
    </>
    )
}

export default AgentsListHeader;