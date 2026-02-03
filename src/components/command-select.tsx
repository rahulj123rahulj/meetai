import { useState } from "react"
import { Button } from "./ui/button"
import { ChevronsUpDownIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { CommandEmpty, CommandInput, CommandItem, CommandList, ResponsiveCommandDialog } from "./ui/command"

interface Props {
    options: Array<{
        id: string
        value: string
        children: React.ReactNode   
    }>
    onSelect: (option: string) => void
    onSearch?: (query: string) => void
    value: string
    placeholder?: string
    isSearchable?: boolean
    className?: string

}


export const CommandSelect = ({options, onSelect, onSearch, value, placeholder = "Select an option", className}: Props) => {
    const [open, setOpen] = useState(false)
    const selectedOption = options.find((option) => option.value === value)
    const handleOpenChange = (open : boolean) =>{
        onSearch?.("")
        setOpen(open);
    }
    return (<>
        <Button
            type="button"
            variant={"outline"}
            className={cn(
                "h-9 justify-between font-normal px-2",
                !selectedOption && "text-muted-foreground",
                className
            )}
            onClick={() => setOpen(true)}
        >
            <div>
            {selectedOption ? selectedOption.children : placeholder}
            </div>
            <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
        </Button>
        <ResponsiveCommandDialog
            shouldFilter={!onSearch}
            open={open}
            onOpenChange={handleOpenChange}
            >
                <CommandInput
                    placeholder={"Search..."}
                    onValueChange={onSearch}
                    />
                <CommandList>
                    <CommandEmpty>
                        <span className="text-muted-foreground text-sm">
                            No results found.
                        </span>
                    </CommandEmpty>
                    {options.map((option) => (
                        <CommandItem
                            key={option.id}
                            onSelect={() => {
                                onSelect(option.value)
                                setOpen(false)
                            }}
                        >
                            {option.children}
                        </CommandItem>
                    ))}
                </CommandList>
        </ResponsiveCommandDialog>
    </>)
}