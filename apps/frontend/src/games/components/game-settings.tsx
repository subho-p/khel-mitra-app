import { ArrowRight, RotateCcw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { useGameSettingsActions, useGameSettingsState } from "../settings/game-settings.context";
import { cn } from "@/lib/utils";
import { useSession } from "@/hooks/use-session";

export const GameSettings = ({
    handleNext,
    onReset,
}: {
    handleNext: () => void;
    onReset?: () => void;
}) => {
    const { user } = useSession();
    const settings = useGameSettingsState();
    const { setMode, setOnlineMode, setPrivateRoomOption, setCoins, reset } =
        useGameSettingsActions();

    function canNext() {
        if (settings.mode === "local") {
            return true;
        } else if (settings.onlineMode === "public") {
            return true;
        } else if (settings.privateRoomOption) {
            return true;
        }

        return false;
    }

    function nextButtonName() {
        if (settings.mode === "local") {
            return "Start Local Game";
        }
        if (settings.onlineMode === "public") {
            return "Start Random Game";
        }

        if (settings.privateRoomOption === "create") {
            return "Create Room";
        }

        if (settings.privateRoomOption === "join") {
            return "Join Room";
        }

        return "Next";
    }

    function handleReset() {
        reset();
        if (onReset) {
            onReset();
        }
    }

    return (
        <div className="flex w-full items-center justify-center mt-16 md:mt-32 px-4">
            <AnimatePresence mode="wait">
                <Container key="game-settings">
                    {/* Mode Selection */}
                    <ContainerItem key="mode-selection">
                        <ContainerItemTitle text="Game Mode" />
                        <div className="flex gap-4">
                            <ContainerButton
                                text="Local Game"
                                onClick={() => setMode("local")}
                                isDefault={settings.mode === "local"}
                            />
                            <ContainerButton
                                text="Online Game"
                                onClick={() => setMode("online")}
                                isDefault={settings.mode === "online"}
                            />
                        </div>
                    </ContainerItem>

                    {/* Online Mode */}
                    <AnimatePresence>
                        {settings.mode === "online" && (
                            <Container key="online-mode">
                                {/* Online Mode Selection */}
                                <ContainerItem key="online-mode-selection">
                                    <ContainerItemTitle text="Online Mode" />
                                    <div className="flex gap-4">
                                        <ContainerButton
                                            isDefault={settings.onlineMode === "private"}
                                            onClick={() => setOnlineMode("private")}
                                            text="Friends"
                                        />
                                        <ContainerButton
                                            isDefault={settings.onlineMode === "public"}
                                            onClick={() => setOnlineMode("public")}
                                            text="Random"
                                        />
                                    </div>
                                </ContainerItem>

                                {/* Room Type */}
                                {settings.onlineMode === "private" && (
                                    <ContainerItem key="room-type-selection">
                                        <ContainerItemTitle text="Room Type" />
                                        <div className="flex gap-4">
                                            <ContainerButton
                                                isDefault={settings.privateRoomOption === "create"}
                                                onClick={() => setPrivateRoomOption("create")}
                                                text="Create Room"
                                            />
                                            <ContainerButton
                                                isDefault={settings.privateRoomOption === "join"}
                                                onClick={() => setPrivateRoomOption("join")}
                                                text="Join Room"
                                            />
                                        </div>
                                    </ContainerItem>
                                )}
                            </Container>
                        )}
                    </AnimatePresence>

                    {/* Token Selection */}
                    <AnimatePresence>
                        {settings.privateRoomOption === "create" && (
                            <ContainerItem key="token-selection">
                                <ContainerItemTitle text="Tokens" />
                                <div className="flex gap-2">
                                    {[100, 500, 1000, 2000].map((noOfTokens, index) => (
                                        <ContainerButton
                                            key={index}
                                            text={noOfTokens.toString()}
                                            onClick={() => setCoins(noOfTokens)}
                                            isDefault={settings.coins === noOfTokens}
                                            disabled={ user!.coins < noOfTokens }
                                        />
                                    ))}
                                </div>
                            </ContainerItem>
                        )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <motion.div className="w-full flex justify-between mt-6" variants={itemVariants}>
                        <Button
                            variant="outline"
                            size="lg"
                            className="font-semibold"
                            onClick={handleReset}
                        >
                            <RotateCcw className="mr-2" />
                            reset
                        </Button>

                        <Button onClick={handleNext} disabled={!canNext()}>
                            {nextButtonName()}
                            <ArrowRight className="ml-2" />
                        </Button>
                    </motion.div>
                </Container>
            </AnimatePresence>
        </div>
    );
};

// Contener
const Container = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    return (
        <motion.div
            className={cn(
                "flex flex-col w-full max-w-xl gap-6 items-center justify-between",
                className
            )}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit"
        >
            {children}
        </motion.div>
    );
};

// Container items
const ContainerItem = ({ children }: { children: React.ReactNode }) => {
    return (
        <motion.div
            className="w-full flex flex-col md:flex-row gap-8 justify-between items-center"
            variants={itemVariants}
        >
            {children}
        </motion.div>
    );
};

// Container item title
const ContainerItemTitle = ({ text }: { text: string }) => {
    return <h3 className="text-md font-semibold text-center md:text-left">{text}</h3>;
};

// Container button
const ContainerButton = ({
    text,
    onClick,
    isDefault,
    disabled = false,
}: {
    text: string;
    onClick: () => void;
    isDefault: boolean;
    disabled?: boolean;
}) => {
    return (
        <Button
            onClick={onClick}
            variant={isDefault ? "default" : "outline"}
            className="font-semibold"
            disabled={disabled}
        >
            {text}
        </Button>
    );
};

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
    exit: { opacity: 0 },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 300, damping: 24 },
    },
    exit: { opacity: 0, y: -20 },
};
