document.addEventListener('DOMContentLoaded', () => {
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

	document.querySelectorAll('p > img:only-child')?.forEach((img) => {
		if (img.closest('a')) {
			return;
		}

		const link = document.createElement('a');
		link.dataset.fancybox = 'images';
		link.href = img.src;

		img.parentNode.replaceChild(link, img);
		link.appendChild(img);
	});

	Fancybox.bind('[data-fancybox="images"]', { theme: 'auto' });
});
