export const GameEvents = [
	"create",
	"join",
	"random",
	"start",
    "ready",
    "restart",
	"move",
	"end",
	"leave",
	"player-left",
    "kick",
] as const;

export type GameEvent = typeof GameEvents[number];