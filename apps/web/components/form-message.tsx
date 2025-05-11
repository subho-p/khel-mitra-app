export const FormSuccessMessage = ({ message }: { message?: string }) => {
	if (!message) {
		return null;
	}

	return (
		<div className="w-full px-3 py-1 bg-green-300 my-2 rounded-md">
			<p className="text-emerald-600 font-semimedium text-sm">{message}</p>
		</div>
	);
};

export const FormErrorMessage = ({ message }: { message?: string }) => {
    if (!message) {
        return null;
    }

    return (
        <div className="w-full px-3 py-1 bg-destructive/30 my-2 rounded-md">
            <p className="text-destructive font-semimedium text-sm">{message} !</p>
        </div>
    );
};