'use strict';

// Helpers
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// Theme toggle
(() => {
	const root = document.documentElement;
	const btn = $('#themeToggle');
	const saved = localStorage.getItem('theme');
	if (saved) root.setAttribute('data-theme', saved);
	btn?.addEventListener('click', () => {
		const current = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
		root.setAttribute('data-theme', current);
		localStorage.setItem('theme', current);
	});
})();

// Set current year
(() => {
	const el = $('#year');
	if (el) el.textContent = String(new Date().getFullYear());
})();

// Smooth active link on scroll
(() => {
	const links = $$('.site-nav .nav-link');
	const sections = links.map(a => $(a.getAttribute('href')));
	const onScroll = () => {
		const y = window.scrollY + 120;
		let activeIndex = 0;
		sections.forEach((sec, i) => {
			if (sec && sec.offsetTop <= y) activeIndex = i;
		});
		links.forEach((l, i) => l.classList.toggle('active', i === activeIndex));
	};
	window.addEventListener('scroll', onScroll, { passive: true });
	onScroll();
})();

// About text fade-in on view
(() => {
	const about = $('#about');
	if (!about) return;
	const paras = $$('.about-copy p', about);
	const io = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				paras.forEach((p, idx) => {
					setTimeout(() => p.classList.add('show'), idx * 120);
				});
				io.disconnect();
			}
		});
	}, { threshold: 0.2 });
	io.observe(about);
})();

// Tilt effect (lightweight)
(() => {
	const tilts = $$('.tilt');
	tilts.forEach(el => {
		const handle = (e) => {
			const r = el.getBoundingClientRect();
			const cx = r.left + r.width / 2;
			const cy = r.top + r.height / 2;
			const dx = (e.clientX - cx) / (r.width / 2);
			const dy = (e.clientY - cy) / (r.height / 2);
			el.style.transform = `perspective(900px) rotateX(${dy * -6}deg) rotateY(${dx * 6}deg) translateY(-2px)`;
		};
		const reset = () => { el.style.transform = ''; };
		el.addEventListener('mousemove', handle);
		el.addEventListener('mouseleave', reset);
	});
})();

// (skill click-to-zoom removed)

// Projects filtering
(() => {
	const grid = $('.project-grid');
	const chips = $$('.filters .chip');
	if (!grid || !chips.length) return;

	chips.forEach(chip => {
		chip.addEventListener('click', () => {
			chips.forEach(c => c.classList.remove('active'));
			chip.classList.add('active');
			const filter = chip.dataset.filter;
			$$('.project-card', grid).forEach(card => {
				const ok = filter === 'all' || card.dataset.category === filter;
				card.style.display = ok ? '' : 'none';
			});
		});
	});
})();

// Duplicate marquee content for seamless loop (if wide screens)
(() => {
	const marqueeTracks = $$('.skills-marquee .track, .footer-marquee .track');
	marqueeTracks.forEach(track => {
		// Clone children to fill at least 2x width
		const content = track.innerHTML;
		track.innerHTML = content + content;
	});
})();

// Particles background (canvas-free, DOM light)
(() => {
	const root = $('#particles');
	if (!root) return;
	const count = Math.min(80, Math.floor(window.innerWidth / 16));
	const frags = document.createDocumentFragment();
	for (let i = 0; i < count; i++) {
		const d = document.createElement('span');
		const size = Math.random() * 3 + 1;
		d.style.position = 'absolute';
		d.style.left = Math.random() * 100 + '%';
		d.style.top = Math.random() * 100 + '%';
		d.style.width = `${size}px`;
		d.style.height = `${size}px`;
		d.style.borderRadius = '50%';
		d.style.background = `radial-gradient(circle, rgba(150,190,255,0.8), rgba(150,190,255,0) 60%)`;
		d.style.filter = 'blur(0.5px)';
		d.style.opacity = String(0.15 + Math.random() * 0.35);
		const dur = 10 + Math.random() * 20;
		const delay = Math.random() * -dur;
		d.style.animation = `floatY ${dur}s ease-in-out ${delay}s infinite alternate`;
		frags.appendChild(d);
	}
	root.appendChild(frags);
	// Inject keyframes once
	const style = document.createElement('style');
	style.textContent = `
@keyframes floatY {
	0% { transform: translateY(-6px) translateX(-4px); }
	100% { transform: translateY(6px) translateX(4px); }
}`;
	document.head.appendChild(style);
})();

// Reduce motion media query support
(() => {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		// Pause animations by removing style animations on particles
		$$('#particles span').forEach(s => s.style.animation = 'none');
	}
})();


