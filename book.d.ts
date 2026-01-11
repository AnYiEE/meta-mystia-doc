declare var Fancybox:
	| { bind: (selector: string, options?: object) => void }
	| undefined;

interface Window {
	_paq: unknown[] | undefined;
}
