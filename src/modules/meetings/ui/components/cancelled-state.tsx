import { EmptyState } from "@/components/empty-state"

export const CancelledState = () =>{
    return <div className="bg-white rounded-lg px-4 py-5 flex flex-col items-center justify-center gap-y-8 ">
        <EmptyState 
            image="/cancelled.svg"
            title="Meeting in progress"
            description="Meeting will end once all participants have left."
        />
    </div>
}