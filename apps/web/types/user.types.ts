export type User = {
	id: string;
	name: string | null;
	username: string;
	email: string;
	coins: number;
	emailVerified: Date | null;
	onboarded: Date | null;
	image: string | null;
	createdAt: Date;
	updatedAt: Date;
};
