/**
 * Mechitas Dibujantes - JavaScript
 * Web de portafolio: retratos, tatuajes y contacto
 */
(function() {
    'use strict';

    /* Marcamos que el JS funciona: el CSS usa esto para ocultar
       el cursor nativo solo si de verdad hay cursor personalizado. */
    document.documentElement.classList.add('js');

    const reduceMotion = typeof window.matchMedia === 'function'
        && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const backToTop = document.getElementById('back-to-top');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const galleryItems = Array.prototype.slice.call(document.querySelectorAll('.gallery-item'));
    const cursorPaw = document.getElementById('cursor-paw');
    const cursorRing = document.getElementById('cursor-ring');

    /* ===== MENU MOVIL ===== */
    function setMenuOpen(open) {
        if (!navToggle || !navMenu) return;
        navMenu.classList.toggle('active', !!open);
        navToggle.classList.toggle('active', !!open);
        navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    /* ===== LIGHTBOX ===== */
    let indice = -1;
    let ultimoFoco = null;

    function imagenDe(item) {
        const img = item.querySelector('img');
        return img ? (img.currentSrc || img.getAttribute('src') || '') : '';
    }

    function altDe(item) {
        const img = item.querySelector('img');
        return img ? (img.getAttribute('alt') || '') : '';
    }

    function mostrar(nuevoIndice) {
        if (!galleryItems.length) return;
        indice = (nuevoIndice + galleryItems.length) % galleryItems.length;
        const item = galleryItems[indice];

        if (lightboxImg) {
            lightboxImg.setAttribute('src', imagenDe(item));
            lightboxImg.setAttribute('alt', altDe(item));
        }
        if (lightboxCounter) {
            lightboxCounter.textContent = (indice + 1) + ' / ' + galleryItems.length;
        }
    }

    function abrirLightbox(item, desdeTeclado) {
        if (!lightbox || !item) return;
        // Si el foco esta en el body (clic de raton), nos quedamos con la foto pulsada
        const activo = document.activeElement;
        ultimoFoco = desdeTeclado ? item : (activo && activo !== document.body ? activo : item);

        const i = galleryItems.indexOf(item);
        mostrar(i < 0 ? 0 : i);

        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');

        // Evita el salto de la pagina al desaparecer la barra de scroll
        const anchoBarra = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = 'hidden';
        if (anchoBarra > 0) document.body.style.paddingRight = anchoBarra + 'px';

        if (lightboxClose) lightboxClose.focus();
    }

    function cerrarLightbox() {
        if (!lightbox) return;
        if (!lightbox.classList.contains('active')) return;
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        if (ultimoFoco && typeof ultimoFoco.focus === 'function') ultimoFoco.focus();
        ultimoFoco = null;
    }

    function siguiente() { if (lightbox && lightbox.classList.contains('active')) mostrar(indice + 1); }
    function anterior() { if (lightbox && lightbox.classList.contains('active')) mostrar(indice - 1); }

    /* ===== INIT ===== */
    function init() {

        /* ----- Custom cat paw cursor ----- */
        if (cursorPaw && cursorRing) {
            let mouseX = 0, mouseY = 0;
            let pawX = 0, pawY = 0;
            let ringX = 0, ringY = 0;
            const pawLerp = 0.2;
            const ringLerp = 0.1;
            const hoverable = 'a, button, .cta-button, .gallery-item, .social-link, .back-to-top, .lightbox-close, .lightbox-prev, .lightbox-next, .contact-value, .contact-item, input, textarea, .nav-link, [tabindex]';

            function handleMouseMove(e) {
                mouseX = e.clientX;
                mouseY = e.clientY;

                const target = e.target;
                if (target.closest && target.closest(hoverable)) {
                    cursorRing.classList.add('hover');
                    cursorPaw.classList.add('hover');
                } else {
                    cursorRing.classList.remove('hover');
                    cursorPaw.classList.remove('hover');
                }

                if (target.tagName === 'A' || (target.closest && target.closest('a'))) {
                    cursorPaw.classList.add('link');
                    cursorRing.classList.add('hover');
                } else {
                    cursorPaw.classList.remove('link');
                }
            }

            function animateCursor() {
                pawX += (mouseX - pawX) * pawLerp;
                pawY += (mouseY - pawY) * pawLerp;

                ringX += (pawX - ringX) * ringLerp;
                ringY += (pawY - ringY) * ringLerp;

                cursorPaw.style.left = pawX + 'px';
                cursorPaw.style.top = pawY + 'px';
                cursorRing.style.left = ringX + 'px';
                cursorRing.style.top = ringY + 'px';

                requestAnimationFrame(animateCursor);
            }

            document.addEventListener('mousemove', handleMouseMove);
            animateCursor();
        }

        /* ----- Navbar scroll + back to top (1 vez por frame) ----- */
        let pendiente = false;
        function actualizarScroll() {
            const arriba = window.scrollY <= 50;
            if (navbar) navbar.classList.toggle('scrolled', !arriba);
            if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);
            pendiente = false;
        }
        window.addEventListener('scroll', function() {
            if (pendiente) return;
            pendiente = true;
            requestAnimationFrame(actualizarScroll);
        }, { passive: true });

        /* ----- Smooth scrolling para los enlaces del menu ----- */
        Array.prototype.forEach.call(document.querySelectorAll('a[href^="#"]'), function(anchor) {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                const target = href && href.length > 1 ? document.querySelector(href) : null;
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
                }
                setMenuOpen(false);
            });
        });

        /* ----- Menu movil ----- */
        if (navToggle) {
            navToggle.setAttribute('aria-expanded', 'false');
            navToggle.addEventListener('click', function() {
                setMenuOpen(!navMenu.classList.contains('active'));
            });
        }

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) setMenuOpen(false);
        });

        document.addEventListener('click', function(e) {
            if (!navMenu || !navMenu.classList.contains('active')) return;
            if (navMenu.contains(e.target)) return;
            if (navToggle && navToggle.contains(e.target)) return;
            setMenuOpen(false);
        });

        /* ----- Back to top ----- */
        if (backToTop) {
            backToTop.addEventListener('click', function() {
                window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
            });
        }

        /* ----- Año del footer ----- */
        const anio = document.getElementById('anio');
        if (anio) anio.textContent = new Date().getFullYear();

        /* ----- Fotos de la galeria ----- */
        galleryItems.forEach(function(item, i) {
            item.setAttribute('data-index', String(i));
            item.addEventListener('click', function() { abrirLightbox(item, false); });
            item.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
                    e.preventDefault();
                    abrirLightbox(item, true);
                }
            });
        });

        if (lightboxClose) lightboxClose.addEventListener('click', cerrarLightbox);
        if (lightboxPrev) lightboxPrev.addEventListener('click', anterior);
        if (lightboxNext) lightboxNext.addEventListener('click', siguiente);
        if (lightbox) {
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox) cerrarLightbox();
            });
        }

        document.addEventListener('keydown', function(e) {
            if (!lightbox || !lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') cerrarLightbox();
            else if (e.key === 'ArrowRight') siguiente();
            else if (e.key === 'ArrowLeft') anterior();
        });

        /* ----- Foco atrapado dentro del lightbox ----- */
        // Mientras el lightbox este abierto, el foco no puede salirse de el.
        // Tambien arregla que el navegador ponga el foco en la foto pulsada
        // DESPUES de nuestro foco, pisandonoslo.
        document.addEventListener('focusin', function(e) {
            if (!lightbox || !lightbox.classList.contains('active')) return;
            if (lightbox.contains(e.target)) return;
            if (lightboxClose) lightboxClose.focus();
        });

        /* ----- Galeria: aparece al hacer scroll (con plan B) ----- */
        if ('IntersectionObserver' in window && !reduceMotion) {
            const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };
            const galleryObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('appear');
                        galleryObserver.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            document.querySelectorAll('.gallery-section, .gallery-item').forEach(function(el) {
                galleryObserver.observe(el);
            });
        } else {
            document.querySelectorAll('.gallery-section, .gallery-item').forEach(function(el) {
                el.classList.add('appear');
            });
        }

        /* Primer calculo, por si la pagina carga ya desplazada */
        actualizarScroll();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    /* ===== DEBUG ===== */
    window.mechitas = {
        abrir: function(i) { abrirLightbox(galleryItems[i], false); },
        cerrar: cerrarLightbox,
        siguiente: siguiente,
        anterior: anterior,
        setMenuOpen: setMenuOpen,
        totalFotos: galleryItems.length
    };
})();
