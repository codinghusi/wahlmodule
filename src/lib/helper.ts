export function average (array: number[]) {
	return array.reduce((a, b) => a + b, 0) / array.length;
}

export function setQueryParam(key: string, value: string) {
	const url = new URL(window.location.toString());
	if (value.length) {
		url.searchParams.set(key, value);
	}
	else {
		url.searchParams.delete(encodeURIComponent(key));
	}
	history.replaceState(history.state, '', url);
}