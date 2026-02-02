"use client"

import { ResponsiveDialog } from "@/components/responsive-dialog"
import AgentForm from "./agent-form"
import { AgentType } from "../../types"

interface UpdateAgentDialogProps {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    initialValues : AgentType
}

const UpdateAgentDialog = ({open, onOpenChange, initialValues}: UpdateAgentDialogProps) => {
    return <ResponsiveDialog
        title="Edit Agent"
        description="Edit the agent details"
        open={open}
        onOpenChange={onOpenChange}
    >
        <AgentForm 
            onCancel={() => onOpenChange(false)} 
            onSuccess={() => onOpenChange(false)}
            initialValues={initialValues}
            />
    </ResponsiveDialog>   
}

export default UpdateAgentDialog;