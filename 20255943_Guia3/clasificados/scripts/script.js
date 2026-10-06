/* ==========================================================================
   CLASIFICADOS.ST — El Salvador
   JavaScript vanilla compartido por las tres páginas.
   Cada bloque solo actúa si encuentra sus elementos en la página.
   ========================================================================== */

(function () {
    'use strict';

    var doc = document;

    function $(selector, context) {
        return (context || doc).querySelector(selector);
    }

    function $$(selector, context) {
        return Array.prototype.slice.call((context || doc).querySelectorAll(selector));
    }

    // Minúsculas y sin tildes, para que "camara" encuentre "Cámara"
    function normalize(text) {
        return String(text)
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    function pluralize(count, singular, plural) {
        return count + ' ' + (count === 1 ? singular : plural);
    }


    /* ----------------------------------------------------------------------
       1. Menú móvil
       ---------------------------------------------------------------------- */

    var toggle = $('.nav-toggle');
    var menu = $('#site-menu');

    if (toggle && menu) {
        var setMenu = function (open) {
            menu.classList.toggle('is-open', open);
            toggle.setAttribute('aria-expanded', String(open));
            toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
        };

        toggle.addEventListener('click', function () {
            setMenu(!menu.classList.contains('is-open'));
        });

        doc.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && menu.classList.contains('is-open')) {
                setMenu(false);
                toggle.focus();
            }
        });
    }


    /* ----------------------------------------------------------------------
       2. Aparición progresiva al hacer scroll
       ---------------------------------------------------------------------- */

    $$('.reveal-group').forEach(function (group) {
        $$('.reveal', group).forEach(function (item, index) {
            item.style.setProperty('--i', String(index % 3));
        });
    });

    var revealItems = $$('.reveal');

    function showItem(item) {
        item.classList.add('is-visible');
        window.setTimeout(function () {
            item.classList.add('is-done');
        }, 1000);
    }

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    showItem(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });

        revealItems.forEach(function (item) {
            observer.observe(item);
        });
    } else {
        revealItems.forEach(showItem);
    }


    /* ----------------------------------------------------------------------
       3. Enlaces de ayuda que se abren en ventana emergente
          (comportamiento del sitio original; si el navegador la bloquea,
          el enlace se abre normalmente en una pestaña nueva)
       ---------------------------------------------------------------------- */

    $$('[data-popup]').forEach(function (link) {
        link.addEventListener('click', function (event) {
            var size = link.getAttribute('data-popup').split('x');
            var width = parseInt(size[0], 10) + 30;
            var height = parseInt(size[1], 10) + 30;
            var features =
                'height=' + height +
                ',width=' + width +
                ',menubar=no,resizable=yes,status=no,scrollbars=yes,toolbar=no';

            var popup = window.open(link.href, link.getAttribute('data-name') || 'ayuda', features);

            if (popup) {
                event.preventDefault();
                popup.focus();
            }
        });
    });


    /* ----------------------------------------------------------------------
       4. Aviso de cookies
       ---------------------------------------------------------------------- */

    (function cookieNotice() {
        var KEY = 'clasificados-cookies-ok';

        try {
            if (window.localStorage.getItem(KEY) === '1') {
                return;
            }
        } catch (error) {
            /* almacenamiento no disponible: se muestra el aviso igualmente */
        }

        var banner = doc.createElement('div');
        banner.className = 'cookie-banner';
        banner.setAttribute('role', 'region');
        banner.setAttribute('aria-label', 'Aviso de cookies');

        banner.innerHTML =
            '<p>Usamos cookies propias y de terceros para mejorar la usabilidad, ' +
            'personalizar el contenido y los anuncios y analizar el tráfico. ' +
            'Si continúa navegando consideramos que acepta su uso. ' +
            'Puede saber más <a href="https://sv.clasificados.st/ayuda?t=6&amp;p=5" ' +
            'data-popup="450x400" data-name="Política de Privacidad" ' +
            'target="_blank" rel="noopener">aquí</a>.</p>' +
            '<button type="button" class="cookie-btn">Aceptar</button>';

        doc.body.appendChild(banner);

        var popupLink = $('a[data-popup]', banner);
        popupLink.addEventListener('click', function (event) {
            var popup = window.open(
                popupLink.href,
                'Política de Privacidad',
                'height=430,width=480,menubar=no,resizable=yes,status=no,scrollbars=yes,toolbar=no'
            );
            if (popup) {
                event.preventDefault();
                popup.focus();
            }
        });

        $('.cookie-btn', banner).addEventListener('click', function () {
            try {
                window.localStorage.setItem(KEY, '1');
            } catch (error) {
                /* sin almacenamiento: el aviso reaparecerá en la próxima visita */
            }
            banner.remove();
        });
    })();


    /* ----------------------------------------------------------------------
       5. INICIO — buscador que filtra las categorías
       ---------------------------------------------------------------------- */

    var searchForm = $('#search-form');

    if (searchForm) {
        var searchInput = $('#category-search');
        var searchStatus = $('#search-status');
        var catCards = $$('.cat-card');
        var catEmpty = $('#cat-empty');
        var catTitle = $('#categorias');

        var filterCategories = function () {
            var term = normalize(searchInput.value.trim());
            var visible = 0;

            catCards.forEach(function (card) {
                var haystack = normalize(card.textContent + ' ' + (card.getAttribute('data-keywords') || ''));
                var match = term === '' || haystack.indexOf(term) !== -1;

                card.hidden = !match;
                if (match) {
                    visible += 1;
                }
            });

            catEmpty.hidden = visible !== 0;

            if (term === '') {
                searchStatus.textContent = '';
            } else if (visible === 0) {
                searchStatus.textContent = 'Sin resultados para «' + searchInput.value.trim() + '».';
            } else {
                searchStatus.textContent = pluralize(visible, 'categoría encontrada', 'categorías encontradas') + '.';
            }
        };

        searchInput.addEventListener('input', filterCategories);

        searchForm.addEventListener('submit', function (event) {
            event.preventDefault();
            filterCategories();

            if (catTitle) {
                catTitle.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }


    /* ----------------------------------------------------------------------
       6. BIENES RAÍCES — filtros y ordenamiento del listado
       ---------------------------------------------------------------------- */

    var filtersForm = $('#filters-form');

    if (filtersForm) {
        var adGrid = $('#ad-grid');
        var ads = $$('.ad-card', adGrid);
        var adCount = $('#ad-count');
        var adEmpty = $('#ad-empty');
        var sortSelect = $('#sort');
        var resetButton = $('#reset-filters');

        var applyFilters = function () {
            var term = normalize(filtersForm.elements.q.value.trim());
            var operation = filtersForm.elements.op.value;
            var type = filtersForm.elements.tipo.value;
            var zone = filtersForm.elements.zona.value;
            var visible = 0;

            ads.forEach(function (ad) {
                var match =
                    (term === '' || normalize(ad.textContent).indexOf(term) !== -1) &&
                    (operation === '' || ad.getAttribute('data-op') === operation) &&
                    (type === '' || ad.getAttribute('data-tipo') === type) &&
                    (zone === '' || ad.getAttribute('data-zona') === zone);

                ad.hidden = !match;
                if (match) {
                    visible += 1;
                }
            });

            adCount.textContent = pluralize(visible, 'anuncio', 'anuncios');
            adEmpty.hidden = visible !== 0;
        };

        var applySort = function () {
            var mode = sortSelect.value;

            ads.sort(function (a, b) {
                var priceA = Number(a.getAttribute('data-precio'));
                var priceB = Number(b.getAttribute('data-precio'));
                var dateA = Number(a.getAttribute('data-fecha'));
                var dateB = Number(b.getAttribute('data-fecha'));

                if (mode === 'precio-asc') {
                    return priceA - priceB;
                }
                if (mode === 'precio-desc') {
                    return priceB - priceA;
                }
                return dateB - dateA;
            });

            ads.forEach(function (ad) {
                adGrid.appendChild(ad);
            });
        };

        filtersForm.addEventListener('input', applyFilters);
        filtersForm.addEventListener('change', applyFilters);
        filtersForm.addEventListener('submit', function (event) {
            event.preventDefault();
            applyFilters();
        });

        sortSelect.addEventListener('change', applySort);

        resetButton.addEventListener('click', function () {
            filtersForm.reset();
            applyFilters();
        });

        applySort();
        applyFilters();

        // Panel de filtros: abierto en escritorio, plegable en móvil
        var panel = $('.filters');

        if (panel && window.matchMedia) {
            var desktop = window.matchMedia('(min-width: 901px)');

            var syncPanel = function () {
                if (desktop.matches) {
                    panel.open = true;
                }
            };

            if (!desktop.matches) {
                panel.open = false;
            }

            panel.addEventListener('toggle', syncPanel);

            if (desktop.addEventListener) {
                desktop.addEventListener('change', syncPanel);
            }
        }
    }


    /* ----------------------------------------------------------------------
       7. CONTACTO — validación del formulario
       ---------------------------------------------------------------------- */

    var contactForm = $('#contact-form');

    if (contactForm) {
        var emailField = $('#email');
        var messageField = $('#mensaje');
        var termsField = $('#acepto');
        var counter = $('#msg-count');
        var success = $('#contact-success');
        var formCard = $('#contact-card');

        var setError = function (input, message) {
            var field = input.closest('.field') || input.closest('.check');
            var error = $('#' + input.id + '-error');

            if (field) {
                field.classList.toggle('has-error', Boolean(message));
            }
            if (error) {
                error.textContent = message || '';
            }
            input.setAttribute('aria-invalid', message ? 'true' : 'false');

            return !message;
        };

        var validateEmail = function () {
            var value = emailField.value.trim();

            if (value === '') {
                return setError(emailField, 'Escriba su correo para que podamos responderle.');
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
                return setError(emailField, 'Revise el formato del correo (ejemplo: nombre@correo.com).');
            }
            return setError(emailField, '');
        };

        var validateMessage = function () {
            var value = messageField.value.trim();

            if (value.length < 10) {
                return setError(messageField, 'Cuéntenos un poco más (mínimo 10 caracteres).');
            }
            return setError(messageField, '');
        };

        var validateTerms = function () {
            if (!termsField.checked) {
                return setError(termsField, 'Debe aceptar las condiciones para enviar el mensaje.');
            }
            return setError(termsField, '');
        };

        emailField.addEventListener('blur', validateEmail);
        messageField.addEventListener('blur', validateMessage);
        termsField.addEventListener('change', validateTerms);

        messageField.addEventListener('input', function () {
            counter.textContent = messageField.value.length + ' / ' + messageField.maxLength;
        });

        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();

            var results = [validateEmail(), validateMessage(), validateTerms()];
            var firstInvalid = [emailField, messageField, termsField][results.indexOf(false)];

            if (firstInvalid) {
                firstInvalid.focus();
                return;
            }

            // Prototipo: aquí se enviaría el mensaje al servidor
            contactForm.hidden = true;
            $('#contact-intro').hidden = true;
            success.hidden = false;
            $('h2', success).focus();
            formCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        $('#send-another').addEventListener('click', function () {
            contactForm.reset();
            counter.textContent = '0 / ' + messageField.maxLength;
            contactForm.hidden = false;
            $('#contact-intro').hidden = false;
            success.hidden = true;
            emailField.focus();
        });
    }

})();
