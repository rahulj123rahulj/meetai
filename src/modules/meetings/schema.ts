import z from "zod";

export const MeetingInsertSchema = z.object({
    name: z.string().min(1, "Name is required"),
    agentId: z.string().min(1, "Agent is required"),
})

export const MeetingUpdateSchema = MeetingInsertSchema.extend({
    id: z.string().min(1,"Id is required")
})