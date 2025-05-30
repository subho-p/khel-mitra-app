import { useSession } from "@/hooks/use-session";
import { cn } from "@/lib/utils";
import type { Player } from "@/types/player.type";
import { User2 } from "lucide-react";

export const DisplayPlayers = ({ players }: { players: Player[] }) => {
	if (players.length === 1) return <OnePlayer player={players[0]} />;

	return (
		<div className="w-full flex items-center justify-between">
			<OnePlayer player={players[0]} />
			<OnePlayer player={players[1]} />
		</div>
	);
};

export const OnePlayer = ({ player }: { player: Player }) => {
	const { user } = useSession();
	const isMe = player.id === user?.id;

	return (
		<div className="flex flex-col items-center gap-2">
			{/* Image */}
			{player?.image ? (
				<img
					src={player?.image || ""}
					alt={player?.username || ""}
					width={100}
					height={100}
				/>
			) : (
				<div
					className={cn(
						"flex items-center justify-center rounded-md shadow ring-2 ring-offset-2",
						isMe ? "ring-emerald-500" : "ring-destructive"
					)}
				>
					<User2
						size={100}
						className={cn(isMe ? "text-emerald-500" : "text-destructive")}
					/>
				</div>
			)}
			{/* name */}
			<div>{player?.username}</div>
		</div>
	);
};
