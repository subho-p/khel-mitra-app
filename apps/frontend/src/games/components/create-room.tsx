import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GameLayout } from "./game-layout";
import { useEffect, useState } from "react";
import { secondsToMinutesSeconds } from "@/lib/utils";

const TIMEOUT_DURATION = 120; // 2 minutes

export const CreateRoom = ({
    roomId = "",
    onTimeout,
    onClose,
}: {
    roomId: string;
    onTimeout: () => void;
    onClose: () => void;
}) => {
    const [countdown, setCountdown] = useState(TIMEOUT_DURATION);

    const copyCode = () => {
        const input = document.getElementById("createRoomIdInput") as HTMLInputElement;

        if (!input) return;

        const text = input.value;

        // Modern clipboard API
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                // toast.success("Room code copied to clipboard");
            });
        } else {
            // Fallback: execCommand (older support)
            input.select();
            document.execCommand("copy");
            // toast.success("Room code copied (fallback)");
        }

        setTimeout(() => {
            input.setSelectionRange(0, 0);
        }, 3_000);
    };

    // Set a timeout to call the onTimeout function after the specified duration
    useEffect(() => {
        const timer = setTimeout(() => {
            setCountdown((prev) => {
                if (prev <= 0) {
                    clearTimeout(timer);
                    onTimeout();
                    return prev;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearTimeout(timer);
    }, [countdown, onTimeout]);

    return (
        <GameLayout className="flex flex-col gap-8" key="create-room-layout">
            <div className="w-full flex-1 items-center justify-center">
                <div>
                    <Label htmlFor="craetedRoomCode" className="text-md font-semibold">
                        Created Room code
                    </Label>
                    <Input id="createRoomIdInput" value={roomId} readOnly className="w-full" />
                </div>
                <p className="text-[0.5rem] text-muted-foreground py-1">
                    Share this code with your friends to join the room.
                </p>
                <Button onClick={copyCode} disabled={!roomId}>
                    Copy room code
                </Button>
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">
                    Room will expire in {secondsToMinutesSeconds(countdown)}
                </p>
                <Button variant="outline" onClick={onClose}>
                    Close Room
                </Button>
            </div>
        </GameLayout>
    );
};
