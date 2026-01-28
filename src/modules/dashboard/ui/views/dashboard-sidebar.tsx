import { Separator } from "@/components/ui/separator";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { BotIcon, StarIcon, VideoIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DashboardUserButton from "./dashboard-user-button";

const firstSection = [
    {
        name: "Meetings",
        href: "/meetings",
        icon: VideoIcon
    },
    {
        name: "Agents",
        href: "/agents",
        icon: BotIcon
    }
]

const secondSection = [
    {
        name: "Upgrade",
        href: "/upgrade",
        icon: StarIcon
    }
]

const DashboardSidebar = () => {
   const pathname = usePathname();

    return <>
        <Sidebar className="">
            <SidebarHeader className="text-sidebar-accent-foreground px-4 py-2">
                <Link href={"/"} className="flex items-center gap-2">
                    <Image src="/logo.svg" alt="logo" width={36} height={36} />
                    <p className="text-2xl font-semibold">Visor.AI</p>
                </Link>
            </SidebarHeader>

            <SidebarContent className="px-2">
                            <div className="px-4 py-2 ">
                <Separator className="" />
            </div>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {
                                firstSection.map((item) => (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton 
                                        asChild 
                                        className={cn("h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#5D6B68]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                                            pathname === item.href ? "bg-linear-to-r/oklch border-[#5D6B68]/10" : ""
                                        )}>
                                            <Link href={item.href} className="flex items-center">
                                                <item.icon className="size-5" />
                                                <span className="text-sm font-medium tracking-tight">
                                                    {item.name}
                                                </span>
                                            </Link>

                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))
                            }
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <div className="px-4 py-2 ">
                    <Separator className="" />
                </div>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {
                                secondSection.map((item) => (
                                    <SidebarMenuItem key={item.href}>
                                        <SidebarMenuButton
                                            asChild
                                            className={cn("h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#5D6B68]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                                                pathname === item.href ? "bg-linear-to-r/oklch border-[#5D6B68]/10" : ""
                                            )}
                                            isActive={pathname === item.href}
                                        >
                                            <Link href={item.href}>
                                                <item.icon className="size-5" />
                                                <span className="text-sm font-medium tracking-tight">
                                                    {item.name}
                                                </span>
                                            </Link>

                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))
                            }
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>


            </SidebarContent>
                <SidebarFooter className="text-white">
                    <DashboardUserButton/>
                </SidebarFooter>
        </Sidebar>

    </>
}
export default DashboardSidebar;