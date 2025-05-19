"use client";

import { motion } from "motion/react";

export const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => {
        const delay = 0 + i * 0.1;
        return {
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: { delay, type: "spring", duration: 1.5, bounce: 0 },
                opacity: { delay, duration: 0.01 },
            },
        };
    },
    exit: (i: number) => {
        const delay = 0 + i * 0.1;
        return {
            pathLength: 0,
            opacity: 0,
            transition: {
                pathLength: { delay, duration: 0.5, ease: "easeInOut" },
                opacity: { delay, duration: 0.2, ease: "easeOut" },
            },
        };
    },
};

export const Cross = () => {
    return (
        <div className="w-full flex items-center justify-center">
            <motion.svg width="100%" height="100%" initial="hidden" animate="visible" exit="exit">
                <motion.line
                    x1="10%"
                    y1="10%"
                    x2="90%"
                    y2="66%"
                    stroke="#00cc88"
                    variants={draw}
                    custom={2}
                    strokeWidth={10}
                    strokeLinecap="round"
                    fill="transparent"
                />
                <motion.line
                    x1="10%"
                    y1="66%"
                    x2="90%"
                    y2="10%"
                    stroke="#00cc88"
                    variants={draw}
                    custom={6}
                    strokeWidth={10}
                    strokeLinecap="round"
                    fill="transparent"
                />
            </motion.svg>
        </div>
    );
};

export const Circle = () => {
    return (
        <motion.svg width="100%" height="100%" initial="hidden" animate="visible" exit="exit">
            <motion.circle
                cx="55"
                cy="55"
                r="35%"
                stroke="#ff0055"
                variants={draw}
                custom={1}
                strokeWidth={10}
                className="bg-transparent"
            />
        </motion.svg>
    );
};