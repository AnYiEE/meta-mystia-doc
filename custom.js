'use strict';

// @ts-check
/// <reference types="./custom.d.ts" />

(() => {
	/**
	 * @param {string} url
	 * @param {'async' | 'defer'} [method]
	 * @param {boolean} [crossOrigin]
	 */
	const setScriptUrlTag = (url, method, crossOrigin) => {
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
	};

	const waitDomReady = () => {
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
	};

	(() => {
		const BASE_URL = 'izakaya.cc';
		if (location.hostname.endsWith(`.${BASE_URL}`)) {
			const ANALYTICS_BASE_URL = `https://track.${BASE_URL}`;
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
				['setCookieDomain', `*.${BASE_URL}`],
				['setRequestMethod', 'GET'],
				['setTrackerUrl', ANALYTICS_API_URL],
				['setSecureCookie', true],
				['setSiteId', ANALYTICS_SITE_ID]
			);

			setScriptUrlTag(ANALYTICS_SCRIPT_URL, 'async', true)
				.then(() => {
					push(['trackPageView']);
					setTimeout(() => {
						push(['ping']);
					}, 30 * 1000);
					console.info('Analytics load succeeded.');
				})
				.catch((error) => {
					console.error('Analytics load failed.', error);
				});
		}
	})();

	waitDomReady().then(() => {
		if (window.__domReadyScriptRan) {
			return;
		}
		window.__domReadyScriptRan = true;

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
						new URL(href, location.href).hostname !==
						location.hostname
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
					Fancybox.bind('[data-fancybox="images"]', {
						theme: 'auto',
					});
					clearInterval(fancyboxInterval);
				}
			}, 50);
		})();

		/**
		 * @description Fetch and display the latest version information
		 */
		(async () => {
			const managerElements = document.querySelectorAll(
				'span.version-manager'
			);
			const dllElements = document.querySelectorAll('span.version-dll');
			const zipElements = document.querySelectorAll('span.version-zip');

			if (
				managerElements.length === 0 &&
				dllElements.length === 0 &&
				zipElements.length === 0
			) {
				return;
			}

			const response = await fetch(
				'https://api.izakaya.cc/version/meta-mystia'
			).catch(() => null);
			if (!response?.ok) {
				return;
			}

			/** @type {{manager: string | null; dll: string | null; zip: string | null}} */
			const data = await response.json().catch(() => null);
			if (data === null) {
				return;
			}

			if (data.manager !== null) {
				managerElements.forEach((el) => {
					el.innerHTML = el.innerHTML
						.replace('*', data.manager)
						.replace('最新的', '');
				});
			}
			if (data.dll !== null) {
				dllElements.forEach((el) => {
					el.innerHTML = el.innerHTML
						.replace('*', data.dll)
						.replace('最新的', '');
				});
			}
			if (data.zip !== null) {
				zipElements.forEach((el) => {
					el.innerHTML = el.innerHTML
						.replace('*', data.zip)
						.replace('最新的', '');
				});
			}
		})();

		/**
		 * @description Translate the search results header
		 */
		(() => {
			const el = document.getElementById('mdbook-searchresults-header');
			if (el === null) {
				return;
			}

			/** @type {(node: HTMLElement | null) => void} */
			const replaceText = (node) => {
				if (!node || !node.textContent) {
					return;
				}

				const regex = /^(\d+) search results for\s+'(.+)':$/i;
				const match = node.textContent.trim().match(regex);
				if (match === null) {
					return;
				}

				const count = match[1];
				const keyword = match[2];
				node.textContent = `${count}条搜索结果：${keyword}`;
			};

			const observer = new MutationObserver((mutations) => {
				for (const mutation of mutations) {
					if (
						mutation.type === 'characterData' ||
						mutation.type === 'childList'
					) {
						replaceText(el);
						break;
					}
				}
			});

			replaceText(el);
			observer.observe(el, {
				characterData: true,
				childList: true,
				subtree: true,
			});
		})();
	});
})();
