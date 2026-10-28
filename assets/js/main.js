/*
	Hyperspace by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$sidebar = $('#sidebar');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ null,      '480px'  ]
		});

	// Hack: Enable IE flexbox workarounds.
		if (browser.name == 'ie')
			$body.addClass('is-ie');

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Forms.

		// Hack: Activate non-input submits.
			$('form').on('click', '.submit', function(event) {

				// Stop propagation, default.
					event.stopPropagation();
					event.preventDefault();

				// Submit form.
					$(this).parents('form').submit();

			});

	// Sidebar.
		if ($sidebar.length > 0) {

			var $sidebar_a = $sidebar.find('a');

			$sidebar_a
				.addClass('scrolly')
				.on('click', function() {

					var $this = $(this);

					// External link? Bail.
						if ($this.attr('href').charAt(0) != '#')
							return;

					// Deactivate all links.
						$sidebar_a.removeClass('active');

					// Activate link *and* lock it (so Scrollex doesn't try to activate other links as we're scrolling to this one's section).
						$this
							.addClass('active')
							.addClass('active-locked');

				})
				.each(function() {

					var	$this = $(this),
						id = $this.attr('href'),
						$section = $(id);

					// No section for this link? Bail.
						if ($section.length < 1)
							return;

					// Scrollex.
						$section.scrollex({
							mode: 'middle',
							top: '-20vh',
							bottom: '-20vh',
							initialize: function() {

								// Deactivate section.
									$section.addClass('inactive');

							},
							enter: function() {

								// Activate section.
									$section.removeClass('inactive');

								// No locked links? Deactivate all links and activate this section's one.
									if ($sidebar_a.filter('.active-locked').length == 0) {

										$sidebar_a.removeClass('active');
										$this.addClass('active');

									}

								// Otherwise, if this section's link is the one that's locked, unlock it.
									else if ($this.hasClass('active-locked'))
										$this.removeClass('active-locked');

							}
						});

				});

		}

	// Scrolly.
		$('.scrolly').scrolly({
			speed: 1000,
			offset: function() {

				// If <=large, >small, and sidebar is present, use its height as the offset.
					if (breakpoints.active('<=large')
					&&	!breakpoints.active('<=small')
					&&	$sidebar.length > 0)
						return $sidebar.height();

				return 0;

			}
		});

	// Spotlights.
		$('.spotlights > section')
			.scrollex({
				mode: 'middle',
				top: '-10vh',
				bottom: '-10vh',
				initialize: function() {

					// Deactivate section.
						$(this).addClass('inactive');

				},
				enter: function() {

					// Activate section.
						$(this).removeClass('inactive');

				}
			})
			.each(function() {

				var	$this = $(this),
					$image = $this.find('.image'),
					$img = $image.find('img'),
					x;

				// Assign image.
					$image.css('background-image', 'url(' + $img.attr('src') + ')');

				// Set background position.
					if (x = $img.data('position'))
						$image.css('background-position', x);

				// Hide <img>.
					$img.hide();

			});

	// Features.
		$('.features')
			.scrollex({
				mode: 'middle',
				top: '-20vh',
				bottom: '-20vh',
				initialize: function() {

					// Deactivate section.
						$(this).addClass('inactive');

				},
				enter: function() {

					// Activate section.
						$(this).removeClass('inactive');

				}
			});

	// Hero 3D background.
		var $heroVisual = $('.hero-visual');
		if ($heroVisual.length > 0 && typeof THREE !== 'undefined') {
			var heroScene = new THREE.Scene();
			var heroCamera = new THREE.PerspectiveCamera(42, $heroVisual.width() / $heroVisual.height(), 0.1, 1000);
			var heroRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
			heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
			heroRenderer.setClearColor(0x000000, 0);
			heroRenderer.setSize($heroVisual.width(), $heroVisual.height());
			$heroVisual.append(heroRenderer.domElement);

			var ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
			heroScene.add(ambientLight);

			var pointLight = new THREE.PointLight(0x8bc6ff, 2.5, 100);
			pointLight.position.set(4, 3, 5);
			heroScene.add(pointLight);

			var heroGroup = new THREE.Group();
			var heroCore = new THREE.Mesh(
				new THREE.IcosahedronGeometry(1.5, 1),
				new THREE.MeshPhysicalMaterial({
					color: 0x7f8cff,
					emissive: 0x2739b0,
					metalness: 0.7,
					roughness: 0.18,
					transparent: true,
					opacity: 0.95
				})
			);

			var heroWireframe = new THREE.Mesh(
				new THREE.IcosahedronGeometry(2.05, 1),
				new THREE.MeshBasicMaterial({
					color: 0xbfe7ff,
					wireframe: true,
					transparent: true,
					opacity: 0.38
				})
			);

			var heroHalo = new THREE.Mesh(
				new THREE.TorusKnotGeometry(1.15, 0.22, 160, 24),
				new THREE.MeshStandardMaterial({
					color: 0xd6a3ff,
					metalness: 0.8,
					roughness: 0.2,
					emissive: 0x3c235f
				})
			);
			heroHalo.rotation.x = 1.3;
			heroHalo.rotation.y = 0.6;

			heroGroup.add(heroHalo);
			heroGroup.add(heroCore);
			heroGroup.add(heroWireframe);
			heroScene.add(heroGroup);

			heroCamera.position.set(0, 0.3, 6.3);
			heroGroup.position.set(0.4, 0.2, 0);

			var heroClock = new THREE.Clock();
			function renderHeroBackground() {
				var elapsed = heroClock.getElapsedTime();
				heroGroup.rotation.x = elapsed * 0.45;
				heroGroup.rotation.y = elapsed * 0.75;
				heroCore.rotation.x -= 0.006;
				heroCore.rotation.y += 0.01;
				heroWireframe.rotation.y -= 0.008;
				heroHalo.rotation.z = elapsed * 0.8;
				heroRenderer.render(heroScene, heroCamera);
				requestAnimationFrame(renderHeroBackground);
			}
			renderHeroBackground();

			$(window).on('resize.hero3d', function() {
				var width = $heroVisual.width();
				var height = $heroVisual.height();
				heroCamera.aspect = width / height;
				heroCamera.updateProjectionMatrix();
				heroRenderer.setSize(width, height);
			});
		}

	window.scrollCarousel = function(button) {
		var targetId = button.getAttribute('data-target');
		var direction = button.getAttribute('data-direction') === 'left' ? -1 : 1;
		var target = document.getElementById(targetId);

		if (!target) {
			return;
		}

		var scrollAmount = Math.max(target.clientWidth * 0.75, 220);
		target.scrollBy({
			left: scrollAmount * direction,
			behavior: 'smooth'
		});
	};

	document.querySelectorAll('.scroll-btn').forEach(function(button) {
		button.addEventListener('click', function(event) {
			event.preventDefault();
			window.scrollCarousel(button);
		});
	});

})(jQuery);