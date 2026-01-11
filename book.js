// @ts-check
/// <reference types="./book.d.ts" />

/**
 * @param {string} url
 * @param {'async' | 'defer'} [method]
 * @param {boolean} [crossOrigin]
 */
function setScriptUrlTag(url, method, crossOrigin) {
	/** @type {(element: HTMLElement) => void} */
	const cleanup = (element) => {
		if (document.head.contains(element)) {
			element.remove();
		}
	};

	return /** @type {Promise<void>} */ (
		new Promise((resolve, reject) => {
			const scriptElement = document.createElement('script');
			scriptElement.src = url;

			if (crossOrigin) {
				scriptElement.crossOrigin = 'anonymous';
			}
			if (method === 'async') {
				scriptElement.async = true;
			}
			if (method === 'defer') {
				scriptElement.defer = true;
			}

			scriptElement.addEventListener('load', () => {
				cleanup(scriptElement);
				resolve();
			});

			scriptElement.addEventListener('error', (error) => {
				cleanup(scriptElement);
				reject(error);
			});

			document.head.append(scriptElement);
		})
	);
}

function waitDomReady() {
	const checkReadyState = () => {
		/** @type {DocumentReadyState[]} */
		const READY_STATE = ['complete', 'interactive'];
		return READY_STATE.includes(document.readyState);
	};

	return /** @type {Promise<void>} */ (
		new Promise((resolve) => {
			if (checkReadyState()) {
				resolve();
			}

			const EVENT_TYPE = 'readystatechange';

			const handleReadystatechange = () => {
				if (checkReadyState()) {
					document.removeEventListener(
						EVENT_TYPE,
						handleReadystatechange
					);
					resolve();
				}
			};

			document.addEventListener(EVENT_TYPE, handleReadystatechange);
		})
	);
}

(() => {
	if (location.hostname.endsWith('.izakaya.cc')) {
		const ANALYTICS_BASE_URL = 'https://track.izakaya.cc';
		const ANALYTICS_API_URL = `${ANALYTICS_BASE_URL}/api.php`;
		const ANALYTICS_SCRIPT_URL = `${ANALYTICS_BASE_URL}/api.js`;
		const ANALYTICS_SITE_ID = '12';

		if (window._paq !== undefined) {
			return;
		}

		/** @type {(...args: unknown[]) => void} */
		const push = (...args) => {
			window._paq ??= [];
			window._paq.push(...args);
		};

		push(
			['enableHeartBeatTimer'],
			['enableLinkTracking'],
			['setRequestMethod', 'GET'],
			['setTrackerUrl', ANALYTICS_API_URL],
			['setSiteId', ANALYTICS_SITE_ID]
		);

		setScriptUrlTag(ANALYTICS_SCRIPT_URL, 'async', true)
			.then(() => {
				push(['trackPageView']);
				console.info('Analytics load succeeded.');
			})
			.catch((error) => {
				console.error('Analytics load failed.', error);
			});
	}
})();

waitDomReady().then(() => {
	/**
	 * @description Open external links in a new tab
	 */
	document.querySelectorAll('#mdbook-content a')?.forEach((a) => {
		const href = a.getAttribute('href');
		if (!href) {
			return;
		}

		if (href.startsWith('http://') || href.startsWith('https://')) {
			try {
				if (
					new URL(href, location.href).hostname !== location.hostname
				) {
					a.setAttribute('target', '_blank');
					a.setAttribute('rel', 'noopener noreferrer');
				}
			} catch {}
		}
	});

	/**
	 * @description Enable Fancybox for images that are the only child of a paragraph
	 */
	document.querySelectorAll('p > img:only-child')?.forEach((img) => {
		if (
			!(img instanceof HTMLImageElement) ||
			img.parentNode === null ||
			img.closest('a')
		) {
			return;
		}

		const link = document.createElement('a');
		link.dataset.fancybox = 'images';
		link.href = img.src;

		img.parentNode.replaceChild(link, img);
		link.appendChild(img);
	});

	const bindFancybox = () => {
		if (Fancybox !== undefined) {
			Fancybox.bind('[data-fancybox="images"]', { theme: 'auto' });
			return true;
		}
	};
	(() => {
		if (bindFancybox()) {
			return;
		}
		let fancyboxInitCount = 0;
		const fancyboxInterval = setInterval(() => {
			if (Fancybox === undefined) {
				fancyboxInitCount += 1;
				if (fancyboxInitCount >= 50) {
					clearInterval(fancyboxInterval);
				}
			} else {
				Fancybox.bind('[data-fancybox="images"]', { theme: 'auto' });
				clearInterval(fancyboxInterval);
			}
		}, 50);
	})();
});
