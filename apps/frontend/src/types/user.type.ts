export interface IUser {
    id: string;
    name: string | null;
    username: string;
    coins: number;
    email: string;
    emailVerified: Date | null;
    onboarded: Date | null;
    createdAt: Date;
    updatedAt: Date;
    image: string | null;
}