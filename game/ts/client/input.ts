
export function setupInput(onInput: (input: { up: boolean; down: boolean }) => void)
{
	const keys: Record<string, boolean> = {
		ArrowUp: false,
		ArrowDown: false,
		w: false,
		s: false
	};

	window.addEventListener('keydown', (e) => {
		if (e.key in keys)
		{
			keys[e.key] = true;
			updateInput();
		}
	});

	window.addEventListener('keyup', (e) => {
		if (e.key in keys)
		{
			keys[e.key] = false;
			updateInput();
		}
	});

	function updateInput()
	{
		onInput({
			up: keys.ArrowUp || keys.w,
			down: keys.ArrowDown || keys.s
		});
	}
}
