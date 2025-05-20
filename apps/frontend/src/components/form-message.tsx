export const ErrorMessage = ({ error }: { error?: string }) => {
	if (!error) return null;

	return (
		<p className="text-destructive px-3 py-1 bg-destructive/30 text-xs text-start">{error}</p>
	);
};

export const SuccessMessage = ({ message }: { message?: string }) => {
	if (!message) return null;

	return <p className="text-emerald-600 px-3 py-1 bg-green-300 text-xs text-start">{message}</p>;
};
