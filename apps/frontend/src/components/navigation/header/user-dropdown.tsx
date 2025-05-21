import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/8bit/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/8bit/dropdown-menu";
import { useSession } from "@/hooks/use-session";
import { useSignout } from "@/hooks/use-signout";
import { useNavigate } from "@tanstack/react-router";

export const UserDropdown = () => {
	const { user } = useSession();
	const navigate = useNavigate();
	const { onSignout } = useSignout();

	const avatarFallbackLetter = user?.username?.charAt(0)?.toUpperCase();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Avatar className="cursor-pointer">
					<AvatarImage src={user?.image || ""} alt={user?.username} />
					<AvatarFallback>{avatarFallbackLetter}</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem onClick={() => navigate({ to: "/profile" })}>
					Profile
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => navigate({ to: "/settings" })}>
					Settings
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={onSignout}>Sign out</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
