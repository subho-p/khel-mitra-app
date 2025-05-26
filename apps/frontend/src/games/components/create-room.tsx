import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GameLayout } from "./game-layout";
import { useEffect, useState } from "react";
import { secondsToMinutesSeconds } from "@/lib/utils";
import { toast } from "@/components/ui/8bit/toast";
import { useParams } from "@tanstack/react-router";
import { Copy } from "lucide-react";
import { CLIENT_URL } from "@/constants";

const TIMEOUT_DURATION = 120;

export const CreateRoom = ({
	roomId = "",
	onTimeout,
	onClose,
}: {
	roomId: string;
	onTimeout: () => void;
	onClose: () => void;
}) => {
	const { game } = useParams({ from: "/_app/games/$game" });

	const copyToClipboard = (id: string, message: string) => {
		const input = document.getElementById(id) as HTMLInputElement;
		if (!input) return;
		const text = input.value;
		if (navigator.clipboard && window.isSecureContext) {
			navigator.clipboard.writeText(text).then(() => toast(message));
		} else {
			input.select();
			document.execCommand("copy");
			toast(`${message} (fallback)`);
		}
		setTimeout(() => input.setSelectionRange(0, 0), 3000);
	};

	const link = `${CLIENT_URL}/?game=${game}&roomCode=${roomId}`;

	return (
		<GameLayout className="flex flex-col gap-8">
			<div className="flex flex-col gap-1 w-full">
				<Label htmlFor="shareableLinkInput" className="text-muted-foreground">
					Shareable Link
				</Label>
				<div className="relative w-full">
					<Input
						id="shareableLinkInput"
						value={link}
						readOnly
						className="w-full text-accent-foreground text-xs pr-10"
						onFocus={(e) => e.target.select()}
						onClick={(e) => {
							e.currentTarget.select();
							document.execCommand("copy");
							toast("Shareable link copied to clipboard");
						}}
					/>
					<Button
						variant="outline"
						size="icon"
						className="absolute top-0 right-0"
						onClick={() =>
							copyToClipboard("shareableLinkInput", "Shareable link copied")
						}
						disabled={!roomId}
					>
						<Copy className="h-4 w-4" />
					</Button>
				</div>
			</div>

			<div className="text-center text-primary">or</div>

			<div className="w-full">
				<Label htmlFor="createRoomIdInput" className="text-muted-foreground">
					Created Room Code
				</Label>
				<div className="relative w-full">
					<Input
						id="createRoomIdInput"
						value={roomId}
						readOnly
						className="w-full text-xs pr-10"
					/>
					<Button
						variant="outline"
						size="icon"
						className="absolute top-0 right-0"
						onClick={() => copyToClipboard("createRoomIdInput", "Room code copied")}
						disabled={!roomId}
					>
						<Copy className="h-4 w-4" />
					</Button>
				</div>
				<p className="text-[0.5rem] text-muted-foreground py-1">
					Share this code with your friends.
				</p>
			</div>

			<ShowTimeout onClose={onClose} onTimeout={onTimeout} />
		</GameLayout>
	);
};

const ShowTimeout = ({ onClose, onTimeout }: { onClose: () => void; onTimeout: () => void }) => {
	const [countdown, setCountdown] = useState(TIMEOUT_DURATION);

	useEffect(() => {
		if (countdown <= 0) {
			onTimeout();
			return;
		}
		const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
		return () => clearTimeout(timer);
	}, [countdown, onTimeout]);

	return (
		<div className="flex flex-col gap-2">
			<p className="text-sm text-muted-foreground">
				Room will expire in {secondsToMinutesSeconds(countdown)}
			</p>
			<Button variant="outline" onClick={onClose}>
				Close Room
			</Button>
		</div>
	);
};
