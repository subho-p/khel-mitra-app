export interface BaseUser {
	id: string;
	name: string | null;
	username: string;
	coins: number;
	image: string | null;
}

export interface JWTPayloadOfUser extends BaseUser {
	userId: string;
}

export interface JWTPayloadOfPlayer extends BaseUser {}

export interface User extends BaseUser {
	email: string;
	emailVerified: Date | null;
	onboarded: Date | null;
	createdAt: Date;
	updatedAt: Date;
}
