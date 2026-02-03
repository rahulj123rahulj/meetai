"use client"

import { ResponsiveDialog } from "@/components/responsive-dialog"
import MeetingForm from "./meeting-form"
import { useRouter } from "next/navigation"
import { SingleMeetingType } from "../../types"

interface UpdateMeetingDialogProps {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    initialValues? : SingleMeetingType
}

const UpdateMeetingDialog = ({open, onOpenChange, initialValues}: UpdateMeetingDialogProps) => {
    const router = useRouter();
    return <ResponsiveDialog
        title="Update Meeting"
        description="Update the meeting details"
        open={open}
        onOpenChange={onOpenChange}
    >
        <MeetingForm 
            onCancel={() => onOpenChange(false)} 
            onSuccess={(id) =>{
                onOpenChange(false)
                router.push(`/meetings/${id}`)
            }}
            initialValues={initialValues}
        />
    </ResponsiveDialog>   
}

export default UpdateMeetingDialog;