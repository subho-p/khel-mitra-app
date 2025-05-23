import { Button } from "@/components/ui/8bit/button";
import { Input } from "@/components/ui/8bit/input";
import { Label } from "@/components/ui/label";
import { GameLayout } from "./game-layout";

export const JoinRoom = ({
    joinedRoomCode,
    setJoinedRoomCode,
    handleJoinRoom,
}: {
    joinedRoomCode: string;
    setJoinedRoomCode: (value: string) => void;
    handleJoinRoom: () => void;
}) => {
    return (
        <GameLayout className="flex-col items-start gap-1">
            <div key="join-room" className="w-full flex-1 items-center justify-center">
                <Label htmlFor="craetedRoomCode" className="text-md font-semibold">
                    Enter Room Code
                </Label>
                <div className="w-full flex flex-col md:flex-row items-center justify-center gap-6">
                    <Input
                        id="joinedRoomCode"
                        value={joinedRoomCode}
                        onChange={(e) => setJoinedRoomCode(e.target.value)}
                        className="w-full"
                    />
                    <Button onClick={handleJoinRoom} className="w-full md:w-auto">
                        Join Room
                    </Button>
                </div>
            </div>
        </GameLayout>
    );
};
