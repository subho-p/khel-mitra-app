import { useSession } from "@/providers/session-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar";
import { Button } from "@/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { Bell, LogOut, Settings, User2Icon } from "lucide-react";
import { useRouter } from "next/navigation";

export const ProfileDropdown = () => {
    const router = useRouter();

	const { user, signout } = useSession();
    const fallbackLetter = user?.username?.charAt(0)?.toUpperCase();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="relative h-8 w-8 rounded-full">
					<Avatar className="size-10 ring ring-primary/50 flex items-center justify-center">
                        {/* TODO: add user image */}
						<AvatarImage src={user?.image || ""} alt={user?.username} />
						<AvatarFallback className="text-xl">{fallbackLetter}</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem onClick={() => router.push("/profile")}>
					<User2Icon className="size-4" />
					My Profile
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => router.push("/notifications")}>
					<Bell className="size-4" />
					Notifications
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => router.push("/settings")}>
					<Settings className="size-4" />
					Settings
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={() => signout()}>
					<LogOut className="size-4" />
					Sign Out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
