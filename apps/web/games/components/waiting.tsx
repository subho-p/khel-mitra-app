'use client';

import { Button } from "@/components/ui/button";
import { secondsToMinutes } from "@/lib/utils";
import { Loader2, X } from "lucide-react";
import React from "react";

export const WaitingLoading = ({
	waitingTime,
	onTimeout,
	onClose,
}: {
	waitingTime: number;
	onTimeout: () => void;
	onClose: () => void;
}) => {
	const [waitingCount, setWaitingCount] = React.useState<number>(waitingTime);

	React.useEffect(() => {
		const interval = setInterval(() => {
			if (waitingCount === 0) {
				clearInterval(interval);
				onTimeout();
				return;
			}
			setWaitingCount((prev) => prev - 1);
		}, 1_000);
		return () => clearInterval(interval);
	}, [onTimeout, waitingCount]);

	return (
		<div className="w-full items-center justify-center mt-12">
			<div className="w-full flex flex-col items-center gap-2">
				{/* Loading spinner */}
				{/* <Loader2 className="animate-spin size-16" /> */}
				<p className="text-sm text-muted-foreground">
					Waiting for {secondsToMinutes(waitingCount)} seconds to join the room
				</p>
				<Button variant="outline" onClick={onClose}>
					<X className="size-4" />
					Cancel
				</Button>
			</div>
		</div>
	);
};
