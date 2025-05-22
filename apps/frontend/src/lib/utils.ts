import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function secondsToMinutesSeconds(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}

export function deepCopy<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

export function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
