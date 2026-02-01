import { auth } from "@/lib/auth";
import { loadSearchParams } from "@/modules/agents/params";
import AgentsListHeader from "@/modules/agents/ui/components/list-header";
import AgentsView, { AgentsViewError, AgentsViewLoading } from "@/modules/agents/ui/views/agents-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SearchParams } from "nuqs";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary"


interface Props {
    searchParams: Promise<SearchParams>;
}
 
const Page = async ({searchParams}:Props) => {
    const queryClient = getQueryClient();
    const filters = await loadSearchParams(searchParams)
    await queryClient.prefetchQuery(trpc.agents.getMany.queryOptions({...filters}));
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (!session) {
        redirect("/sign-in")
    }
    return ( <>
        <AgentsListHeader />
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback ={<AgentsViewLoading/>}>
                <ErrorBoundary fallback={<AgentsViewError/>}>
                    <AgentsView/>
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    </> );
}
 
export default Page;