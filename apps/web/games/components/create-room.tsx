"use client";

import React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MAX_WAITING_TIME } from "../constants";
import { WaitingLoading } from "./waiting";
import { GameLayout } from "./layout";

export const CreateRoom = ({
	roomId = "",
	onTimeout,
	onClose,
}: {
	roomId: string;
	onTimeout: () => void;
	onClose: () => void;
}) => {
	const [isCopied, setIsCopied] = React.useState(false);

	const copyCode = () => {
		const input = document.getElementById("createRoomIdInput") as HTMLInputElement;

		if (!input) return;

		const text = input.value;

		// Modern clipboard API
		if (navigator.clipboard && window.isSecureContext) {
			navigator.clipboard.writeText(text).then(() => {
				toast.success("Room code copied to clipboard");
			});
		} else {
			// Fallback: execCommand (older support)
			input.select();
			document.execCommand("copy");
			toast.success("Room code copied (fallback)");
		}

		setIsCopied(true);

		setTimeout(() => {
			input.setSelectionRange(0, 0);
		}, 3_000);
	};

	return (
		<GameLayout className="flex flex-col" key="create-room">
			<div className="flex w-full max-w-xl gap-6 items-center justify-center pt-16">
				<div className="w-full flex-1 items-center justify-center">
					<Label htmlFor="craetedRoomCode" className="text-md font-semibold">
						Created Room code
					</Label>
					<div className="w-full flex flex-col mb-2">
						<Input id="createRoomIdInput" value={roomId} readOnly className="w-full" />
						<p className="text-sm text-muted-foreground">
							Share the room code with your friends
						</p>
					</div>
					<Button onClick={copyCode} disabled={!roomId}>
						Copy room code
					</Button>
					<WaitingLoading
						waitingTime={MAX_WAITING_TIME}
						onTimeout={onTimeout}
						onClose={onClose}
					/>
				</div>
			</div>
		</GameLayout>
	);
};
