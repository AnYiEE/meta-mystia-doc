document.addEventListener('DOMContentLoaded', () => {
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

	Fancybox.bind('[data-fancybox="images"]', {
		theme: 'auto',
	});
});
