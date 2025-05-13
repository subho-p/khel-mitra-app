export interface JWTPayloadOfUser {
	userId: string;
}

export interface JWTPayloadOfPlayer {
	id: string;
	name: string | null;
	username: string;
	coins: number;
	image: string | null;
}

export interface User extends JWTPayloadOfPlayer {
	email: string;
	emailVerified: Date | null;
	onboarded: Date | null;
	createdAt: Date;
	updatedAt: Date;
}
