(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var Reveal = require('reveal.js/js/reveal.js');
var head = require('reveal.js/lib/js/head.min.js');
var notes = require('reveal.js/plugin/notes/notes.js');
Reveal.initialize({
  controls: true,
  progress: true,
  history: true,
  center: true,
  dependencies: []
  //	{ src: '/assets/js/plugin/notes/notes.js', async: true }, 

  // default/cube/page/concave/zoom/linear/fade/none 
  //transition: 'none',
});

},{"reveal.js/js/reveal.js":2,"reveal.js/lib/js/head.min.js":3,"reveal.js/plugin/notes/notes.js":4}],2:[function(require,module,exports){
/*!
 * reveal.js
 * http://lab.hakim.se/reveal-js
 * MIT licensed
 *
 * Copyright (C) 2016 Hakim El Hattab, http://hakim.se
 */
(function( root, factory ) {
	if( typeof define === 'function' && define.amd ) {
		// AMD. Register as an anonymous module.
		define( function() {
			root.Reveal = factory();
			return root.Reveal;
		} );
	} else if( typeof exports === 'object' ) {
		// Node. Does not work with strict CommonJS.
		module.exports = factory();
	} else {
		// Browser globals.
		root.Reveal = factory();
	}
}( this, function() {

	'use strict';

	var Reveal;

	// The reveal.js version
	var VERSION = '3.4.1';

	var SLIDES_SELECTOR = '.slides section',
		HORIZONTAL_SLIDES_SELECTOR = '.slides>section',
		VERTICAL_SLIDES_SELECTOR = '.slides>section.present>section',
		HOME_SLIDE_SELECTOR = '.slides>section:first-of-type',
		UA = navigator.userAgent,

		// Configuration defaults, can be overridden at initialization time
		config = {

			// The "normal" size of the presentation, aspect ratio will be preserved
			// when the presentation is scaled to fit different resolutions
			width: 960,
			height: 700,

			// Factor of the display size that should remain empty around the content
			margin: 0.04,

			// Bounds for smallest/largest possible scale to apply to content
			minScale: 0.2,
			maxScale: 2.0,

			// Display controls in the bottom right corner
			controls: true,

			// Display a presentation progress bar
			progress: true,

			// Display the page number of the current slide
			slideNumber: false,

			// Push each slide change to the browser history
			history: false,

			// Enable keyboard shortcuts for navigation
			keyboard: true,

			// Optional function that blocks keyboard events when retuning false
			keyboardCondition: null,

			// Enable the slide overview mode
			overview: true,

			// Vertical centering of slides
			center: true,

			// Enables touch navigation on devices with touch input
			touch: true,

			// Loop the presentation
			loop: false,

			// Change the presentation direction to be RTL
			rtl: false,

			// Randomizes the order of slides each time the presentation loads
			shuffle: false,

			// Turns fragments on and off globally
			fragments: true,

			// Flags if the presentation is running in an embedded mode,
			// i.e. contained within a limited portion of the screen
			embedded: false,

			// Flags if we should show a help overlay when the question-mark
			// key is pressed
			help: true,

			// Flags if it should be possible to pause the presentation (blackout)
			pause: true,

			// Flags if speaker notes should be visible to all viewers
			showNotes: false,

			// Number of milliseconds between automatically proceeding to the
			// next slide, disabled when set to 0, this value can be overwritten
			// by using a data-autoslide attribute on your slides
			autoSlide: 0,

			// Stop auto-sliding after user input
			autoSlideStoppable: true,

			// Use this method for navigation when auto-sliding (defaults to navigateNext)
			autoSlideMethod: null,

			// Enable slide navigation via mouse wheel
			mouseWheel: false,

			// Apply a 3D roll to links on hover
			rollingLinks: false,

			// Hides the address bar on mobile devices
			hideAddressBar: true,

			// Opens links in an iframe preview overlay
			previewLinks: false,

			// Exposes the reveal.js API through window.postMessage
			postMessage: true,

			// Dispatches all reveal.js events to the parent window through postMessage
			postMessageEvents: false,

			// Focuses body when page changes visibility to ensure keyboard shortcuts work
			focusBodyOnPageVisibilityChange: true,

			// Transition style
			transition: 'slide', // none/fade/slide/convex/concave/zoom

			// Transition speed
			transitionSpeed: 'default', // default/fast/slow

			// Transition style for full page slide backgrounds
			backgroundTransition: 'fade', // none/fade/slide/convex/concave/zoom

			// Parallax background image
			parallaxBackgroundImage: '', // CSS syntax, e.g. "a.jpg"

			// Parallax background size
			parallaxBackgroundSize: '', // CSS syntax, e.g. "3000px 2000px"

			// Amount of pixels to move the parallax background per slide step
			parallaxBackgroundHorizontal: null,
			parallaxBackgroundVertical: null,

			// The maximum number of pages a single slide can expand onto when printing
			// to PDF, unlimited by default
			pdfMaxPagesPerSlide: Number.POSITIVE_INFINITY,

			// Number of slides away from the current that are visible
			viewDistance: 3,

			// Script dependencies to load
			dependencies: []

		},

		// Flags if Reveal.initialize() has been called
		initialized = false,

		// Flags if reveal.js is loaded (has dispatched the 'ready' event)
		loaded = false,

		// Flags if the overview mode is currently active
		overview = false,

		// Holds the dimensions of our overview slides, including margins
		overviewSlideWidth = null,
		overviewSlideHeight = null,

		// The horizontal and vertical index of the currently active slide
		indexh,
		indexv,

		// The previous and current slide HTML elements
		previousSlide,
		currentSlide,

		previousBackground,

		// Slides may hold a data-state attribute which we pick up and apply
		// as a class to the body. This list contains the combined state of
		// all current slides.
		state = [],

		// The current scale of the presentation (see width/height config)
		scale = 1,

		// CSS transform that is currently applied to the slides container,
		// split into two groups
		slidesTransform = { layout: '', overview: '' },

		// Cached references to DOM elements
		dom = {},

		// Features supported by the browser, see #checkCapabilities()
		features = {},

		// Client is a mobile device, see #checkCapabilities()
		isMobileDevice,

		// Client is a desktop Chrome, see #checkCapabilities()
		isChrome,

		// Throttles mouse wheel navigation
		lastMouseWheelStep = 0,

		// Delays updates to the URL due to a Chrome thumbnailer bug
		writeURLTimeout = 0,

		// Flags if the interaction event listeners are bound
		eventsAreBound = false,

		// The current auto-slide duration
		autoSlide = 0,

		// Auto slide properties
		autoSlidePlayer,
		autoSlideTimeout = 0,
		autoSlideStartTime = -1,
		autoSlidePaused = false,

		// Holds information about the currently ongoing touch input
		touch = {
			startX: 0,
			startY: 0,
			startSpan: 0,
			startCount: 0,
			captured: false,
			threshold: 40
		},

		// Holds information about the keyboard shortcuts
		keyboardShortcuts = {
			'N  ,  SPACE':			'Next slide',
			'P':					'Previous slide',
			'&#8592;  ,  H':		'Navigate left',
			'&#8594;  ,  L':		'Navigate right',
			'&#8593;  ,  K':		'Navigate up',
			'&#8595;  ,  J':		'Navigate down',
			'Home':					'First slide',
			'End':					'Last slide',
			'B  ,  .':				'Pause',
			'F':					'Fullscreen',
			'ESC, O':				'Slide overview'
		};

	/**
	 * Starts up the presentation if the client is capable.
	 */
	function initialize( options ) {

		// Make sure we only initialize once
		if( initialized === true ) return;

		initialized = true;

		checkCapabilities();

		if( !features.transforms2d && !features.transforms3d ) {
			document.body.setAttribute( 'class', 'no-transforms' );

			// Since JS won't be running any further, we load all lazy
			// loading elements upfront
			var images = toArray( document.getElementsByTagName( 'img' ) ),
				iframes = toArray( document.getElementsByTagName( 'iframe' ) );

			var lazyLoadable = images.concat( iframes );

			for( var i = 0, len = lazyLoadable.length; i < len; i++ ) {
				var element = lazyLoadable[i];
				if( element.getAttribute( 'data-src' ) ) {
					element.setAttribute( 'src', element.getAttribute( 'data-src' ) );
					element.removeAttribute( 'data-src' );
				}
			}

			// If the browser doesn't support core features we won't be
			// using JavaScript to control the presentation
			return;
		}

		// Cache references to key DOM elements
		dom.wrapper = document.querySelector( '.reveal' );
		dom.slides = document.querySelector( '.reveal .slides' );

		// Force a layout when the whole page, incl fonts, has loaded
		window.addEventListener( 'load', layout, false );

		var query = Reveal.getQueryHash();

		// Do not accept new dependencies via query config to avoid
		// the potential of malicious script injection
		if( typeof query['dependencies'] !== 'undefined' ) delete query['dependencies'];

		// Copy options over to our config object
		extend( config, options );
		extend( config, query );

		// Hide the address bar in mobile browsers
		hideAddressBar();

		// Loads the dependencies and continues to #start() once done
		load();

	}

	/**
	 * Inspect the client to see what it's capable of, this
	 * should only happens once per runtime.
	 */
	function checkCapabilities() {

		isMobileDevice = /(iphone|ipod|ipad|android)/gi.test( UA );
		isChrome = /chrome/i.test( UA ) && !/edge/i.test( UA );

		var testElement = document.createElement( 'div' );

		features.transforms3d = 'WebkitPerspective' in testElement.style ||
								'MozPerspective' in testElement.style ||
								'msPerspective' in testElement.style ||
								'OPerspective' in testElement.style ||
								'perspective' in testElement.style;

		features.transforms2d = 'WebkitTransform' in testElement.style ||
								'MozTransform' in testElement.style ||
								'msTransform' in testElement.style ||
								'OTransform' in testElement.style ||
								'transform' in testElement.style;

		features.requestAnimationFrameMethod = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
		features.requestAnimationFrame = typeof features.requestAnimationFrameMethod === 'function';

		features.canvas = !!document.createElement( 'canvas' ).getContext;

		// Transitions in the overview are disabled in desktop and
		// Safari due to lag
		features.overviewTransitions = !/Version\/[\d\.]+.*Safari/.test( UA );

		// Flags if we should use zoom instead of transform to scale
		// up slides. Zoom produces crisper results but has a lot of
		// xbrowser quirks so we only use it in whitelsited browsers.
		features.zoom = 'zoom' in testElement.style && !isMobileDevice &&
						( isChrome || /Version\/[\d\.]+.*Safari/.test( UA ) );

	}

    /**
     * Loads the dependencies of reveal.js. Dependencies are
     * defined via the configuration option 'dependencies'
     * and will be loaded prior to starting/binding reveal.js.
     * Some dependencies may have an 'async' flag, if so they
     * will load after reveal.js has been started up.
     */
	function load() {

		var scripts = [],
			scriptsAsync = [],
			scriptsToPreload = 0;

		// Called once synchronous scripts finish loading
		function proceed() {
			if( scriptsAsync.length ) {
				// Load asynchronous scripts
				head.js.apply( null, scriptsAsync );
			}

			start();
		}

		function loadScript( s ) {
			head.ready( s.src.match( /([\w\d_\-]*)\.?js$|[^\\\/]*$/i )[0], function() {
				// Extension may contain callback functions
				if( typeof s.callback === 'function' ) {
					s.callback.apply( this );
				}

				if( --scriptsToPreload === 0 ) {
					proceed();
				}
			});
		}

		for( var i = 0, len = config.dependencies.length; i < len; i++ ) {
			var s = config.dependencies[i];

			// Load if there's no condition or the condition is truthy
			if( !s.condition || s.condition() ) {
				if( s.async ) {
					scriptsAsync.push( s.src );
				}
				else {
					scripts.push( s.src );
				}

				loadScript( s );
			}
		}

		if( scripts.length ) {
			scriptsToPreload = scripts.length;

			// Load synchronous scripts
			head.js.apply( null, scripts );
		}
		else {
			proceed();
		}

	}

	/**
	 * Starts up reveal.js by binding input events and navigating
	 * to the current URL deeplink if there is one.
	 */
	function start() {

		// Make sure we've got all the DOM elements we need
		setupDOM();

		// Listen to messages posted to this window
		setupPostMessage();

		// Prevent the slides from being scrolled out of view
		setupScrollPrevention();

		// Resets all vertical slides so that only the first is visible
		resetVerticalSlides();

		// Updates the presentation to match the current configuration values
		configure();

		// Read the initial hash
		readURL();

		// Update all backgrounds
		updateBackground( true );

		// Notify listeners that the presentation is ready but use a 1ms
		// timeout to ensure it's not fired synchronously after #initialize()
		setTimeout( function() {
			// Enable transitions now that we're loaded
			dom.slides.classList.remove( 'no-transition' );

			loaded = true;

			dom.wrapper.classList.add( 'ready' );

			dispatchEvent( 'ready', {
				'indexh': indexh,
				'indexv': indexv,
				'currentSlide': currentSlide
			} );
		}, 1 );

		// Special setup and config is required when printing to PDF
		if( isPrintingPDF() ) {
			removeEventListeners();

			// The document needs to have loaded for the PDF layout
			// measurements to be accurate
			if( document.readyState === 'complete' ) {
				setupPDF();
			}
			else {
				window.addEventListener( 'load', setupPDF );
			}
		}

	}

	/**
	 * Finds and stores references to DOM elements which are
	 * required by the presentation. If a required element is
	 * not found, it is created.
	 */
	function setupDOM() {

		// Prevent transitions while we're loading
		dom.slides.classList.add( 'no-transition' );

		// Background element
		dom.background = createSingletonNode( dom.wrapper, 'div', 'backgrounds', null );

		// Progress bar
		dom.progress = createSingletonNode( dom.wrapper, 'div', 'progress', '<span></span>' );
		dom.progressbar = dom.progress.querySelector( 'span' );

		// Arrow controls
		createSingletonNode( dom.wrapper, 'aside', 'controls',
			'<button class="navigate-left" aria-label="previous slide"></button>' +
			'<button class="navigate-right" aria-label="next slide"></button>' +
			'<button class="navigate-up" aria-label="above slide"></button>' +
			'<button class="navigate-down" aria-label="below slide"></button>' );

		// Slide number
		dom.slideNumber = createSingletonNode( dom.wrapper, 'div', 'slide-number', '' );

		// Element containing notes that are visible to the audience
		dom.speakerNotes = createSingletonNode( dom.wrapper, 'div', 'speaker-notes', null );
		dom.speakerNotes.setAttribute( 'data-prevent-swipe', '' );
		dom.speakerNotes.setAttribute( 'tabindex', '0' );

		// Overlay graphic which is displayed during the paused mode
		createSingletonNode( dom.wrapper, 'div', 'pause-overlay', null );

		// Cache references to elements
		dom.controls = document.querySelector( '.reveal .controls' );

		dom.wrapper.setAttribute( 'role', 'application' );

		// There can be multiple instances of controls throughout the page
		dom.controlsLeft = toArray( document.querySelectorAll( '.navigate-left' ) );
		dom.controlsRight = toArray( document.querySelectorAll( '.navigate-right' ) );
		dom.controlsUp = toArray( document.querySelectorAll( '.navigate-up' ) );
		dom.controlsDown = toArray( document.querySelectorAll( '.navigate-down' ) );
		dom.controlsPrev = toArray( document.querySelectorAll( '.navigate-prev' ) );
		dom.controlsNext = toArray( document.querySelectorAll( '.navigate-next' ) );

		dom.statusDiv = createStatusDiv();
	}

	/**
	 * Creates a hidden div with role aria-live to announce the
	 * current slide content. Hide the div off-screen to make it
	 * available only to Assistive Technologies.
	 *
	 * @return {HTMLElement}
	 */
	function createStatusDiv() {

		var statusDiv = document.getElementById( 'aria-status-div' );
		if( !statusDiv ) {
			statusDiv = document.createElement( 'div' );
			statusDiv.style.position = 'absolute';
			statusDiv.style.height = '1px';
			statusDiv.style.width = '1px';
			statusDiv.style.overflow = 'hidden';
			statusDiv.style.clip = 'rect( 1px, 1px, 1px, 1px )';
			statusDiv.setAttribute( 'id', 'aria-status-div' );
			statusDiv.setAttribute( 'aria-live', 'polite' );
			statusDiv.setAttribute( 'aria-atomic','true' );
			dom.wrapper.appendChild( statusDiv );
		}
		return statusDiv;

	}

	/**
	 * Converts the given HTML element into a string of text
	 * that can be announced to a screen reader. Hidden
	 * elements are excluded.
	 */
	function getStatusText( node ) {

		var text = '';

		// Text node
		if( node.nodeType === 3 ) {
			text += node.textContent;
		}
		// Element node
		else if( node.nodeType === 1 ) {

			var isAriaHidden = node.getAttribute( 'aria-hidden' );
			var isDisplayHidden = window.getComputedStyle( node )['display'] === 'none';
			if( isAriaHidden !== 'true' && !isDisplayHidden ) {

				toArray( node.childNodes ).forEach( function( child ) {
					text += getStatusText( child );
				} );

			}

		}

		return text;

	}

	/**
	 * Configures the presentation for printing to a static
	 * PDF.
	 */
	function setupPDF() {

		var slideSize = getComputedSlideSize( window.innerWidth, window.innerHeight );

		// Dimensions of the PDF pages
		var pageWidth = Math.floor( slideSize.width * ( 1 + config.margin ) ),
			pageHeight = Math.floor( slideSize.height * ( 1 + config.margin ) );

		// Dimensions of slides within the pages
		var slideWidth = slideSize.width,
			slideHeight = slideSize.height;

		// Let the browser know what page size we want to print
		injectStyleSheet( '@page{size:'+ pageWidth +'px '+ pageHeight +'px; margin: 0 0 -1px 0;}' );

		// Limit the size of certain elements to the dimensions of the slide
		injectStyleSheet( '.reveal section>img, .reveal section>video, .reveal section>iframe{max-width: '+ slideWidth +'px; max-height:'+ slideHeight +'px}' );

		document.body.classList.add( 'print-pdf' );
		document.body.style.width = pageWidth + 'px';
		document.body.style.height = pageHeight + 'px';

		// Add each slide's index as attributes on itself, we need these
		// indices to generate slide numbers below
		toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) ).forEach( function( hslide, h ) {
			hslide.setAttribute( 'data-index-h', h );

			if( hslide.classList.contains( 'stack' ) ) {
				toArray( hslide.querySelectorAll( 'section' ) ).forEach( function( vslide, v ) {
					vslide.setAttribute( 'data-index-h', h );
					vslide.setAttribute( 'data-index-v', v );
				} );
			}
		} );

		// Slide and slide background layout
		toArray( dom.wrapper.querySelectorAll( SLIDES_SELECTOR ) ).forEach( function( slide ) {

			// Vertical stacks are not centred since their section
			// children will be
			if( slide.classList.contains( 'stack' ) === false ) {
				// Center the slide inside of the page, giving the slide some margin
				var left = ( pageWidth - slideWidth ) / 2,
					top = ( pageHeight - slideHeight ) / 2;

				var contentHeight = slide.scrollHeight;
				var numberOfPages = Math.max( Math.ceil( contentHeight / pageHeight ), 1 );

				// Adhere to configured pages per slide limit
				numberOfPages = Math.min( numberOfPages, config.pdfMaxPagesPerSlide );

				// Center slides vertically
				if( numberOfPages === 1 && config.center || slide.classList.contains( 'center' ) ) {
					top = Math.max( ( pageHeight - contentHeight ) / 2, 0 );
				}

				// Wrap the slide in a page element and hide its overflow
				// so that no page ever flows onto another
				var page = document.createElement( 'div' );
				page.className = 'pdf-page';
				page.style.height = ( pageHeight * numberOfPages ) + 'px';
				slide.parentNode.insertBefore( page, slide );
				page.appendChild( slide );

				// Position the slide inside of the page
				slide.style.left = left + 'px';
				slide.style.top = top + 'px';
				slide.style.width = slideWidth + 'px';

				if( slide.slideBackgroundElement ) {
					page.insertBefore( slide.slideBackgroundElement, slide );
				}

				// Inject notes if `showNotes` is enabled
				if( config.showNotes ) {

					// Are there notes for this slide?
					var notes = getSlideNotes( slide );
					if( notes ) {

						var notesSpacing = 8;
						var notesLayout = typeof config.showNotes === 'string' ? config.showNotes : 'inline';
						var notesElement = document.createElement( 'div' );
						notesElement.classList.add( 'speaker-notes' );
						notesElement.classList.add( 'speaker-notes-pdf' );
						notesElement.setAttribute( 'data-layout', notesLayout );
						notesElement.innerHTML = notes;

						if( notesLayout === 'separate-page' ) {
							page.parentNode.insertBefore( notesElement, page.nextSibling );
						}
						else {
							notesElement.style.left = notesSpacing + 'px';
							notesElement.style.bottom = notesSpacing + 'px';
							notesElement.style.width = ( pageWidth - notesSpacing*2 ) + 'px';
							page.appendChild( notesElement );
						}

					}

				}

				// Inject slide numbers if `slideNumbers` are enabled
				if( config.slideNumber ) {
					var slideNumberH = parseInt( slide.getAttribute( 'data-index-h' ), 10 ) + 1,
						slideNumberV = parseInt( slide.getAttribute( 'data-index-v' ), 10 ) + 1;

					var numberElement = document.createElement( 'div' );
					numberElement.classList.add( 'slide-number' );
					numberElement.classList.add( 'slide-number-pdf' );
					numberElement.innerHTML = formatSlideNumber( slideNumberH, '.', slideNumberV );
					page.appendChild( numberElement );
				}
			}

		} );

		// Show all fragments
		toArray( dom.wrapper.querySelectorAll( SLIDES_SELECTOR + ' .fragment' ) ).forEach( function( fragment ) {
			fragment.classList.add( 'visible' );
		} );

		// Notify subscribers that the PDF layout is good to go
		dispatchEvent( 'pdf-ready' );

	}

	/**
	 * This is an unfortunate necessity. Some actions – such as
	 * an input field being focused in an iframe or using the
	 * keyboard to expand text selection beyond the bounds of
	 * a slide – can trigger our content to be pushed out of view.
	 * This scrolling can not be prevented by hiding overflow in
	 * CSS (we already do) so we have to resort to repeatedly
	 * checking if the slides have been offset :(
	 */
	function setupScrollPrevention() {

		setInterval( function() {
			if( dom.wrapper.scrollTop !== 0 || dom.wrapper.scrollLeft !== 0 ) {
				dom.wrapper.scrollTop = 0;
				dom.wrapper.scrollLeft = 0;
			}
		}, 1000 );

	}

	/**
	 * Creates an HTML element and returns a reference to it.
	 * If the element already exists the existing instance will
	 * be returned.
	 *
	 * @param {HTMLElement} container
	 * @param {string} tagname
	 * @param {string} classname
	 * @param {string} innerHTML
	 *
	 * @return {HTMLElement}
	 */
	function createSingletonNode( container, tagname, classname, innerHTML ) {

		// Find all nodes matching the description
		var nodes = container.querySelectorAll( '.' + classname );

		// Check all matches to find one which is a direct child of
		// the specified container
		for( var i = 0; i < nodes.length; i++ ) {
			var testNode = nodes[i];
			if( testNode.parentNode === container ) {
				return testNode;
			}
		}

		// If no node was found, create it now
		var node = document.createElement( tagname );
		node.classList.add( classname );
		if( typeof innerHTML === 'string' ) {
			node.innerHTML = innerHTML;
		}
		container.appendChild( node );

		return node;

	}

	/**
	 * Creates the slide background elements and appends them
	 * to the background container. One element is created per
	 * slide no matter if the given slide has visible background.
	 */
	function createBackgrounds() {

		var printMode = isPrintingPDF();

		// Clear prior backgrounds
		dom.background.innerHTML = '';
		dom.background.classList.add( 'no-transition' );

		// Iterate over all horizontal slides
		toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) ).forEach( function( slideh ) {

			var backgroundStack = createBackground( slideh, dom.background );

			// Iterate over all vertical slides
			toArray( slideh.querySelectorAll( 'section' ) ).forEach( function( slidev ) {

				createBackground( slidev, backgroundStack );

				backgroundStack.classList.add( 'stack' );

			} );

		} );

		// Add parallax background if specified
		if( config.parallaxBackgroundImage ) {

			dom.background.style.backgroundImage = 'url("' + config.parallaxBackgroundImage + '")';
			dom.background.style.backgroundSize = config.parallaxBackgroundSize;

			// Make sure the below properties are set on the element - these properties are
			// needed for proper transitions to be set on the element via CSS. To remove
			// annoying background slide-in effect when the presentation starts, apply
			// these properties after short time delay
			setTimeout( function() {
				dom.wrapper.classList.add( 'has-parallax-background' );
			}, 1 );

		}
		else {

			dom.background.style.backgroundImage = '';
			dom.wrapper.classList.remove( 'has-parallax-background' );

		}

	}

	/**
	 * Creates a background for the given slide.
	 *
	 * @param {HTMLElement} slide
	 * @param {HTMLElement} container The element that the background
	 * should be appended to
	 * @return {HTMLElement} New background div
	 */
	function createBackground( slide, container ) {

		var data = {
			background: slide.getAttribute( 'data-background' ),
			backgroundSize: slide.getAttribute( 'data-background-size' ),
			backgroundImage: slide.getAttribute( 'data-background-image' ),
			backgroundVideo: slide.getAttribute( 'data-background-video' ),
			backgroundIframe: slide.getAttribute( 'data-background-iframe' ),
			backgroundColor: slide.getAttribute( 'data-background-color' ),
			backgroundRepeat: slide.getAttribute( 'data-background-repeat' ),
			backgroundPosition: slide.getAttribute( 'data-background-position' ),
			backgroundTransition: slide.getAttribute( 'data-background-transition' )
		};

		var element = document.createElement( 'div' );

		// Carry over custom classes from the slide to the background
		element.className = 'slide-background ' + slide.className.replace( /present|past|future/, '' );

		if( data.background ) {
			// Auto-wrap image urls in url(...)
			if( /^(http|file|\/\/)/gi.test( data.background ) || /\.(svg|png|jpg|jpeg|gif|bmp)$/gi.test( data.background ) ) {
				slide.setAttribute( 'data-background-image', data.background );
			}
			else {
				element.style.background = data.background;
			}
		}

		// Create a hash for this combination of background settings.
		// This is used to determine when two slide backgrounds are
		// the same.
		if( data.background || data.backgroundColor || data.backgroundImage || data.backgroundVideo || data.backgroundIframe ) {
			element.setAttribute( 'data-background-hash', data.background +
															data.backgroundSize +
															data.backgroundImage +
															data.backgroundVideo +
															data.backgroundIframe +
															data.backgroundColor +
															data.backgroundRepeat +
															data.backgroundPosition +
															data.backgroundTransition );
		}

		// Additional and optional background properties
		if( data.backgroundSize ) element.style.backgroundSize = data.backgroundSize;
		if( data.backgroundColor ) element.style.backgroundColor = data.backgroundColor;
		if( data.backgroundRepeat ) element.style.backgroundRepeat = data.backgroundRepeat;
		if( data.backgroundPosition ) element.style.backgroundPosition = data.backgroundPosition;
		if( data.backgroundTransition ) element.setAttribute( 'data-background-transition', data.backgroundTransition );

		container.appendChild( element );

		// If backgrounds are being recreated, clear old classes
		slide.classList.remove( 'has-dark-background' );
		slide.classList.remove( 'has-light-background' );

		slide.slideBackgroundElement = element;

		// If this slide has a background color, add a class that
		// signals if it is light or dark. If the slide has no background
		// color, no class will be set
		var computedBackgroundStyle = window.getComputedStyle( element );
		if( computedBackgroundStyle && computedBackgroundStyle.backgroundColor ) {
			var rgb = colorToRgb( computedBackgroundStyle.backgroundColor );

			// Ignore fully transparent backgrounds. Some browsers return
			// rgba(0,0,0,0) when reading the computed background color of
			// an element with no background
			if( rgb && rgb.a !== 0 ) {
				if( colorBrightness( computedBackgroundStyle.backgroundColor ) < 128 ) {
					slide.classList.add( 'has-dark-background' );
				}
				else {
					slide.classList.add( 'has-light-background' );
				}
			}
		}

		return element;

	}

	/**
	 * Registers a listener to postMessage events, this makes it
	 * possible to call all reveal.js API methods from another
	 * window. For example:
	 *
	 * revealWindow.postMessage( JSON.stringify({
	 *   method: 'slide',
	 *   args: [ 2 ]
	 * }), '*' );
	 */
	function setupPostMessage() {

		if( config.postMessage ) {
			window.addEventListener( 'message', function ( event ) {
				var data = event.data;

				// Make sure we're dealing with JSON
				if( typeof data === 'string' && data.charAt( 0 ) === '{' && data.charAt( data.length - 1 ) === '}' ) {
					data = JSON.parse( data );

					// Check if the requested method can be found
					if( data.method && typeof Reveal[data.method] === 'function' ) {
						Reveal[data.method].apply( Reveal, data.args );
					}
				}
			}, false );
		}

	}

	/**
	 * Applies the configuration settings from the config
	 * object. May be called multiple times.
	 *
	 * @param {object} options
	 */
	function configure( options ) {

		var numberOfSlides = dom.wrapper.querySelectorAll( SLIDES_SELECTOR ).length;

		dom.wrapper.classList.remove( config.transition );

		// New config options may be passed when this method
		// is invoked through the API after initialization
		if( typeof options === 'object' ) extend( config, options );

		// Force linear transition based on browser capabilities
		if( features.transforms3d === false ) config.transition = 'linear';

		dom.wrapper.classList.add( config.transition );

		dom.wrapper.setAttribute( 'data-transition-speed', config.transitionSpeed );
		dom.wrapper.setAttribute( 'data-background-transition', config.backgroundTransition );

		dom.controls.style.display = config.controls ? 'block' : 'none';
		dom.progress.style.display = config.progress ? 'block' : 'none';
		dom.slideNumber.style.display = config.slideNumber && !isPrintingPDF() ? 'block' : 'none';

		if( config.shuffle ) {
			shuffle();
		}

		if( config.rtl ) {
			dom.wrapper.classList.add( 'rtl' );
		}
		else {
			dom.wrapper.classList.remove( 'rtl' );
		}

		if( config.center ) {
			dom.wrapper.classList.add( 'center' );
		}
		else {
			dom.wrapper.classList.remove( 'center' );
		}

		// Exit the paused mode if it was configured off
		if( config.pause === false ) {
			resume();
		}

		if( config.showNotes ) {
			dom.speakerNotes.classList.add( 'visible' );
			dom.speakerNotes.setAttribute( 'data-layout', typeof config.showNotes === 'string' ? config.showNotes : 'inline' );
		}
		else {
			dom.speakerNotes.classList.remove( 'visible' );
		}

		if( config.mouseWheel ) {
			document.addEventListener( 'DOMMouseScroll', onDocumentMouseScroll, false ); // FF
			document.addEventListener( 'mousewheel', onDocumentMouseScroll, false );
		}
		else {
			document.removeEventListener( 'DOMMouseScroll', onDocumentMouseScroll, false ); // FF
			document.removeEventListener( 'mousewheel', onDocumentMouseScroll, false );
		}

		// Rolling 3D links
		if( config.rollingLinks ) {
			enableRollingLinks();
		}
		else {
			disableRollingLinks();
		}

		// Iframe link previews
		if( config.previewLinks ) {
			enablePreviewLinks();
		}
		else {
			disablePreviewLinks();
			enablePreviewLinks( '[data-preview-link]' );
		}

		// Remove existing auto-slide controls
		if( autoSlidePlayer ) {
			autoSlidePlayer.destroy();
			autoSlidePlayer = null;
		}

		// Generate auto-slide controls if needed
		if( numberOfSlides > 1 && config.autoSlide && config.autoSlideStoppable && features.canvas && features.requestAnimationFrame ) {
			autoSlidePlayer = new Playback( dom.wrapper, function() {
				return Math.min( Math.max( ( Date.now() - autoSlideStartTime ) / autoSlide, 0 ), 1 );
			} );

			autoSlidePlayer.on( 'click', onAutoSlidePlayerClick );
			autoSlidePaused = false;
		}

		// When fragments are turned off they should be visible
		if( config.fragments === false ) {
			toArray( dom.slides.querySelectorAll( '.fragment' ) ).forEach( function( element ) {
				element.classList.add( 'visible' );
				element.classList.remove( 'current-fragment' );
			} );
		}

		sync();

	}

	/**
	 * Binds all event listeners.
	 */
	function addEventListeners() {

		eventsAreBound = true;

		window.addEventListener( 'hashchange', onWindowHashChange, false );
		window.addEventListener( 'resize', onWindowResize, false );

		if( config.touch ) {
			dom.wrapper.addEventListener( 'touchstart', onTouchStart, false );
			dom.wrapper.addEventListener( 'touchmove', onTouchMove, false );
			dom.wrapper.addEventListener( 'touchend', onTouchEnd, false );

			// Support pointer-style touch interaction as well
			if( window.navigator.pointerEnabled ) {
				// IE 11 uses un-prefixed version of pointer events
				dom.wrapper.addEventListener( 'pointerdown', onPointerDown, false );
				dom.wrapper.addEventListener( 'pointermove', onPointerMove, false );
				dom.wrapper.addEventListener( 'pointerup', onPointerUp, false );
			}
			else if( window.navigator.msPointerEnabled ) {
				// IE 10 uses prefixed version of pointer events
				dom.wrapper.addEventListener( 'MSPointerDown', onPointerDown, false );
				dom.wrapper.addEventListener( 'MSPointerMove', onPointerMove, false );
				dom.wrapper.addEventListener( 'MSPointerUp', onPointerUp, false );
			}
		}

		if( config.keyboard ) {
			document.addEventListener( 'keydown', onDocumentKeyDown, false );
			document.addEventListener( 'keypress', onDocumentKeyPress, false );
		}

		if( config.progress && dom.progress ) {
			dom.progress.addEventListener( 'click', onProgressClicked, false );
		}

		if( config.focusBodyOnPageVisibilityChange ) {
			var visibilityChange;

			if( 'hidden' in document ) {
				visibilityChange = 'visibilitychange';
			}
			else if( 'msHidden' in document ) {
				visibilityChange = 'msvisibilitychange';
			}
			else if( 'webkitHidden' in document ) {
				visibilityChange = 'webkitvisibilitychange';
			}

			if( visibilityChange ) {
				document.addEventListener( visibilityChange, onPageVisibilityChange, false );
			}
		}

		// Listen to both touch and click events, in case the device
		// supports both
		var pointerEvents = [ 'touchstart', 'click' ];

		// Only support touch for Android, fixes double navigations in
		// stock browser
		if( UA.match( /android/gi ) ) {
			pointerEvents = [ 'touchstart' ];
		}

		pointerEvents.forEach( function( eventName ) {
			dom.controlsLeft.forEach( function( el ) { el.addEventListener( eventName, onNavigateLeftClicked, false ); } );
			dom.controlsRight.forEach( function( el ) { el.addEventListener( eventName, onNavigateRightClicked, false ); } );
			dom.controlsUp.forEach( function( el ) { el.addEventListener( eventName, onNavigateUpClicked, false ); } );
			dom.controlsDown.forEach( function( el ) { el.addEventListener( eventName, onNavigateDownClicked, false ); } );
			dom.controlsPrev.forEach( function( el ) { el.addEventListener( eventName, onNavigatePrevClicked, false ); } );
			dom.controlsNext.forEach( function( el ) { el.addEventListener( eventName, onNavigateNextClicked, false ); } );
		} );

	}

	/**
	 * Unbinds all event listeners.
	 */
	function removeEventListeners() {

		eventsAreBound = false;

		document.removeEventListener( 'keydown', onDocumentKeyDown, false );
		document.removeEventListener( 'keypress', onDocumentKeyPress, false );
		window.removeEventListener( 'hashchange', onWindowHashChange, false );
		window.removeEventListener( 'resize', onWindowResize, false );

		dom.wrapper.removeEventListener( 'touchstart', onTouchStart, false );
		dom.wrapper.removeEventListener( 'touchmove', onTouchMove, false );
		dom.wrapper.removeEventListener( 'touchend', onTouchEnd, false );

		// IE11
		if( window.navigator.pointerEnabled ) {
			dom.wrapper.removeEventListener( 'pointerdown', onPointerDown, false );
			dom.wrapper.removeEventListener( 'pointermove', onPointerMove, false );
			dom.wrapper.removeEventListener( 'pointerup', onPointerUp, false );
		}
		// IE10
		else if( window.navigator.msPointerEnabled ) {
			dom.wrapper.removeEventListener( 'MSPointerDown', onPointerDown, false );
			dom.wrapper.removeEventListener( 'MSPointerMove', onPointerMove, false );
			dom.wrapper.removeEventListener( 'MSPointerUp', onPointerUp, false );
		}

		if ( config.progress && dom.progress ) {
			dom.progress.removeEventListener( 'click', onProgressClicked, false );
		}

		[ 'touchstart', 'click' ].forEach( function( eventName ) {
			dom.controlsLeft.forEach( function( el ) { el.removeEventListener( eventName, onNavigateLeftClicked, false ); } );
			dom.controlsRight.forEach( function( el ) { el.removeEventListener( eventName, onNavigateRightClicked, false ); } );
			dom.controlsUp.forEach( function( el ) { el.removeEventListener( eventName, onNavigateUpClicked, false ); } );
			dom.controlsDown.forEach( function( el ) { el.removeEventListener( eventName, onNavigateDownClicked, false ); } );
			dom.controlsPrev.forEach( function( el ) { el.removeEventListener( eventName, onNavigatePrevClicked, false ); } );
			dom.controlsNext.forEach( function( el ) { el.removeEventListener( eventName, onNavigateNextClicked, false ); } );
		} );

	}

	/**
	 * Extend object a with the properties of object b.
	 * If there's a conflict, object b takes precedence.
	 *
	 * @param {object} a
	 * @param {object} b
	 */
	function extend( a, b ) {

		for( var i in b ) {
			a[ i ] = b[ i ];
		}

	}

	/**
	 * Converts the target object to an array.
	 *
	 * @param {object} o
	 * @return {object[]}
	 */
	function toArray( o ) {

		return Array.prototype.slice.call( o );

	}

	/**
	 * Utility for deserializing a value.
	 *
	 * @param {*} value
	 * @return {*}
	 */
	function deserialize( value ) {

		if( typeof value === 'string' ) {
			if( value === 'null' ) return null;
			else if( value === 'true' ) return true;
			else if( value === 'false' ) return false;
			else if( value.match( /^\d+$/ ) ) return parseFloat( value );
		}

		return value;

	}

	/**
	 * Measures the distance in pixels between point a
	 * and point b.
	 *
	 * @param {object} a point with x/y properties
	 * @param {object} b point with x/y properties
	 *
	 * @return {number}
	 */
	function distanceBetween( a, b ) {

		var dx = a.x - b.x,
			dy = a.y - b.y;

		return Math.sqrt( dx*dx + dy*dy );

	}

	/**
	 * Applies a CSS transform to the target element.
	 *
	 * @param {HTMLElement} element
	 * @param {string} transform
	 */
	function transformElement( element, transform ) {

		element.style.WebkitTransform = transform;
		element.style.MozTransform = transform;
		element.style.msTransform = transform;
		element.style.transform = transform;

	}

	/**
	 * Applies CSS transforms to the slides container. The container
	 * is transformed from two separate sources: layout and the overview
	 * mode.
	 *
	 * @param {object} transforms
	 */
	function transformSlides( transforms ) {

		// Pick up new transforms from arguments
		if( typeof transforms.layout === 'string' ) slidesTransform.layout = transforms.layout;
		if( typeof transforms.overview === 'string' ) slidesTransform.overview = transforms.overview;

		// Apply the transforms to the slides container
		if( slidesTransform.layout ) {
			transformElement( dom.slides, slidesTransform.layout + ' ' + slidesTransform.overview );
		}
		else {
			transformElement( dom.slides, slidesTransform.overview );
		}

	}

	/**
	 * Injects the given CSS styles into the DOM.
	 *
	 * @param {string} value
	 */
	function injectStyleSheet( value ) {

		var tag = document.createElement( 'style' );
		tag.type = 'text/css';
		if( tag.styleSheet ) {
			tag.styleSheet.cssText = value;
		}
		else {
			tag.appendChild( document.createTextNode( value ) );
		}
		document.getElementsByTagName( 'head' )[0].appendChild( tag );

	}

	/**
	 * Find the closest parent that matches the given
	 * selector.
	 *
	 * @param {HTMLElement} target The child element
	 * @param {String} selector The CSS selector to match
	 * the parents against
	 *
	 * @return {HTMLElement} The matched parent or null
	 * if no matching parent was found
	 */
	function closestParent( target, selector ) {

		var parent = target.parentNode;

		while( parent ) {

			// There's some overhead doing this each time, we don't
			// want to rewrite the element prototype but should still
			// be enough to feature detect once at startup...
			var matchesMethod = parent.matches || parent.matchesSelector || parent.msMatchesSelector;

			// If we find a match, we're all set
			if( matchesMethod && matchesMethod.call( parent, selector ) ) {
				return parent;
			}

			// Keep searching
			parent = parent.parentNode;

		}

		return null;

	}

	/**
	 * Converts various color input formats to an {r:0,g:0,b:0} object.
	 *
	 * @param {string} color The string representation of a color
	 * @example
	 * colorToRgb('#000');
	 * @example
	 * colorToRgb('#000000');
	 * @example
	 * colorToRgb('rgb(0,0,0)');
	 * @example
	 * colorToRgb('rgba(0,0,0)');
	 *
	 * @return {{r: number, g: number, b: number, [a]: number}|null}
	 */
	function colorToRgb( color ) {

		var hex3 = color.match( /^#([0-9a-f]{3})$/i );
		if( hex3 && hex3[1] ) {
			hex3 = hex3[1];
			return {
				r: parseInt( hex3.charAt( 0 ), 16 ) * 0x11,
				g: parseInt( hex3.charAt( 1 ), 16 ) * 0x11,
				b: parseInt( hex3.charAt( 2 ), 16 ) * 0x11
			};
		}

		var hex6 = color.match( /^#([0-9a-f]{6})$/i );
		if( hex6 && hex6[1] ) {
			hex6 = hex6[1];
			return {
				r: parseInt( hex6.substr( 0, 2 ), 16 ),
				g: parseInt( hex6.substr( 2, 2 ), 16 ),
				b: parseInt( hex6.substr( 4, 2 ), 16 )
			};
		}

		var rgb = color.match( /^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i );
		if( rgb ) {
			return {
				r: parseInt( rgb[1], 10 ),
				g: parseInt( rgb[2], 10 ),
				b: parseInt( rgb[3], 10 )
			};
		}

		var rgba = color.match( /^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\,\s*([\d]+|[\d]*.[\d]+)\s*\)$/i );
		if( rgba ) {
			return {
				r: parseInt( rgba[1], 10 ),
				g: parseInt( rgba[2], 10 ),
				b: parseInt( rgba[3], 10 ),
				a: parseFloat( rgba[4] )
			};
		}

		return null;

	}

	/**
	 * Calculates brightness on a scale of 0-255.
	 *
	 * @param {string} color See colorToRgb for supported formats.
	 * @see {@link colorToRgb}
	 */
	function colorBrightness( color ) {

		if( typeof color === 'string' ) color = colorToRgb( color );

		if( color ) {
			return ( color.r * 299 + color.g * 587 + color.b * 114 ) / 1000;
		}

		return null;

	}

	/**
	 * Returns the remaining height within the parent of the
	 * target element.
	 *
	 * remaining height = [ configured parent height ] - [ current parent height ]
	 * 
	 * @param {HTMLElement} element
	 * @param {number} [height]
	 */
	function getRemainingHeight( element, height ) {

		height = height || 0;

		if( element ) {
			var newHeight, oldHeight = element.style.height;

			// Change the .stretch element height to 0 in order find the height of all
			// the other elements
			element.style.height = '0px';
			newHeight = height - element.parentNode.offsetHeight;

			// Restore the old height, just in case
			element.style.height = oldHeight + 'px';

			return newHeight;
		}

		return height;

	}

	/**
	 * Checks if this instance is being used to print a PDF.
	 */
	function isPrintingPDF() {

		return ( /print-pdf/gi ).test( window.location.search );

	}

	/**
	 * Hides the address bar if we're on a mobile device.
	 */
	function hideAddressBar() {

		if( config.hideAddressBar && isMobileDevice ) {
			// Events that should trigger the address bar to hide
			window.addEventListener( 'load', removeAddressBar, false );
			window.addEventListener( 'orientationchange', removeAddressBar, false );
		}

	}

	/**
	 * Causes the address bar to hide on mobile devices,
	 * more vertical space ftw.
	 */
	function removeAddressBar() {

		setTimeout( function() {
			window.scrollTo( 0, 1 );
		}, 10 );

	}

	/**
	 * Dispatches an event of the specified type from the
	 * reveal DOM element.
	 */
	function dispatchEvent( type, args ) {

		var event = document.createEvent( 'HTMLEvents', 1, 2 );
		event.initEvent( type, true, true );
		extend( event, args );
		dom.wrapper.dispatchEvent( event );

		// If we're in an iframe, post each reveal.js event to the
		// parent window. Used by the notes plugin
		if( config.postMessageEvents && window.parent !== window.self ) {
			window.parent.postMessage( JSON.stringify({ namespace: 'reveal', eventName: type, state: getState() }), '*' );
		}

	}

	/**
	 * Wrap all links in 3D goodness.
	 */
	function enableRollingLinks() {

		if( features.transforms3d && !( 'msPerspective' in document.body.style ) ) {
			var anchors = dom.wrapper.querySelectorAll( SLIDES_SELECTOR + ' a' );

			for( var i = 0, len = anchors.length; i < len; i++ ) {
				var anchor = anchors[i];

				if( anchor.textContent && !anchor.querySelector( '*' ) && ( !anchor.className || !anchor.classList.contains( anchor, 'roll' ) ) ) {
					var span = document.createElement('span');
					span.setAttribute('data-title', anchor.text);
					span.innerHTML = anchor.innerHTML;

					anchor.classList.add( 'roll' );
					anchor.innerHTML = '';
					anchor.appendChild(span);
				}
			}
		}

	}

	/**
	 * Unwrap all 3D links.
	 */
	function disableRollingLinks() {

		var anchors = dom.wrapper.querySelectorAll( SLIDES_SELECTOR + ' a.roll' );

		for( var i = 0, len = anchors.length; i < len; i++ ) {
			var anchor = anchors[i];
			var span = anchor.querySelector( 'span' );

			if( span ) {
				anchor.classList.remove( 'roll' );
				anchor.innerHTML = span.innerHTML;
			}
		}

	}

	/**
	 * Bind preview frame links.
	 *
	 * @param {string} [selector=a] - selector for anchors
	 */
	function enablePreviewLinks( selector ) {

		var anchors = toArray( document.querySelectorAll( selector ? selector : 'a' ) );

		anchors.forEach( function( element ) {
			if( /^(http|www)/gi.test( element.getAttribute( 'href' ) ) ) {
				element.addEventListener( 'click', onPreviewLinkClicked, false );
			}
		} );

	}

	/**
	 * Unbind preview frame links.
	 */
	function disablePreviewLinks() {

		var anchors = toArray( document.querySelectorAll( 'a' ) );

		anchors.forEach( function( element ) {
			if( /^(http|www)/gi.test( element.getAttribute( 'href' ) ) ) {
				element.removeEventListener( 'click', onPreviewLinkClicked, false );
			}
		} );

	}

	/**
	 * Opens a preview window for the target URL.
	 *
	 * @param {string} url - url for preview iframe src
	 */
	function showPreview( url ) {

		closeOverlay();

		dom.overlay = document.createElement( 'div' );
		dom.overlay.classList.add( 'overlay' );
		dom.overlay.classList.add( 'overlay-preview' );
		dom.wrapper.appendChild( dom.overlay );

		dom.overlay.innerHTML = [
			'<header>',
				'<a class="close" href="#"><span class="icon"></span></a>',
				'<a class="external" href="'+ url +'" target="_blank"><span class="icon"></span></a>',
			'</header>',
			'<div class="spinner"></div>',
			'<div class="viewport">',
				'<iframe src="'+ url +'"></iframe>',
				'<small class="viewport-inner">',
					'<span class="x-frame-error">Unable to load iframe. This is likely due to the site\'s policy (x-frame-options).</span>',
				'</small>',
			'</div>'
		].join('');

		dom.overlay.querySelector( 'iframe' ).addEventListener( 'load', function( event ) {
			dom.overlay.classList.add( 'loaded' );
		}, false );

		dom.overlay.querySelector( '.close' ).addEventListener( 'click', function( event ) {
			closeOverlay();
			event.preventDefault();
		}, false );

		dom.overlay.querySelector( '.external' ).addEventListener( 'click', function( event ) {
			closeOverlay();
		}, false );

		setTimeout( function() {
			dom.overlay.classList.add( 'visible' );
		}, 1 );

	}

	/**
	 * Opens an overlay window with help material.
	 */
	function showHelp() {

		if( config.help ) {

			closeOverlay();

			dom.overlay = document.createElement( 'div' );
			dom.overlay.classList.add( 'overlay' );
			dom.overlay.classList.add( 'overlay-help' );
			dom.wrapper.appendChild( dom.overlay );

			var html = '<p class="title">Keyboard Shortcuts</p><br/>';

			html += '<table><th>KEY</th><th>ACTION</th>';
			for( var key in keyboardShortcuts ) {
				html += '<tr><td>' + key + '</td><td>' + keyboardShortcuts[ key ] + '</td></tr>';
			}

			html += '</table>';

			dom.overlay.innerHTML = [
				'<header>',
					'<a class="close" href="#"><span class="icon"></span></a>',
				'</header>',
				'<div class="viewport">',
					'<div class="viewport-inner">'+ html +'</div>',
				'</div>'
			].join('');

			dom.overlay.querySelector( '.close' ).addEventListener( 'click', function( event ) {
				closeOverlay();
				event.preventDefault();
			}, false );

			setTimeout( function() {
				dom.overlay.classList.add( 'visible' );
			}, 1 );

		}

	}

	/**
	 * Closes any currently open overlay.
	 */
	function closeOverlay() {

		if( dom.overlay ) {
			dom.overlay.parentNode.removeChild( dom.overlay );
			dom.overlay = null;
		}

	}

	/**
	 * Applies JavaScript-controlled layout rules to the
	 * presentation.
	 */
	function layout() {

		if( dom.wrapper && !isPrintingPDF() ) {

			var size = getComputedSlideSize();

			// Layout the contents of the slides
			layoutSlideContents( config.width, config.height );

			dom.slides.style.width = size.width + 'px';
			dom.slides.style.height = size.height + 'px';

			// Determine scale of content to fit within available space
			scale = Math.min( size.presentationWidth / size.width, size.presentationHeight / size.height );

			// Respect max/min scale settings
			scale = Math.max( scale, config.minScale );
			scale = Math.min( scale, config.maxScale );

			// Don't apply any scaling styles if scale is 1
			if( scale === 1 ) {
				dom.slides.style.zoom = '';
				dom.slides.style.left = '';
				dom.slides.style.top = '';
				dom.slides.style.bottom = '';
				dom.slides.style.right = '';
				transformSlides( { layout: '' } );
			}
			else {
				// Prefer zoom for scaling up so that content remains crisp.
				// Don't use zoom to scale down since that can lead to shifts
				// in text layout/line breaks.
				if( scale > 1 && features.zoom ) {
					dom.slides.style.zoom = scale;
					dom.slides.style.left = '';
					dom.slides.style.top = '';
					dom.slides.style.bottom = '';
					dom.slides.style.right = '';
					transformSlides( { layout: '' } );
				}
				// Apply scale transform as a fallback
				else {
					dom.slides.style.zoom = '';
					dom.slides.style.left = '50%';
					dom.slides.style.top = '50%';
					dom.slides.style.bottom = 'auto';
					dom.slides.style.right = 'auto';
					transformSlides( { layout: 'translate(-50%, -50%) scale('+ scale +')' } );
				}
			}

			// Select all slides, vertical and horizontal
			var slides = toArray( dom.wrapper.querySelectorAll( SLIDES_SELECTOR ) );

			for( var i = 0, len = slides.length; i < len; i++ ) {
				var slide = slides[ i ];

				// Don't bother updating invisible slides
				if( slide.style.display === 'none' ) {
					continue;
				}

				if( config.center || slide.classList.contains( 'center' ) ) {
					// Vertical stacks are not centred since their section
					// children will be
					if( slide.classList.contains( 'stack' ) ) {
						slide.style.top = 0;
					}
					else {
						slide.style.top = Math.max( ( size.height - slide.scrollHeight ) / 2, 0 ) + 'px';
					}
				}
				else {
					slide.style.top = '';
				}

			}

			updateProgress();
			updateParallax();

		}

	}

	/**
	 * Applies layout logic to the contents of all slides in
	 * the presentation.
	 *
	 * @param {string|number} width
	 * @param {string|number} height
	 */
	function layoutSlideContents( width, height ) {

		// Handle sizing of elements with the 'stretch' class
		toArray( dom.slides.querySelectorAll( 'section > .stretch' ) ).forEach( function( element ) {

			// Determine how much vertical space we can use
			var remainingHeight = getRemainingHeight( element, height );

			// Consider the aspect ratio of media elements
			if( /(img|video)/gi.test( element.nodeName ) ) {
				var nw = element.naturalWidth || element.videoWidth,
					nh = element.naturalHeight || element.videoHeight;

				var es = Math.min( width / nw, remainingHeight / nh );

				element.style.width = ( nw * es ) + 'px';
				element.style.height = ( nh * es ) + 'px';

			}
			else {
				element.style.width = width + 'px';
				element.style.height = remainingHeight + 'px';
			}

		} );

	}

	/**
	 * Calculates the computed pixel size of our slides. These
	 * values are based on the width and height configuration
	 * options.
	 *
	 * @param {number} [presentationWidth=dom.wrapper.offsetWidth]
	 * @param {number} [presentationHeight=dom.wrapper.offsetHeight]
	 */
	function getComputedSlideSize( presentationWidth, presentationHeight ) {

		var size = {
			// Slide size
			width: config.width,
			height: config.height,

			// Presentation size
			presentationWidth: presentationWidth || dom.wrapper.offsetWidth,
			presentationHeight: presentationHeight || dom.wrapper.offsetHeight
		};

		// Reduce available space by margin
		size.presentationWidth -= ( size.presentationWidth * config.margin );
		size.presentationHeight -= ( size.presentationHeight * config.margin );

		// Slide width may be a percentage of available width
		if( typeof size.width === 'string' && /%$/.test( size.width ) ) {
			size.width = parseInt( size.width, 10 ) / 100 * size.presentationWidth;
		}

		// Slide height may be a percentage of available height
		if( typeof size.height === 'string' && /%$/.test( size.height ) ) {
			size.height = parseInt( size.height, 10 ) / 100 * size.presentationHeight;
		}

		return size;

	}

	/**
	 * Stores the vertical index of a stack so that the same
	 * vertical slide can be selected when navigating to and
	 * from the stack.
	 *
	 * @param {HTMLElement} stack The vertical stack element
	 * @param {string|number} [v=0] Index to memorize
	 */
	function setPreviousVerticalIndex( stack, v ) {

		if( typeof stack === 'object' && typeof stack.setAttribute === 'function' ) {
			stack.setAttribute( 'data-previous-indexv', v || 0 );
		}

	}

	/**
	 * Retrieves the vertical index which was stored using
	 * #setPreviousVerticalIndex() or 0 if no previous index
	 * exists.
	 *
	 * @param {HTMLElement} stack The vertical stack element
	 */
	function getPreviousVerticalIndex( stack ) {

		if( typeof stack === 'object' && typeof stack.setAttribute === 'function' && stack.classList.contains( 'stack' ) ) {
			// Prefer manually defined start-indexv
			var attributeName = stack.hasAttribute( 'data-start-indexv' ) ? 'data-start-indexv' : 'data-previous-indexv';

			return parseInt( stack.getAttribute( attributeName ) || 0, 10 );
		}

		return 0;

	}

	/**
	 * Displays the overview of slides (quick nav) by scaling
	 * down and arranging all slide elements.
	 */
	function activateOverview() {

		// Only proceed if enabled in config
		if( config.overview && !isOverview() ) {

			overview = true;

			dom.wrapper.classList.add( 'overview' );
			dom.wrapper.classList.remove( 'overview-deactivating' );

			if( features.overviewTransitions ) {
				setTimeout( function() {
					dom.wrapper.classList.add( 'overview-animated' );
				}, 1 );
			}

			// Don't auto-slide while in overview mode
			cancelAutoSlide();

			// Move the backgrounds element into the slide container to
			// that the same scaling is applied
			dom.slides.appendChild( dom.background );

			// Clicking on an overview slide navigates to it
			toArray( dom.wrapper.querySelectorAll( SLIDES_SELECTOR ) ).forEach( function( slide ) {
				if( !slide.classList.contains( 'stack' ) ) {
					slide.addEventListener( 'click', onOverviewSlideClicked, true );
				}
			} );

			// Calculate slide sizes
			var margin = 70;
			var slideSize = getComputedSlideSize();
			overviewSlideWidth = slideSize.width + margin;
			overviewSlideHeight = slideSize.height + margin;

			// Reverse in RTL mode
			if( config.rtl ) {
				overviewSlideWidth = -overviewSlideWidth;
			}

			updateSlidesVisibility();
			layoutOverview();
			updateOverview();

			layout();

			// Notify observers of the overview showing
			dispatchEvent( 'overviewshown', {
				'indexh': indexh,
				'indexv': indexv,
				'currentSlide': currentSlide
			} );

		}

	}

	/**
	 * Uses CSS transforms to position all slides in a grid for
	 * display inside of the overview mode.
	 */
	function layoutOverview() {

		// Layout slides
		toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) ).forEach( function( hslide, h ) {
			hslide.setAttribute( 'data-index-h', h );
			transformElement( hslide, 'translate3d(' + ( h * overviewSlideWidth ) + 'px, 0, 0)' );

			if( hslide.classList.contains( 'stack' ) ) {

				toArray( hslide.querySelectorAll( 'section' ) ).forEach( function( vslide, v ) {
					vslide.setAttribute( 'data-index-h', h );
					vslide.setAttribute( 'data-index-v', v );

					transformElement( vslide, 'translate3d(0, ' + ( v * overviewSlideHeight ) + 'px, 0)' );
				} );

			}
		} );

		// Layout slide backgrounds
		toArray( dom.background.childNodes ).forEach( function( hbackground, h ) {
			transformElement( hbackground, 'translate3d(' + ( h * overviewSlideWidth ) + 'px, 0, 0)' );

			toArray( hbackground.querySelectorAll( '.slide-background' ) ).forEach( function( vbackground, v ) {
				transformElement( vbackground, 'translate3d(0, ' + ( v * overviewSlideHeight ) + 'px, 0)' );
			} );
		} );

	}

	/**
	 * Moves the overview viewport to the current slides.
	 * Called each time the current slide changes.
	 */
	function updateOverview() {

		transformSlides( {
			overview: [
				'translateX('+ ( -indexh * overviewSlideWidth ) +'px)',
				'translateY('+ ( -indexv * overviewSlideHeight ) +'px)',
				'translateZ('+ ( window.innerWidth < 400 ? -1000 : -2500 ) +'px)'
			].join( ' ' )
		} );

	}

	/**
	 * Exits the slide overview and enters the currently
	 * active slide.
	 */
	function deactivateOverview() {

		// Only proceed if enabled in config
		if( config.overview ) {

			overview = false;

			dom.wrapper.classList.remove( 'overview' );
			dom.wrapper.classList.remove( 'overview-animated' );

			// Temporarily add a class so that transitions can do different things
			// depending on whether they are exiting/entering overview, or just
			// moving from slide to slide
			dom.wrapper.classList.add( 'overview-deactivating' );

			setTimeout( function () {
				dom.wrapper.classList.remove( 'overview-deactivating' );
			}, 1 );

			// Move the background element back out
			dom.wrapper.appendChild( dom.background );

			// Clean up changes made to slides
			toArray( dom.wrapper.querySelectorAll( SLIDES_SELECTOR ) ).forEach( function( slide ) {
				transformElement( slide, '' );

				slide.removeEventListener( 'click', onOverviewSlideClicked, true );
			} );

			// Clean up changes made to backgrounds
			toArray( dom.background.querySelectorAll( '.slide-background' ) ).forEach( function( background ) {
				transformElement( background, '' );
			} );

			transformSlides( { overview: '' } );

			slide( indexh, indexv );

			layout();

			cueAutoSlide();

			// Notify observers of the overview hiding
			dispatchEvent( 'overviewhidden', {
				'indexh': indexh,
				'indexv': indexv,
				'currentSlide': currentSlide
			} );

		}
	}

	/**
	 * Toggles the slide overview mode on and off.
	 *
	 * @param {Boolean} [override] Flag which overrides the
	 * toggle logic and forcibly sets the desired state. True means
	 * overview is open, false means it's closed.
	 */
	function toggleOverview( override ) {

		if( typeof override === 'boolean' ) {
			override ? activateOverview() : deactivateOverview();
		}
		else {
			isOverview() ? deactivateOverview() : activateOverview();
		}

	}

	/**
	 * Checks if the overview is currently active.
	 *
	 * @return {Boolean} true if the overview is active,
	 * false otherwise
	 */
	function isOverview() {

		return overview;

	}

	/**
	 * Checks if the current or specified slide is vertical
	 * (nested within another slide).
	 *
	 * @param {HTMLElement} [slide=currentSlide] The slide to check
	 * orientation of
	 * @return {Boolean}
	 */
	function isVerticalSlide( slide ) {

		// Prefer slide argument, otherwise use current slide
		slide = slide ? slide : currentSlide;

		return slide && slide.parentNode && !!slide.parentNode.nodeName.match( /section/i );

	}

	/**
	 * Handling the fullscreen functionality via the fullscreen API
	 *
	 * @see http://fullscreen.spec.whatwg.org/
	 * @see https://developer.mozilla.org/en-US/docs/DOM/Using_fullscreen_mode
	 */
	function enterFullscreen() {

		var element = document.documentElement;

		// Check which implementation is available
		var requestMethod = element.requestFullscreen ||
							element.webkitRequestFullscreen ||
							element.webkitRequestFullScreen ||
							element.mozRequestFullScreen ||
							element.msRequestFullscreen;

		if( requestMethod ) {
			requestMethod.apply( element );
		}

	}

	/**
	 * Enters the paused mode which fades everything on screen to
	 * black.
	 */
	function pause() {

		if( config.pause ) {
			var wasPaused = dom.wrapper.classList.contains( 'paused' );

			cancelAutoSlide();
			dom.wrapper.classList.add( 'paused' );

			if( wasPaused === false ) {
				dispatchEvent( 'paused' );
			}
		}

	}

	/**
	 * Exits from the paused mode.
	 */
	function resume() {

		var wasPaused = dom.wrapper.classList.contains( 'paused' );
		dom.wrapper.classList.remove( 'paused' );

		cueAutoSlide();

		if( wasPaused ) {
			dispatchEvent( 'resumed' );
		}

	}

	/**
	 * Toggles the paused mode on and off.
	 */
	function togglePause( override ) {

		if( typeof override === 'boolean' ) {
			override ? pause() : resume();
		}
		else {
			isPaused() ? resume() : pause();
		}

	}

	/**
	 * Checks if we are currently in the paused mode.
	 *
	 * @return {Boolean}
	 */
	function isPaused() {

		return dom.wrapper.classList.contains( 'paused' );

	}

	/**
	 * Toggles the auto slide mode on and off.
	 *
	 * @param {Boolean} [override] Flag which sets the desired state.
	 * True means autoplay starts, false means it stops.
	 */

	function toggleAutoSlide( override ) {

		if( typeof override === 'boolean' ) {
			override ? resumeAutoSlide() : pauseAutoSlide();
		}

		else {
			autoSlidePaused ? resumeAutoSlide() : pauseAutoSlide();
		}

	}

	/**
	 * Checks if the auto slide mode is currently on.
	 *
	 * @return {Boolean}
	 */
	function isAutoSliding() {

		return !!( autoSlide && !autoSlidePaused );

	}

	/**
	 * Steps from the current point in the presentation to the
	 * slide which matches the specified horizontal and vertical
	 * indices.
	 *
	 * @param {number} [h=indexh] Horizontal index of the target slide
	 * @param {number} [v=indexv] Vertical index of the target slide
	 * @param {number} [f] Index of a fragment within the
	 * target slide to activate
	 * @param {number} [o] Origin for use in multimaster environments
	 */
	function slide( h, v, f, o ) {

		// Remember where we were at before
		previousSlide = currentSlide;

		// Query all horizontal slides in the deck
		var horizontalSlides = dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR );

		// Abort if there are no slides
		if( horizontalSlides.length === 0 ) return;

		// If no vertical index is specified and the upcoming slide is a
		// stack, resume at its previous vertical index
		if( v === undefined && !isOverview() ) {
			v = getPreviousVerticalIndex( horizontalSlides[ h ] );
		}

		// If we were on a vertical stack, remember what vertical index
		// it was on so we can resume at the same position when returning
		if( previousSlide && previousSlide.parentNode && previousSlide.parentNode.classList.contains( 'stack' ) ) {
			setPreviousVerticalIndex( previousSlide.parentNode, indexv );
		}

		// Remember the state before this slide
		var stateBefore = state.concat();

		// Reset the state array
		state.length = 0;

		var indexhBefore = indexh || 0,
			indexvBefore = indexv || 0;

		// Activate and transition to the new slide
		indexh = updateSlides( HORIZONTAL_SLIDES_SELECTOR, h === undefined ? indexh : h );
		indexv = updateSlides( VERTICAL_SLIDES_SELECTOR, v === undefined ? indexv : v );

		// Update the visibility of slides now that the indices have changed
		updateSlidesVisibility();

		layout();

		// Apply the new state
		stateLoop: for( var i = 0, len = state.length; i < len; i++ ) {
			// Check if this state existed on the previous slide. If it
			// did, we will avoid adding it repeatedly
			for( var j = 0; j < stateBefore.length; j++ ) {
				if( stateBefore[j] === state[i] ) {
					stateBefore.splice( j, 1 );
					continue stateLoop;
				}
			}

			document.documentElement.classList.add( state[i] );

			// Dispatch custom event matching the state's name
			dispatchEvent( state[i] );
		}

		// Clean up the remains of the previous state
		while( stateBefore.length ) {
			document.documentElement.classList.remove( stateBefore.pop() );
		}

		// Update the overview if it's currently active
		if( isOverview() ) {
			updateOverview();
		}

		// Find the current horizontal slide and any possible vertical slides
		// within it
		var currentHorizontalSlide = horizontalSlides[ indexh ],
			currentVerticalSlides = currentHorizontalSlide.querySelectorAll( 'section' );

		// Store references to the previous and current slides
		currentSlide = currentVerticalSlides[ indexv ] || currentHorizontalSlide;

		// Show fragment, if specified
		if( typeof f !== 'undefined' ) {
			navigateFragment( f );
		}

		// Dispatch an event if the slide changed
		var slideChanged = ( indexh !== indexhBefore || indexv !== indexvBefore );
		if( slideChanged ) {
			dispatchEvent( 'slidechanged', {
				'indexh': indexh,
				'indexv': indexv,
				'previousSlide': previousSlide,
				'currentSlide': currentSlide,
				'origin': o
			} );
		}
		else {
			// Ensure that the previous slide is never the same as the current
			previousSlide = null;
		}

		// Solves an edge case where the previous slide maintains the
		// 'present' class when navigating between adjacent vertical
		// stacks
		if( previousSlide ) {
			previousSlide.classList.remove( 'present' );
			previousSlide.setAttribute( 'aria-hidden', 'true' );

			// Reset all slides upon navigate to home
			// Issue: #285
			if ( dom.wrapper.querySelector( HOME_SLIDE_SELECTOR ).classList.contains( 'present' ) ) {
				// Launch async task
				setTimeout( function () {
					var slides = toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR + '.stack') ), i;
					for( i in slides ) {
						if( slides[i] ) {
							// Reset stack
							setPreviousVerticalIndex( slides[i], 0 );
						}
					}
				}, 0 );
			}
		}

		// Handle embedded content
		if( slideChanged || !previousSlide ) {
			stopEmbeddedContent( previousSlide );
			startEmbeddedContent( currentSlide );
		}

		// Announce the current slide contents, for screen readers
		dom.statusDiv.textContent = getStatusText( currentSlide );

		updateControls();
		updateProgress();
		updateBackground();
		updateParallax();
		updateSlideNumber();
		updateNotes();

		// Update the URL hash
		writeURL();

		cueAutoSlide();

	}

	/**
	 * Syncs the presentation with the current DOM. Useful
	 * when new slides or control elements are added or when
	 * the configuration has changed.
	 */
	function sync() {

		// Subscribe to input
		removeEventListeners();
		addEventListeners();

		// Force a layout to make sure the current config is accounted for
		layout();

		// Reflect the current autoSlide value
		autoSlide = config.autoSlide;

		// Start auto-sliding if it's enabled
		cueAutoSlide();

		// Re-create the slide backgrounds
		createBackgrounds();

		// Write the current hash to the URL
		writeURL();

		sortAllFragments();

		updateControls();
		updateProgress();
		updateBackground( true );
		updateSlideNumber();
		updateSlidesVisibility();
		updateNotes();

		formatEmbeddedContent();
		startEmbeddedContent( currentSlide );

		if( isOverview() ) {
			layoutOverview();
		}

	}

	/**
	 * Resets all vertical slides so that only the first
	 * is visible.
	 */
	function resetVerticalSlides() {

		var horizontalSlides = toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) );
		horizontalSlides.forEach( function( horizontalSlide ) {

			var verticalSlides = toArray( horizontalSlide.querySelectorAll( 'section' ) );
			verticalSlides.forEach( function( verticalSlide, y ) {

				if( y > 0 ) {
					verticalSlide.classList.remove( 'present' );
					verticalSlide.classList.remove( 'past' );
					verticalSlide.classList.add( 'future' );
					verticalSlide.setAttribute( 'aria-hidden', 'true' );
				}

			} );

		} );

	}

	/**
	 * Sorts and formats all of fragments in the
	 * presentation.
	 */
	function sortAllFragments() {

		var horizontalSlides = toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) );
		horizontalSlides.forEach( function( horizontalSlide ) {

			var verticalSlides = toArray( horizontalSlide.querySelectorAll( 'section' ) );
			verticalSlides.forEach( function( verticalSlide, y ) {

				sortFragments( verticalSlide.querySelectorAll( '.fragment' ) );

			} );

			if( verticalSlides.length === 0 ) sortFragments( horizontalSlide.querySelectorAll( '.fragment' ) );

		} );

	}

	/**
	 * Randomly shuffles all slides in the deck.
	 */
	function shuffle() {

		var slides = toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) );

		slides.forEach( function( slide ) {

			// Insert this slide next to another random slide. This may
			// cause the slide to insert before itself but that's fine.
			dom.slides.insertBefore( slide, slides[ Math.floor( Math.random() * slides.length ) ] );

		} );

	}

	/**
	 * Updates one dimension of slides by showing the slide
	 * with the specified index.
	 *
	 * @param {string} selector A CSS selector that will fetch
	 * the group of slides we are working with
	 * @param {number} index The index of the slide that should be
	 * shown
	 *
	 * @return {number} The index of the slide that is now shown,
	 * might differ from the passed in index if it was out of
	 * bounds.
	 */
	function updateSlides( selector, index ) {

		// Select all slides and convert the NodeList result to
		// an array
		var slides = toArray( dom.wrapper.querySelectorAll( selector ) ),
			slidesLength = slides.length;

		var printMode = isPrintingPDF();

		if( slidesLength ) {

			// Should the index loop?
			if( config.loop ) {
				index %= slidesLength;

				if( index < 0 ) {
					index = slidesLength + index;
				}
			}

			// Enforce max and minimum index bounds
			index = Math.max( Math.min( index, slidesLength - 1 ), 0 );

			for( var i = 0; i < slidesLength; i++ ) {
				var element = slides[i];

				var reverse = config.rtl && !isVerticalSlide( element );

				element.classList.remove( 'past' );
				element.classList.remove( 'present' );
				element.classList.remove( 'future' );

				// http://www.w3.org/html/wg/drafts/html/master/editing.html#the-hidden-attribute
				element.setAttribute( 'hidden', '' );
				element.setAttribute( 'aria-hidden', 'true' );

				// If this element contains vertical slides
				if( element.querySelector( 'section' ) ) {
					element.classList.add( 'stack' );
				}

				// If we're printing static slides, all slides are "present"
				if( printMode ) {
					element.classList.add( 'present' );
					continue;
				}

				if( i < index ) {
					// Any element previous to index is given the 'past' class
					element.classList.add( reverse ? 'future' : 'past' );

					if( config.fragments ) {
						var pastFragments = toArray( element.querySelectorAll( '.fragment' ) );

						// Show all fragments on prior slides
						while( pastFragments.length ) {
							var pastFragment = pastFragments.pop();
							pastFragment.classList.add( 'visible' );
							pastFragment.classList.remove( 'current-fragment' );
						}
					}
				}
				else if( i > index ) {
					// Any element subsequent to index is given the 'future' class
					element.classList.add( reverse ? 'past' : 'future' );

					if( config.fragments ) {
						var futureFragments = toArray( element.querySelectorAll( '.fragment.visible' ) );

						// No fragments in future slides should be visible ahead of time
						while( futureFragments.length ) {
							var futureFragment = futureFragments.pop();
							futureFragment.classList.remove( 'visible' );
							futureFragment.classList.remove( 'current-fragment' );
						}
					}
				}
			}

			// Mark the current slide as present
			slides[index].classList.add( 'present' );
			slides[index].removeAttribute( 'hidden' );
			slides[index].removeAttribute( 'aria-hidden' );

			// If this slide has a state associated with it, add it
			// onto the current state of the deck
			var slideState = slides[index].getAttribute( 'data-state' );
			if( slideState ) {
				state = state.concat( slideState.split( ' ' ) );
			}

		}
		else {
			// Since there are no slides we can't be anywhere beyond the
			// zeroth index
			index = 0;
		}

		return index;

	}

	/**
	 * Optimization method; hide all slides that are far away
	 * from the present slide.
	 */
	function updateSlidesVisibility() {

		// Select all slides and convert the NodeList result to
		// an array
		var horizontalSlides = toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) ),
			horizontalSlidesLength = horizontalSlides.length,
			distanceX,
			distanceY;

		if( horizontalSlidesLength && typeof indexh !== 'undefined' ) {

			// The number of steps away from the present slide that will
			// be visible
			var viewDistance = isOverview() ? 10 : config.viewDistance;

			// Limit view distance on weaker devices
			if( isMobileDevice ) {
				viewDistance = isOverview() ? 6 : 2;
			}

			// All slides need to be visible when exporting to PDF
			if( isPrintingPDF() ) {
				viewDistance = Number.MAX_VALUE;
			}

			for( var x = 0; x < horizontalSlidesLength; x++ ) {
				var horizontalSlide = horizontalSlides[x];

				var verticalSlides = toArray( horizontalSlide.querySelectorAll( 'section' ) ),
					verticalSlidesLength = verticalSlides.length;

				// Determine how far away this slide is from the present
				distanceX = Math.abs( ( indexh || 0 ) - x ) || 0;

				// If the presentation is looped, distance should measure
				// 1 between the first and last slides
				if( config.loop ) {
					distanceX = Math.abs( ( ( indexh || 0 ) - x ) % ( horizontalSlidesLength - viewDistance ) ) || 0;
				}

				// Show the horizontal slide if it's within the view distance
				if( distanceX < viewDistance ) {
					showSlide( horizontalSlide );
				}
				else {
					hideSlide( horizontalSlide );
				}

				if( verticalSlidesLength ) {

					var oy = getPreviousVerticalIndex( horizontalSlide );

					for( var y = 0; y < verticalSlidesLength; y++ ) {
						var verticalSlide = verticalSlides[y];

						distanceY = x === ( indexh || 0 ) ? Math.abs( ( indexv || 0 ) - y ) : Math.abs( y - oy );

						if( distanceX + distanceY < viewDistance ) {
							showSlide( verticalSlide );
						}
						else {
							hideSlide( verticalSlide );
						}
					}

				}
			}

		}

	}

	/**
	 * Pick up notes from the current slide and display them
	 * to the viewer.
	 *
	 * @see {@link config.showNotes}
	 */
	function updateNotes() {

		if( config.showNotes && dom.speakerNotes && currentSlide && !isPrintingPDF() ) {

			dom.speakerNotes.innerHTML = getSlideNotes() || '';

		}

	}

	/**
	 * Updates the progress bar to reflect the current slide.
	 */
	function updateProgress() {

		// Update progress if enabled
		if( config.progress && dom.progressbar ) {

			dom.progressbar.style.width = getProgress() * dom.wrapper.offsetWidth + 'px';

		}

	}

	/**
	 * Updates the slide number div to reflect the current slide.
	 *
	 * The following slide number formats are available:
	 *  "h.v":	horizontal . vertical slide number (default)
	 *  "h/v":	horizontal / vertical slide number
	 *    "c":	flattened slide number
	 *  "c/t":	flattened slide number / total slides
	 */
	function updateSlideNumber() {

		// Update slide number if enabled
		if( config.slideNumber && dom.slideNumber ) {

			var value = [];
			var format = 'h.v';

			// Check if a custom number format is available
			if( typeof config.slideNumber === 'string' ) {
				format = config.slideNumber;
			}

			switch( format ) {
				case 'c':
					value.push( getSlidePastCount() + 1 );
					break;
				case 'c/t':
					value.push( getSlidePastCount() + 1, '/', getTotalSlides() );
					break;
				case 'h/v':
					value.push( indexh + 1 );
					if( isVerticalSlide() ) value.push( '/', indexv + 1 );
					break;
				default:
					value.push( indexh + 1 );
					if( isVerticalSlide() ) value.push( '.', indexv + 1 );
			}

			dom.slideNumber.innerHTML = formatSlideNumber( value[0], value[1], value[2] );
		}

	}

	/**
	 * Applies HTML formatting to a slide number before it's
	 * written to the DOM.
	 *
	 * @param {number} a Current slide
	 * @param {string} delimiter Character to separate slide numbers
	 * @param {(number|*)} b Total slides
	 * @return {string} HTML string fragment
	 */
	function formatSlideNumber( a, delimiter, b ) {

		if( typeof b === 'number' && !isNaN( b ) ) {
			return  '<span class="slide-number-a">'+ a +'</span>' +
					'<span class="slide-number-delimiter">'+ delimiter +'</span>' +
					'<span class="slide-number-b">'+ b +'</span>';
		}
		else {
			return '<span class="slide-number-a">'+ a +'</span>';
		}

	}

	/**
	 * Updates the state of all control/navigation arrows.
	 */
	function updateControls() {

		var routes = availableRoutes();
		var fragments = availableFragments();

		// Remove the 'enabled' class from all directions
		dom.controlsLeft.concat( dom.controlsRight )
						.concat( dom.controlsUp )
						.concat( dom.controlsDown )
						.concat( dom.controlsPrev )
						.concat( dom.controlsNext ).forEach( function( node ) {
			node.classList.remove( 'enabled' );
			node.classList.remove( 'fragmented' );

			// Set 'disabled' attribute on all directions
			node.setAttribute( 'disabled', 'disabled' );
		} );

		// Add the 'enabled' class to the available routes; remove 'disabled' attribute to enable buttons
		if( routes.left ) dom.controlsLeft.forEach( function( el ) { el.classList.add( 'enabled' ); el.removeAttribute( 'disabled' ); } );
		if( routes.right ) dom.controlsRight.forEach( function( el ) { el.classList.add( 'enabled' ); el.removeAttribute( 'disabled' ); } );
		if( routes.up ) dom.controlsUp.forEach( function( el ) { el.classList.add( 'enabled' ); el.removeAttribute( 'disabled' ); } );
		if( routes.down ) dom.controlsDown.forEach( function( el ) { el.classList.add( 'enabled' ); el.removeAttribute( 'disabled' ); } );

		// Prev/next buttons
		if( routes.left || routes.up ) dom.controlsPrev.forEach( function( el ) { el.classList.add( 'enabled' ); el.removeAttribute( 'disabled' ); } );
		if( routes.right || routes.down ) dom.controlsNext.forEach( function( el ) { el.classList.add( 'enabled' ); el.removeAttribute( 'disabled' ); } );

		// Highlight fragment directions
		if( currentSlide ) {

			// Always apply fragment decorator to prev/next buttons
			if( fragments.prev ) dom.controlsPrev.forEach( function( el ) { el.classList.add( 'fragmented', 'enabled' ); el.removeAttribute( 'disabled' ); } );
			if( fragments.next ) dom.controlsNext.forEach( function( el ) { el.classList.add( 'fragmented', 'enabled' ); el.removeAttribute( 'disabled' ); } );

			// Apply fragment decorators to directional buttons based on
			// what slide axis they are in
			if( isVerticalSlide( currentSlide ) ) {
				if( fragments.prev ) dom.controlsUp.forEach( function( el ) { el.classList.add( 'fragmented', 'enabled' ); el.removeAttribute( 'disabled' ); } );
				if( fragments.next ) dom.controlsDown.forEach( function( el ) { el.classList.add( 'fragmented', 'enabled' ); el.removeAttribute( 'disabled' ); } );
			}
			else {
				if( fragments.prev ) dom.controlsLeft.forEach( function( el ) { el.classList.add( 'fragmented', 'enabled' ); el.removeAttribute( 'disabled' ); } );
				if( fragments.next ) dom.controlsRight.forEach( function( el ) { el.classList.add( 'fragmented', 'enabled' ); el.removeAttribute( 'disabled' ); } );
			}

		}

	}

	/**
	 * Updates the background elements to reflect the current
	 * slide.
	 *
	 * @param {boolean} includeAll If true, the backgrounds of
	 * all vertical slides (not just the present) will be updated.
	 */
	function updateBackground( includeAll ) {

		var currentBackground = null;

		// Reverse past/future classes when in RTL mode
		var horizontalPast = config.rtl ? 'future' : 'past',
			horizontalFuture = config.rtl ? 'past' : 'future';

		// Update the classes of all backgrounds to match the
		// states of their slides (past/present/future)
		toArray( dom.background.childNodes ).forEach( function( backgroundh, h ) {

			backgroundh.classList.remove( 'past' );
			backgroundh.classList.remove( 'present' );
			backgroundh.classList.remove( 'future' );

			if( h < indexh ) {
				backgroundh.classList.add( horizontalPast );
			}
			else if ( h > indexh ) {
				backgroundh.classList.add( horizontalFuture );
			}
			else {
				backgroundh.classList.add( 'present' );

				// Store a reference to the current background element
				currentBackground = backgroundh;
			}

			if( includeAll || h === indexh ) {
				toArray( backgroundh.querySelectorAll( '.slide-background' ) ).forEach( function( backgroundv, v ) {

					backgroundv.classList.remove( 'past' );
					backgroundv.classList.remove( 'present' );
					backgroundv.classList.remove( 'future' );

					if( v < indexv ) {
						backgroundv.classList.add( 'past' );
					}
					else if ( v > indexv ) {
						backgroundv.classList.add( 'future' );
					}
					else {
						backgroundv.classList.add( 'present' );

						// Only if this is the present horizontal and vertical slide
						if( h === indexh ) currentBackground = backgroundv;
					}

				} );
			}

		} );

		// Stop any currently playing video background
		if( previousBackground ) {

			var previousVideo = previousBackground.querySelector( 'video' );
			if( previousVideo ) previousVideo.pause();

		}

		if( currentBackground ) {

			// Start video playback
			var currentVideo = currentBackground.querySelector( 'video' );
			if( currentVideo ) {

				var startVideo = function() {
					currentVideo.currentTime = 0;
					currentVideo.play();
					currentVideo.removeEventListener( 'loadeddata', startVideo );
				};

				if( currentVideo.readyState > 1 ) {
					startVideo();
				}
				else {
					currentVideo.addEventListener( 'loadeddata', startVideo );
				}

			}

			var backgroundImageURL = currentBackground.style.backgroundImage || '';

			// Restart GIFs (doesn't work in Firefox)
			if( /\.gif/i.test( backgroundImageURL ) ) {
				currentBackground.style.backgroundImage = '';
				window.getComputedStyle( currentBackground ).opacity;
				currentBackground.style.backgroundImage = backgroundImageURL;
			}

			// Don't transition between identical backgrounds. This
			// prevents unwanted flicker.
			var previousBackgroundHash = previousBackground ? previousBackground.getAttribute( 'data-background-hash' ) : null;
			var currentBackgroundHash = currentBackground.getAttribute( 'data-background-hash' );
			if( currentBackgroundHash && currentBackgroundHash === previousBackgroundHash && currentBackground !== previousBackground ) {
				dom.background.classList.add( 'no-transition' );
			}

			previousBackground = currentBackground;

		}

		// If there's a background brightness flag for this slide,
		// bubble it to the .reveal container
		if( currentSlide ) {
			[ 'has-light-background', 'has-dark-background' ].forEach( function( classToBubble ) {
				if( currentSlide.classList.contains( classToBubble ) ) {
					dom.wrapper.classList.add( classToBubble );
				}
				else {
					dom.wrapper.classList.remove( classToBubble );
				}
			} );
		}

		// Allow the first background to apply without transition
		setTimeout( function() {
			dom.background.classList.remove( 'no-transition' );
		}, 1 );

	}

	/**
	 * Updates the position of the parallax background based
	 * on the current slide index.
	 */
	function updateParallax() {

		if( config.parallaxBackgroundImage ) {

			var horizontalSlides = dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ),
				verticalSlides = dom.wrapper.querySelectorAll( VERTICAL_SLIDES_SELECTOR );

			var backgroundSize = dom.background.style.backgroundSize.split( ' ' ),
				backgroundWidth, backgroundHeight;

			if( backgroundSize.length === 1 ) {
				backgroundWidth = backgroundHeight = parseInt( backgroundSize[0], 10 );
			}
			else {
				backgroundWidth = parseInt( backgroundSize[0], 10 );
				backgroundHeight = parseInt( backgroundSize[1], 10 );
			}

			var slideWidth = dom.background.offsetWidth,
				horizontalSlideCount = horizontalSlides.length,
				horizontalOffsetMultiplier,
				horizontalOffset;

			if( typeof config.parallaxBackgroundHorizontal === 'number' ) {
				horizontalOffsetMultiplier = config.parallaxBackgroundHorizontal;
			}
			else {
				horizontalOffsetMultiplier = horizontalSlideCount > 1 ? ( backgroundWidth - slideWidth ) / ( horizontalSlideCount-1 ) : 0;
			}

			horizontalOffset = horizontalOffsetMultiplier * indexh * -1;

			var slideHeight = dom.background.offsetHeight,
				verticalSlideCount = verticalSlides.length,
				verticalOffsetMultiplier,
				verticalOffset;

			if( typeof config.parallaxBackgroundVertical === 'number' ) {
				verticalOffsetMultiplier = config.parallaxBackgroundVertical;
			}
			else {
				verticalOffsetMultiplier = ( backgroundHeight - slideHeight ) / ( verticalSlideCount-1 );
			}

			verticalOffset = verticalSlideCount > 0 ?  verticalOffsetMultiplier * indexv : 0;

			dom.background.style.backgroundPosition = horizontalOffset + 'px ' + -verticalOffset + 'px';

		}

	}

	/**
	 * Called when the given slide is within the configured view
	 * distance. Shows the slide element and loads any content
	 * that is set to load lazily (data-src).
	 *
	 * @param {HTMLElement} slide Slide to show
	 */
	function showSlide( slide ) {

		// Show the slide element
		slide.style.display = 'block';

		// Media elements with data-src attributes
		toArray( slide.querySelectorAll( 'img[data-src], video[data-src], audio[data-src]' ) ).forEach( function( element ) {
			element.setAttribute( 'src', element.getAttribute( 'data-src' ) );
			element.removeAttribute( 'data-src' );
		} );

		// Media elements with <source> children
		toArray( slide.querySelectorAll( 'video, audio' ) ).forEach( function( media ) {
			var sources = 0;

			toArray( media.querySelectorAll( 'source[data-src]' ) ).forEach( function( source ) {
				source.setAttribute( 'src', source.getAttribute( 'data-src' ) );
				source.removeAttribute( 'data-src' );
				sources += 1;
			} );

			// If we rewrote sources for this video/audio element, we need
			// to manually tell it to load from its new origin
			if( sources > 0 ) {
				media.load();
			}
		} );


		// Show the corresponding background element
		var indices = getIndices( slide );
		var background = getSlideBackground( indices.h, indices.v );
		if( background ) {
			background.style.display = 'block';

			// If the background contains media, load it
			if( background.hasAttribute( 'data-loaded' ) === false ) {
				background.setAttribute( 'data-loaded', 'true' );

				var backgroundImage = slide.getAttribute( 'data-background-image' ),
					backgroundVideo = slide.getAttribute( 'data-background-video' ),
					backgroundVideoLoop = slide.hasAttribute( 'data-background-video-loop' ),
					backgroundVideoMuted = slide.hasAttribute( 'data-background-video-muted' ),
					backgroundIframe = slide.getAttribute( 'data-background-iframe' );

				// Images
				if( backgroundImage ) {
					background.style.backgroundImage = 'url('+ backgroundImage +')';
				}
				// Videos
				else if ( backgroundVideo && !isSpeakerNotes() ) {
					var video = document.createElement( 'video' );

					if( backgroundVideoLoop ) {
						video.setAttribute( 'loop', '' );
					}

					if( backgroundVideoMuted ) {
						video.muted = true;
					}

					// Support comma separated lists of video sources
					backgroundVideo.split( ',' ).forEach( function( source ) {
						video.innerHTML += '<source src="'+ source +'">';
					} );

					background.appendChild( video );
				}
				// Iframes
				else if( backgroundIframe ) {
					var iframe = document.createElement( 'iframe' );
						iframe.setAttribute( 'src', backgroundIframe );
						iframe.style.width  = '100%';
						iframe.style.height = '100%';
						iframe.style.maxHeight = '100%';
						iframe.style.maxWidth = '100%';

					background.appendChild( iframe );
				}
			}
		}

	}

	/**
	 * Called when the given slide is moved outside of the
	 * configured view distance.
	 *
	 * @param {HTMLElement} slide
	 */
	function hideSlide( slide ) {

		// Hide the slide element
		slide.style.display = 'none';

		// Hide the corresponding background element
		var indices = getIndices( slide );
		var background = getSlideBackground( indices.h, indices.v );
		if( background ) {
			background.style.display = 'none';
		}

	}

	/**
	 * Determine what available routes there are for navigation.
	 *
	 * @return {{left: boolean, right: boolean, up: boolean, down: boolean}}
	 */
	function availableRoutes() {

		var horizontalSlides = dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ),
			verticalSlides = dom.wrapper.querySelectorAll( VERTICAL_SLIDES_SELECTOR );

		var routes = {
			left: indexh > 0 || config.loop,
			right: indexh < horizontalSlides.length - 1 || config.loop,
			up: indexv > 0,
			down: indexv < verticalSlides.length - 1
		};

		// reverse horizontal controls for rtl
		if( config.rtl ) {
			var left = routes.left;
			routes.left = routes.right;
			routes.right = left;
		}

		return routes;

	}

	/**
	 * Returns an object describing the available fragment
	 * directions.
	 *
	 * @return {{prev: boolean, next: boolean}}
	 */
	function availableFragments() {

		if( currentSlide && config.fragments ) {
			var fragments = currentSlide.querySelectorAll( '.fragment' );
			var hiddenFragments = currentSlide.querySelectorAll( '.fragment:not(.visible)' );

			return {
				prev: fragments.length - hiddenFragments.length > 0,
				next: !!hiddenFragments.length
			};
		}
		else {
			return { prev: false, next: false };
		}

	}

	/**
	 * Enforces origin-specific format rules for embedded media.
	 */
	function formatEmbeddedContent() {

		var _appendParamToIframeSource = function( sourceAttribute, sourceURL, param ) {
			toArray( dom.slides.querySelectorAll( 'iframe['+ sourceAttribute +'*="'+ sourceURL +'"]' ) ).forEach( function( el ) {
				var src = el.getAttribute( sourceAttribute );
				if( src && src.indexOf( param ) === -1 ) {
					el.setAttribute( sourceAttribute, src + ( !/\?/.test( src ) ? '?' : '&' ) + param );
				}
			});
		};

		// YouTube frames must include "?enablejsapi=1"
		_appendParamToIframeSource( 'src', 'youtube.com/embed/', 'enablejsapi=1' );
		_appendParamToIframeSource( 'data-src', 'youtube.com/embed/', 'enablejsapi=1' );

		// Vimeo frames must include "?api=1"
		_appendParamToIframeSource( 'src', 'player.vimeo.com/', 'api=1' );
		_appendParamToIframeSource( 'data-src', 'player.vimeo.com/', 'api=1' );

	}

	/**
	 * Start playback of any embedded content inside of
	 * the given element.
	 *
	 * @param {HTMLElement} slide
	 */
	function startEmbeddedContent( element ) {

		if( element && !isSpeakerNotes() ) {
			// Restart GIFs
			toArray( element.querySelectorAll( 'img[src$=".gif"]' ) ).forEach( function( el ) {
				// Setting the same unchanged source like this was confirmed
				// to work in Chrome, FF & Safari
				el.setAttribute( 'src', el.getAttribute( 'src' ) );
			} );

			// HTML5 media elements
			toArray( element.querySelectorAll( 'video, audio' ) ).forEach( function( el ) {
				if( closestParent( el, '.fragment' ) && !closestParent( el, '.fragment.visible' ) ) {
					return;
				}

				if( el.hasAttribute( 'data-autoplay' ) && typeof el.play === 'function' ) {
					el.play();
				}
			} );

			// Normal iframes
			toArray( element.querySelectorAll( 'iframe[src]' ) ).forEach( function( el ) {
				if( closestParent( el, '.fragment' ) && !closestParent( el, '.fragment.visible' ) ) {
					return;
				}

				startEmbeddedIframe( { target: el } );
			} );

			// Lazy loading iframes
			toArray( element.querySelectorAll( 'iframe[data-src]' ) ).forEach( function( el ) {
				if( closestParent( el, '.fragment' ) && !closestParent( el, '.fragment.visible' ) ) {
					return;
				}

				if( el.getAttribute( 'src' ) !== el.getAttribute( 'data-src' ) ) {
					el.removeEventListener( 'load', startEmbeddedIframe ); // remove first to avoid dupes
					el.addEventListener( 'load', startEmbeddedIframe );
					el.setAttribute( 'src', el.getAttribute( 'data-src' ) );
				}
			} );
		}

	}

	/**
	 * "Starts" the content of an embedded iframe using the
	 * postMessage API.
	 *
	 * @param {object} event - postMessage API event
	 */
	function startEmbeddedIframe( event ) {

		var iframe = event.target;

		if( iframe && iframe.contentWindow ) {

			// YouTube postMessage API
			if( /youtube\.com\/embed\//.test( iframe.getAttribute( 'src' ) ) && iframe.hasAttribute( 'data-autoplay' ) ) {
				iframe.contentWindow.postMessage( '{"event":"command","func":"playVideo","args":""}', '*' );
			}
			// Vimeo postMessage API
			else if( /player\.vimeo\.com\//.test( iframe.getAttribute( 'src' ) ) && iframe.hasAttribute( 'data-autoplay' ) ) {
				iframe.contentWindow.postMessage( '{"method":"play"}', '*' );
			}
			// Generic postMessage API
			else {
				iframe.contentWindow.postMessage( 'slide:start', '*' );
			}

		}

	}

	/**
	 * Stop playback of any embedded content inside of
	 * the targeted slide.
	 *
	 * @param {HTMLElement} slide
	 */
	function stopEmbeddedContent( slide ) {

		if( slide && slide.parentNode ) {
			// HTML5 media elements
			toArray( slide.querySelectorAll( 'video, audio' ) ).forEach( function( el ) {
				if( !el.hasAttribute( 'data-ignore' ) && typeof el.pause === 'function' ) {
					el.pause();
				}
			} );

			// Generic postMessage API for non-lazy loaded iframes
			toArray( slide.querySelectorAll( 'iframe' ) ).forEach( function( el ) {
				el.contentWindow.postMessage( 'slide:stop', '*' );
				el.removeEventListener( 'load', startEmbeddedIframe );
			});

			// YouTube postMessage API
			toArray( slide.querySelectorAll( 'iframe[src*="youtube.com/embed/"]' ) ).forEach( function( el ) {
				if( !el.hasAttribute( 'data-ignore' ) && typeof el.contentWindow.postMessage === 'function' ) {
					el.contentWindow.postMessage( '{"event":"command","func":"pauseVideo","args":""}', '*' );
				}
			});

			// Vimeo postMessage API
			toArray( slide.querySelectorAll( 'iframe[src*="player.vimeo.com/"]' ) ).forEach( function( el ) {
				if( !el.hasAttribute( 'data-ignore' ) && typeof el.contentWindow.postMessage === 'function' ) {
					el.contentWindow.postMessage( '{"method":"pause"}', '*' );
				}
			});

			// Lazy loading iframes
			toArray( slide.querySelectorAll( 'iframe[data-src]' ) ).forEach( function( el ) {
				// Only removing the src doesn't actually unload the frame
				// in all browsers (Firefox) so we set it to blank first
				el.setAttribute( 'src', 'about:blank' );
				el.removeAttribute( 'src' );
			} );
		}

	}

	/**
	 * Returns the number of past slides. This can be used as a global
	 * flattened index for slides.
	 *
	 * @return {number} Past slide count
	 */
	function getSlidePastCount() {

		var horizontalSlides = toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) );

		// The number of past slides
		var pastCount = 0;

		// Step through all slides and count the past ones
		mainLoop: for( var i = 0; i < horizontalSlides.length; i++ ) {

			var horizontalSlide = horizontalSlides[i];
			var verticalSlides = toArray( horizontalSlide.querySelectorAll( 'section' ) );

			for( var j = 0; j < verticalSlides.length; j++ ) {

				// Stop as soon as we arrive at the present
				if( verticalSlides[j].classList.contains( 'present' ) ) {
					break mainLoop;
				}

				pastCount++;

			}

			// Stop as soon as we arrive at the present
			if( horizontalSlide.classList.contains( 'present' ) ) {
				break;
			}

			// Don't count the wrapping section for vertical slides
			if( horizontalSlide.classList.contains( 'stack' ) === false ) {
				pastCount++;
			}

		}

		return pastCount;

	}

	/**
	 * Returns a value ranging from 0-1 that represents
	 * how far into the presentation we have navigated.
	 *
	 * @return {number}
	 */
	function getProgress() {

		// The number of past and total slides
		var totalCount = getTotalSlides();
		var pastCount = getSlidePastCount();

		if( currentSlide ) {

			var allFragments = currentSlide.querySelectorAll( '.fragment' );

			// If there are fragments in the current slide those should be
			// accounted for in the progress.
			if( allFragments.length > 0 ) {
				var visibleFragments = currentSlide.querySelectorAll( '.fragment.visible' );

				// This value represents how big a portion of the slide progress
				// that is made up by its fragments (0-1)
				var fragmentWeight = 0.9;

				// Add fragment progress to the past slide count
				pastCount += ( visibleFragments.length / allFragments.length ) * fragmentWeight;
			}

		}

		return pastCount / ( totalCount - 1 );

	}

	/**
	 * Checks if this presentation is running inside of the
	 * speaker notes window.
	 *
	 * @return {boolean}
	 */
	function isSpeakerNotes() {

		return !!window.location.search.match( /receiver/gi );

	}

	/**
	 * Reads the current URL (hash) and navigates accordingly.
	 */
	function readURL() {

		var hash = window.location.hash;

		// Attempt to parse the hash as either an index or name
		var bits = hash.slice( 2 ).split( '/' ),
			name = hash.replace( /#|\//gi, '' );

		// If the first bit is invalid and there is a name we can
		// assume that this is a named link
		if( isNaN( parseInt( bits[0], 10 ) ) && name.length ) {
			var element;

			// Ensure the named link is a valid HTML ID attribute
			if( /^[a-zA-Z][\w:.-]*$/.test( name ) ) {
				// Find the slide with the specified ID
				element = document.getElementById( name );
			}

			if( element ) {
				// Find the position of the named slide and navigate to it
				var indices = Reveal.getIndices( element );
				slide( indices.h, indices.v );
			}
			// If the slide doesn't exist, navigate to the current slide
			else {
				slide( indexh || 0, indexv || 0 );
			}
		}
		else {
			// Read the index components of the hash
			var h = parseInt( bits[0], 10 ) || 0,
				v = parseInt( bits[1], 10 ) || 0;

			if( h !== indexh || v !== indexv ) {
				slide( h, v );
			}
		}

	}

	/**
	 * Updates the page URL (hash) to reflect the current
	 * state.
	 *
	 * @param {number} delay The time in ms to wait before
	 * writing the hash
	 */
	function writeURL( delay ) {

		if( config.history ) {

			// Make sure there's never more than one timeout running
			clearTimeout( writeURLTimeout );

			// If a delay is specified, timeout this call
			if( typeof delay === 'number' ) {
				writeURLTimeout = setTimeout( writeURL, delay );
			}
			else if( currentSlide ) {
				var url = '/';

				// Attempt to create a named link based on the slide's ID
				var id = currentSlide.getAttribute( 'id' );
				if( id ) {
					id = id.replace( /[^a-zA-Z0-9\-\_\:\.]/g, '' );
				}

				// If the current slide has an ID, use that as a named link
				if( typeof id === 'string' && id.length ) {
					url = '/' + id;
				}
				// Otherwise use the /h/v index
				else {
					if( indexh > 0 || indexv > 0 ) url += indexh;
					if( indexv > 0 ) url += '/' + indexv;
				}

				window.location.hash = url;
			}
		}

	}
	/**
	 * Retrieves the h/v location and fragment of the current,
	 * or specified, slide.
	 *
	 * @param {HTMLElement} [slide] If specified, the returned
	 * index will be for this slide rather than the currently
	 * active one
	 *
	 * @return {{h: number, v: number, f: number}}
	 */
	function getIndices( slide ) {

		// By default, return the current indices
		var h = indexh,
			v = indexv,
			f;

		// If a slide is specified, return the indices of that slide
		if( slide ) {
			var isVertical = isVerticalSlide( slide );
			var slideh = isVertical ? slide.parentNode : slide;

			// Select all horizontal slides
			var horizontalSlides = toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) );

			// Now that we know which the horizontal slide is, get its index
			h = Math.max( horizontalSlides.indexOf( slideh ), 0 );

			// Assume we're not vertical
			v = undefined;

			// If this is a vertical slide, grab the vertical index
			if( isVertical ) {
				v = Math.max( toArray( slide.parentNode.querySelectorAll( 'section' ) ).indexOf( slide ), 0 );
			}
		}

		if( !slide && currentSlide ) {
			var hasFragments = currentSlide.querySelectorAll( '.fragment' ).length > 0;
			if( hasFragments ) {
				var currentFragment = currentSlide.querySelector( '.current-fragment' );
				if( currentFragment && currentFragment.hasAttribute( 'data-fragment-index' ) ) {
					f = parseInt( currentFragment.getAttribute( 'data-fragment-index' ), 10 );
				}
				else {
					f = currentSlide.querySelectorAll( '.fragment.visible' ).length - 1;
				}
			}
		}

		return { h: h, v: v, f: f };

	}

	/**
	 * Retrieves the total number of slides in this presentation.
	 *
	 * @return {number}
	 */
	function getTotalSlides() {

		return dom.wrapper.querySelectorAll( SLIDES_SELECTOR + ':not(.stack)' ).length;

	}

	/**
	 * Returns the slide element matching the specified index.
	 *
	 * @return {HTMLElement}
	 */
	function getSlide( x, y ) {

		var horizontalSlide = dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR )[ x ];
		var verticalSlides = horizontalSlide && horizontalSlide.querySelectorAll( 'section' );

		if( verticalSlides && verticalSlides.length && typeof y === 'number' ) {
			return verticalSlides ? verticalSlides[ y ] : undefined;
		}

		return horizontalSlide;

	}

	/**
	 * Returns the background element for the given slide.
	 * All slides, even the ones with no background properties
	 * defined, have a background element so as long as the
	 * index is valid an element will be returned.
	 *
	 * @param {number} x Horizontal background index
	 * @param {number} y Vertical background index
	 * @return {(HTMLElement[]|*)}
	 */
	function getSlideBackground( x, y ) {

		// When printing to PDF the slide backgrounds are nested
		// inside of the slides
		if( isPrintingPDF() ) {
			var slide = getSlide( x, y );
			if( slide ) {
				return slide.slideBackgroundElement;
			}

			return undefined;
		}

		var horizontalBackground = dom.wrapper.querySelectorAll( '.backgrounds>.slide-background' )[ x ];
		var verticalBackgrounds = horizontalBackground && horizontalBackground.querySelectorAll( '.slide-background' );

		if( verticalBackgrounds && verticalBackgrounds.length && typeof y === 'number' ) {
			return verticalBackgrounds ? verticalBackgrounds[ y ] : undefined;
		}

		return horizontalBackground;

	}

	/**
	 * Retrieves the speaker notes from a slide. Notes can be
	 * defined in two ways:
	 * 1. As a data-notes attribute on the slide <section>
	 * 2. As an <aside class="notes"> inside of the slide
	 *
	 * @param {HTMLElement} [slide=currentSlide]
	 * @return {(string|null)}
	 */
	function getSlideNotes( slide ) {

		// Default to the current slide
		slide = slide || currentSlide;

		// Notes can be specified via the data-notes attribute...
		if( slide.hasAttribute( 'data-notes' ) ) {
			return slide.getAttribute( 'data-notes' );
		}

		// ... or using an <aside class="notes"> element
		var notesElement = slide.querySelector( 'aside.notes' );
		if( notesElement ) {
			return notesElement.innerHTML;
		}

		return null;

	}

	/**
	 * Retrieves the current state of the presentation as
	 * an object. This state can then be restored at any
	 * time.
	 *
	 * @return {{indexh: number, indexv: number, indexf: number, paused: boolean, overview: boolean}}
	 */
	function getState() {

		var indices = getIndices();

		return {
			indexh: indices.h,
			indexv: indices.v,
			indexf: indices.f,
			paused: isPaused(),
			overview: isOverview()
		};

	}

	/**
	 * Restores the presentation to the given state.
	 *
	 * @param {object} state As generated by getState()
	 * @see {@link getState} generates the parameter `state`
	 */
	function setState( state ) {

		if( typeof state === 'object' ) {
			slide( deserialize( state.indexh ), deserialize( state.indexv ), deserialize( state.indexf ) );

			var pausedFlag = deserialize( state.paused ),
				overviewFlag = deserialize( state.overview );

			if( typeof pausedFlag === 'boolean' && pausedFlag !== isPaused() ) {
				togglePause( pausedFlag );
			}

			if( typeof overviewFlag === 'boolean' && overviewFlag !== isOverview() ) {
				toggleOverview( overviewFlag );
			}
		}

	}

	/**
	 * Return a sorted fragments list, ordered by an increasing
	 * "data-fragment-index" attribute.
	 *
	 * Fragments will be revealed in the order that they are returned by
	 * this function, so you can use the index attributes to control the
	 * order of fragment appearance.
	 *
	 * To maintain a sensible default fragment order, fragments are presumed
	 * to be passed in document order. This function adds a "fragment-index"
	 * attribute to each node if such an attribute is not already present,
	 * and sets that attribute to an integer value which is the position of
	 * the fragment within the fragments list.
	 *
	 * @param {object[]|*} fragments
	 * @return {object[]} sorted Sorted array of fragments
	 */
	function sortFragments( fragments ) {

		fragments = toArray( fragments );

		var ordered = [],
			unordered = [],
			sorted = [];

		// Group ordered and unordered elements
		fragments.forEach( function( fragment, i ) {
			if( fragment.hasAttribute( 'data-fragment-index' ) ) {
				var index = parseInt( fragment.getAttribute( 'data-fragment-index' ), 10 );

				if( !ordered[index] ) {
					ordered[index] = [];
				}

				ordered[index].push( fragment );
			}
			else {
				unordered.push( [ fragment ] );
			}
		} );

		// Append fragments without explicit indices in their
		// DOM order
		ordered = ordered.concat( unordered );

		// Manually count the index up per group to ensure there
		// are no gaps
		var index = 0;

		// Push all fragments in their sorted order to an array,
		// this flattens the groups
		ordered.forEach( function( group ) {
			group.forEach( function( fragment ) {
				sorted.push( fragment );
				fragment.setAttribute( 'data-fragment-index', index );
			} );

			index ++;
		} );

		return sorted;

	}

	/**
	 * Navigate to the specified slide fragment.
	 *
	 * @param {?number} index The index of the fragment that
	 * should be shown, -1 means all are invisible
	 * @param {number} offset Integer offset to apply to the
	 * fragment index
	 *
	 * @return {boolean} true if a change was made in any
	 * fragments visibility as part of this call
	 */
	function navigateFragment( index, offset ) {

		if( currentSlide && config.fragments ) {

			var fragments = sortFragments( currentSlide.querySelectorAll( '.fragment' ) );
			if( fragments.length ) {

				// If no index is specified, find the current
				if( typeof index !== 'number' ) {
					var lastVisibleFragment = sortFragments( currentSlide.querySelectorAll( '.fragment.visible' ) ).pop();

					if( lastVisibleFragment ) {
						index = parseInt( lastVisibleFragment.getAttribute( 'data-fragment-index' ) || 0, 10 );
					}
					else {
						index = -1;
					}
				}

				// If an offset is specified, apply it to the index
				if( typeof offset === 'number' ) {
					index += offset;
				}

				var fragmentsShown = [],
					fragmentsHidden = [];

				toArray( fragments ).forEach( function( element, i ) {

					if( element.hasAttribute( 'data-fragment-index' ) ) {
						i = parseInt( element.getAttribute( 'data-fragment-index' ), 10 );
					}

					// Visible fragments
					if( i <= index ) {
						if( !element.classList.contains( 'visible' ) ) fragmentsShown.push( element );
						element.classList.add( 'visible' );
						element.classList.remove( 'current-fragment' );

						// Announce the fragments one by one to the Screen Reader
						dom.statusDiv.textContent = getStatusText( element );

						if( i === index ) {
							element.classList.add( 'current-fragment' );
							startEmbeddedContent( element );
						}
					}
					// Hidden fragments
					else {
						if( element.classList.contains( 'visible' ) ) fragmentsHidden.push( element );
						element.classList.remove( 'visible' );
						element.classList.remove( 'current-fragment' );
					}

				} );

				if( fragmentsHidden.length ) {
					dispatchEvent( 'fragmenthidden', { fragment: fragmentsHidden[0], fragments: fragmentsHidden } );
				}

				if( fragmentsShown.length ) {
					dispatchEvent( 'fragmentshown', { fragment: fragmentsShown[0], fragments: fragmentsShown } );
				}

				updateControls();
				updateProgress();

				return !!( fragmentsShown.length || fragmentsHidden.length );

			}

		}

		return false;

	}

	/**
	 * Navigate to the next slide fragment.
	 *
	 * @return {boolean} true if there was a next fragment,
	 * false otherwise
	 */
	function nextFragment() {

		return navigateFragment( null, 1 );

	}

	/**
	 * Navigate to the previous slide fragment.
	 *
	 * @return {boolean} true if there was a previous fragment,
	 * false otherwise
	 */
	function previousFragment() {

		return navigateFragment( null, -1 );

	}

	/**
	 * Cues a new automated slide if enabled in the config.
	 */
	function cueAutoSlide() {

		cancelAutoSlide();

		if( currentSlide ) {

			var fragment = currentSlide.querySelector( '.current-fragment' );

			// When the slide first appears there is no "current" fragment so
			// we look for a data-autoslide timing on the first fragment
			if( !fragment ) fragment = currentSlide.querySelector( '.fragment' );

			var fragmentAutoSlide = fragment ? fragment.getAttribute( 'data-autoslide' ) : null;
			var parentAutoSlide = currentSlide.parentNode ? currentSlide.parentNode.getAttribute( 'data-autoslide' ) : null;
			var slideAutoSlide = currentSlide.getAttribute( 'data-autoslide' );

			// Pick value in the following priority order:
			// 1. Current fragment's data-autoslide
			// 2. Current slide's data-autoslide
			// 3. Parent slide's data-autoslide
			// 4. Global autoSlide setting
			if( fragmentAutoSlide ) {
				autoSlide = parseInt( fragmentAutoSlide, 10 );
			}
			else if( slideAutoSlide ) {
				autoSlide = parseInt( slideAutoSlide, 10 );
			}
			else if( parentAutoSlide ) {
				autoSlide = parseInt( parentAutoSlide, 10 );
			}
			else {
				autoSlide = config.autoSlide;
			}

			// If there are media elements with data-autoplay,
			// automatically set the autoSlide duration to the
			// length of that media. Not applicable if the slide
			// is divided up into fragments. 
			// playbackRate is accounted for in the duration.
			if( currentSlide.querySelectorAll( '.fragment' ).length === 0 ) {
				toArray( currentSlide.querySelectorAll( 'video, audio' ) ).forEach( function( el ) {
					if( el.hasAttribute( 'data-autoplay' ) ) {
						if( autoSlide && (el.duration * 1000 / el.playbackRate ) > autoSlide ) {
							autoSlide = ( el.duration * 1000 / el.playbackRate ) + 1000;
						}
					}
				} );
			}

			// Cue the next auto-slide if:
			// - There is an autoSlide value
			// - Auto-sliding isn't paused by the user
			// - The presentation isn't paused
			// - The overview isn't active
			// - The presentation isn't over
			if( autoSlide && !autoSlidePaused && !isPaused() && !isOverview() && ( !Reveal.isLastSlide() || availableFragments().next || config.loop === true ) ) {
				autoSlideTimeout = setTimeout( function() {
					typeof config.autoSlideMethod === 'function' ? config.autoSlideMethod() : navigateNext();
					cueAutoSlide();
				}, autoSlide );
				autoSlideStartTime = Date.now();
			}

			if( autoSlidePlayer ) {
				autoSlidePlayer.setPlaying( autoSlideTimeout !== -1 );
			}

		}

	}

	/**
	 * Cancels any ongoing request to auto-slide.
	 */
	function cancelAutoSlide() {

		clearTimeout( autoSlideTimeout );
		autoSlideTimeout = -1;

	}

	function pauseAutoSlide() {

		if( autoSlide && !autoSlidePaused ) {
			autoSlidePaused = true;
			dispatchEvent( 'autoslidepaused' );
			clearTimeout( autoSlideTimeout );

			if( autoSlidePlayer ) {
				autoSlidePlayer.setPlaying( false );
			}
		}

	}

	function resumeAutoSlide() {

		if( autoSlide && autoSlidePaused ) {
			autoSlidePaused = false;
			dispatchEvent( 'autoslideresumed' );
			cueAutoSlide();
		}

	}

	function navigateLeft() {

		// Reverse for RTL
		if( config.rtl ) {
			if( ( isOverview() || nextFragment() === false ) && availableRoutes().left ) {
				slide( indexh + 1 );
			}
		}
		// Normal navigation
		else if( ( isOverview() || previousFragment() === false ) && availableRoutes().left ) {
			slide( indexh - 1 );
		}

	}

	function navigateRight() {

		// Reverse for RTL
		if( config.rtl ) {
			if( ( isOverview() || previousFragment() === false ) && availableRoutes().right ) {
				slide( indexh - 1 );
			}
		}
		// Normal navigation
		else if( ( isOverview() || nextFragment() === false ) && availableRoutes().right ) {
			slide( indexh + 1 );
		}

	}

	function navigateUp() {

		// Prioritize hiding fragments
		if( ( isOverview() || previousFragment() === false ) && availableRoutes().up ) {
			slide( indexh, indexv - 1 );
		}

	}

	function navigateDown() {

		// Prioritize revealing fragments
		if( ( isOverview() || nextFragment() === false ) && availableRoutes().down ) {
			slide( indexh, indexv + 1 );
		}

	}

	/**
	 * Navigates backwards, prioritized in the following order:
	 * 1) Previous fragment
	 * 2) Previous vertical slide
	 * 3) Previous horizontal slide
	 */
	function navigatePrev() {

		// Prioritize revealing fragments
		if( previousFragment() === false ) {
			if( availableRoutes().up ) {
				navigateUp();
			}
			else {
				// Fetch the previous horizontal slide, if there is one
				var previousSlide;

				if( config.rtl ) {
					previousSlide = toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR + '.future' ) ).pop();
				}
				else {
					previousSlide = toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR + '.past' ) ).pop();
				}

				if( previousSlide ) {
					var v = ( previousSlide.querySelectorAll( 'section' ).length - 1 ) || undefined;
					var h = indexh - 1;
					slide( h, v );
				}
			}
		}

	}

	/**
	 * The reverse of #navigatePrev().
	 */
	function navigateNext() {

		// Prioritize revealing fragments
		if( nextFragment() === false ) {
			if( availableRoutes().down ) {
				navigateDown();
			}
			else if( config.rtl ) {
				navigateLeft();
			}
			else {
				navigateRight();
			}
		}

	}

	/**
	 * Checks if the target element prevents the triggering of
	 * swipe navigation.
	 */
	function isSwipePrevented( target ) {

		while( target && typeof target.hasAttribute === 'function' ) {
			if( target.hasAttribute( 'data-prevent-swipe' ) ) return true;
			target = target.parentNode;
		}

		return false;

	}


	// --------------------------------------------------------------------//
	// ----------------------------- EVENTS -------------------------------//
	// --------------------------------------------------------------------//

	/**
	 * Called by all event handlers that are based on user
	 * input.
	 *
	 * @param {object} [event]
	 */
	function onUserInput( event ) {

		if( config.autoSlideStoppable ) {
			pauseAutoSlide();
		}

	}

	/**
	 * Handler for the document level 'keypress' event.
	 *
	 * @param {object} event
	 */
	function onDocumentKeyPress( event ) {

		// Check if the pressed key is question mark
		if( event.shiftKey && event.charCode === 63 ) {
			if( dom.overlay ) {
				closeOverlay();
			}
			else {
				showHelp( true );
			}
		}

	}

	/**
	 * Handler for the document level 'keydown' event.
	 *
	 * @param {object} event
	 */
	function onDocumentKeyDown( event ) {

		// If there's a condition specified and it returns false,
		// ignore this event
		if( typeof config.keyboardCondition === 'function' && config.keyboardCondition() === false ) {
			return true;
		}

		// Remember if auto-sliding was paused so we can toggle it
		var autoSlideWasPaused = autoSlidePaused;

		onUserInput( event );

		// Check if there's a focused element that could be using
		// the keyboard
		var activeElementIsCE = document.activeElement && document.activeElement.contentEditable !== 'inherit';
		var activeElementIsInput = document.activeElement && document.activeElement.tagName && /input|textarea/i.test( document.activeElement.tagName );
		var activeElementIsNotes = document.activeElement && document.activeElement.className && /speaker-notes/i.test( document.activeElement.className);

		// Disregard the event if there's a focused element or a
		// keyboard modifier key is present
		if( activeElementIsCE || activeElementIsInput || activeElementIsNotes || (event.shiftKey && event.keyCode !== 32) || event.altKey || event.ctrlKey || event.metaKey ) return;

		// While paused only allow resume keyboard events; 'b', 'v', '.'
		var resumeKeyCodes = [66,86,190,191];
		var key;

		// Custom key bindings for togglePause should be able to resume
		if( typeof config.keyboard === 'object' ) {
			for( key in config.keyboard ) {
				if( config.keyboard[key] === 'togglePause' ) {
					resumeKeyCodes.push( parseInt( key, 10 ) );
				}
			}
		}

		if( isPaused() && resumeKeyCodes.indexOf( event.keyCode ) === -1 ) {
			return false;
		}

		var triggered = false;

		// 1. User defined key bindings
		if( typeof config.keyboard === 'object' ) {

			for( key in config.keyboard ) {

				// Check if this binding matches the pressed key
				if( parseInt( key, 10 ) === event.keyCode ) {

					var value = config.keyboard[ key ];

					// Callback function
					if( typeof value === 'function' ) {
						value.apply( null, [ event ] );
					}
					// String shortcuts to reveal.js API
					else if( typeof value === 'string' && typeof Reveal[ value ] === 'function' ) {
						Reveal[ value ].call();
					}

					triggered = true;

				}

			}

		}

		// 2. System defined key bindings
		if( triggered === false ) {

			// Assume true and try to prove false
			triggered = true;

			switch( event.keyCode ) {
				// p, page up
				case 80: case 33: navigatePrev(); break;
				// n, page down
				case 78: case 34: navigateNext(); break;
				// h, left
				case 72: case 37: navigateLeft(); break;
				// l, right
				case 76: case 39: navigateRight(); break;
				// k, up
				case 75: case 38: navigateUp(); break;
				// j, down
				case 74: case 40: navigateDown(); break;
				// home
				case 36: slide( 0 ); break;
				// end
				case 35: slide( Number.MAX_VALUE ); break;
				// space
				case 32: isOverview() ? deactivateOverview() : event.shiftKey ? navigatePrev() : navigateNext(); break;
				// return
				case 13: isOverview() ? deactivateOverview() : triggered = false; break;
				// two-spot, semicolon, b, v, period, Logitech presenter tools "black screen" button
				case 58: case 59: case 66: case 86: case 190: case 191: togglePause(); break;
				// f
				case 70: enterFullscreen(); break;
				// a
				case 65: if ( config.autoSlideStoppable ) toggleAutoSlide( autoSlideWasPaused ); break;
				default:
					triggered = false;
			}

		}

		// If the input resulted in a triggered action we should prevent
		// the browsers default behavior
		if( triggered ) {
			event.preventDefault && event.preventDefault();
		}
		// ESC or O key
		else if ( ( event.keyCode === 27 || event.keyCode === 79 ) && features.transforms3d ) {
			if( dom.overlay ) {
				closeOverlay();
			}
			else {
				toggleOverview();
			}

			event.preventDefault && event.preventDefault();
		}

		// If auto-sliding is enabled we need to cue up
		// another timeout
		cueAutoSlide();

	}

	/**
	 * Handler for the 'touchstart' event, enables support for
	 * swipe and pinch gestures.
	 *
	 * @param {object} event
	 */
	function onTouchStart( event ) {

		if( isSwipePrevented( event.target ) ) return true;

		touch.startX = event.touches[0].clientX;
		touch.startY = event.touches[0].clientY;
		touch.startCount = event.touches.length;

		// If there's two touches we need to memorize the distance
		// between those two points to detect pinching
		if( event.touches.length === 2 && config.overview ) {
			touch.startSpan = distanceBetween( {
				x: event.touches[1].clientX,
				y: event.touches[1].clientY
			}, {
				x: touch.startX,
				y: touch.startY
			} );
		}

	}

	/**
	 * Handler for the 'touchmove' event.
	 *
	 * @param {object} event
	 */
	function onTouchMove( event ) {

		if( isSwipePrevented( event.target ) ) return true;

		// Each touch should only trigger one action
		if( !touch.captured ) {
			onUserInput( event );

			var currentX = event.touches[0].clientX;
			var currentY = event.touches[0].clientY;

			// If the touch started with two points and still has
			// two active touches; test for the pinch gesture
			if( event.touches.length === 2 && touch.startCount === 2 && config.overview ) {

				// The current distance in pixels between the two touch points
				var currentSpan = distanceBetween( {
					x: event.touches[1].clientX,
					y: event.touches[1].clientY
				}, {
					x: touch.startX,
					y: touch.startY
				} );

				// If the span is larger than the desire amount we've got
				// ourselves a pinch
				if( Math.abs( touch.startSpan - currentSpan ) > touch.threshold ) {
					touch.captured = true;

					if( currentSpan < touch.startSpan ) {
						activateOverview();
					}
					else {
						deactivateOverview();
					}
				}

				event.preventDefault();

			}
			// There was only one touch point, look for a swipe
			else if( event.touches.length === 1 && touch.startCount !== 2 ) {

				var deltaX = currentX - touch.startX,
					deltaY = currentY - touch.startY;

				if( deltaX > touch.threshold && Math.abs( deltaX ) > Math.abs( deltaY ) ) {
					touch.captured = true;
					navigateLeft();
				}
				else if( deltaX < -touch.threshold && Math.abs( deltaX ) > Math.abs( deltaY ) ) {
					touch.captured = true;
					navigateRight();
				}
				else if( deltaY > touch.threshold ) {
					touch.captured = true;
					navigateUp();
				}
				else if( deltaY < -touch.threshold ) {
					touch.captured = true;
					navigateDown();
				}

				// If we're embedded, only block touch events if they have
				// triggered an action
				if( config.embedded ) {
					if( touch.captured || isVerticalSlide( currentSlide ) ) {
						event.preventDefault();
					}
				}
				// Not embedded? Block them all to avoid needless tossing
				// around of the viewport in iOS
				else {
					event.preventDefault();
				}

			}
		}
		// There's a bug with swiping on some Android devices unless
		// the default action is always prevented
		else if( UA.match( /android/gi ) ) {
			event.preventDefault();
		}

	}

	/**
	 * Handler for the 'touchend' event.
	 *
	 * @param {object} event
	 */
	function onTouchEnd( event ) {

		touch.captured = false;

	}

	/**
	 * Convert pointer down to touch start.
	 *
	 * @param {object} event
	 */
	function onPointerDown( event ) {

		if( event.pointerType === event.MSPOINTER_TYPE_TOUCH || event.pointerType === "touch" ) {
			event.touches = [{ clientX: event.clientX, clientY: event.clientY }];
			onTouchStart( event );
		}

	}

	/**
	 * Convert pointer move to touch move.
	 *
	 * @param {object} event
	 */
	function onPointerMove( event ) {

		if( event.pointerType === event.MSPOINTER_TYPE_TOUCH || event.pointerType === "touch" )  {
			event.touches = [{ clientX: event.clientX, clientY: event.clientY }];
			onTouchMove( event );
		}

	}

	/**
	 * Convert pointer up to touch end.
	 *
	 * @param {object} event
	 */
	function onPointerUp( event ) {

		if( event.pointerType === event.MSPOINTER_TYPE_TOUCH || event.pointerType === "touch" )  {
			event.touches = [{ clientX: event.clientX, clientY: event.clientY }];
			onTouchEnd( event );
		}

	}

	/**
	 * Handles mouse wheel scrolling, throttled to avoid skipping
	 * multiple slides.
	 *
	 * @param {object} event
	 */
	function onDocumentMouseScroll( event ) {

		if( Date.now() - lastMouseWheelStep > 600 ) {

			lastMouseWheelStep = Date.now();

			var delta = event.detail || -event.wheelDelta;
			if( delta > 0 ) {
				navigateNext();
			}
			else if( delta < 0 ) {
				navigatePrev();
			}

		}

	}

	/**
	 * Clicking on the progress bar results in a navigation to the
	 * closest approximate horizontal slide using this equation:
	 *
	 * ( clickX / presentationWidth ) * numberOfSlides
	 *
	 * @param {object} event
	 */
	function onProgressClicked( event ) {

		onUserInput( event );

		event.preventDefault();

		var slidesTotal = toArray( dom.wrapper.querySelectorAll( HORIZONTAL_SLIDES_SELECTOR ) ).length;
		var slideIndex = Math.floor( ( event.clientX / dom.wrapper.offsetWidth ) * slidesTotal );

		if( config.rtl ) {
			slideIndex = slidesTotal - slideIndex;
		}

		slide( slideIndex );

	}

	/**
	 * Event handler for navigation control buttons.
	 */
	function onNavigateLeftClicked( event ) { event.preventDefault(); onUserInput(); navigateLeft(); }
	function onNavigateRightClicked( event ) { event.preventDefault(); onUserInput(); navigateRight(); }
	function onNavigateUpClicked( event ) { event.preventDefault(); onUserInput(); navigateUp(); }
	function onNavigateDownClicked( event ) { event.preventDefault(); onUserInput(); navigateDown(); }
	function onNavigatePrevClicked( event ) { event.preventDefault(); onUserInput(); navigatePrev(); }
	function onNavigateNextClicked( event ) { event.preventDefault(); onUserInput(); navigateNext(); }

	/**
	 * Handler for the window level 'hashchange' event.
	 *
	 * @param {object} [event]
	 */
	function onWindowHashChange( event ) {

		readURL();

	}

	/**
	 * Handler for the window level 'resize' event.
	 *
	 * @param {object} [event]
	 */
	function onWindowResize( event ) {

		layout();

	}

	/**
	 * Handle for the window level 'visibilitychange' event.
	 *
	 * @param {object} [event]
	 */
	function onPageVisibilityChange( event ) {

		var isHidden =  document.webkitHidden ||
						document.msHidden ||
						document.hidden;

		// If, after clicking a link or similar and we're coming back,
		// focus the document.body to ensure we can use keyboard shortcuts
		if( isHidden === false && document.activeElement !== document.body ) {
			// Not all elements support .blur() - SVGs among them.
			if( typeof document.activeElement.blur === 'function' ) {
				document.activeElement.blur();
			}
			document.body.focus();
		}

	}

	/**
	 * Invoked when a slide is and we're in the overview.
	 *
	 * @param {object} event
	 */
	function onOverviewSlideClicked( event ) {

		// TODO There's a bug here where the event listeners are not
		// removed after deactivating the overview.
		if( eventsAreBound && isOverview() ) {
			event.preventDefault();

			var element = event.target;

			while( element && !element.nodeName.match( /section/gi ) ) {
				element = element.parentNode;
			}

			if( element && !element.classList.contains( 'disabled' ) ) {

				deactivateOverview();

				if( element.nodeName.match( /section/gi ) ) {
					var h = parseInt( element.getAttribute( 'data-index-h' ), 10 ),
						v = parseInt( element.getAttribute( 'data-index-v' ), 10 );

					slide( h, v );
				}

			}
		}

	}

	/**
	 * Handles clicks on links that are set to preview in the
	 * iframe overlay.
	 *
	 * @param {object} event
	 */
	function onPreviewLinkClicked( event ) {

		if( event.currentTarget && event.currentTarget.hasAttribute( 'href' ) ) {
			var url = event.currentTarget.getAttribute( 'href' );
			if( url ) {
				showPreview( url );
				event.preventDefault();
			}
		}

	}

	/**
	 * Handles click on the auto-sliding controls element.
	 *
	 * @param {object} [event]
	 */
	function onAutoSlidePlayerClick( event ) {

		// Replay
		if( Reveal.isLastSlide() && config.loop === false ) {
			slide( 0, 0 );
			resumeAutoSlide();
		}
		// Resume
		else if( autoSlidePaused ) {
			resumeAutoSlide();
		}
		// Pause
		else {
			pauseAutoSlide();
		}

	}


	// --------------------------------------------------------------------//
	// ------------------------ PLAYBACK COMPONENT ------------------------//
	// --------------------------------------------------------------------//


	/**
	 * Constructor for the playback component, which displays
	 * play/pause/progress controls.
	 *
	 * @param {HTMLElement} container The component will append
	 * itself to this
	 * @param {function} progressCheck A method which will be
	 * called frequently to get the current progress on a range
	 * of 0-1
	 */
	function Playback( container, progressCheck ) {

		// Cosmetics
		this.diameter = 100;
		this.diameter2 = this.diameter/2;
		this.thickness = 6;

		// Flags if we are currently playing
		this.playing = false;

		// Current progress on a 0-1 range
		this.progress = 0;

		// Used to loop the animation smoothly
		this.progressOffset = 1;

		this.container = container;
		this.progressCheck = progressCheck;

		this.canvas = document.createElement( 'canvas' );
		this.canvas.className = 'playback';
		this.canvas.width = this.diameter;
		this.canvas.height = this.diameter;
		this.canvas.style.width = this.diameter2 + 'px';
		this.canvas.style.height = this.diameter2 + 'px';
		this.context = this.canvas.getContext( '2d' );

		this.container.appendChild( this.canvas );

		this.render();

	}

	/**
	 * @param value
	 */
	Playback.prototype.setPlaying = function( value ) {

		var wasPlaying = this.playing;

		this.playing = value;

		// Start repainting if we weren't already
		if( !wasPlaying && this.playing ) {
			this.animate();
		}
		else {
			this.render();
		}

	};

	Playback.prototype.animate = function() {

		var progressBefore = this.progress;

		this.progress = this.progressCheck();

		// When we loop, offset the progress so that it eases
		// smoothly rather than immediately resetting
		if( progressBefore > 0.8 && this.progress < 0.2 ) {
			this.progressOffset = this.progress;
		}

		this.render();

		if( this.playing ) {
			features.requestAnimationFrameMethod.call( window, this.animate.bind( this ) );
		}

	};

	/**
	 * Renders the current progress and playback state.
	 */
	Playback.prototype.render = function() {

		var progress = this.playing ? this.progress : 0,
			radius = ( this.diameter2 ) - this.thickness,
			x = this.diameter2,
			y = this.diameter2,
			iconSize = 28;

		// Ease towards 1
		this.progressOffset += ( 1 - this.progressOffset ) * 0.1;

		var endAngle = ( - Math.PI / 2 ) + ( progress * ( Math.PI * 2 ) );
		var startAngle = ( - Math.PI / 2 ) + ( this.progressOffset * ( Math.PI * 2 ) );

		this.context.save();
		this.context.clearRect( 0, 0, this.diameter, this.diameter );

		// Solid background color
		this.context.beginPath();
		this.context.arc( x, y, radius + 4, 0, Math.PI * 2, false );
		this.context.fillStyle = 'rgba( 0, 0, 0, 0.4 )';
		this.context.fill();

		// Draw progress track
		this.context.beginPath();
		this.context.arc( x, y, radius, 0, Math.PI * 2, false );
		this.context.lineWidth = this.thickness;
		this.context.strokeStyle = '#666';
		this.context.stroke();

		if( this.playing ) {
			// Draw progress on top of track
			this.context.beginPath();
			this.context.arc( x, y, radius, startAngle, endAngle, false );
			this.context.lineWidth = this.thickness;
			this.context.strokeStyle = '#fff';
			this.context.stroke();
		}

		this.context.translate( x - ( iconSize / 2 ), y - ( iconSize / 2 ) );

		// Draw play/pause icons
		if( this.playing ) {
			this.context.fillStyle = '#fff';
			this.context.fillRect( 0, 0, iconSize / 2 - 4, iconSize );
			this.context.fillRect( iconSize / 2 + 4, 0, iconSize / 2 - 4, iconSize );
		}
		else {
			this.context.beginPath();
			this.context.translate( 4, 0 );
			this.context.moveTo( 0, 0 );
			this.context.lineTo( iconSize - 4, iconSize / 2 );
			this.context.lineTo( 0, iconSize );
			this.context.fillStyle = '#fff';
			this.context.fill();
		}

		this.context.restore();

	};

	Playback.prototype.on = function( type, listener ) {
		this.canvas.addEventListener( type, listener, false );
	};

	Playback.prototype.off = function( type, listener ) {
		this.canvas.removeEventListener( type, listener, false );
	};

	Playback.prototype.destroy = function() {

		this.playing = false;

		if( this.canvas.parentNode ) {
			this.container.removeChild( this.canvas );
		}

	};


	// --------------------------------------------------------------------//
	// ------------------------------- API --------------------------------//
	// --------------------------------------------------------------------//


	Reveal = {
		VERSION: VERSION,

		initialize: initialize,
		configure: configure,
		sync: sync,

		// Navigation methods
		slide: slide,
		left: navigateLeft,
		right: navigateRight,
		up: navigateUp,
		down: navigateDown,
		prev: navigatePrev,
		next: navigateNext,

		// Fragment methods
		navigateFragment: navigateFragment,
		prevFragment: previousFragment,
		nextFragment: nextFragment,

		// Deprecated aliases
		navigateTo: slide,
		navigateLeft: navigateLeft,
		navigateRight: navigateRight,
		navigateUp: navigateUp,
		navigateDown: navigateDown,
		navigatePrev: navigatePrev,
		navigateNext: navigateNext,

		// Shows a help overlay with keyboard shortcuts
		showHelp: showHelp,

		// Forces an update in slide layout
		layout: layout,

		// Randomizes the order of slides
		shuffle: shuffle,

		// Returns an object with the available routes as booleans (left/right/top/bottom)
		availableRoutes: availableRoutes,

		// Returns an object with the available fragments as booleans (prev/next)
		availableFragments: availableFragments,

		// Toggles the overview mode on/off
		toggleOverview: toggleOverview,

		// Toggles the "black screen" mode on/off
		togglePause: togglePause,

		// Toggles the auto slide mode on/off
		toggleAutoSlide: toggleAutoSlide,

		// State checks
		isOverview: isOverview,
		isPaused: isPaused,
		isAutoSliding: isAutoSliding,

		// Adds or removes all internal event listeners (such as keyboard)
		addEventListeners: addEventListeners,
		removeEventListeners: removeEventListeners,

		// Facility for persisting and restoring the presentation state
		getState: getState,
		setState: setState,

		// Presentation progress on range of 0-1
		getProgress: getProgress,

		// Returns the indices of the current, or specified, slide
		getIndices: getIndices,

		getTotalSlides: getTotalSlides,

		// Returns the slide element at the specified index
		getSlide: getSlide,

		// Returns the slide background element at the specified index
		getSlideBackground: getSlideBackground,

		// Returns the speaker notes string for a slide, or null
		getSlideNotes: getSlideNotes,

		// Returns the previous slide element, may be null
		getPreviousSlide: function() {
			return previousSlide;
		},

		// Returns the current slide element
		getCurrentSlide: function() {
			return currentSlide;
		},

		// Returns the current scale of the presentation content
		getScale: function() {
			return scale;
		},

		// Returns the current configuration object
		getConfig: function() {
			return config;
		},

		// Helper method, retrieves query string as a key/value hash
		getQueryHash: function() {
			var query = {};

			location.search.replace( /[A-Z0-9]+?=([\w\.%-]*)/gi, function(a) {
				query[ a.split( '=' ).shift() ] = a.split( '=' ).pop();
			} );

			// Basic deserialization
			for( var i in query ) {
				var value = query[ i ];

				query[ i ] = deserialize( unescape( value ) );
			}

			return query;
		},

		// Returns true if we're currently on the first slide
		isFirstSlide: function() {
			return ( indexh === 0 && indexv === 0 );
		},

		// Returns true if we're currently on the last slide
		isLastSlide: function() {
			if( currentSlide ) {
				// Does this slide has next a sibling?
				if( currentSlide.nextElementSibling ) return false;

				// If it's vertical, does its parent have a next sibling?
				if( isVerticalSlide( currentSlide ) && currentSlide.parentNode.nextElementSibling ) return false;

				return true;
			}

			return false;
		},

		// Checks if reveal.js has been loaded and is ready for use
		isReady: function() {
			return loaded;
		},

		// Forward event binding to the reveal DOM element
		addEventListener: function( type, listener, useCapture ) {
			if( 'addEventListener' in window ) {
				( dom.wrapper || document.querySelector( '.reveal' ) ).addEventListener( type, listener, useCapture );
			}
		},
		removeEventListener: function( type, listener, useCapture ) {
			if( 'addEventListener' in window ) {
				( dom.wrapper || document.querySelector( '.reveal' ) ).removeEventListener( type, listener, useCapture );
			}
		},

		// Programatically triggers a keyboard event
		triggerKey: function( keyCode ) {
			onDocumentKeyDown( { keyCode: keyCode } );
		},

		// Registers a new shortcut to include in the help overlay
		registerKeyboardShortcut: function( key, value ) {
			keyboardShortcuts[key] = value;
		}
	};

	return Reveal;

}));

},{}],3:[function(require,module,exports){
/*! head.core - v1.0.2 */
(function(n,t){"use strict";function r(n){a[a.length]=n}function k(n){var t=new RegExp(" ?\\b"+n+"\\b");c.className=c.className.replace(t,"")}function p(n,t){for(var i=0,r=n.length;i<r;i++)t.call(n,n[i],i)}function tt(){var t,e,f,o;c.className=c.className.replace(/ (w-|eq-|gt-|gte-|lt-|lte-|portrait|no-portrait|landscape|no-landscape)\d+/g,"");t=n.innerWidth||c.clientWidth;e=n.outerWidth||n.screen.width;u.screen.innerWidth=t;u.screen.outerWidth=e;r("w-"+t);p(i.screens,function(n){t>n?(i.screensCss.gt&&r("gt-"+n),i.screensCss.gte&&r("gte-"+n)):t<n?(i.screensCss.lt&&r("lt-"+n),i.screensCss.lte&&r("lte-"+n)):t===n&&(i.screensCss.lte&&r("lte-"+n),i.screensCss.eq&&r("e-q"+n),i.screensCss.gte&&r("gte-"+n))});f=n.innerHeight||c.clientHeight;o=n.outerHeight||n.screen.height;u.screen.innerHeight=f;u.screen.outerHeight=o;u.feature("portrait",f>t);u.feature("landscape",f<t)}function it(){n.clearTimeout(b);b=n.setTimeout(tt,50)}var y=n.document,rt=n.navigator,ut=n.location,c=y.documentElement,a=[],i={screens:[240,320,480,640,768,800,1024,1280,1440,1680,1920],screensCss:{gt:!0,gte:!1,lt:!0,lte:!1,eq:!1},browsers:[{ie:{min:6,max:11}}],browserCss:{gt:!0,gte:!1,lt:!0,lte:!1,eq:!0},html5:!0,page:"-page",section:"-section",head:"head"},v,u,s,w,o,h,l,d,f,g,nt,e,b;if(n.head_conf)for(v in n.head_conf)n.head_conf[v]!==t&&(i[v]=n.head_conf[v]);u=n[i.head]=function(){u.ready.apply(null,arguments)};u.feature=function(n,t,i){return n?(Object.prototype.toString.call(t)==="[object Function]"&&(t=t.call()),r((t?"":"no-")+n),u[n]=!!t,i||(k("no-"+n),k(n),u.feature()),u):(c.className+=" "+a.join(" "),a=[],u)};u.feature("js",!0);s=rt.userAgent.toLowerCase();w=/mobile|android|kindle|silk|midp|phone|(windows .+arm|touch)/.test(s);u.feature("mobile",w,!0);u.feature("desktop",!w,!0);s=/(chrome|firefox)[ \/]([\w.]+)/.exec(s)||/(iphone|ipad|ipod)(?:.*version)?[ \/]([\w.]+)/.exec(s)||/(android)(?:.*version)?[ \/]([\w.]+)/.exec(s)||/(webkit|opera)(?:.*version)?[ \/]([\w.]+)/.exec(s)||/(msie) ([\w.]+)/.exec(s)||/(trident).+rv:(\w.)+/.exec(s)||[];o=s[1];h=parseFloat(s[2]);switch(o){case"msie":case"trident":o="ie";h=y.documentMode||h;break;case"firefox":o="ff";break;case"ipod":case"ipad":case"iphone":o="ios";break;case"webkit":o="safari"}for(u.browser={name:o,version:h},u.browser[o]=!0,l=0,d=i.browsers.length;l<d;l++)for(f in i.browsers[l])if(o===f)for(r(f),g=i.browsers[l][f].min,nt=i.browsers[l][f].max,e=g;e<=nt;e++)h>e?(i.browserCss.gt&&r("gt-"+f+e),i.browserCss.gte&&r("gte-"+f+e)):h<e?(i.browserCss.lt&&r("lt-"+f+e),i.browserCss.lte&&r("lte-"+f+e)):h===e&&(i.browserCss.lte&&r("lte-"+f+e),i.browserCss.eq&&r("eq-"+f+e),i.browserCss.gte&&r("gte-"+f+e));else r("no-"+f);r(o);r(o+parseInt(h,10));i.html5&&o==="ie"&&h<9&&p("abbr|article|aside|audio|canvas|details|figcaption|figure|footer|header|hgroup|main|mark|meter|nav|output|progress|section|summary|time|video".split("|"),function(n){y.createElement(n)});p(ut.pathname.split("/"),function(n,u){if(this.length>2&&this[u+1]!==t)u&&r(this.slice(u,u+1).join("-").toLowerCase()+i.section);else{var f=n||"index",e=f.indexOf(".");e>0&&(f=f.substring(0,e));c.id=f.toLowerCase()+i.page;u||r("root"+i.section)}});u.screen={height:n.screen.height,width:n.screen.width};tt();b=0;n.addEventListener?n.addEventListener("resize",it,!1):n.attachEvent("onresize",it)})(window);
/*! head.css3 - v1.0.0 */
(function(n,t){"use strict";function a(n){for(var r in n)if(i[n[r]]!==t)return!0;return!1}function r(n){var t=n.charAt(0).toUpperCase()+n.substr(1),i=(n+" "+c.join(t+" ")+t).split(" ");return!!a(i)}var h=n.document,o=h.createElement("i"),i=o.style,s=" -o- -moz- -ms- -webkit- -khtml- ".split(" "),c="Webkit Moz O ms Khtml".split(" "),l=n.head_conf&&n.head_conf.head||"head",u=n[l],f={gradient:function(){var n="background-image:";return i.cssText=(n+s.join("gradient(linear,left top,right bottom,from(#9f9),to(#fff));"+n)+s.join("linear-gradient(left top,#eee,#fff);"+n)).slice(0,-n.length),!!i.backgroundImage},rgba:function(){return i.cssText="background-color:rgba(0,0,0,0.5)",!!i.backgroundColor},opacity:function(){return o.style.opacity===""},textshadow:function(){return i.textShadow===""},multiplebgs:function(){i.cssText="background:url(https://),url(https://),red url(https://)";var n=(i.background||"").match(/url/g);return Object.prototype.toString.call(n)==="[object Array]"&&n.length===3},boxshadow:function(){return r("boxShadow")},borderimage:function(){return r("borderImage")},borderradius:function(){return r("borderRadius")},cssreflections:function(){return r("boxReflect")},csstransforms:function(){return r("transform")},csstransitions:function(){return r("transition")},touch:function(){return"ontouchstart"in n},retina:function(){return n.devicePixelRatio>1},fontface:function(){var t=u.browser.name,n=u.browser.version;switch(t){case"ie":return n>=9;case"chrome":return n>=13;case"ff":return n>=6;case"ios":return n>=5;case"android":return!1;case"webkit":return n>=5.1;case"opera":return n>=10;default:return!1}}};for(var e in f)f[e]&&u.feature(e,f[e].call(),!0);u.feature()})(window);
/*! head.load - v1.0.3 */
(function(n,t){"use strict";function w(){}function u(n,t){if(n){typeof n=="object"&&(n=[].slice.call(n));for(var i=0,r=n.length;i<r;i++)t.call(n,n[i],i)}}function it(n,i){var r=Object.prototype.toString.call(i).slice(8,-1);return i!==t&&i!==null&&r===n}function s(n){return it("Function",n)}function a(n){return it("Array",n)}function et(n){var i=n.split("/"),t=i[i.length-1],r=t.indexOf("?");return r!==-1?t.substring(0,r):t}function f(n){(n=n||w,n._done)||(n(),n._done=1)}function ot(n,t,r,u){var f=typeof n=="object"?n:{test:n,success:!t?!1:a(t)?t:[t],failure:!r?!1:a(r)?r:[r],callback:u||w},e=!!f.test;return e&&!!f.success?(f.success.push(f.callback),i.load.apply(null,f.success)):e||!f.failure?u():(f.failure.push(f.callback),i.load.apply(null,f.failure)),i}function v(n){var t={},i,r;if(typeof n=="object")for(i in n)!n[i]||(t={name:i,url:n[i]});else t={name:et(n),url:n};return(r=c[t.name],r&&r.url===t.url)?r:(c[t.name]=t,t)}function y(n){n=n||c;for(var t in n)if(n.hasOwnProperty(t)&&n[t].state!==l)return!1;return!0}function st(n){n.state=ft;u(n.onpreload,function(n){n.call()})}function ht(n){n.state===t&&(n.state=nt,n.onpreload=[],rt({url:n.url,type:"cache"},function(){st(n)}))}function ct(){var n=arguments,t=n[n.length-1],r=[].slice.call(n,1),f=r[0];return(s(t)||(t=null),a(n[0]))?(n[0].push(t),i.load.apply(null,n[0]),i):(f?(u(r,function(n){s(n)||!n||ht(v(n))}),b(v(n[0]),s(f)?f:function(){i.load.apply(null,r)})):b(v(n[0])),i)}function lt(){var n=arguments,t=n[n.length-1],r={};return(s(t)||(t=null),a(n[0]))?(n[0].push(t),i.load.apply(null,n[0]),i):(u(n,function(n){n!==t&&(n=v(n),r[n.name]=n)}),u(n,function(n){n!==t&&(n=v(n),b(n,function(){y(r)&&f(t)}))}),i)}function b(n,t){if(t=t||w,n.state===l){t();return}if(n.state===tt){i.ready(n.name,t);return}if(n.state===nt){n.onpreload.push(function(){b(n,t)});return}n.state=tt;rt(n,function(){n.state=l;t();u(h[n.name],function(n){f(n)});o&&y()&&u(h.ALL,function(n){f(n)})})}function at(n){n=n||"";var t=n.split("?")[0].split(".");return t[t.length-1].toLowerCase()}function rt(t,i){function e(t){t=t||n.event;u.onload=u.onreadystatechange=u.onerror=null;i()}function o(f){f=f||n.event;(f.type==="load"||/loaded|complete/.test(u.readyState)&&(!r.documentMode||r.documentMode<9))&&(n.clearTimeout(t.errorTimeout),n.clearTimeout(t.cssTimeout),u.onload=u.onreadystatechange=u.onerror=null,i())}function s(){if(t.state!==l&&t.cssRetries<=20){for(var i=0,f=r.styleSheets.length;i<f;i++)if(r.styleSheets[i].href===u.href){o({type:"load"});return}t.cssRetries++;t.cssTimeout=n.setTimeout(s,250)}}var u,h,f;i=i||w;h=at(t.url);h==="css"?(u=r.createElement("link"),u.type="text/"+(t.type||"css"),u.rel="stylesheet",u.href=t.url,t.cssRetries=0,t.cssTimeout=n.setTimeout(s,500)):(u=r.createElement("script"),u.type="text/"+(t.type||"javascript"),u.src=t.url);u.onload=u.onreadystatechange=o;u.onerror=e;u.async=!1;u.defer=!1;t.errorTimeout=n.setTimeout(function(){e({type:"timeout"})},7e3);f=r.head||r.getElementsByTagName("head")[0];f.insertBefore(u,f.lastChild)}function vt(){for(var t,u=r.getElementsByTagName("script"),n=0,f=u.length;n<f;n++)if(t=u[n].getAttribute("data-headjs-load"),!!t){i.load(t);return}}function yt(n,t){var v,p,e;return n===r?(o?f(t):d.push(t),i):(s(n)&&(t=n,n="ALL"),a(n))?(v={},u(n,function(n){v[n]=c[n];i.ready(n,function(){y(v)&&f(t)})}),i):typeof n!="string"||!s(t)?i:(p=c[n],p&&p.state===l||n==="ALL"&&y()&&o)?(f(t),i):(e=h[n],e?e.push(t):e=h[n]=[t],i)}function e(){if(!r.body){n.clearTimeout(i.readyTimeout);i.readyTimeout=n.setTimeout(e,50);return}o||(o=!0,vt(),u(d,function(n){f(n)}))}function k(){r.addEventListener?(r.removeEventListener("DOMContentLoaded",k,!1),e()):r.readyState==="complete"&&(r.detachEvent("onreadystatechange",k),e())}var r=n.document,d=[],h={},c={},ut="async"in r.createElement("script")||"MozAppearance"in r.documentElement.style||n.opera,o,g=n.head_conf&&n.head_conf.head||"head",i=n[g]=n[g]||function(){i.ready.apply(null,arguments)},nt=1,ft=2,tt=3,l=4,p;if(r.readyState==="complete")e();else if(r.addEventListener)r.addEventListener("DOMContentLoaded",k,!1),n.addEventListener("load",e,!1);else{r.attachEvent("onreadystatechange",k);n.attachEvent("onload",e);p=!1;try{p=!n.frameElement&&r.documentElement}catch(wt){}p&&p.doScroll&&function pt(){if(!o){try{p.doScroll("left")}catch(t){n.clearTimeout(i.readyTimeout);i.readyTimeout=n.setTimeout(pt,50);return}e()}}()}i.load=i.js=ut?lt:ct;i.test=ot;i.ready=yt;i.ready(r,function(){y()&&u(h.ALL,function(n){f(n)});i.feature&&i.feature("domloaded",!0)})})(window);
/*

*/
},{}],4:[function(require,module,exports){
/**
 * Handles opening of and synchronization with the reveal.js
 * notes window.
 *
 * Handshake process:
 * 1. This window posts 'connect' to notes window
 *    - Includes URL of presentation to show
 * 2. Notes window responds with 'connected' when it is available
 * 3. This window proceeds to send the current presentation state
 *    to the notes window
 */
 var Reveal = require('reveal.js/js/reveal.js');
var RevealNotes = (function() {

	function openNotes( notesFilePath ) {

		if( !notesFilePath ) {
			var jsFileLocation = document.querySelector('script[src$="notes.js"]').src;  // this js file path
			jsFileLocation = jsFileLocation.replace(/notes\.js(\?.*)?$/, '');   // the js folder path
			notesFilePath = jsFileLocation + 'notes.html';
		}

		var notesPopup = window.open( notesFilePath, 'reveal.js - Notes', 'width=1100,height=700' );

		/**
		 * Connect to the notes window through a postmessage handshake.
		 * Using postmessage enables us to work in situations where the
		 * origins differ, such as a presentation being opened from the
		 * file system.
		 */
		function connect() {
			// Keep trying to connect until we get a 'connected' message back
			var connectInterval = setInterval( function() {
				notesPopup.postMessage( JSON.stringify( {
					namespace: 'reveal-notes',
					type: 'connect',
					url: window.location.protocol + '//' + window.location.host + window.location.pathname + window.location.search,
					state: Reveal.getState()
				} ), '*' );
			}, 500 );

			window.addEventListener( 'message', function( event ) {
				var data = JSON.parse( event.data );
				if( data && data.namespace === 'reveal-notes' && data.type === 'connected' ) {
					clearInterval( connectInterval );
					onConnected();
				}
			} );
		}

		/**
		 * Posts the current slide data to the notes window
		 */
		function post() {

			var slideElement = Reveal.getCurrentSlide(),
				notesElement = slideElement.querySelector( 'aside.notes' );

			var messageData = {
				namespace: 'reveal-notes',
				type: 'state',
				notes: '',
				markdown: false,
				whitespace: 'normal',
				state: Reveal.getState()
			};

			// Look for notes defined in a slide attribute
			if( slideElement.hasAttribute( 'data-notes' ) ) {
				messageData.notes = slideElement.getAttribute( 'data-notes' );
				messageData.whitespace = 'pre-wrap';
			}

			// Look for notes defined in an aside element
			if( notesElement ) {
				messageData.notes = notesElement.innerHTML;
				messageData.markdown = typeof notesElement.getAttribute( 'data-markdown' ) === 'string';
			}

			notesPopup.postMessage( JSON.stringify( messageData ), '*' );

		}

		/**
		 * Called once we have established a connection to the notes
		 * window.
		 */
		function onConnected() {

			// Monitor events that trigger a change in state
			Reveal.addEventListener( 'slidechanged', post );
			Reveal.addEventListener( 'fragmentshown', post );
			Reveal.addEventListener( 'fragmenthidden', post );
			Reveal.addEventListener( 'overviewhidden', post );
			Reveal.addEventListener( 'overviewshown', post );
			Reveal.addEventListener( 'paused', post );
			Reveal.addEventListener( 'resumed', post );

			// Post the initial state
			post();

		}

		connect();

	}

	if( !/receiver/i.test( window.location.search ) ) {

		// If the there's a 'notes' query set, open directly
		if( window.location.search.match( /(\?|\&)notes/gi ) !== null ) {
			openNotes();
		}

		// Open the notes when the 's' key is hit
		document.addEventListener( 'keydown', function( event ) {
			// Disregard the event if the target is editable or a
			// modifier is present
			if ( document.querySelector( ':focus' ) !== null || event.shiftKey || event.altKey || event.ctrlKey || event.metaKey ) return;

			// Disregard the event if keyboard is disabled
			if ( Reveal.getConfig().keyboard === false ) return;

			if( event.keyCode === 83 ) {
				event.preventDefault();
				openNotes();
			}
		}, false );

		// Show our keyboard shortcut in the reveal.js help overlay
		if( window.Reveal ) Reveal.registerKeyboardShortcut( 'S', 'Speaker notes view' );

	}

	return { open: openNotes };

})();

},{"reveal.js/js/reveal.js":2}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJidWlsZC9fanMvX2N1c3RvbS9zY3JpcHRzLmpzIiwibm9kZV9tb2R1bGVzL3JldmVhbC5qcy9qcy9yZXZlYWwuanMiLCJub2RlX21vZHVsZXMvcmV2ZWFsLmpzL2xpYi9qcy9oZWFkLm1pbi5qcyIsIm5vZGVfbW9kdWxlcy9yZXZlYWwuanMvcGx1Z2luL25vdGVzL25vdGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNDQSxJQUFJLFNBQVMsUUFBUSx3QkFBUixDQUFiO0FBQ0EsSUFBSSxPQUFPLFFBQVEsOEJBQVIsQ0FBWDtBQUNBLElBQUksUUFBUSxRQUFRLGlDQUFSLENBQVo7QUFDQSxPQUFPLFVBQVAsQ0FBa0I7QUFDaEIsWUFBVSxJQURNO0FBRWhCLFlBQVUsSUFGTTtBQUdoQixXQUFTLElBSE87QUFJaEIsVUFBUSxJQUpRO0FBS2hCLGdCQUFjO0FBQ2Q7O0FBRUE7QUFDQTtBQVRnQixDQUFsQjs7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2oySkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcbnZhciBSZXZlYWwgPSByZXF1aXJlKCdyZXZlYWwuanMvanMvcmV2ZWFsLmpzJyk7XG52YXIgaGVhZCA9IHJlcXVpcmUoJ3JldmVhbC5qcy9saWIvanMvaGVhZC5taW4uanMnKTtcbnZhciBub3RlcyA9IHJlcXVpcmUoJ3JldmVhbC5qcy9wbHVnaW4vbm90ZXMvbm90ZXMuanMnKTtcblJldmVhbC5pbml0aWFsaXplKHtcbiAgY29udHJvbHM6IHRydWUsXG4gIHByb2dyZXNzOiB0cnVlLFxuICBoaXN0b3J5OiB0cnVlLFxuICBjZW50ZXI6IHRydWUsXG4gIGRlcGVuZGVuY2llczogW1xuICAvL1x0eyBzcmM6ICcvYXNzZXRzL2pzL3BsdWdpbi9ub3Rlcy9ub3Rlcy5qcycsIGFzeW5jOiB0cnVlIH0sIFxuICBdXG4gIC8vIGRlZmF1bHQvY3ViZS9wYWdlL2NvbmNhdmUvem9vbS9saW5lYXIvZmFkZS9ub25lIFxuICAvL3RyYW5zaXRpb246ICdub25lJyxcbn0pOyIsIi8qIVxuICogcmV2ZWFsLmpzXG4gKiBodHRwOi8vbGFiLmhha2ltLnNlL3JldmVhbC1qc1xuICogTUlUIGxpY2Vuc2VkXG4gKlxuICogQ29weXJpZ2h0IChDKSAyMDE2IEhha2ltIEVsIEhhdHRhYiwgaHR0cDovL2hha2ltLnNlXG4gKi9cbihmdW5jdGlvbiggcm9vdCwgZmFjdG9yeSApIHtcblx0aWYoIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCApIHtcblx0XHQvLyBBTUQuIFJlZ2lzdGVyIGFzIGFuIGFub255bW91cyBtb2R1bGUuXG5cdFx0ZGVmaW5lKCBmdW5jdGlvbigpIHtcblx0XHRcdHJvb3QuUmV2ZWFsID0gZmFjdG9yeSgpO1xuXHRcdFx0cmV0dXJuIHJvb3QuUmV2ZWFsO1xuXHRcdH0gKTtcblx0fSBlbHNlIGlmKCB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgKSB7XG5cdFx0Ly8gTm9kZS4gRG9lcyBub3Qgd29yayB3aXRoIHN0cmljdCBDb21tb25KUy5cblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0fSBlbHNlIHtcblx0XHQvLyBCcm93c2VyIGdsb2JhbHMuXG5cdFx0cm9vdC5SZXZlYWwgPSBmYWN0b3J5KCk7XG5cdH1cbn0oIHRoaXMsIGZ1bmN0aW9uKCkge1xuXG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgUmV2ZWFsO1xuXG5cdC8vIFRoZSByZXZlYWwuanMgdmVyc2lvblxuXHR2YXIgVkVSU0lPTiA9ICczLjQuMSc7XG5cblx0dmFyIFNMSURFU19TRUxFQ1RPUiA9ICcuc2xpZGVzIHNlY3Rpb24nLFxuXHRcdEhPUklaT05UQUxfU0xJREVTX1NFTEVDVE9SID0gJy5zbGlkZXM+c2VjdGlvbicsXG5cdFx0VkVSVElDQUxfU0xJREVTX1NFTEVDVE9SID0gJy5zbGlkZXM+c2VjdGlvbi5wcmVzZW50PnNlY3Rpb24nLFxuXHRcdEhPTUVfU0xJREVfU0VMRUNUT1IgPSAnLnNsaWRlcz5zZWN0aW9uOmZpcnN0LW9mLXR5cGUnLFxuXHRcdFVBID0gbmF2aWdhdG9yLnVzZXJBZ2VudCxcblxuXHRcdC8vIENvbmZpZ3VyYXRpb24gZGVmYXVsdHMsIGNhbiBiZSBvdmVycmlkZGVuIGF0IGluaXRpYWxpemF0aW9uIHRpbWVcblx0XHRjb25maWcgPSB7XG5cblx0XHRcdC8vIFRoZSBcIm5vcm1hbFwiIHNpemUgb2YgdGhlIHByZXNlbnRhdGlvbiwgYXNwZWN0IHJhdGlvIHdpbGwgYmUgcHJlc2VydmVkXG5cdFx0XHQvLyB3aGVuIHRoZSBwcmVzZW50YXRpb24gaXMgc2NhbGVkIHRvIGZpdCBkaWZmZXJlbnQgcmVzb2x1dGlvbnNcblx0XHRcdHdpZHRoOiA5NjAsXG5cdFx0XHRoZWlnaHQ6IDcwMCxcblxuXHRcdFx0Ly8gRmFjdG9yIG9mIHRoZSBkaXNwbGF5IHNpemUgdGhhdCBzaG91bGQgcmVtYWluIGVtcHR5IGFyb3VuZCB0aGUgY29udGVudFxuXHRcdFx0bWFyZ2luOiAwLjA0LFxuXG5cdFx0XHQvLyBCb3VuZHMgZm9yIHNtYWxsZXN0L2xhcmdlc3QgcG9zc2libGUgc2NhbGUgdG8gYXBwbHkgdG8gY29udGVudFxuXHRcdFx0bWluU2NhbGU6IDAuMixcblx0XHRcdG1heFNjYWxlOiAyLjAsXG5cblx0XHRcdC8vIERpc3BsYXkgY29udHJvbHMgaW4gdGhlIGJvdHRvbSByaWdodCBjb3JuZXJcblx0XHRcdGNvbnRyb2xzOiB0cnVlLFxuXG5cdFx0XHQvLyBEaXNwbGF5IGEgcHJlc2VudGF0aW9uIHByb2dyZXNzIGJhclxuXHRcdFx0cHJvZ3Jlc3M6IHRydWUsXG5cblx0XHRcdC8vIERpc3BsYXkgdGhlIHBhZ2UgbnVtYmVyIG9mIHRoZSBjdXJyZW50IHNsaWRlXG5cdFx0XHRzbGlkZU51bWJlcjogZmFsc2UsXG5cblx0XHRcdC8vIFB1c2ggZWFjaCBzbGlkZSBjaGFuZ2UgdG8gdGhlIGJyb3dzZXIgaGlzdG9yeVxuXHRcdFx0aGlzdG9yeTogZmFsc2UsXG5cblx0XHRcdC8vIEVuYWJsZSBrZXlib2FyZCBzaG9ydGN1dHMgZm9yIG5hdmlnYXRpb25cblx0XHRcdGtleWJvYXJkOiB0cnVlLFxuXG5cdFx0XHQvLyBPcHRpb25hbCBmdW5jdGlvbiB0aGF0IGJsb2NrcyBrZXlib2FyZCBldmVudHMgd2hlbiByZXR1bmluZyBmYWxzZVxuXHRcdFx0a2V5Ym9hcmRDb25kaXRpb246IG51bGwsXG5cblx0XHRcdC8vIEVuYWJsZSB0aGUgc2xpZGUgb3ZlcnZpZXcgbW9kZVxuXHRcdFx0b3ZlcnZpZXc6IHRydWUsXG5cblx0XHRcdC8vIFZlcnRpY2FsIGNlbnRlcmluZyBvZiBzbGlkZXNcblx0XHRcdGNlbnRlcjogdHJ1ZSxcblxuXHRcdFx0Ly8gRW5hYmxlcyB0b3VjaCBuYXZpZ2F0aW9uIG9uIGRldmljZXMgd2l0aCB0b3VjaCBpbnB1dFxuXHRcdFx0dG91Y2g6IHRydWUsXG5cblx0XHRcdC8vIExvb3AgdGhlIHByZXNlbnRhdGlvblxuXHRcdFx0bG9vcDogZmFsc2UsXG5cblx0XHRcdC8vIENoYW5nZSB0aGUgcHJlc2VudGF0aW9uIGRpcmVjdGlvbiB0byBiZSBSVExcblx0XHRcdHJ0bDogZmFsc2UsXG5cblx0XHRcdC8vIFJhbmRvbWl6ZXMgdGhlIG9yZGVyIG9mIHNsaWRlcyBlYWNoIHRpbWUgdGhlIHByZXNlbnRhdGlvbiBsb2Fkc1xuXHRcdFx0c2h1ZmZsZTogZmFsc2UsXG5cblx0XHRcdC8vIFR1cm5zIGZyYWdtZW50cyBvbiBhbmQgb2ZmIGdsb2JhbGx5XG5cdFx0XHRmcmFnbWVudHM6IHRydWUsXG5cblx0XHRcdC8vIEZsYWdzIGlmIHRoZSBwcmVzZW50YXRpb24gaXMgcnVubmluZyBpbiBhbiBlbWJlZGRlZCBtb2RlLFxuXHRcdFx0Ly8gaS5lLiBjb250YWluZWQgd2l0aGluIGEgbGltaXRlZCBwb3J0aW9uIG9mIHRoZSBzY3JlZW5cblx0XHRcdGVtYmVkZGVkOiBmYWxzZSxcblxuXHRcdFx0Ly8gRmxhZ3MgaWYgd2Ugc2hvdWxkIHNob3cgYSBoZWxwIG92ZXJsYXkgd2hlbiB0aGUgcXVlc3Rpb24tbWFya1xuXHRcdFx0Ly8ga2V5IGlzIHByZXNzZWRcblx0XHRcdGhlbHA6IHRydWUsXG5cblx0XHRcdC8vIEZsYWdzIGlmIGl0IHNob3VsZCBiZSBwb3NzaWJsZSB0byBwYXVzZSB0aGUgcHJlc2VudGF0aW9uIChibGFja291dClcblx0XHRcdHBhdXNlOiB0cnVlLFxuXG5cdFx0XHQvLyBGbGFncyBpZiBzcGVha2VyIG5vdGVzIHNob3VsZCBiZSB2aXNpYmxlIHRvIGFsbCB2aWV3ZXJzXG5cdFx0XHRzaG93Tm90ZXM6IGZhbHNlLFxuXG5cdFx0XHQvLyBOdW1iZXIgb2YgbWlsbGlzZWNvbmRzIGJldHdlZW4gYXV0b21hdGljYWxseSBwcm9jZWVkaW5nIHRvIHRoZVxuXHRcdFx0Ly8gbmV4dCBzbGlkZSwgZGlzYWJsZWQgd2hlbiBzZXQgdG8gMCwgdGhpcyB2YWx1ZSBjYW4gYmUgb3ZlcndyaXR0ZW5cblx0XHRcdC8vIGJ5IHVzaW5nIGEgZGF0YS1hdXRvc2xpZGUgYXR0cmlidXRlIG9uIHlvdXIgc2xpZGVzXG5cdFx0XHRhdXRvU2xpZGU6IDAsXG5cblx0XHRcdC8vIFN0b3AgYXV0by1zbGlkaW5nIGFmdGVyIHVzZXIgaW5wdXRcblx0XHRcdGF1dG9TbGlkZVN0b3BwYWJsZTogdHJ1ZSxcblxuXHRcdFx0Ly8gVXNlIHRoaXMgbWV0aG9kIGZvciBuYXZpZ2F0aW9uIHdoZW4gYXV0by1zbGlkaW5nIChkZWZhdWx0cyB0byBuYXZpZ2F0ZU5leHQpXG5cdFx0XHRhdXRvU2xpZGVNZXRob2Q6IG51bGwsXG5cblx0XHRcdC8vIEVuYWJsZSBzbGlkZSBuYXZpZ2F0aW9uIHZpYSBtb3VzZSB3aGVlbFxuXHRcdFx0bW91c2VXaGVlbDogZmFsc2UsXG5cblx0XHRcdC8vIEFwcGx5IGEgM0Qgcm9sbCB0byBsaW5rcyBvbiBob3ZlclxuXHRcdFx0cm9sbGluZ0xpbmtzOiBmYWxzZSxcblxuXHRcdFx0Ly8gSGlkZXMgdGhlIGFkZHJlc3MgYmFyIG9uIG1vYmlsZSBkZXZpY2VzXG5cdFx0XHRoaWRlQWRkcmVzc0JhcjogdHJ1ZSxcblxuXHRcdFx0Ly8gT3BlbnMgbGlua3MgaW4gYW4gaWZyYW1lIHByZXZpZXcgb3ZlcmxheVxuXHRcdFx0cHJldmlld0xpbmtzOiBmYWxzZSxcblxuXHRcdFx0Ly8gRXhwb3NlcyB0aGUgcmV2ZWFsLmpzIEFQSSB0aHJvdWdoIHdpbmRvdy5wb3N0TWVzc2FnZVxuXHRcdFx0cG9zdE1lc3NhZ2U6IHRydWUsXG5cblx0XHRcdC8vIERpc3BhdGNoZXMgYWxsIHJldmVhbC5qcyBldmVudHMgdG8gdGhlIHBhcmVudCB3aW5kb3cgdGhyb3VnaCBwb3N0TWVzc2FnZVxuXHRcdFx0cG9zdE1lc3NhZ2VFdmVudHM6IGZhbHNlLFxuXG5cdFx0XHQvLyBGb2N1c2VzIGJvZHkgd2hlbiBwYWdlIGNoYW5nZXMgdmlzaWJpbGl0eSB0byBlbnN1cmUga2V5Ym9hcmQgc2hvcnRjdXRzIHdvcmtcblx0XHRcdGZvY3VzQm9keU9uUGFnZVZpc2liaWxpdHlDaGFuZ2U6IHRydWUsXG5cblx0XHRcdC8vIFRyYW5zaXRpb24gc3R5bGVcblx0XHRcdHRyYW5zaXRpb246ICdzbGlkZScsIC8vIG5vbmUvZmFkZS9zbGlkZS9jb252ZXgvY29uY2F2ZS96b29tXG5cblx0XHRcdC8vIFRyYW5zaXRpb24gc3BlZWRcblx0XHRcdHRyYW5zaXRpb25TcGVlZDogJ2RlZmF1bHQnLCAvLyBkZWZhdWx0L2Zhc3Qvc2xvd1xuXG5cdFx0XHQvLyBUcmFuc2l0aW9uIHN0eWxlIGZvciBmdWxsIHBhZ2Ugc2xpZGUgYmFja2dyb3VuZHNcblx0XHRcdGJhY2tncm91bmRUcmFuc2l0aW9uOiAnZmFkZScsIC8vIG5vbmUvZmFkZS9zbGlkZS9jb252ZXgvY29uY2F2ZS96b29tXG5cblx0XHRcdC8vIFBhcmFsbGF4IGJhY2tncm91bmQgaW1hZ2Vcblx0XHRcdHBhcmFsbGF4QmFja2dyb3VuZEltYWdlOiAnJywgLy8gQ1NTIHN5bnRheCwgZS5nLiBcImEuanBnXCJcblxuXHRcdFx0Ly8gUGFyYWxsYXggYmFja2dyb3VuZCBzaXplXG5cdFx0XHRwYXJhbGxheEJhY2tncm91bmRTaXplOiAnJywgLy8gQ1NTIHN5bnRheCwgZS5nLiBcIjMwMDBweCAyMDAwcHhcIlxuXG5cdFx0XHQvLyBBbW91bnQgb2YgcGl4ZWxzIHRvIG1vdmUgdGhlIHBhcmFsbGF4IGJhY2tncm91bmQgcGVyIHNsaWRlIHN0ZXBcblx0XHRcdHBhcmFsbGF4QmFja2dyb3VuZEhvcml6b250YWw6IG51bGwsXG5cdFx0XHRwYXJhbGxheEJhY2tncm91bmRWZXJ0aWNhbDogbnVsbCxcblxuXHRcdFx0Ly8gVGhlIG1heGltdW0gbnVtYmVyIG9mIHBhZ2VzIGEgc2luZ2xlIHNsaWRlIGNhbiBleHBhbmQgb250byB3aGVuIHByaW50aW5nXG5cdFx0XHQvLyB0byBQREYsIHVubGltaXRlZCBieSBkZWZhdWx0XG5cdFx0XHRwZGZNYXhQYWdlc1BlclNsaWRlOiBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFksXG5cblx0XHRcdC8vIE51bWJlciBvZiBzbGlkZXMgYXdheSBmcm9tIHRoZSBjdXJyZW50IHRoYXQgYXJlIHZpc2libGVcblx0XHRcdHZpZXdEaXN0YW5jZTogMyxcblxuXHRcdFx0Ly8gU2NyaXB0IGRlcGVuZGVuY2llcyB0byBsb2FkXG5cdFx0XHRkZXBlbmRlbmNpZXM6IFtdXG5cblx0XHR9LFxuXG5cdFx0Ly8gRmxhZ3MgaWYgUmV2ZWFsLmluaXRpYWxpemUoKSBoYXMgYmVlbiBjYWxsZWRcblx0XHRpbml0aWFsaXplZCA9IGZhbHNlLFxuXG5cdFx0Ly8gRmxhZ3MgaWYgcmV2ZWFsLmpzIGlzIGxvYWRlZCAoaGFzIGRpc3BhdGNoZWQgdGhlICdyZWFkeScgZXZlbnQpXG5cdFx0bG9hZGVkID0gZmFsc2UsXG5cblx0XHQvLyBGbGFncyBpZiB0aGUgb3ZlcnZpZXcgbW9kZSBpcyBjdXJyZW50bHkgYWN0aXZlXG5cdFx0b3ZlcnZpZXcgPSBmYWxzZSxcblxuXHRcdC8vIEhvbGRzIHRoZSBkaW1lbnNpb25zIG9mIG91ciBvdmVydmlldyBzbGlkZXMsIGluY2x1ZGluZyBtYXJnaW5zXG5cdFx0b3ZlcnZpZXdTbGlkZVdpZHRoID0gbnVsbCxcblx0XHRvdmVydmlld1NsaWRlSGVpZ2h0ID0gbnVsbCxcblxuXHRcdC8vIFRoZSBob3Jpem9udGFsIGFuZCB2ZXJ0aWNhbCBpbmRleCBvZiB0aGUgY3VycmVudGx5IGFjdGl2ZSBzbGlkZVxuXHRcdGluZGV4aCxcblx0XHRpbmRleHYsXG5cblx0XHQvLyBUaGUgcHJldmlvdXMgYW5kIGN1cnJlbnQgc2xpZGUgSFRNTCBlbGVtZW50c1xuXHRcdHByZXZpb3VzU2xpZGUsXG5cdFx0Y3VycmVudFNsaWRlLFxuXG5cdFx0cHJldmlvdXNCYWNrZ3JvdW5kLFxuXG5cdFx0Ly8gU2xpZGVzIG1heSBob2xkIGEgZGF0YS1zdGF0ZSBhdHRyaWJ1dGUgd2hpY2ggd2UgcGljayB1cCBhbmQgYXBwbHlcblx0XHQvLyBhcyBhIGNsYXNzIHRvIHRoZSBib2R5LiBUaGlzIGxpc3QgY29udGFpbnMgdGhlIGNvbWJpbmVkIHN0YXRlIG9mXG5cdFx0Ly8gYWxsIGN1cnJlbnQgc2xpZGVzLlxuXHRcdHN0YXRlID0gW10sXG5cblx0XHQvLyBUaGUgY3VycmVudCBzY2FsZSBvZiB0aGUgcHJlc2VudGF0aW9uIChzZWUgd2lkdGgvaGVpZ2h0IGNvbmZpZylcblx0XHRzY2FsZSA9IDEsXG5cblx0XHQvLyBDU1MgdHJhbnNmb3JtIHRoYXQgaXMgY3VycmVudGx5IGFwcGxpZWQgdG8gdGhlIHNsaWRlcyBjb250YWluZXIsXG5cdFx0Ly8gc3BsaXQgaW50byB0d28gZ3JvdXBzXG5cdFx0c2xpZGVzVHJhbnNmb3JtID0geyBsYXlvdXQ6ICcnLCBvdmVydmlldzogJycgfSxcblxuXHRcdC8vIENhY2hlZCByZWZlcmVuY2VzIHRvIERPTSBlbGVtZW50c1xuXHRcdGRvbSA9IHt9LFxuXG5cdFx0Ly8gRmVhdHVyZXMgc3VwcG9ydGVkIGJ5IHRoZSBicm93c2VyLCBzZWUgI2NoZWNrQ2FwYWJpbGl0aWVzKClcblx0XHRmZWF0dXJlcyA9IHt9LFxuXG5cdFx0Ly8gQ2xpZW50IGlzIGEgbW9iaWxlIGRldmljZSwgc2VlICNjaGVja0NhcGFiaWxpdGllcygpXG5cdFx0aXNNb2JpbGVEZXZpY2UsXG5cblx0XHQvLyBDbGllbnQgaXMgYSBkZXNrdG9wIENocm9tZSwgc2VlICNjaGVja0NhcGFiaWxpdGllcygpXG5cdFx0aXNDaHJvbWUsXG5cblx0XHQvLyBUaHJvdHRsZXMgbW91c2Ugd2hlZWwgbmF2aWdhdGlvblxuXHRcdGxhc3RNb3VzZVdoZWVsU3RlcCA9IDAsXG5cblx0XHQvLyBEZWxheXMgdXBkYXRlcyB0byB0aGUgVVJMIGR1ZSB0byBhIENocm9tZSB0aHVtYm5haWxlciBidWdcblx0XHR3cml0ZVVSTFRpbWVvdXQgPSAwLFxuXG5cdFx0Ly8gRmxhZ3MgaWYgdGhlIGludGVyYWN0aW9uIGV2ZW50IGxpc3RlbmVycyBhcmUgYm91bmRcblx0XHRldmVudHNBcmVCb3VuZCA9IGZhbHNlLFxuXG5cdFx0Ly8gVGhlIGN1cnJlbnQgYXV0by1zbGlkZSBkdXJhdGlvblxuXHRcdGF1dG9TbGlkZSA9IDAsXG5cblx0XHQvLyBBdXRvIHNsaWRlIHByb3BlcnRpZXNcblx0XHRhdXRvU2xpZGVQbGF5ZXIsXG5cdFx0YXV0b1NsaWRlVGltZW91dCA9IDAsXG5cdFx0YXV0b1NsaWRlU3RhcnRUaW1lID0gLTEsXG5cdFx0YXV0b1NsaWRlUGF1c2VkID0gZmFsc2UsXG5cblx0XHQvLyBIb2xkcyBpbmZvcm1hdGlvbiBhYm91dCB0aGUgY3VycmVudGx5IG9uZ29pbmcgdG91Y2ggaW5wdXRcblx0XHR0b3VjaCA9IHtcblx0XHRcdHN0YXJ0WDogMCxcblx0XHRcdHN0YXJ0WTogMCxcblx0XHRcdHN0YXJ0U3BhbjogMCxcblx0XHRcdHN0YXJ0Q291bnQ6IDAsXG5cdFx0XHRjYXB0dXJlZDogZmFsc2UsXG5cdFx0XHR0aHJlc2hvbGQ6IDQwXG5cdFx0fSxcblxuXHRcdC8vIEhvbGRzIGluZm9ybWF0aW9uIGFib3V0IHRoZSBrZXlib2FyZCBzaG9ydGN1dHNcblx0XHRrZXlib2FyZFNob3J0Y3V0cyA9IHtcblx0XHRcdCdOICAsICBTUEFDRSc6XHRcdFx0J05leHQgc2xpZGUnLFxuXHRcdFx0J1AnOlx0XHRcdFx0XHQnUHJldmlvdXMgc2xpZGUnLFxuXHRcdFx0JyYjODU5MjsgICwgIEgnOlx0XHQnTmF2aWdhdGUgbGVmdCcsXG5cdFx0XHQnJiM4NTk0OyAgLCAgTCc6XHRcdCdOYXZpZ2F0ZSByaWdodCcsXG5cdFx0XHQnJiM4NTkzOyAgLCAgSyc6XHRcdCdOYXZpZ2F0ZSB1cCcsXG5cdFx0XHQnJiM4NTk1OyAgLCAgSic6XHRcdCdOYXZpZ2F0ZSBkb3duJyxcblx0XHRcdCdIb21lJzpcdFx0XHRcdFx0J0ZpcnN0IHNsaWRlJyxcblx0XHRcdCdFbmQnOlx0XHRcdFx0XHQnTGFzdCBzbGlkZScsXG5cdFx0XHQnQiAgLCAgLic6XHRcdFx0XHQnUGF1c2UnLFxuXHRcdFx0J0YnOlx0XHRcdFx0XHQnRnVsbHNjcmVlbicsXG5cdFx0XHQnRVNDLCBPJzpcdFx0XHRcdCdTbGlkZSBvdmVydmlldydcblx0XHR9O1xuXG5cdC8qKlxuXHQgKiBTdGFydHMgdXAgdGhlIHByZXNlbnRhdGlvbiBpZiB0aGUgY2xpZW50IGlzIGNhcGFibGUuXG5cdCAqL1xuXHRmdW5jdGlvbiBpbml0aWFsaXplKCBvcHRpb25zICkge1xuXG5cdFx0Ly8gTWFrZSBzdXJlIHdlIG9ubHkgaW5pdGlhbGl6ZSBvbmNlXG5cdFx0aWYoIGluaXRpYWxpemVkID09PSB0cnVlICkgcmV0dXJuO1xuXG5cdFx0aW5pdGlhbGl6ZWQgPSB0cnVlO1xuXG5cdFx0Y2hlY2tDYXBhYmlsaXRpZXMoKTtcblxuXHRcdGlmKCAhZmVhdHVyZXMudHJhbnNmb3JtczJkICYmICFmZWF0dXJlcy50cmFuc2Zvcm1zM2QgKSB7XG5cdFx0XHRkb2N1bWVudC5ib2R5LnNldEF0dHJpYnV0ZSggJ2NsYXNzJywgJ25vLXRyYW5zZm9ybXMnICk7XG5cblx0XHRcdC8vIFNpbmNlIEpTIHdvbid0IGJlIHJ1bm5pbmcgYW55IGZ1cnRoZXIsIHdlIGxvYWQgYWxsIGxhenlcblx0XHRcdC8vIGxvYWRpbmcgZWxlbWVudHMgdXBmcm9udFxuXHRcdFx0dmFyIGltYWdlcyA9IHRvQXJyYXkoIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCAnaW1nJyApICksXG5cdFx0XHRcdGlmcmFtZXMgPSB0b0FycmF5KCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSggJ2lmcmFtZScgKSApO1xuXG5cdFx0XHR2YXIgbGF6eUxvYWRhYmxlID0gaW1hZ2VzLmNvbmNhdCggaWZyYW1lcyApO1xuXG5cdFx0XHRmb3IoIHZhciBpID0gMCwgbGVuID0gbGF6eUxvYWRhYmxlLmxlbmd0aDsgaSA8IGxlbjsgaSsrICkge1xuXHRcdFx0XHR2YXIgZWxlbWVudCA9IGxhenlMb2FkYWJsZVtpXTtcblx0XHRcdFx0aWYoIGVsZW1lbnQuZ2V0QXR0cmlidXRlKCAnZGF0YS1zcmMnICkgKSB7XG5cdFx0XHRcdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGUoICdzcmMnLCBlbGVtZW50LmdldEF0dHJpYnV0ZSggJ2RhdGEtc3JjJyApICk7XG5cdFx0XHRcdFx0ZWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoICdkYXRhLXNyYycgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBJZiB0aGUgYnJvd3NlciBkb2Vzbid0IHN1cHBvcnQgY29yZSBmZWF0dXJlcyB3ZSB3b24ndCBiZVxuXHRcdFx0Ly8gdXNpbmcgSmF2YVNjcmlwdCB0byBjb250cm9sIHRoZSBwcmVzZW50YXRpb25cblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQvLyBDYWNoZSByZWZlcmVuY2VzIHRvIGtleSBET00gZWxlbWVudHNcblx0XHRkb20ud3JhcHBlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoICcucmV2ZWFsJyApO1xuXHRcdGRvbS5zbGlkZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLnJldmVhbCAuc2xpZGVzJyApO1xuXG5cdFx0Ly8gRm9yY2UgYSBsYXlvdXQgd2hlbiB0aGUgd2hvbGUgcGFnZSwgaW5jbCBmb250cywgaGFzIGxvYWRlZFxuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAnbG9hZCcsIGxheW91dCwgZmFsc2UgKTtcblxuXHRcdHZhciBxdWVyeSA9IFJldmVhbC5nZXRRdWVyeUhhc2goKTtcblxuXHRcdC8vIERvIG5vdCBhY2NlcHQgbmV3IGRlcGVuZGVuY2llcyB2aWEgcXVlcnkgY29uZmlnIHRvIGF2b2lkXG5cdFx0Ly8gdGhlIHBvdGVudGlhbCBvZiBtYWxpY2lvdXMgc2NyaXB0IGluamVjdGlvblxuXHRcdGlmKCB0eXBlb2YgcXVlcnlbJ2RlcGVuZGVuY2llcyddICE9PSAndW5kZWZpbmVkJyApIGRlbGV0ZSBxdWVyeVsnZGVwZW5kZW5jaWVzJ107XG5cblx0XHQvLyBDb3B5IG9wdGlvbnMgb3ZlciB0byBvdXIgY29uZmlnIG9iamVjdFxuXHRcdGV4dGVuZCggY29uZmlnLCBvcHRpb25zICk7XG5cdFx0ZXh0ZW5kKCBjb25maWcsIHF1ZXJ5ICk7XG5cblx0XHQvLyBIaWRlIHRoZSBhZGRyZXNzIGJhciBpbiBtb2JpbGUgYnJvd3NlcnNcblx0XHRoaWRlQWRkcmVzc0JhcigpO1xuXG5cdFx0Ly8gTG9hZHMgdGhlIGRlcGVuZGVuY2llcyBhbmQgY29udGludWVzIHRvICNzdGFydCgpIG9uY2UgZG9uZVxuXHRcdGxvYWQoKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIEluc3BlY3QgdGhlIGNsaWVudCB0byBzZWUgd2hhdCBpdCdzIGNhcGFibGUgb2YsIHRoaXNcblx0ICogc2hvdWxkIG9ubHkgaGFwcGVucyBvbmNlIHBlciBydW50aW1lLlxuXHQgKi9cblx0ZnVuY3Rpb24gY2hlY2tDYXBhYmlsaXRpZXMoKSB7XG5cblx0XHRpc01vYmlsZURldmljZSA9IC8oaXBob25lfGlwb2R8aXBhZHxhbmRyb2lkKS9naS50ZXN0KCBVQSApO1xuXHRcdGlzQ2hyb21lID0gL2Nocm9tZS9pLnRlc3QoIFVBICkgJiYgIS9lZGdlL2kudGVzdCggVUEgKTtcblxuXHRcdHZhciB0ZXN0RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7XG5cblx0XHRmZWF0dXJlcy50cmFuc2Zvcm1zM2QgPSAnV2Via2l0UGVyc3BlY3RpdmUnIGluIHRlc3RFbGVtZW50LnN0eWxlIHx8XG5cdFx0XHRcdFx0XHRcdFx0J01velBlcnNwZWN0aXZlJyBpbiB0ZXN0RWxlbWVudC5zdHlsZSB8fFxuXHRcdFx0XHRcdFx0XHRcdCdtc1BlcnNwZWN0aXZlJyBpbiB0ZXN0RWxlbWVudC5zdHlsZSB8fFxuXHRcdFx0XHRcdFx0XHRcdCdPUGVyc3BlY3RpdmUnIGluIHRlc3RFbGVtZW50LnN0eWxlIHx8XG5cdFx0XHRcdFx0XHRcdFx0J3BlcnNwZWN0aXZlJyBpbiB0ZXN0RWxlbWVudC5zdHlsZTtcblxuXHRcdGZlYXR1cmVzLnRyYW5zZm9ybXMyZCA9ICdXZWJraXRUcmFuc2Zvcm0nIGluIHRlc3RFbGVtZW50LnN0eWxlIHx8XG5cdFx0XHRcdFx0XHRcdFx0J01velRyYW5zZm9ybScgaW4gdGVzdEVsZW1lbnQuc3R5bGUgfHxcblx0XHRcdFx0XHRcdFx0XHQnbXNUcmFuc2Zvcm0nIGluIHRlc3RFbGVtZW50LnN0eWxlIHx8XG5cdFx0XHRcdFx0XHRcdFx0J09UcmFuc2Zvcm0nIGluIHRlc3RFbGVtZW50LnN0eWxlIHx8XG5cdFx0XHRcdFx0XHRcdFx0J3RyYW5zZm9ybScgaW4gdGVzdEVsZW1lbnQuc3R5bGU7XG5cblx0XHRmZWF0dXJlcy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVNZXRob2QgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgd2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZTtcblx0XHRmZWF0dXJlcy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB0eXBlb2YgZmVhdHVyZXMucmVxdWVzdEFuaW1hdGlvbkZyYW1lTWV0aG9kID09PSAnZnVuY3Rpb24nO1xuXG5cdFx0ZmVhdHVyZXMuY2FudmFzID0gISFkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnY2FudmFzJyApLmdldENvbnRleHQ7XG5cblx0XHQvLyBUcmFuc2l0aW9ucyBpbiB0aGUgb3ZlcnZpZXcgYXJlIGRpc2FibGVkIGluIGRlc2t0b3AgYW5kXG5cdFx0Ly8gU2FmYXJpIGR1ZSB0byBsYWdcblx0XHRmZWF0dXJlcy5vdmVydmlld1RyYW5zaXRpb25zID0gIS9WZXJzaW9uXFwvW1xcZFxcLl0rLipTYWZhcmkvLnRlc3QoIFVBICk7XG5cblx0XHQvLyBGbGFncyBpZiB3ZSBzaG91bGQgdXNlIHpvb20gaW5zdGVhZCBvZiB0cmFuc2Zvcm0gdG8gc2NhbGVcblx0XHQvLyB1cCBzbGlkZXMuIFpvb20gcHJvZHVjZXMgY3Jpc3BlciByZXN1bHRzIGJ1dCBoYXMgYSBsb3Qgb2Zcblx0XHQvLyB4YnJvd3NlciBxdWlya3Mgc28gd2Ugb25seSB1c2UgaXQgaW4gd2hpdGVsc2l0ZWQgYnJvd3NlcnMuXG5cdFx0ZmVhdHVyZXMuem9vbSA9ICd6b29tJyBpbiB0ZXN0RWxlbWVudC5zdHlsZSAmJiAhaXNNb2JpbGVEZXZpY2UgJiZcblx0XHRcdFx0XHRcdCggaXNDaHJvbWUgfHwgL1ZlcnNpb25cXC9bXFxkXFwuXSsuKlNhZmFyaS8udGVzdCggVUEgKSApO1xuXG5cdH1cblxuICAgIC8qKlxuICAgICAqIExvYWRzIHRoZSBkZXBlbmRlbmNpZXMgb2YgcmV2ZWFsLmpzLiBEZXBlbmRlbmNpZXMgYXJlXG4gICAgICogZGVmaW5lZCB2aWEgdGhlIGNvbmZpZ3VyYXRpb24gb3B0aW9uICdkZXBlbmRlbmNpZXMnXG4gICAgICogYW5kIHdpbGwgYmUgbG9hZGVkIHByaW9yIHRvIHN0YXJ0aW5nL2JpbmRpbmcgcmV2ZWFsLmpzLlxuICAgICAqIFNvbWUgZGVwZW5kZW5jaWVzIG1heSBoYXZlIGFuICdhc3luYycgZmxhZywgaWYgc28gdGhleVxuICAgICAqIHdpbGwgbG9hZCBhZnRlciByZXZlYWwuanMgaGFzIGJlZW4gc3RhcnRlZCB1cC5cbiAgICAgKi9cblx0ZnVuY3Rpb24gbG9hZCgpIHtcblxuXHRcdHZhciBzY3JpcHRzID0gW10sXG5cdFx0XHRzY3JpcHRzQXN5bmMgPSBbXSxcblx0XHRcdHNjcmlwdHNUb1ByZWxvYWQgPSAwO1xuXG5cdFx0Ly8gQ2FsbGVkIG9uY2Ugc3luY2hyb25vdXMgc2NyaXB0cyBmaW5pc2ggbG9hZGluZ1xuXHRcdGZ1bmN0aW9uIHByb2NlZWQoKSB7XG5cdFx0XHRpZiggc2NyaXB0c0FzeW5jLmxlbmd0aCApIHtcblx0XHRcdFx0Ly8gTG9hZCBhc3luY2hyb25vdXMgc2NyaXB0c1xuXHRcdFx0XHRoZWFkLmpzLmFwcGx5KCBudWxsLCBzY3JpcHRzQXN5bmMgKTtcblx0XHRcdH1cblxuXHRcdFx0c3RhcnQoKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBsb2FkU2NyaXB0KCBzICkge1xuXHRcdFx0aGVhZC5yZWFkeSggcy5zcmMubWF0Y2goIC8oW1xcd1xcZF9cXC1dKilcXC4/anMkfFteXFxcXFxcL10qJC9pIClbMF0sIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHQvLyBFeHRlbnNpb24gbWF5IGNvbnRhaW4gY2FsbGJhY2sgZnVuY3Rpb25zXG5cdFx0XHRcdGlmKCB0eXBlb2Ygcy5jYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJyApIHtcblx0XHRcdFx0XHRzLmNhbGxiYWNrLmFwcGx5KCB0aGlzICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiggLS1zY3JpcHRzVG9QcmVsb2FkID09PSAwICkge1xuXHRcdFx0XHRcdHByb2NlZWQoKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0Zm9yKCB2YXIgaSA9IDAsIGxlbiA9IGNvbmZpZy5kZXBlbmRlbmNpZXMubGVuZ3RoOyBpIDwgbGVuOyBpKysgKSB7XG5cdFx0XHR2YXIgcyA9IGNvbmZpZy5kZXBlbmRlbmNpZXNbaV07XG5cblx0XHRcdC8vIExvYWQgaWYgdGhlcmUncyBubyBjb25kaXRpb24gb3IgdGhlIGNvbmRpdGlvbiBpcyB0cnV0aHlcblx0XHRcdGlmKCAhcy5jb25kaXRpb24gfHwgcy5jb25kaXRpb24oKSApIHtcblx0XHRcdFx0aWYoIHMuYXN5bmMgKSB7XG5cdFx0XHRcdFx0c2NyaXB0c0FzeW5jLnB1c2goIHMuc3JjICk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0c2NyaXB0cy5wdXNoKCBzLnNyYyApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0bG9hZFNjcmlwdCggcyApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmKCBzY3JpcHRzLmxlbmd0aCApIHtcblx0XHRcdHNjcmlwdHNUb1ByZWxvYWQgPSBzY3JpcHRzLmxlbmd0aDtcblxuXHRcdFx0Ly8gTG9hZCBzeW5jaHJvbm91cyBzY3JpcHRzXG5cdFx0XHRoZWFkLmpzLmFwcGx5KCBudWxsLCBzY3JpcHRzICk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0cHJvY2VlZCgpO1xuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIFN0YXJ0cyB1cCByZXZlYWwuanMgYnkgYmluZGluZyBpbnB1dCBldmVudHMgYW5kIG5hdmlnYXRpbmdcblx0ICogdG8gdGhlIGN1cnJlbnQgVVJMIGRlZXBsaW5rIGlmIHRoZXJlIGlzIG9uZS5cblx0ICovXG5cdGZ1bmN0aW9uIHN0YXJ0KCkge1xuXG5cdFx0Ly8gTWFrZSBzdXJlIHdlJ3ZlIGdvdCBhbGwgdGhlIERPTSBlbGVtZW50cyB3ZSBuZWVkXG5cdFx0c2V0dXBET00oKTtcblxuXHRcdC8vIExpc3RlbiB0byBtZXNzYWdlcyBwb3N0ZWQgdG8gdGhpcyB3aW5kb3dcblx0XHRzZXR1cFBvc3RNZXNzYWdlKCk7XG5cblx0XHQvLyBQcmV2ZW50IHRoZSBzbGlkZXMgZnJvbSBiZWluZyBzY3JvbGxlZCBvdXQgb2Ygdmlld1xuXHRcdHNldHVwU2Nyb2xsUHJldmVudGlvbigpO1xuXG5cdFx0Ly8gUmVzZXRzIGFsbCB2ZXJ0aWNhbCBzbGlkZXMgc28gdGhhdCBvbmx5IHRoZSBmaXJzdCBpcyB2aXNpYmxlXG5cdFx0cmVzZXRWZXJ0aWNhbFNsaWRlcygpO1xuXG5cdFx0Ly8gVXBkYXRlcyB0aGUgcHJlc2VudGF0aW9uIHRvIG1hdGNoIHRoZSBjdXJyZW50IGNvbmZpZ3VyYXRpb24gdmFsdWVzXG5cdFx0Y29uZmlndXJlKCk7XG5cblx0XHQvLyBSZWFkIHRoZSBpbml0aWFsIGhhc2hcblx0XHRyZWFkVVJMKCk7XG5cblx0XHQvLyBVcGRhdGUgYWxsIGJhY2tncm91bmRzXG5cdFx0dXBkYXRlQmFja2dyb3VuZCggdHJ1ZSApO1xuXG5cdFx0Ly8gTm90aWZ5IGxpc3RlbmVycyB0aGF0IHRoZSBwcmVzZW50YXRpb24gaXMgcmVhZHkgYnV0IHVzZSBhIDFtc1xuXHRcdC8vIHRpbWVvdXQgdG8gZW5zdXJlIGl0J3Mgbm90IGZpcmVkIHN5bmNocm9ub3VzbHkgYWZ0ZXIgI2luaXRpYWxpemUoKVxuXHRcdHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gRW5hYmxlIHRyYW5zaXRpb25zIG5vdyB0aGF0IHdlJ3JlIGxvYWRlZFxuXHRcdFx0ZG9tLnNsaWRlcy5jbGFzc0xpc3QucmVtb3ZlKCAnbm8tdHJhbnNpdGlvbicgKTtcblxuXHRcdFx0bG9hZGVkID0gdHJ1ZTtcblxuXHRcdFx0ZG9tLndyYXBwZXIuY2xhc3NMaXN0LmFkZCggJ3JlYWR5JyApO1xuXG5cdFx0XHRkaXNwYXRjaEV2ZW50KCAncmVhZHknLCB7XG5cdFx0XHRcdCdpbmRleGgnOiBpbmRleGgsXG5cdFx0XHRcdCdpbmRleHYnOiBpbmRleHYsXG5cdFx0XHRcdCdjdXJyZW50U2xpZGUnOiBjdXJyZW50U2xpZGVcblx0XHRcdH0gKTtcblx0XHR9LCAxICk7XG5cblx0XHQvLyBTcGVjaWFsIHNldHVwIGFuZCBjb25maWcgaXMgcmVxdWlyZWQgd2hlbiBwcmludGluZyB0byBQREZcblx0XHRpZiggaXNQcmludGluZ1BERigpICkge1xuXHRcdFx0cmVtb3ZlRXZlbnRMaXN0ZW5lcnMoKTtcblxuXHRcdFx0Ly8gVGhlIGRvY3VtZW50IG5lZWRzIHRvIGhhdmUgbG9hZGVkIGZvciB0aGUgUERGIGxheW91dFxuXHRcdFx0Ly8gbWVhc3VyZW1lbnRzIHRvIGJlIGFjY3VyYXRlXG5cdFx0XHRpZiggZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJyApIHtcblx0XHRcdFx0c2V0dXBQREYoKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ2xvYWQnLCBzZXR1cFBERiApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIEZpbmRzIGFuZCBzdG9yZXMgcmVmZXJlbmNlcyB0byBET00gZWxlbWVudHMgd2hpY2ggYXJlXG5cdCAqIHJlcXVpcmVkIGJ5IHRoZSBwcmVzZW50YXRpb24uIElmIGEgcmVxdWlyZWQgZWxlbWVudCBpc1xuXHQgKiBub3QgZm91bmQsIGl0IGlzIGNyZWF0ZWQuXG5cdCAqL1xuXHRmdW5jdGlvbiBzZXR1cERPTSgpIHtcblxuXHRcdC8vIFByZXZlbnQgdHJhbnNpdGlvbnMgd2hpbGUgd2UncmUgbG9hZGluZ1xuXHRcdGRvbS5zbGlkZXMuY2xhc3NMaXN0LmFkZCggJ25vLXRyYW5zaXRpb24nICk7XG5cblx0XHQvLyBCYWNrZ3JvdW5kIGVsZW1lbnRcblx0XHRkb20uYmFja2dyb3VuZCA9IGNyZWF0ZVNpbmdsZXRvbk5vZGUoIGRvbS53cmFwcGVyLCAnZGl2JywgJ2JhY2tncm91bmRzJywgbnVsbCApO1xuXG5cdFx0Ly8gUHJvZ3Jlc3MgYmFyXG5cdFx0ZG9tLnByb2dyZXNzID0gY3JlYXRlU2luZ2xldG9uTm9kZSggZG9tLndyYXBwZXIsICdkaXYnLCAncHJvZ3Jlc3MnLCAnPHNwYW4+PC9zcGFuPicgKTtcblx0XHRkb20ucHJvZ3Jlc3NiYXIgPSBkb20ucHJvZ3Jlc3MucXVlcnlTZWxlY3RvciggJ3NwYW4nICk7XG5cblx0XHQvLyBBcnJvdyBjb250cm9sc1xuXHRcdGNyZWF0ZVNpbmdsZXRvbk5vZGUoIGRvbS53cmFwcGVyLCAnYXNpZGUnLCAnY29udHJvbHMnLFxuXHRcdFx0JzxidXR0b24gY2xhc3M9XCJuYXZpZ2F0ZS1sZWZ0XCIgYXJpYS1sYWJlbD1cInByZXZpb3VzIHNsaWRlXCI+PC9idXR0b24+JyArXG5cdFx0XHQnPGJ1dHRvbiBjbGFzcz1cIm5hdmlnYXRlLXJpZ2h0XCIgYXJpYS1sYWJlbD1cIm5leHQgc2xpZGVcIj48L2J1dHRvbj4nICtcblx0XHRcdCc8YnV0dG9uIGNsYXNzPVwibmF2aWdhdGUtdXBcIiBhcmlhLWxhYmVsPVwiYWJvdmUgc2xpZGVcIj48L2J1dHRvbj4nICtcblx0XHRcdCc8YnV0dG9uIGNsYXNzPVwibmF2aWdhdGUtZG93blwiIGFyaWEtbGFiZWw9XCJiZWxvdyBzbGlkZVwiPjwvYnV0dG9uPicgKTtcblxuXHRcdC8vIFNsaWRlIG51bWJlclxuXHRcdGRvbS5zbGlkZU51bWJlciA9IGNyZWF0ZVNpbmdsZXRvbk5vZGUoIGRvbS53cmFwcGVyLCAnZGl2JywgJ3NsaWRlLW51bWJlcicsICcnICk7XG5cblx0XHQvLyBFbGVtZW50IGNvbnRhaW5pbmcgbm90ZXMgdGhhdCBhcmUgdmlzaWJsZSB0byB0aGUgYXVkaWVuY2Vcblx0XHRkb20uc3BlYWtlck5vdGVzID0gY3JlYXRlU2luZ2xldG9uTm9kZSggZG9tLndyYXBwZXIsICdkaXYnLCAnc3BlYWtlci1ub3RlcycsIG51bGwgKTtcblx0XHRkb20uc3BlYWtlck5vdGVzLnNldEF0dHJpYnV0ZSggJ2RhdGEtcHJldmVudC1zd2lwZScsICcnICk7XG5cdFx0ZG9tLnNwZWFrZXJOb3Rlcy5zZXRBdHRyaWJ1dGUoICd0YWJpbmRleCcsICcwJyApO1xuXG5cdFx0Ly8gT3ZlcmxheSBncmFwaGljIHdoaWNoIGlzIGRpc3BsYXllZCBkdXJpbmcgdGhlIHBhdXNlZCBtb2RlXG5cdFx0Y3JlYXRlU2luZ2xldG9uTm9kZSggZG9tLndyYXBwZXIsICdkaXYnLCAncGF1c2Utb3ZlcmxheScsIG51bGwgKTtcblxuXHRcdC8vIENhY2hlIHJlZmVyZW5jZXMgdG8gZWxlbWVudHNcblx0XHRkb20uY29udHJvbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLnJldmVhbCAuY29udHJvbHMnICk7XG5cblx0XHRkb20ud3JhcHBlci5zZXRBdHRyaWJ1dGUoICdyb2xlJywgJ2FwcGxpY2F0aW9uJyApO1xuXG5cdFx0Ly8gVGhlcmUgY2FuIGJlIG11bHRpcGxlIGluc3RhbmNlcyBvZiBjb250cm9scyB0aHJvdWdob3V0IHRoZSBwYWdlXG5cdFx0ZG9tLmNvbnRyb2xzTGVmdCA9IHRvQXJyYXkoIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICcubmF2aWdhdGUtbGVmdCcgKSApO1xuXHRcdGRvbS5jb250cm9sc1JpZ2h0ID0gdG9BcnJheSggZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy5uYXZpZ2F0ZS1yaWdodCcgKSApO1xuXHRcdGRvbS5jb250cm9sc1VwID0gdG9BcnJheSggZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy5uYXZpZ2F0ZS11cCcgKSApO1xuXHRcdGRvbS5jb250cm9sc0Rvd24gPSB0b0FycmF5KCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnLm5hdmlnYXRlLWRvd24nICkgKTtcblx0XHRkb20uY29udHJvbHNQcmV2ID0gdG9BcnJheSggZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJy5uYXZpZ2F0ZS1wcmV2JyApICk7XG5cdFx0ZG9tLmNvbnRyb2xzTmV4dCA9IHRvQXJyYXkoIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICcubmF2aWdhdGUtbmV4dCcgKSApO1xuXG5cdFx0ZG9tLnN0YXR1c0RpdiA9IGNyZWF0ZVN0YXR1c0RpdigpO1xuXHR9XG5cblx0LyoqXG5cdCAqIENyZWF0ZXMgYSBoaWRkZW4gZGl2IHdpdGggcm9sZSBhcmlhLWxpdmUgdG8gYW5ub3VuY2UgdGhlXG5cdCAqIGN1cnJlbnQgc2xpZGUgY29udGVudC4gSGlkZSB0aGUgZGl2IG9mZi1zY3JlZW4gdG8gbWFrZSBpdFxuXHQgKiBhdmFpbGFibGUgb25seSB0byBBc3Npc3RpdmUgVGVjaG5vbG9naWVzLlxuXHQgKlxuXHQgKiBAcmV0dXJuIHtIVE1MRWxlbWVudH1cblx0ICovXG5cdGZ1bmN0aW9uIGNyZWF0ZVN0YXR1c0RpdigpIHtcblxuXHRcdHZhciBzdGF0dXNEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggJ2FyaWEtc3RhdHVzLWRpdicgKTtcblx0XHRpZiggIXN0YXR1c0RpdiApIHtcblx0XHRcdHN0YXR1c0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7XG5cdFx0XHRzdGF0dXNEaXYuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuXHRcdFx0c3RhdHVzRGl2LnN0eWxlLmhlaWdodCA9ICcxcHgnO1xuXHRcdFx0c3RhdHVzRGl2LnN0eWxlLndpZHRoID0gJzFweCc7XG5cdFx0XHRzdGF0dXNEaXYuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcblx0XHRcdHN0YXR1c0Rpdi5zdHlsZS5jbGlwID0gJ3JlY3QoIDFweCwgMXB4LCAxcHgsIDFweCApJztcblx0XHRcdHN0YXR1c0Rpdi5zZXRBdHRyaWJ1dGUoICdpZCcsICdhcmlhLXN0YXR1cy1kaXYnICk7XG5cdFx0XHRzdGF0dXNEaXYuc2V0QXR0cmlidXRlKCAnYXJpYS1saXZlJywgJ3BvbGl0ZScgKTtcblx0XHRcdHN0YXR1c0Rpdi5zZXRBdHRyaWJ1dGUoICdhcmlhLWF0b21pYycsJ3RydWUnICk7XG5cdFx0XHRkb20ud3JhcHBlci5hcHBlbmRDaGlsZCggc3RhdHVzRGl2ICk7XG5cdFx0fVxuXHRcdHJldHVybiBzdGF0dXNEaXY7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyB0aGUgZ2l2ZW4gSFRNTCBlbGVtZW50IGludG8gYSBzdHJpbmcgb2YgdGV4dFxuXHQgKiB0aGF0IGNhbiBiZSBhbm5vdW5jZWQgdG8gYSBzY3JlZW4gcmVhZGVyLiBIaWRkZW5cblx0ICogZWxlbWVudHMgYXJlIGV4Y2x1ZGVkLlxuXHQgKi9cblx0ZnVuY3Rpb24gZ2V0U3RhdHVzVGV4dCggbm9kZSApIHtcblxuXHRcdHZhciB0ZXh0ID0gJyc7XG5cblx0XHQvLyBUZXh0IG5vZGVcblx0XHRpZiggbm9kZS5ub2RlVHlwZSA9PT0gMyApIHtcblx0XHRcdHRleHQgKz0gbm9kZS50ZXh0Q29udGVudDtcblx0XHR9XG5cdFx0Ly8gRWxlbWVudCBub2RlXG5cdFx0ZWxzZSBpZiggbm9kZS5ub2RlVHlwZSA9PT0gMSApIHtcblxuXHRcdFx0dmFyIGlzQXJpYUhpZGRlbiA9IG5vZGUuZ2V0QXR0cmlidXRlKCAnYXJpYS1oaWRkZW4nICk7XG5cdFx0XHR2YXIgaXNEaXNwbGF5SGlkZGVuID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoIG5vZGUgKVsnZGlzcGxheSddID09PSAnbm9uZSc7XG5cdFx0XHRpZiggaXNBcmlhSGlkZGVuICE9PSAndHJ1ZScgJiYgIWlzRGlzcGxheUhpZGRlbiApIHtcblxuXHRcdFx0XHR0b0FycmF5KCBub2RlLmNoaWxkTm9kZXMgKS5mb3JFYWNoKCBmdW5jdGlvbiggY2hpbGQgKSB7XG5cdFx0XHRcdFx0dGV4dCArPSBnZXRTdGF0dXNUZXh0KCBjaGlsZCApO1xuXHRcdFx0XHR9ICk7XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdHJldHVybiB0ZXh0O1xuXG5cdH1cblxuXHQvKipcblx0ICogQ29uZmlndXJlcyB0aGUgcHJlc2VudGF0aW9uIGZvciBwcmludGluZyB0byBhIHN0YXRpY1xuXHQgKiBQREYuXG5cdCAqL1xuXHRmdW5jdGlvbiBzZXR1cFBERigpIHtcblxuXHRcdHZhciBzbGlkZVNpemUgPSBnZXRDb21wdXRlZFNsaWRlU2l6ZSggd2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCApO1xuXG5cdFx0Ly8gRGltZW5zaW9ucyBvZiB0aGUgUERGIHBhZ2VzXG5cdFx0dmFyIHBhZ2VXaWR0aCA9IE1hdGguZmxvb3IoIHNsaWRlU2l6ZS53aWR0aCAqICggMSArIGNvbmZpZy5tYXJnaW4gKSApLFxuXHRcdFx0cGFnZUhlaWdodCA9IE1hdGguZmxvb3IoIHNsaWRlU2l6ZS5oZWlnaHQgKiAoIDEgKyBjb25maWcubWFyZ2luICkgKTtcblxuXHRcdC8vIERpbWVuc2lvbnMgb2Ygc2xpZGVzIHdpdGhpbiB0aGUgcGFnZXNcblx0XHR2YXIgc2xpZGVXaWR0aCA9IHNsaWRlU2l6ZS53aWR0aCxcblx0XHRcdHNsaWRlSGVpZ2h0ID0gc2xpZGVTaXplLmhlaWdodDtcblxuXHRcdC8vIExldCB0aGUgYnJvd3NlciBrbm93IHdoYXQgcGFnZSBzaXplIHdlIHdhbnQgdG8gcHJpbnRcblx0XHRpbmplY3RTdHlsZVNoZWV0KCAnQHBhZ2V7c2l6ZTonKyBwYWdlV2lkdGggKydweCAnKyBwYWdlSGVpZ2h0ICsncHg7IG1hcmdpbjogMCAwIC0xcHggMDt9JyApO1xuXG5cdFx0Ly8gTGltaXQgdGhlIHNpemUgb2YgY2VydGFpbiBlbGVtZW50cyB0byB0aGUgZGltZW5zaW9ucyBvZiB0aGUgc2xpZGVcblx0XHRpbmplY3RTdHlsZVNoZWV0KCAnLnJldmVhbCBzZWN0aW9uPmltZywgLnJldmVhbCBzZWN0aW9uPnZpZGVvLCAucmV2ZWFsIHNlY3Rpb24+aWZyYW1le21heC13aWR0aDogJysgc2xpZGVXaWR0aCArJ3B4OyBtYXgtaGVpZ2h0OicrIHNsaWRlSGVpZ2h0ICsncHh9JyApO1xuXG5cdFx0ZG9jdW1lbnQuYm9keS5jbGFzc0xpc3QuYWRkKCAncHJpbnQtcGRmJyApO1xuXHRcdGRvY3VtZW50LmJvZHkuc3R5bGUud2lkdGggPSBwYWdlV2lkdGggKyAncHgnO1xuXHRcdGRvY3VtZW50LmJvZHkuc3R5bGUuaGVpZ2h0ID0gcGFnZUhlaWdodCArICdweCc7XG5cblx0XHQvLyBBZGQgZWFjaCBzbGlkZSdzIGluZGV4IGFzIGF0dHJpYnV0ZXMgb24gaXRzZWxmLCB3ZSBuZWVkIHRoZXNlXG5cdFx0Ly8gaW5kaWNlcyB0byBnZW5lcmF0ZSBzbGlkZSBudW1iZXJzIGJlbG93XG5cdFx0dG9BcnJheSggZG9tLndyYXBwZXIucXVlcnlTZWxlY3RvckFsbCggSE9SSVpPTlRBTF9TTElERVNfU0VMRUNUT1IgKSApLmZvckVhY2goIGZ1bmN0aW9uKCBoc2xpZGUsIGggKSB7XG5cdFx0XHRoc2xpZGUuc2V0QXR0cmlidXRlKCAnZGF0YS1pbmRleC1oJywgaCApO1xuXG5cdFx0XHRpZiggaHNsaWRlLmNsYXNzTGlzdC5jb250YWlucyggJ3N0YWNrJyApICkge1xuXHRcdFx0XHR0b0FycmF5KCBoc2xpZGUucXVlcnlTZWxlY3RvckFsbCggJ3NlY3Rpb24nICkgKS5mb3JFYWNoKCBmdW5jdGlvbiggdnNsaWRlLCB2ICkge1xuXHRcdFx0XHRcdHZzbGlkZS5zZXRBdHRyaWJ1dGUoICdkYXRhLWluZGV4LWgnLCBoICk7XG5cdFx0XHRcdFx0dnNsaWRlLnNldEF0dHJpYnV0ZSggJ2RhdGEtaW5kZXgtdicsIHYgKTtcblx0XHRcdFx0fSApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdC8vIFNsaWRlIGFuZCBzbGlkZSBiYWNrZ3JvdW5kIGxheW91dFxuXHRcdHRvQXJyYXkoIGRvbS53cmFwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoIFNMSURFU19TRUxFQ1RPUiApICkuZm9yRWFjaCggZnVuY3Rpb24oIHNsaWRlICkge1xuXG5cdFx0XHQvLyBWZXJ0aWNhbCBzdGFja3MgYXJlIG5vdCBjZW50cmVkIHNpbmNlIHRoZWlyIHNlY3Rpb25cblx0XHRcdC8vIGNoaWxkcmVuIHdpbGwgYmVcblx0XHRcdGlmKCBzbGlkZS5jbGFzc0xpc3QuY29udGFpbnMoICdzdGFjaycgKSA9PT0gZmFsc2UgKSB7XG5cdFx0XHRcdC8vIENlbnRlciB0aGUgc2xpZGUgaW5zaWRlIG9mIHRoZSBwYWdlLCBnaXZpbmcgdGhlIHNsaWRlIHNvbWUgbWFyZ2luXG5cdFx0XHRcdHZhciBsZWZ0ID0gKCBwYWdlV2lkdGggLSBzbGlkZVdpZHRoICkgLyAyLFxuXHRcdFx0XHRcdHRvcCA9ICggcGFnZUhlaWdodCAtIHNsaWRlSGVpZ2h0ICkgLyAyO1xuXG5cdFx0XHRcdHZhciBjb250ZW50SGVpZ2h0ID0gc2xpZGUuc2Nyb2xsSGVpZ2h0O1xuXHRcdFx0XHR2YXIgbnVtYmVyT2ZQYWdlcyA9IE1hdGgubWF4KCBNYXRoLmNlaWwoIGNvbnRlbnRIZWlnaHQgLyBwYWdlSGVpZ2h0ICksIDEgKTtcblxuXHRcdFx0XHQvLyBBZGhlcmUgdG8gY29uZmlndXJlZCBwYWdlcyBwZXIgc2xpZGUgbGltaXRcblx0XHRcdFx0bnVtYmVyT2ZQYWdlcyA9IE1hdGgubWluKCBudW1iZXJPZlBhZ2VzLCBjb25maWcucGRmTWF4UGFnZXNQZXJTbGlkZSApO1xuXG5cdFx0XHRcdC8vIENlbnRlciBzbGlkZXMgdmVydGljYWxseVxuXHRcdFx0XHRpZiggbnVtYmVyT2ZQYWdlcyA9PT0gMSAmJiBjb25maWcuY2VudGVyIHx8IHNsaWRlLmNsYXNzTGlzdC5jb250YWlucyggJ2NlbnRlcicgKSApIHtcblx0XHRcdFx0XHR0b3AgPSBNYXRoLm1heCggKCBwYWdlSGVpZ2h0IC0gY29udGVudEhlaWdodCApIC8gMiwgMCApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gV3JhcCB0aGUgc2xpZGUgaW4gYSBwYWdlIGVsZW1lbnQgYW5kIGhpZGUgaXRzIG92ZXJmbG93XG5cdFx0XHRcdC8vIHNvIHRoYXQgbm8gcGFnZSBldmVyIGZsb3dzIG9udG8gYW5vdGhlclxuXHRcdFx0XHR2YXIgcGFnZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7XG5cdFx0XHRcdHBhZ2UuY2xhc3NOYW1lID0gJ3BkZi1wYWdlJztcblx0XHRcdFx0cGFnZS5zdHlsZS5oZWlnaHQgPSAoIHBhZ2VIZWlnaHQgKiBudW1iZXJPZlBhZ2VzICkgKyAncHgnO1xuXHRcdFx0XHRzbGlkZS5wYXJlbnROb2RlLmluc2VydEJlZm9yZSggcGFnZSwgc2xpZGUgKTtcblx0XHRcdFx0cGFnZS5hcHBlbmRDaGlsZCggc2xpZGUgKTtcblxuXHRcdFx0XHQvLyBQb3NpdGlvbiB0aGUgc2xpZGUgaW5zaWRlIG9mIHRoZSBwYWdlXG5cdFx0XHRcdHNsaWRlLnN0eWxlLmxlZnQgPSBsZWZ0ICsgJ3B4Jztcblx0XHRcdFx0c2xpZGUuc3R5bGUudG9wID0gdG9wICsgJ3B4Jztcblx0XHRcdFx0c2xpZGUuc3R5bGUud2lkdGggPSBzbGlkZVdpZHRoICsgJ3B4JztcblxuXHRcdFx0XHRpZiggc2xpZGUuc2xpZGVCYWNrZ3JvdW5kRWxlbWVudCApIHtcblx0XHRcdFx0XHRwYWdlLmluc2VydEJlZm9yZSggc2xpZGUuc2xpZGVCYWNrZ3JvdW5kRWxlbWVudCwgc2xpZGUgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEluamVjdCBub3RlcyBpZiBgc2hvd05vdGVzYCBpcyBlbmFibGVkXG5cdFx0XHRcdGlmKCBjb25maWcuc2hvd05vdGVzICkge1xuXG5cdFx0XHRcdFx0Ly8gQXJlIHRoZXJlIG5vdGVzIGZvciB0aGlzIHNsaWRlP1xuXHRcdFx0XHRcdHZhciBub3RlcyA9IGdldFNsaWRlTm90ZXMoIHNsaWRlICk7XG5cdFx0XHRcdFx0aWYoIG5vdGVzICkge1xuXG5cdFx0XHRcdFx0XHR2YXIgbm90ZXNTcGFjaW5nID0gODtcblx0XHRcdFx0XHRcdHZhciBub3Rlc0xheW91dCA9IHR5cGVvZiBjb25maWcuc2hvd05vdGVzID09PSAnc3RyaW5nJyA/IGNvbmZpZy5zaG93Tm90ZXMgOiAnaW5saW5lJztcblx0XHRcdFx0XHRcdHZhciBub3Rlc0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xuXHRcdFx0XHRcdFx0bm90ZXNFbGVtZW50LmNsYXNzTGlzdC5hZGQoICdzcGVha2VyLW5vdGVzJyApO1xuXHRcdFx0XHRcdFx0bm90ZXNFbGVtZW50LmNsYXNzTGlzdC5hZGQoICdzcGVha2VyLW5vdGVzLXBkZicgKTtcblx0XHRcdFx0XHRcdG5vdGVzRWxlbWVudC5zZXRBdHRyaWJ1dGUoICdkYXRhLWxheW91dCcsIG5vdGVzTGF5b3V0ICk7XG5cdFx0XHRcdFx0XHRub3Rlc0VsZW1lbnQuaW5uZXJIVE1MID0gbm90ZXM7XG5cblx0XHRcdFx0XHRcdGlmKCBub3Rlc0xheW91dCA9PT0gJ3NlcGFyYXRlLXBhZ2UnICkge1xuXHRcdFx0XHRcdFx0XHRwYWdlLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKCBub3Rlc0VsZW1lbnQsIHBhZ2UubmV4dFNpYmxpbmcgKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRub3Rlc0VsZW1lbnQuc3R5bGUubGVmdCA9IG5vdGVzU3BhY2luZyArICdweCc7XG5cdFx0XHRcdFx0XHRcdG5vdGVzRWxlbWVudC5zdHlsZS5ib3R0b20gPSBub3Rlc1NwYWNpbmcgKyAncHgnO1xuXHRcdFx0XHRcdFx0XHRub3Rlc0VsZW1lbnQuc3R5bGUud2lkdGggPSAoIHBhZ2VXaWR0aCAtIG5vdGVzU3BhY2luZyoyICkgKyAncHgnO1xuXHRcdFx0XHRcdFx0XHRwYWdlLmFwcGVuZENoaWxkKCBub3Rlc0VsZW1lbnQgKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gSW5qZWN0IHNsaWRlIG51bWJlcnMgaWYgYHNsaWRlTnVtYmVyc2AgYXJlIGVuYWJsZWRcblx0XHRcdFx0aWYoIGNvbmZpZy5zbGlkZU51bWJlciApIHtcblx0XHRcdFx0XHR2YXIgc2xpZGVOdW1iZXJIID0gcGFyc2VJbnQoIHNsaWRlLmdldEF0dHJpYnV0ZSggJ2RhdGEtaW5kZXgtaCcgKSwgMTAgKSArIDEsXG5cdFx0XHRcdFx0XHRzbGlkZU51bWJlclYgPSBwYXJzZUludCggc2xpZGUuZ2V0QXR0cmlidXRlKCAnZGF0YS1pbmRleC12JyApLCAxMCApICsgMTtcblxuXHRcdFx0XHRcdHZhciBudW1iZXJFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcblx0XHRcdFx0XHRudW1iZXJFbGVtZW50LmNsYXNzTGlzdC5hZGQoICdzbGlkZS1udW1iZXInICk7XG5cdFx0XHRcdFx0bnVtYmVyRWxlbWVudC5jbGFzc0xpc3QuYWRkKCAnc2xpZGUtbnVtYmVyLXBkZicgKTtcblx0XHRcdFx0XHRudW1iZXJFbGVtZW50LmlubmVySFRNTCA9IGZvcm1hdFNsaWRlTnVtYmVyKCBzbGlkZU51bWJlckgsICcuJywgc2xpZGVOdW1iZXJWICk7XG5cdFx0XHRcdFx0cGFnZS5hcHBlbmRDaGlsZCggbnVtYmVyRWxlbWVudCApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHR9ICk7XG5cblx0XHQvLyBTaG93IGFsbCBmcmFnbWVudHNcblx0XHR0b0FycmF5KCBkb20ud3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKCBTTElERVNfU0VMRUNUT1IgKyAnIC5mcmFnbWVudCcgKSApLmZvckVhY2goIGZ1bmN0aW9uKCBmcmFnbWVudCApIHtcblx0XHRcdGZyYWdtZW50LmNsYXNzTGlzdC5hZGQoICd2aXNpYmxlJyApO1xuXHRcdH0gKTtcblxuXHRcdC8vIE5vdGlmeSBzdWJzY3JpYmVycyB0aGF0IHRoZSBQREYgbGF5b3V0IGlzIGdvb2QgdG8gZ29cblx0XHRkaXNwYXRjaEV2ZW50KCAncGRmLXJlYWR5JyApO1xuXG5cdH1cblxuXHQvKipcblx0ICogVGhpcyBpcyBhbiB1bmZvcnR1bmF0ZSBuZWNlc3NpdHkuIFNvbWUgYWN0aW9ucyDigJMgc3VjaCBhc1xuXHQgKiBhbiBpbnB1dCBmaWVsZCBiZWluZyBmb2N1c2VkIGluIGFuIGlmcmFtZSBvciB1c2luZyB0aGVcblx0ICoga2V5Ym9hcmQgdG8gZXhwYW5kIHRleHQgc2VsZWN0aW9uIGJleW9uZCB0aGUgYm91bmRzIG9mXG5cdCAqIGEgc2xpZGUg4oCTIGNhbiB0cmlnZ2VyIG91ciBjb250ZW50IHRvIGJlIHB1c2hlZCBvdXQgb2Ygdmlldy5cblx0ICogVGhpcyBzY3JvbGxpbmcgY2FuIG5vdCBiZSBwcmV2ZW50ZWQgYnkgaGlkaW5nIG92ZXJmbG93IGluXG5cdCAqIENTUyAod2UgYWxyZWFkeSBkbykgc28gd2UgaGF2ZSB0byByZXNvcnQgdG8gcmVwZWF0ZWRseVxuXHQgKiBjaGVja2luZyBpZiB0aGUgc2xpZGVzIGhhdmUgYmVlbiBvZmZzZXQgOihcblx0ICovXG5cdGZ1bmN0aW9uIHNldHVwU2Nyb2xsUHJldmVudGlvbigpIHtcblxuXHRcdHNldEludGVydmFsKCBmdW5jdGlvbigpIHtcblx0XHRcdGlmKCBkb20ud3JhcHBlci5zY3JvbGxUb3AgIT09IDAgfHwgZG9tLndyYXBwZXIuc2Nyb2xsTGVmdCAhPT0gMCApIHtcblx0XHRcdFx0ZG9tLndyYXBwZXIuc2Nyb2xsVG9wID0gMDtcblx0XHRcdFx0ZG9tLndyYXBwZXIuc2Nyb2xsTGVmdCA9IDA7XG5cdFx0XHR9XG5cdFx0fSwgMTAwMCApO1xuXG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyBhbiBIVE1MIGVsZW1lbnQgYW5kIHJldHVybnMgYSByZWZlcmVuY2UgdG8gaXQuXG5cdCAqIElmIHRoZSBlbGVtZW50IGFscmVhZHkgZXhpc3RzIHRoZSBleGlzdGluZyBpbnN0YW5jZSB3aWxsXG5cdCAqIGJlIHJldHVybmVkLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXJcblx0ICogQHBhcmFtIHtzdHJpbmd9IHRhZ25hbWVcblx0ICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzbmFtZVxuXHQgKiBAcGFyYW0ge3N0cmluZ30gaW5uZXJIVE1MXG5cdCAqXG5cdCAqIEByZXR1cm4ge0hUTUxFbGVtZW50fVxuXHQgKi9cblx0ZnVuY3Rpb24gY3JlYXRlU2luZ2xldG9uTm9kZSggY29udGFpbmVyLCB0YWduYW1lLCBjbGFzc25hbWUsIGlubmVySFRNTCApIHtcblxuXHRcdC8vIEZpbmQgYWxsIG5vZGVzIG1hdGNoaW5nIHRoZSBkZXNjcmlwdGlvblxuXHRcdHZhciBub2RlcyA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yQWxsKCAnLicgKyBjbGFzc25hbWUgKTtcblxuXHRcdC8vIENoZWNrIGFsbCBtYXRjaGVzIHRvIGZpbmQgb25lIHdoaWNoIGlzIGEgZGlyZWN0IGNoaWxkIG9mXG5cdFx0Ly8gdGhlIHNwZWNpZmllZCBjb250YWluZXJcblx0XHRmb3IoIHZhciBpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgaSsrICkge1xuXHRcdFx0dmFyIHRlc3ROb2RlID0gbm9kZXNbaV07XG5cdFx0XHRpZiggdGVzdE5vZGUucGFyZW50Tm9kZSA9PT0gY29udGFpbmVyICkge1xuXHRcdFx0XHRyZXR1cm4gdGVzdE5vZGU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gSWYgbm8gbm9kZSB3YXMgZm91bmQsIGNyZWF0ZSBpdCBub3dcblx0XHR2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIHRhZ25hbWUgKTtcblx0XHRub2RlLmNsYXNzTGlzdC5hZGQoIGNsYXNzbmFtZSApO1xuXHRcdGlmKCB0eXBlb2YgaW5uZXJIVE1MID09PSAnc3RyaW5nJyApIHtcblx0XHRcdG5vZGUuaW5uZXJIVE1MID0gaW5uZXJIVE1MO1xuXHRcdH1cblx0XHRjb250YWluZXIuYXBwZW5kQ2hpbGQoIG5vZGUgKTtcblxuXHRcdHJldHVybiBub2RlO1xuXG5cdH1cblxuXHQvKipcblx0ICogQ3JlYXRlcyB0aGUgc2xpZGUgYmFja2dyb3VuZCBlbGVtZW50cyBhbmQgYXBwZW5kcyB0aGVtXG5cdCAqIHRvIHRoZSBiYWNrZ3JvdW5kIGNvbnRhaW5lci4gT25lIGVsZW1lbnQgaXMgY3JlYXRlZCBwZXJcblx0ICogc2xpZGUgbm8gbWF0dGVyIGlmIHRoZSBnaXZlbiBzbGlkZSBoYXMgdmlzaWJsZSBiYWNrZ3JvdW5kLlxuXHQgKi9cblx0ZnVuY3Rpb24gY3JlYXRlQmFja2dyb3VuZHMoKSB7XG5cblx0XHR2YXIgcHJpbnRNb2RlID0gaXNQcmludGluZ1BERigpO1xuXG5cdFx0Ly8gQ2xlYXIgcHJpb3IgYmFja2dyb3VuZHNcblx0XHRkb20uYmFja2dyb3VuZC5pbm5lckhUTUwgPSAnJztcblx0XHRkb20uYmFja2dyb3VuZC5jbGFzc0xpc3QuYWRkKCAnbm8tdHJhbnNpdGlvbicgKTtcblxuXHRcdC8vIEl0ZXJhdGUgb3ZlciBhbGwgaG9yaXpvbnRhbCBzbGlkZXNcblx0XHR0b0FycmF5KCBkb20ud3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKCBIT1JJWk9OVEFMX1NMSURFU19TRUxFQ1RPUiApICkuZm9yRWFjaCggZnVuY3Rpb24oIHNsaWRlaCApIHtcblxuXHRcdFx0dmFyIGJhY2tncm91bmRTdGFjayA9IGNyZWF0ZUJhY2tncm91bmQoIHNsaWRlaCwgZG9tLmJhY2tncm91bmQgKTtcblxuXHRcdFx0Ly8gSXRlcmF0ZSBvdmVyIGFsbCB2ZXJ0aWNhbCBzbGlkZXNcblx0XHRcdHRvQXJyYXkoIHNsaWRlaC5xdWVyeVNlbGVjdG9yQWxsKCAnc2VjdGlvbicgKSApLmZvckVhY2goIGZ1bmN0aW9uKCBzbGlkZXYgKSB7XG5cblx0XHRcdFx0Y3JlYXRlQmFja2dyb3VuZCggc2xpZGV2LCBiYWNrZ3JvdW5kU3RhY2sgKTtcblxuXHRcdFx0XHRiYWNrZ3JvdW5kU3RhY2suY2xhc3NMaXN0LmFkZCggJ3N0YWNrJyApO1xuXG5cdFx0XHR9ICk7XG5cblx0XHR9ICk7XG5cblx0XHQvLyBBZGQgcGFyYWxsYXggYmFja2dyb3VuZCBpZiBzcGVjaWZpZWRcblx0XHRpZiggY29uZmlnLnBhcmFsbGF4QmFja2dyb3VuZEltYWdlICkge1xuXG5cdFx0XHRkb20uYmFja2dyb3VuZC5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSAndXJsKFwiJyArIGNvbmZpZy5wYXJhbGxheEJhY2tncm91bmRJbWFnZSArICdcIiknO1xuXHRcdFx0ZG9tLmJhY2tncm91bmQuc3R5bGUuYmFja2dyb3VuZFNpemUgPSBjb25maWcucGFyYWxsYXhCYWNrZ3JvdW5kU2l6ZTtcblxuXHRcdFx0Ly8gTWFrZSBzdXJlIHRoZSBiZWxvdyBwcm9wZXJ0aWVzIGFyZSBzZXQgb24gdGhlIGVsZW1lbnQgLSB0aGVzZSBwcm9wZXJ0aWVzIGFyZVxuXHRcdFx0Ly8gbmVlZGVkIGZvciBwcm9wZXIgdHJhbnNpdGlvbnMgdG8gYmUgc2V0IG9uIHRoZSBlbGVtZW50IHZpYSBDU1MuIFRvIHJlbW92ZVxuXHRcdFx0Ly8gYW5ub3lpbmcgYmFja2dyb3VuZCBzbGlkZS1pbiBlZmZlY3Qgd2hlbiB0aGUgcHJlc2VudGF0aW9uIHN0YXJ0cywgYXBwbHlcblx0XHRcdC8vIHRoZXNlIHByb3BlcnRpZXMgYWZ0ZXIgc2hvcnQgdGltZSBkZWxheVxuXHRcdFx0c2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGRvbS53cmFwcGVyLmNsYXNzTGlzdC5hZGQoICdoYXMtcGFyYWxsYXgtYmFja2dyb3VuZCcgKTtcblx0XHRcdH0sIDEgKTtcblxuXHRcdH1cblx0XHRlbHNlIHtcblxuXHRcdFx0ZG9tLmJhY2tncm91bmQuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gJyc7XG5cdFx0XHRkb20ud3JhcHBlci5jbGFzc0xpc3QucmVtb3ZlKCAnaGFzLXBhcmFsbGF4LWJhY2tncm91bmQnICk7XG5cblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGVzIGEgYmFja2dyb3VuZCBmb3IgdGhlIGdpdmVuIHNsaWRlLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBzbGlkZVxuXHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBjb250YWluZXIgVGhlIGVsZW1lbnQgdGhhdCB0aGUgYmFja2dyb3VuZFxuXHQgKiBzaG91bGQgYmUgYXBwZW5kZWQgdG9cblx0ICogQHJldHVybiB7SFRNTEVsZW1lbnR9IE5ldyBiYWNrZ3JvdW5kIGRpdlxuXHQgKi9cblx0ZnVuY3Rpb24gY3JlYXRlQmFja2dyb3VuZCggc2xpZGUsIGNvbnRhaW5lciApIHtcblxuXHRcdHZhciBkYXRhID0ge1xuXHRcdFx0YmFja2dyb3VuZDogc2xpZGUuZ2V0QXR0cmlidXRlKCAnZGF0YS1iYWNrZ3JvdW5kJyApLFxuXHRcdFx0YmFja2dyb3VuZFNpemU6IHNsaWRlLmdldEF0dHJpYnV0ZSggJ2RhdGEtYmFja2dyb3VuZC1zaXplJyApLFxuXHRcdFx0YmFja2dyb3VuZEltYWdlOiBzbGlkZS5nZXRBdHRyaWJ1dGUoICdkYXRhLWJhY2tncm91bmQtaW1hZ2UnICksXG5cdFx0XHRiYWNrZ3JvdW5kVmlkZW86IHNsaWRlLmdldEF0dHJpYnV0ZSggJ2RhdGEtYmFja2dyb3VuZC12aWRlbycgKSxcblx0XHRcdGJhY2tncm91bmRJZnJhbWU6IHNsaWRlLmdldEF0dHJpYnV0ZSggJ2RhdGEtYmFja2dyb3VuZC1pZnJhbWUnICksXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IHNsaWRlLmdldEF0dHJpYnV0ZSggJ2RhdGEtYmFja2dyb3VuZC1jb2xvcicgKSxcblx0XHRcdGJhY2tncm91bmRSZXBlYXQ6IHNsaWRlLmdldEF0dHJpYnV0ZSggJ2RhdGEtYmFja2dyb3VuZC1yZXBlYXQnICksXG5cdFx0XHRiYWNrZ3JvdW5kUG9zaXRpb246IHNsaWRlLmdldEF0dHJpYnV0ZSggJ2RhdGEtYmFja2dyb3VuZC1wb3NpdGlvbicgKSxcblx0XHRcdGJhY2tncm91bmRUcmFuc2l0aW9uOiBzbGlkZS5nZXRBdHRyaWJ1dGUoICdkYXRhLWJhY2tncm91bmQtdHJhbnNpdGlvbicgKVxuXHRcdH07XG5cblx0XHR2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7XG5cblx0XHQvLyBDYXJyeSBvdmVyIGN1c3RvbSBjbGFzc2VzIGZyb20gdGhlIHNsaWRlIHRvIHRoZSBiYWNrZ3JvdW5kXG5cdFx0ZWxlbWVudC5jbGFzc05hbWUgPSAnc2xpZGUtYmFja2dyb3VuZCAnICsgc2xpZGUuY2xhc3NOYW1lLnJlcGxhY2UoIC9wcmVzZW50fHBhc3R8ZnV0dXJlLywgJycgKTtcblxuXHRcdGlmKCBkYXRhLmJhY2tncm91bmQgKSB7XG5cdFx0XHQvLyBBdXRvLXdyYXAgaW1hZ2UgdXJscyBpbiB1cmwoLi4uKVxuXHRcdFx0aWYoIC9eKGh0dHB8ZmlsZXxcXC9cXC8pL2dpLnRlc3QoIGRhdGEuYmFja2dyb3VuZCApIHx8IC9cXC4oc3ZnfHBuZ3xqcGd8anBlZ3xnaWZ8Ym1wKSQvZ2kudGVzdCggZGF0YS5iYWNrZ3JvdW5kICkgKSB7XG5cdFx0XHRcdHNsaWRlLnNldEF0dHJpYnV0ZSggJ2RhdGEtYmFja2dyb3VuZC1pbWFnZScsIGRhdGEuYmFja2dyb3VuZCApO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZCA9IGRhdGEuYmFja2dyb3VuZDtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBDcmVhdGUgYSBoYXNoIGZvciB0aGlzIGNvbWJpbmF0aW9uIG9mIGJhY2tncm91bmQgc2V0dGluZ3MuXG5cdFx0Ly8gVGhpcyBpcyB1c2VkIHRvIGRldGVybWluZSB3aGVuIHR3byBzbGlkZSBiYWNrZ3JvdW5kcyBhcmVcblx0XHQvLyB0aGUgc2FtZS5cblx0XHRpZiggZGF0YS5iYWNrZ3JvdW5kIHx8IGRhdGEuYmFja2dyb3VuZENvbG9yIHx8IGRhdGEuYmFja2dyb3VuZEltYWdlIHx8IGRhdGEuYmFja2dyb3VuZFZpZGVvIHx8IGRhdGEuYmFja2dyb3VuZElmcmFtZSApIHtcblx0XHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKCAnZGF0YS1iYWNrZ3JvdW5kLWhhc2gnLCBkYXRhLmJhY2tncm91bmQgK1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5iYWNrZ3JvdW5kU2l6ZSArXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLmJhY2tncm91bmRJbWFnZSArXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLmJhY2tncm91bmRWaWRlbyArXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRkYXRhLmJhY2tncm91bmRJZnJhbWUgK1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5iYWNrZ3JvdW5kQ29sb3IgK1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0ZGF0YS5iYWNrZ3JvdW5kUmVwZWF0ICtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGEuYmFja2dyb3VuZFBvc2l0aW9uICtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdGRhdGEuYmFja2dyb3VuZFRyYW5zaXRpb24gKTtcblx0XHR9XG5cblx0XHQvLyBBZGRpdGlvbmFsIGFuZCBvcHRpb25hbCBiYWNrZ3JvdW5kIHByb3BlcnRpZXNcblx0XHRpZiggZGF0YS5iYWNrZ3JvdW5kU2l6ZSApIGVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZFNpemUgPSBkYXRhLmJhY2tncm91bmRTaXplO1xuXHRcdGlmKCBkYXRhLmJhY2tncm91bmRDb2xvciApIGVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gZGF0YS5iYWNrZ3JvdW5kQ29sb3I7XG5cdFx0aWYoIGRhdGEuYmFja2dyb3VuZFJlcGVhdCApIGVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZFJlcGVhdCA9IGRhdGEuYmFja2dyb3VuZFJlcGVhdDtcblx0XHRpZiggZGF0YS5iYWNrZ3JvdW5kUG9zaXRpb24gKSBlbGVtZW50LnN0eWxlLmJhY2tncm91bmRQb3NpdGlvbiA9IGRhdGEuYmFja2dyb3VuZFBvc2l0aW9uO1xuXHRcdGlmKCBkYXRhLmJhY2tncm91bmRUcmFuc2l0aW9uICkgZWxlbWVudC5zZXRBdHRyaWJ1dGUoICdkYXRhLWJhY2tncm91bmQtdHJhbnNpdGlvbicsIGRhdGEuYmFja2dyb3VuZFRyYW5zaXRpb24gKTtcblxuXHRcdGNvbnRhaW5lci5hcHBlbmRDaGlsZCggZWxlbWVudCApO1xuXG5cdFx0Ly8gSWYgYmFja2dyb3VuZHMgYXJlIGJlaW5nIHJlY3JlYXRlZCwgY2xlYXIgb2xkIGNsYXNzZXNcblx0XHRzbGlkZS5jbGFzc0xpc3QucmVtb3ZlKCAnaGFzLWRhcmstYmFja2dyb3VuZCcgKTtcblx0XHRzbGlkZS5jbGFzc0xpc3QucmVtb3ZlKCAnaGFzLWxpZ2h0LWJhY2tncm91bmQnICk7XG5cblx0XHRzbGlkZS5zbGlkZUJhY2tncm91bmRFbGVtZW50ID0gZWxlbWVudDtcblxuXHRcdC8vIElmIHRoaXMgc2xpZGUgaGFzIGEgYmFja2dyb3VuZCBjb2xvciwgYWRkIGEgY2xhc3MgdGhhdFxuXHRcdC8vIHNpZ25hbHMgaWYgaXQgaXMgbGlnaHQgb3IgZGFyay4gSWYgdGhlIHNsaWRlIGhhcyBubyBiYWNrZ3JvdW5kXG5cdFx0Ly8gY29sb3IsIG5vIGNsYXNzIHdpbGwgYmUgc2V0XG5cdFx0dmFyIGNvbXB1dGVkQmFja2dyb3VuZFN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoIGVsZW1lbnQgKTtcblx0XHRpZiggY29tcHV0ZWRCYWNrZ3JvdW5kU3R5bGUgJiYgY29tcHV0ZWRCYWNrZ3JvdW5kU3R5bGUuYmFja2dyb3VuZENvbG9yICkge1xuXHRcdFx0dmFyIHJnYiA9IGNvbG9yVG9SZ2IoIGNvbXB1dGVkQmFja2dyb3VuZFN0eWxlLmJhY2tncm91bmRDb2xvciApO1xuXG5cdFx0XHQvLyBJZ25vcmUgZnVsbHkgdHJhbnNwYXJlbnQgYmFja2dyb3VuZHMuIFNvbWUgYnJvd3NlcnMgcmV0dXJuXG5cdFx0XHQvLyByZ2JhKDAsMCwwLDApIHdoZW4gcmVhZGluZyB0aGUgY29tcHV0ZWQgYmFja2dyb3VuZCBjb2xvciBvZlxuXHRcdFx0Ly8gYW4gZWxlbWVudCB3aXRoIG5vIGJhY2tncm91bmRcblx0XHRcdGlmKCByZ2IgJiYgcmdiLmEgIT09IDAgKSB7XG5cdFx0XHRcdGlmKCBjb2xvckJyaWdodG5lc3MoIGNvbXB1dGVkQmFja2dyb3VuZFN0eWxlLmJhY2tncm91bmRDb2xvciApIDwgMTI4ICkge1xuXHRcdFx0XHRcdHNsaWRlLmNsYXNzTGlzdC5hZGQoICdoYXMtZGFyay1iYWNrZ3JvdW5kJyApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHNsaWRlLmNsYXNzTGlzdC5hZGQoICdoYXMtbGlnaHQtYmFja2dyb3VuZCcgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBlbGVtZW50O1xuXG5cdH1cblxuXHQvKipcblx0ICogUmVnaXN0ZXJzIGEgbGlzdGVuZXIgdG8gcG9zdE1lc3NhZ2UgZXZlbnRzLCB0aGlzIG1ha2VzIGl0XG5cdCAqIHBvc3NpYmxlIHRvIGNhbGwgYWxsIHJldmVhbC5qcyBBUEkgbWV0aG9kcyBmcm9tIGFub3RoZXJcblx0ICogd2luZG93LiBGb3IgZXhhbXBsZTpcblx0ICpcblx0ICogcmV2ZWFsV2luZG93LnBvc3RNZXNzYWdlKCBKU09OLnN0cmluZ2lmeSh7XG5cdCAqICAgbWV0aG9kOiAnc2xpZGUnLFxuXHQgKiAgIGFyZ3M6IFsgMiBdXG5cdCAqIH0pLCAnKicgKTtcblx0ICovXG5cdGZ1bmN0aW9uIHNldHVwUG9zdE1lc3NhZ2UoKSB7XG5cblx0XHRpZiggY29uZmlnLnBvc3RNZXNzYWdlICkge1xuXHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdtZXNzYWdlJywgZnVuY3Rpb24gKCBldmVudCApIHtcblx0XHRcdFx0dmFyIGRhdGEgPSBldmVudC5kYXRhO1xuXG5cdFx0XHRcdC8vIE1ha2Ugc3VyZSB3ZSdyZSBkZWFsaW5nIHdpdGggSlNPTlxuXHRcdFx0XHRpZiggdHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnICYmIGRhdGEuY2hhckF0KCAwICkgPT09ICd7JyAmJiBkYXRhLmNoYXJBdCggZGF0YS5sZW5ndGggLSAxICkgPT09ICd9JyApIHtcblx0XHRcdFx0XHRkYXRhID0gSlNPTi5wYXJzZSggZGF0YSApO1xuXG5cdFx0XHRcdFx0Ly8gQ2hlY2sgaWYgdGhlIHJlcXVlc3RlZCBtZXRob2QgY2FuIGJlIGZvdW5kXG5cdFx0XHRcdFx0aWYoIGRhdGEubWV0aG9kICYmIHR5cGVvZiBSZXZlYWxbZGF0YS5tZXRob2RdID09PSAnZnVuY3Rpb24nICkge1xuXHRcdFx0XHRcdFx0UmV2ZWFsW2RhdGEubWV0aG9kXS5hcHBseSggUmV2ZWFsLCBkYXRhLmFyZ3MgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0sIGZhbHNlICk7XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogQXBwbGllcyB0aGUgY29uZmlndXJhdGlvbiBzZXR0aW5ncyBmcm9tIHRoZSBjb25maWdcblx0ICogb2JqZWN0LiBNYXkgYmUgY2FsbGVkIG11bHRpcGxlIHRpbWVzLlxuXHQgKlxuXHQgKiBAcGFyYW0ge29iamVjdH0gb3B0aW9uc1xuXHQgKi9cblx0ZnVuY3Rpb24gY29uZmlndXJlKCBvcHRpb25zICkge1xuXG5cdFx0dmFyIG51bWJlck9mU2xpZGVzID0gZG9tLndyYXBwZXIucXVlcnlTZWxlY3RvckFsbCggU0xJREVTX1NFTEVDVE9SICkubGVuZ3RoO1xuXG5cdFx0ZG9tLndyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZSggY29uZmlnLnRyYW5zaXRpb24gKTtcblxuXHRcdC8vIE5ldyBjb25maWcgb3B0aW9ucyBtYXkgYmUgcGFzc2VkIHdoZW4gdGhpcyBtZXRob2Rcblx0XHQvLyBpcyBpbnZva2VkIHRocm91Z2ggdGhlIEFQSSBhZnRlciBpbml0aWFsaXphdGlvblxuXHRcdGlmKCB0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcgKSBleHRlbmQoIGNvbmZpZywgb3B0aW9ucyApO1xuXG5cdFx0Ly8gRm9yY2UgbGluZWFyIHRyYW5zaXRpb24gYmFzZWQgb24gYnJvd3NlciBjYXBhYmlsaXRpZXNcblx0XHRpZiggZmVhdHVyZXMudHJhbnNmb3JtczNkID09PSBmYWxzZSApIGNvbmZpZy50cmFuc2l0aW9uID0gJ2xpbmVhcic7XG5cblx0XHRkb20ud3JhcHBlci5jbGFzc0xpc3QuYWRkKCBjb25maWcudHJhbnNpdGlvbiApO1xuXG5cdFx0ZG9tLndyYXBwZXIuc2V0QXR0cmlidXRlKCAnZGF0YS10cmFuc2l0aW9uLXNwZWVkJywgY29uZmlnLnRyYW5zaXRpb25TcGVlZCApO1xuXHRcdGRvbS53cmFwcGVyLnNldEF0dHJpYnV0ZSggJ2RhdGEtYmFja2dyb3VuZC10cmFuc2l0aW9uJywgY29uZmlnLmJhY2tncm91bmRUcmFuc2l0aW9uICk7XG5cblx0XHRkb20uY29udHJvbHMuc3R5bGUuZGlzcGxheSA9IGNvbmZpZy5jb250cm9scyA/ICdibG9jaycgOiAnbm9uZSc7XG5cdFx0ZG9tLnByb2dyZXNzLnN0eWxlLmRpc3BsYXkgPSBjb25maWcucHJvZ3Jlc3MgPyAnYmxvY2snIDogJ25vbmUnO1xuXHRcdGRvbS5zbGlkZU51bWJlci5zdHlsZS5kaXNwbGF5ID0gY29uZmlnLnNsaWRlTnVtYmVyICYmICFpc1ByaW50aW5nUERGKCkgPyAnYmxvY2snIDogJ25vbmUnO1xuXG5cdFx0aWYoIGNvbmZpZy5zaHVmZmxlICkge1xuXHRcdFx0c2h1ZmZsZSgpO1xuXHRcdH1cblxuXHRcdGlmKCBjb25maWcucnRsICkge1xuXHRcdFx0ZG9tLndyYXBwZXIuY2xhc3NMaXN0LmFkZCggJ3J0bCcgKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRkb20ud3JhcHBlci5jbGFzc0xpc3QucmVtb3ZlKCAncnRsJyApO1xuXHRcdH1cblxuXHRcdGlmKCBjb25maWcuY2VudGVyICkge1xuXHRcdFx0ZG9tLndyYXBwZXIuY2xhc3NMaXN0LmFkZCggJ2NlbnRlcicgKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRkb20ud3JhcHBlci5jbGFzc0xpc3QucmVtb3ZlKCAnY2VudGVyJyApO1xuXHRcdH1cblxuXHRcdC8vIEV4aXQgdGhlIHBhdXNlZCBtb2RlIGlmIGl0IHdhcyBjb25maWd1cmVkIG9mZlxuXHRcdGlmKCBjb25maWcucGF1c2UgPT09IGZhbHNlICkge1xuXHRcdFx0cmVzdW1lKCk7XG5cdFx0fVxuXG5cdFx0aWYoIGNvbmZpZy5zaG93Tm90ZXMgKSB7XG5cdFx0XHRkb20uc3BlYWtlck5vdGVzLmNsYXNzTGlzdC5hZGQoICd2aXNpYmxlJyApO1xuXHRcdFx0ZG9tLnNwZWFrZXJOb3Rlcy5zZXRBdHRyaWJ1dGUoICdkYXRhLWxheW91dCcsIHR5cGVvZiBjb25maWcuc2hvd05vdGVzID09PSAnc3RyaW5nJyA/IGNvbmZpZy5zaG93Tm90ZXMgOiAnaW5saW5lJyApO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGRvbS5zcGVha2VyTm90ZXMuY2xhc3NMaXN0LnJlbW92ZSggJ3Zpc2libGUnICk7XG5cdFx0fVxuXG5cdFx0aWYoIGNvbmZpZy5tb3VzZVdoZWVsICkge1xuXHRcdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ0RPTU1vdXNlU2Nyb2xsJywgb25Eb2N1bWVudE1vdXNlU2Nyb2xsLCBmYWxzZSApOyAvLyBGRlxuXHRcdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ21vdXNld2hlZWwnLCBvbkRvY3VtZW50TW91c2VTY3JvbGwsIGZhbHNlICk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ0RPTU1vdXNlU2Nyb2xsJywgb25Eb2N1bWVudE1vdXNlU2Nyb2xsLCBmYWxzZSApOyAvLyBGRlxuXHRcdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ21vdXNld2hlZWwnLCBvbkRvY3VtZW50TW91c2VTY3JvbGwsIGZhbHNlICk7XG5cdFx0fVxuXG5cdFx0Ly8gUm9sbGluZyAzRCBsaW5rc1xuXHRcdGlmKCBjb25maWcucm9sbGluZ0xpbmtzICkge1xuXHRcdFx0ZW5hYmxlUm9sbGluZ0xpbmtzKCk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0ZGlzYWJsZVJvbGxpbmdMaW5rcygpO1xuXHRcdH1cblxuXHRcdC8vIElmcmFtZSBsaW5rIHByZXZpZXdzXG5cdFx0aWYoIGNvbmZpZy5wcmV2aWV3TGlua3MgKSB7XG5cdFx0XHRlbmFibGVQcmV2aWV3TGlua3MoKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRkaXNhYmxlUHJldmlld0xpbmtzKCk7XG5cdFx0XHRlbmFibGVQcmV2aWV3TGlua3MoICdbZGF0YS1wcmV2aWV3LWxpbmtdJyApO1xuXHRcdH1cblxuXHRcdC8vIFJlbW92ZSBleGlzdGluZyBhdXRvLXNsaWRlIGNvbnRyb2xzXG5cdFx0aWYoIGF1dG9TbGlkZVBsYXllciApIHtcblx0XHRcdGF1dG9TbGlkZVBsYXllci5kZXN0cm95KCk7XG5cdFx0XHRhdXRvU2xpZGVQbGF5ZXIgPSBudWxsO1xuXHRcdH1cblxuXHRcdC8vIEdlbmVyYXRlIGF1dG8tc2xpZGUgY29udHJvbHMgaWYgbmVlZGVkXG5cdFx0aWYoIG51bWJlck9mU2xpZGVzID4gMSAmJiBjb25maWcuYXV0b1NsaWRlICYmIGNvbmZpZy5hdXRvU2xpZGVTdG9wcGFibGUgJiYgZmVhdHVyZXMuY2FudmFzICYmIGZlYXR1cmVzLnJlcXVlc3RBbmltYXRpb25GcmFtZSApIHtcblx0XHRcdGF1dG9TbGlkZVBsYXllciA9IG5ldyBQbGF5YmFjayggZG9tLndyYXBwZXIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4gTWF0aC5taW4oIE1hdGgubWF4KCAoIERhdGUubm93KCkgLSBhdXRvU2xpZGVTdGFydFRpbWUgKSAvIGF1dG9TbGlkZSwgMCApLCAxICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdGF1dG9TbGlkZVBsYXllci5vbiggJ2NsaWNrJywgb25BdXRvU2xpZGVQbGF5ZXJDbGljayApO1xuXHRcdFx0YXV0b1NsaWRlUGF1c2VkID0gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gV2hlbiBmcmFnbWVudHMgYXJlIHR1cm5lZCBvZmYgdGhleSBzaG91bGQgYmUgdmlzaWJsZVxuXHRcdGlmKCBjb25maWcuZnJhZ21lbnRzID09PSBmYWxzZSApIHtcblx0XHRcdHRvQXJyYXkoIGRvbS5zbGlkZXMucXVlcnlTZWxlY3RvckFsbCggJy5mcmFnbWVudCcgKSApLmZvckVhY2goIGZ1bmN0aW9uKCBlbGVtZW50ICkge1xuXHRcdFx0XHRlbGVtZW50LmNsYXNzTGlzdC5hZGQoICd2aXNpYmxlJyApO1xuXHRcdFx0XHRlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoICdjdXJyZW50LWZyYWdtZW50JyApO1xuXHRcdFx0fSApO1xuXHRcdH1cblxuXHRcdHN5bmMoKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIEJpbmRzIGFsbCBldmVudCBsaXN0ZW5lcnMuXG5cdCAqL1xuXHRmdW5jdGlvbiBhZGRFdmVudExpc3RlbmVycygpIHtcblxuXHRcdGV2ZW50c0FyZUJvdW5kID0gdHJ1ZTtcblxuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAnaGFzaGNoYW5nZScsIG9uV2luZG93SGFzaENoYW5nZSwgZmFsc2UgKTtcblx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ3Jlc2l6ZScsIG9uV2luZG93UmVzaXplLCBmYWxzZSApO1xuXG5cdFx0aWYoIGNvbmZpZy50b3VjaCApIHtcblx0XHRcdGRvbS53cmFwcGVyLmFkZEV2ZW50TGlzdGVuZXIoICd0b3VjaHN0YXJ0Jywgb25Ub3VjaFN0YXJ0LCBmYWxzZSApO1xuXHRcdFx0ZG9tLndyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lciggJ3RvdWNobW92ZScsIG9uVG91Y2hNb3ZlLCBmYWxzZSApO1xuXHRcdFx0ZG9tLndyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lciggJ3RvdWNoZW5kJywgb25Ub3VjaEVuZCwgZmFsc2UgKTtcblxuXHRcdFx0Ly8gU3VwcG9ydCBwb2ludGVyLXN0eWxlIHRvdWNoIGludGVyYWN0aW9uIGFzIHdlbGxcblx0XHRcdGlmKCB3aW5kb3cubmF2aWdhdG9yLnBvaW50ZXJFbmFibGVkICkge1xuXHRcdFx0XHQvLyBJRSAxMSB1c2VzIHVuLXByZWZpeGVkIHZlcnNpb24gb2YgcG9pbnRlciBldmVudHNcblx0XHRcdFx0ZG9tLndyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lciggJ3BvaW50ZXJkb3duJywgb25Qb2ludGVyRG93biwgZmFsc2UgKTtcblx0XHRcdFx0ZG9tLndyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lciggJ3BvaW50ZXJtb3ZlJywgb25Qb2ludGVyTW92ZSwgZmFsc2UgKTtcblx0XHRcdFx0ZG9tLndyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lciggJ3BvaW50ZXJ1cCcsIG9uUG9pbnRlclVwLCBmYWxzZSApO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiggd2luZG93Lm5hdmlnYXRvci5tc1BvaW50ZXJFbmFibGVkICkge1xuXHRcdFx0XHQvLyBJRSAxMCB1c2VzIHByZWZpeGVkIHZlcnNpb24gb2YgcG9pbnRlciBldmVudHNcblx0XHRcdFx0ZG9tLndyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lciggJ01TUG9pbnRlckRvd24nLCBvblBvaW50ZXJEb3duLCBmYWxzZSApO1xuXHRcdFx0XHRkb20ud3JhcHBlci5hZGRFdmVudExpc3RlbmVyKCAnTVNQb2ludGVyTW92ZScsIG9uUG9pbnRlck1vdmUsIGZhbHNlICk7XG5cdFx0XHRcdGRvbS53cmFwcGVyLmFkZEV2ZW50TGlzdGVuZXIoICdNU1BvaW50ZXJVcCcsIG9uUG9pbnRlclVwLCBmYWxzZSApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmKCBjb25maWcua2V5Ym9hcmQgKSB7XG5cdFx0XHRkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCAna2V5ZG93bicsIG9uRG9jdW1lbnRLZXlEb3duLCBmYWxzZSApO1xuXHRcdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggJ2tleXByZXNzJywgb25Eb2N1bWVudEtleVByZXNzLCBmYWxzZSApO1xuXHRcdH1cblxuXHRcdGlmKCBjb25maWcucHJvZ3Jlc3MgJiYgZG9tLnByb2dyZXNzICkge1xuXHRcdFx0ZG9tLnByb2dyZXNzLmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIG9uUHJvZ3Jlc3NDbGlja2VkLCBmYWxzZSApO1xuXHRcdH1cblxuXHRcdGlmKCBjb25maWcuZm9jdXNCb2R5T25QYWdlVmlzaWJpbGl0eUNoYW5nZSApIHtcblx0XHRcdHZhciB2aXNpYmlsaXR5Q2hhbmdlO1xuXG5cdFx0XHRpZiggJ2hpZGRlbicgaW4gZG9jdW1lbnQgKSB7XG5cdFx0XHRcdHZpc2liaWxpdHlDaGFuZ2UgPSAndmlzaWJpbGl0eWNoYW5nZSc7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmKCAnbXNIaWRkZW4nIGluIGRvY3VtZW50ICkge1xuXHRcdFx0XHR2aXNpYmlsaXR5Q2hhbmdlID0gJ21zdmlzaWJpbGl0eWNoYW5nZSc7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmKCAnd2Via2l0SGlkZGVuJyBpbiBkb2N1bWVudCApIHtcblx0XHRcdFx0dmlzaWJpbGl0eUNoYW5nZSA9ICd3ZWJraXR2aXNpYmlsaXR5Y2hhbmdlJztcblx0XHRcdH1cblxuXHRcdFx0aWYoIHZpc2liaWxpdHlDaGFuZ2UgKSB7XG5cdFx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoIHZpc2liaWxpdHlDaGFuZ2UsIG9uUGFnZVZpc2liaWxpdHlDaGFuZ2UsIGZhbHNlICk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gTGlzdGVuIHRvIGJvdGggdG91Y2ggYW5kIGNsaWNrIGV2ZW50cywgaW4gY2FzZSB0aGUgZGV2aWNlXG5cdFx0Ly8gc3VwcG9ydHMgYm90aFxuXHRcdHZhciBwb2ludGVyRXZlbnRzID0gWyAndG91Y2hzdGFydCcsICdjbGljaycgXTtcblxuXHRcdC8vIE9ubHkgc3VwcG9ydCB0b3VjaCBmb3IgQW5kcm9pZCwgZml4ZXMgZG91YmxlIG5hdmlnYXRpb25zIGluXG5cdFx0Ly8gc3RvY2sgYnJvd3NlclxuXHRcdGlmKCBVQS5tYXRjaCggL2FuZHJvaWQvZ2kgKSApIHtcblx0XHRcdHBvaW50ZXJFdmVudHMgPSBbICd0b3VjaHN0YXJ0JyBdO1xuXHRcdH1cblxuXHRcdHBvaW50ZXJFdmVudHMuZm9yRWFjaCggZnVuY3Rpb24oIGV2ZW50TmFtZSApIHtcblx0XHRcdGRvbS5jb250cm9sc0xlZnQuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkgeyBlbC5hZGRFdmVudExpc3RlbmVyKCBldmVudE5hbWUsIG9uTmF2aWdhdGVMZWZ0Q2xpY2tlZCwgZmFsc2UgKTsgfSApO1xuXHRcdFx0ZG9tLmNvbnRyb2xzUmlnaHQuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkgeyBlbC5hZGRFdmVudExpc3RlbmVyKCBldmVudE5hbWUsIG9uTmF2aWdhdGVSaWdodENsaWNrZWQsIGZhbHNlICk7IH0gKTtcblx0XHRcdGRvbS5jb250cm9sc1VwLmZvckVhY2goIGZ1bmN0aW9uKCBlbCApIHsgZWwuYWRkRXZlbnRMaXN0ZW5lciggZXZlbnROYW1lLCBvbk5hdmlnYXRlVXBDbGlja2VkLCBmYWxzZSApOyB9ICk7XG5cdFx0XHRkb20uY29udHJvbHNEb3duLmZvckVhY2goIGZ1bmN0aW9uKCBlbCApIHsgZWwuYWRkRXZlbnRMaXN0ZW5lciggZXZlbnROYW1lLCBvbk5hdmlnYXRlRG93bkNsaWNrZWQsIGZhbHNlICk7IH0gKTtcblx0XHRcdGRvbS5jb250cm9sc1ByZXYuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkgeyBlbC5hZGRFdmVudExpc3RlbmVyKCBldmVudE5hbWUsIG9uTmF2aWdhdGVQcmV2Q2xpY2tlZCwgZmFsc2UgKTsgfSApO1xuXHRcdFx0ZG9tLmNvbnRyb2xzTmV4dC5mb3JFYWNoKCBmdW5jdGlvbiggZWwgKSB7IGVsLmFkZEV2ZW50TGlzdGVuZXIoIGV2ZW50TmFtZSwgb25OYXZpZ2F0ZU5leHRDbGlja2VkLCBmYWxzZSApOyB9ICk7XG5cdFx0fSApO1xuXG5cdH1cblxuXHQvKipcblx0ICogVW5iaW5kcyBhbGwgZXZlbnQgbGlzdGVuZXJzLlxuXHQgKi9cblx0ZnVuY3Rpb24gcmVtb3ZlRXZlbnRMaXN0ZW5lcnMoKSB7XG5cblx0XHRldmVudHNBcmVCb3VuZCA9IGZhbHNlO1xuXG5cdFx0ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ2tleWRvd24nLCBvbkRvY3VtZW50S2V5RG93biwgZmFsc2UgKTtcblx0XHRkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCAna2V5cHJlc3MnLCBvbkRvY3VtZW50S2V5UHJlc3MsIGZhbHNlICk7XG5cdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdoYXNoY2hhbmdlJywgb25XaW5kb3dIYXNoQ2hhbmdlLCBmYWxzZSApO1xuXHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCAncmVzaXplJywgb25XaW5kb3dSZXNpemUsIGZhbHNlICk7XG5cblx0XHRkb20ud3JhcHBlci5yZW1vdmVFdmVudExpc3RlbmVyKCAndG91Y2hzdGFydCcsIG9uVG91Y2hTdGFydCwgZmFsc2UgKTtcblx0XHRkb20ud3JhcHBlci5yZW1vdmVFdmVudExpc3RlbmVyKCAndG91Y2htb3ZlJywgb25Ub3VjaE1vdmUsIGZhbHNlICk7XG5cdFx0ZG9tLndyYXBwZXIucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ3RvdWNoZW5kJywgb25Ub3VjaEVuZCwgZmFsc2UgKTtcblxuXHRcdC8vIElFMTFcblx0XHRpZiggd2luZG93Lm5hdmlnYXRvci5wb2ludGVyRW5hYmxlZCApIHtcblx0XHRcdGRvbS53cmFwcGVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoICdwb2ludGVyZG93bicsIG9uUG9pbnRlckRvd24sIGZhbHNlICk7XG5cdFx0XHRkb20ud3JhcHBlci5yZW1vdmVFdmVudExpc3RlbmVyKCAncG9pbnRlcm1vdmUnLCBvblBvaW50ZXJNb3ZlLCBmYWxzZSApO1xuXHRcdFx0ZG9tLndyYXBwZXIucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ3BvaW50ZXJ1cCcsIG9uUG9pbnRlclVwLCBmYWxzZSApO1xuXHRcdH1cblx0XHQvLyBJRTEwXG5cdFx0ZWxzZSBpZiggd2luZG93Lm5hdmlnYXRvci5tc1BvaW50ZXJFbmFibGVkICkge1xuXHRcdFx0ZG9tLndyYXBwZXIucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ01TUG9pbnRlckRvd24nLCBvblBvaW50ZXJEb3duLCBmYWxzZSApO1xuXHRcdFx0ZG9tLndyYXBwZXIucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ01TUG9pbnRlck1vdmUnLCBvblBvaW50ZXJNb3ZlLCBmYWxzZSApO1xuXHRcdFx0ZG9tLndyYXBwZXIucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ01TUG9pbnRlclVwJywgb25Qb2ludGVyVXAsIGZhbHNlICk7XG5cdFx0fVxuXG5cdFx0aWYgKCBjb25maWcucHJvZ3Jlc3MgJiYgZG9tLnByb2dyZXNzICkge1xuXHRcdFx0ZG9tLnByb2dyZXNzLnJlbW92ZUV2ZW50TGlzdGVuZXIoICdjbGljaycsIG9uUHJvZ3Jlc3NDbGlja2VkLCBmYWxzZSApO1xuXHRcdH1cblxuXHRcdFsgJ3RvdWNoc3RhcnQnLCAnY2xpY2snIF0uZm9yRWFjaCggZnVuY3Rpb24oIGV2ZW50TmFtZSApIHtcblx0XHRcdGRvbS5jb250cm9sc0xlZnQuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkgeyBlbC5yZW1vdmVFdmVudExpc3RlbmVyKCBldmVudE5hbWUsIG9uTmF2aWdhdGVMZWZ0Q2xpY2tlZCwgZmFsc2UgKTsgfSApO1xuXHRcdFx0ZG9tLmNvbnRyb2xzUmlnaHQuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkgeyBlbC5yZW1vdmVFdmVudExpc3RlbmVyKCBldmVudE5hbWUsIG9uTmF2aWdhdGVSaWdodENsaWNrZWQsIGZhbHNlICk7IH0gKTtcblx0XHRcdGRvbS5jb250cm9sc1VwLmZvckVhY2goIGZ1bmN0aW9uKCBlbCApIHsgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lciggZXZlbnROYW1lLCBvbk5hdmlnYXRlVXBDbGlja2VkLCBmYWxzZSApOyB9ICk7XG5cdFx0XHRkb20uY29udHJvbHNEb3duLmZvckVhY2goIGZ1bmN0aW9uKCBlbCApIHsgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lciggZXZlbnROYW1lLCBvbk5hdmlnYXRlRG93bkNsaWNrZWQsIGZhbHNlICk7IH0gKTtcblx0XHRcdGRvbS5jb250cm9sc1ByZXYuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkgeyBlbC5yZW1vdmVFdmVudExpc3RlbmVyKCBldmVudE5hbWUsIG9uTmF2aWdhdGVQcmV2Q2xpY2tlZCwgZmFsc2UgKTsgfSApO1xuXHRcdFx0ZG9tLmNvbnRyb2xzTmV4dC5mb3JFYWNoKCBmdW5jdGlvbiggZWwgKSB7IGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoIGV2ZW50TmFtZSwgb25OYXZpZ2F0ZU5leHRDbGlja2VkLCBmYWxzZSApOyB9ICk7XG5cdFx0fSApO1xuXG5cdH1cblxuXHQvKipcblx0ICogRXh0ZW5kIG9iamVjdCBhIHdpdGggdGhlIHByb3BlcnRpZXMgb2Ygb2JqZWN0IGIuXG5cdCAqIElmIHRoZXJlJ3MgYSBjb25mbGljdCwgb2JqZWN0IGIgdGFrZXMgcHJlY2VkZW5jZS5cblx0ICpcblx0ICogQHBhcmFtIHtvYmplY3R9IGFcblx0ICogQHBhcmFtIHtvYmplY3R9IGJcblx0ICovXG5cdGZ1bmN0aW9uIGV4dGVuZCggYSwgYiApIHtcblxuXHRcdGZvciggdmFyIGkgaW4gYiApIHtcblx0XHRcdGFbIGkgXSA9IGJbIGkgXTtcblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0cyB0aGUgdGFyZ2V0IG9iamVjdCB0byBhbiBhcnJheS5cblx0ICpcblx0ICogQHBhcmFtIHtvYmplY3R9IG9cblx0ICogQHJldHVybiB7b2JqZWN0W119XG5cdCAqL1xuXHRmdW5jdGlvbiB0b0FycmF5KCBvICkge1xuXG5cdFx0cmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCBvICk7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBVdGlsaXR5IGZvciBkZXNlcmlhbGl6aW5nIGEgdmFsdWUuXG5cdCAqXG5cdCAqIEBwYXJhbSB7Kn0gdmFsdWVcblx0ICogQHJldHVybiB7Kn1cblx0ICovXG5cdGZ1bmN0aW9uIGRlc2VyaWFsaXplKCB2YWx1ZSApIHtcblxuXHRcdGlmKCB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnICkge1xuXHRcdFx0aWYoIHZhbHVlID09PSAnbnVsbCcgKSByZXR1cm4gbnVsbDtcblx0XHRcdGVsc2UgaWYoIHZhbHVlID09PSAndHJ1ZScgKSByZXR1cm4gdHJ1ZTtcblx0XHRcdGVsc2UgaWYoIHZhbHVlID09PSAnZmFsc2UnICkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0ZWxzZSBpZiggdmFsdWUubWF0Y2goIC9eXFxkKyQvICkgKSByZXR1cm4gcGFyc2VGbG9hdCggdmFsdWUgKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdmFsdWU7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBNZWFzdXJlcyB0aGUgZGlzdGFuY2UgaW4gcGl4ZWxzIGJldHdlZW4gcG9pbnQgYVxuXHQgKiBhbmQgcG9pbnQgYi5cblx0ICpcblx0ICogQHBhcmFtIHtvYmplY3R9IGEgcG9pbnQgd2l0aCB4L3kgcHJvcGVydGllc1xuXHQgKiBAcGFyYW0ge29iamVjdH0gYiBwb2ludCB3aXRoIHgveSBwcm9wZXJ0aWVzXG5cdCAqXG5cdCAqIEByZXR1cm4ge251bWJlcn1cblx0ICovXG5cdGZ1bmN0aW9uIGRpc3RhbmNlQmV0d2VlbiggYSwgYiApIHtcblxuXHRcdHZhciBkeCA9IGEueCAtIGIueCxcblx0XHRcdGR5ID0gYS55IC0gYi55O1xuXG5cdFx0cmV0dXJuIE1hdGguc3FydCggZHgqZHggKyBkeSpkeSApO1xuXG5cdH1cblxuXHQvKipcblx0ICogQXBwbGllcyBhIENTUyB0cmFuc2Zvcm0gdG8gdGhlIHRhcmdldCBlbGVtZW50LlxuXHQgKlxuXHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB0cmFuc2Zvcm1cblx0ICovXG5cdGZ1bmN0aW9uIHRyYW5zZm9ybUVsZW1lbnQoIGVsZW1lbnQsIHRyYW5zZm9ybSApIHtcblxuXHRcdGVsZW1lbnQuc3R5bGUuV2Via2l0VHJhbnNmb3JtID0gdHJhbnNmb3JtO1xuXHRcdGVsZW1lbnQuc3R5bGUuTW96VHJhbnNmb3JtID0gdHJhbnNmb3JtO1xuXHRcdGVsZW1lbnQuc3R5bGUubXNUcmFuc2Zvcm0gPSB0cmFuc2Zvcm07XG5cdFx0ZWxlbWVudC5zdHlsZS50cmFuc2Zvcm0gPSB0cmFuc2Zvcm07XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBBcHBsaWVzIENTUyB0cmFuc2Zvcm1zIHRvIHRoZSBzbGlkZXMgY29udGFpbmVyLiBUaGUgY29udGFpbmVyXG5cdCAqIGlzIHRyYW5zZm9ybWVkIGZyb20gdHdvIHNlcGFyYXRlIHNvdXJjZXM6IGxheW91dCBhbmQgdGhlIG92ZXJ2aWV3XG5cdCAqIG1vZGUuXG5cdCAqXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSB0cmFuc2Zvcm1zXG5cdCAqL1xuXHRmdW5jdGlvbiB0cmFuc2Zvcm1TbGlkZXMoIHRyYW5zZm9ybXMgKSB7XG5cblx0XHQvLyBQaWNrIHVwIG5ldyB0cmFuc2Zvcm1zIGZyb20gYXJndW1lbnRzXG5cdFx0aWYoIHR5cGVvZiB0cmFuc2Zvcm1zLmxheW91dCA9PT0gJ3N0cmluZycgKSBzbGlkZXNUcmFuc2Zvcm0ubGF5b3V0ID0gdHJhbnNmb3Jtcy5sYXlvdXQ7XG5cdFx0aWYoIHR5cGVvZiB0cmFuc2Zvcm1zLm92ZXJ2aWV3ID09PSAnc3RyaW5nJyApIHNsaWRlc1RyYW5zZm9ybS5vdmVydmlldyA9IHRyYW5zZm9ybXMub3ZlcnZpZXc7XG5cblx0XHQvLyBBcHBseSB0aGUgdHJhbnNmb3JtcyB0byB0aGUgc2xpZGVzIGNvbnRhaW5lclxuXHRcdGlmKCBzbGlkZXNUcmFuc2Zvcm0ubGF5b3V0ICkge1xuXHRcdFx0dHJhbnNmb3JtRWxlbWVudCggZG9tLnNsaWRlcywgc2xpZGVzVHJhbnNmb3JtLmxheW91dCArICcgJyArIHNsaWRlc1RyYW5zZm9ybS5vdmVydmlldyApO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHRyYW5zZm9ybUVsZW1lbnQoIGRvbS5zbGlkZXMsIHNsaWRlc1RyYW5zZm9ybS5vdmVydmlldyApO1xuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIEluamVjdHMgdGhlIGdpdmVuIENTUyBzdHlsZXMgaW50byB0aGUgRE9NLlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcblx0ICovXG5cdGZ1bmN0aW9uIGluamVjdFN0eWxlU2hlZXQoIHZhbHVlICkge1xuXG5cdFx0dmFyIHRhZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzdHlsZScgKTtcblx0XHR0YWcudHlwZSA9ICd0ZXh0L2Nzcyc7XG5cdFx0aWYoIHRhZy5zdHlsZVNoZWV0ICkge1xuXHRcdFx0dGFnLnN0eWxlU2hlZXQuY3NzVGV4dCA9IHZhbHVlO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHRhZy5hcHBlbmRDaGlsZCggZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoIHZhbHVlICkgKTtcblx0XHR9XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoICdoZWFkJyApWzBdLmFwcGVuZENoaWxkKCB0YWcgKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIEZpbmQgdGhlIGNsb3Nlc3QgcGFyZW50IHRoYXQgbWF0Y2hlcyB0aGUgZ2l2ZW5cblx0ICogc2VsZWN0b3IuXG5cdCAqXG5cdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHRhcmdldCBUaGUgY2hpbGQgZWxlbWVudFxuXHQgKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3IgVGhlIENTUyBzZWxlY3RvciB0byBtYXRjaFxuXHQgKiB0aGUgcGFyZW50cyBhZ2FpbnN0XG5cdCAqXG5cdCAqIEByZXR1cm4ge0hUTUxFbGVtZW50fSBUaGUgbWF0Y2hlZCBwYXJlbnQgb3IgbnVsbFxuXHQgKiBpZiBubyBtYXRjaGluZyBwYXJlbnQgd2FzIGZvdW5kXG5cdCAqL1xuXHRmdW5jdGlvbiBjbG9zZXN0UGFyZW50KCB0YXJnZXQsIHNlbGVjdG9yICkge1xuXG5cdFx0dmFyIHBhcmVudCA9IHRhcmdldC5wYXJlbnROb2RlO1xuXG5cdFx0d2hpbGUoIHBhcmVudCApIHtcblxuXHRcdFx0Ly8gVGhlcmUncyBzb21lIG92ZXJoZWFkIGRvaW5nIHRoaXMgZWFjaCB0aW1lLCB3ZSBkb24ndFxuXHRcdFx0Ly8gd2FudCB0byByZXdyaXRlIHRoZSBlbGVtZW50IHByb3RvdHlwZSBidXQgc2hvdWxkIHN0aWxsXG5cdFx0XHQvLyBiZSBlbm91Z2ggdG8gZmVhdHVyZSBkZXRlY3Qgb25jZSBhdCBzdGFydHVwLi4uXG5cdFx0XHR2YXIgbWF0Y2hlc01ldGhvZCA9IHBhcmVudC5tYXRjaGVzIHx8IHBhcmVudC5tYXRjaGVzU2VsZWN0b3IgfHwgcGFyZW50Lm1zTWF0Y2hlc1NlbGVjdG9yO1xuXG5cdFx0XHQvLyBJZiB3ZSBmaW5kIGEgbWF0Y2gsIHdlJ3JlIGFsbCBzZXRcblx0XHRcdGlmKCBtYXRjaGVzTWV0aG9kICYmIG1hdGNoZXNNZXRob2QuY2FsbCggcGFyZW50LCBzZWxlY3RvciApICkge1xuXHRcdFx0XHRyZXR1cm4gcGFyZW50O1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBLZWVwIHNlYXJjaGluZ1xuXHRcdFx0cGFyZW50ID0gcGFyZW50LnBhcmVudE5vZGU7XG5cblx0XHR9XG5cblx0XHRyZXR1cm4gbnVsbDtcblxuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnRzIHZhcmlvdXMgY29sb3IgaW5wdXQgZm9ybWF0cyB0byBhbiB7cjowLGc6MCxiOjB9IG9iamVjdC5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IGNvbG9yIFRoZSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgYSBjb2xvclxuXHQgKiBAZXhhbXBsZVxuXHQgKiBjb2xvclRvUmdiKCcjMDAwJyk7XG5cdCAqIEBleGFtcGxlXG5cdCAqIGNvbG9yVG9SZ2IoJyMwMDAwMDAnKTtcblx0ICogQGV4YW1wbGVcblx0ICogY29sb3JUb1JnYigncmdiKDAsMCwwKScpO1xuXHQgKiBAZXhhbXBsZVxuXHQgKiBjb2xvclRvUmdiKCdyZ2JhKDAsMCwwKScpO1xuXHQgKlxuXHQgKiBAcmV0dXJuIHt7cjogbnVtYmVyLCBnOiBudW1iZXIsIGI6IG51bWJlciwgW2FdOiBudW1iZXJ9fG51bGx9XG5cdCAqL1xuXHRmdW5jdGlvbiBjb2xvclRvUmdiKCBjb2xvciApIHtcblxuXHRcdHZhciBoZXgzID0gY29sb3IubWF0Y2goIC9eIyhbMC05YS1mXXszfSkkL2kgKTtcblx0XHRpZiggaGV4MyAmJiBoZXgzWzFdICkge1xuXHRcdFx0aGV4MyA9IGhleDNbMV07XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRyOiBwYXJzZUludCggaGV4My5jaGFyQXQoIDAgKSwgMTYgKSAqIDB4MTEsXG5cdFx0XHRcdGc6IHBhcnNlSW50KCBoZXgzLmNoYXJBdCggMSApLCAxNiApICogMHgxMSxcblx0XHRcdFx0YjogcGFyc2VJbnQoIGhleDMuY2hhckF0KCAyICksIDE2ICkgKiAweDExXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdHZhciBoZXg2ID0gY29sb3IubWF0Y2goIC9eIyhbMC05YS1mXXs2fSkkL2kgKTtcblx0XHRpZiggaGV4NiAmJiBoZXg2WzFdICkge1xuXHRcdFx0aGV4NiA9IGhleDZbMV07XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRyOiBwYXJzZUludCggaGV4Ni5zdWJzdHIoIDAsIDIgKSwgMTYgKSxcblx0XHRcdFx0ZzogcGFyc2VJbnQoIGhleDYuc3Vic3RyKCAyLCAyICksIDE2ICksXG5cdFx0XHRcdGI6IHBhcnNlSW50KCBoZXg2LnN1YnN0ciggNCwgMiApLCAxNiApXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdHZhciByZ2IgPSBjb2xvci5tYXRjaCggL15yZ2JcXHMqXFwoXFxzKihcXGQrKVxccyosXFxzKihcXGQrKVxccyosXFxzKihcXGQrKVxccypcXCkkL2kgKTtcblx0XHRpZiggcmdiICkge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0cjogcGFyc2VJbnQoIHJnYlsxXSwgMTAgKSxcblx0XHRcdFx0ZzogcGFyc2VJbnQoIHJnYlsyXSwgMTAgKSxcblx0XHRcdFx0YjogcGFyc2VJbnQoIHJnYlszXSwgMTAgKVxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHR2YXIgcmdiYSA9IGNvbG9yLm1hdGNoKCAvXnJnYmFcXHMqXFwoXFxzKihcXGQrKVxccyosXFxzKihcXGQrKVxccyosXFxzKihcXGQrKVxccypcXCxcXHMqKFtcXGRdK3xbXFxkXSouW1xcZF0rKVxccypcXCkkL2kgKTtcblx0XHRpZiggcmdiYSApIHtcblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHI6IHBhcnNlSW50KCByZ2JhWzFdLCAxMCApLFxuXHRcdFx0XHRnOiBwYXJzZUludCggcmdiYVsyXSwgMTAgKSxcblx0XHRcdFx0YjogcGFyc2VJbnQoIHJnYmFbM10sIDEwICksXG5cdFx0XHRcdGE6IHBhcnNlRmxvYXQoIHJnYmFbNF0gKVxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRyZXR1cm4gbnVsbDtcblxuXHR9XG5cblx0LyoqXG5cdCAqIENhbGN1bGF0ZXMgYnJpZ2h0bmVzcyBvbiBhIHNjYWxlIG9mIDAtMjU1LlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gY29sb3IgU2VlIGNvbG9yVG9SZ2IgZm9yIHN1cHBvcnRlZCBmb3JtYXRzLlxuXHQgKiBAc2VlIHtAbGluayBjb2xvclRvUmdifVxuXHQgKi9cblx0ZnVuY3Rpb24gY29sb3JCcmlnaHRuZXNzKCBjb2xvciApIHtcblxuXHRcdGlmKCB0eXBlb2YgY29sb3IgPT09ICdzdHJpbmcnICkgY29sb3IgPSBjb2xvclRvUmdiKCBjb2xvciApO1xuXG5cdFx0aWYoIGNvbG9yICkge1xuXHRcdFx0cmV0dXJuICggY29sb3IuciAqIDI5OSArIGNvbG9yLmcgKiA1ODcgKyBjb2xvci5iICogMTE0ICkgLyAxMDAwO1xuXHRcdH1cblxuXHRcdHJldHVybiBudWxsO1xuXG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgcmVtYWluaW5nIGhlaWdodCB3aXRoaW4gdGhlIHBhcmVudCBvZiB0aGVcblx0ICogdGFyZ2V0IGVsZW1lbnQuXG5cdCAqXG5cdCAqIHJlbWFpbmluZyBoZWlnaHQgPSBbIGNvbmZpZ3VyZWQgcGFyZW50IGhlaWdodCBdIC0gWyBjdXJyZW50IHBhcmVudCBoZWlnaHQgXVxuXHQgKiBcblx0ICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudFxuXHQgKiBAcGFyYW0ge251bWJlcn0gW2hlaWdodF1cblx0ICovXG5cdGZ1bmN0aW9uIGdldFJlbWFpbmluZ0hlaWdodCggZWxlbWVudCwgaGVpZ2h0ICkge1xuXG5cdFx0aGVpZ2h0ID0gaGVpZ2h0IHx8IDA7XG5cblx0XHRpZiggZWxlbWVudCApIHtcblx0XHRcdHZhciBuZXdIZWlnaHQsIG9sZEhlaWdodCA9IGVsZW1lbnQuc3R5bGUuaGVpZ2h0O1xuXG5cdFx0XHQvLyBDaGFuZ2UgdGhlIC5zdHJldGNoIGVsZW1lbnQgaGVpZ2h0IHRvIDAgaW4gb3JkZXIgZmluZCB0aGUgaGVpZ2h0IG9mIGFsbFxuXHRcdFx0Ly8gdGhlIG90aGVyIGVsZW1lbnRzXG5cdFx0XHRlbGVtZW50LnN0eWxlLmhlaWdodCA9ICcwcHgnO1xuXHRcdFx0bmV3SGVpZ2h0ID0gaGVpZ2h0IC0gZWxlbWVudC5wYXJlbnROb2RlLm9mZnNldEhlaWdodDtcblxuXHRcdFx0Ly8gUmVzdG9yZSB0aGUgb2xkIGhlaWdodCwganVzdCBpbiBjYXNlXG5cdFx0XHRlbGVtZW50LnN0eWxlLmhlaWdodCA9IG9sZEhlaWdodCArICdweCc7XG5cblx0XHRcdHJldHVybiBuZXdIZWlnaHQ7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGhlaWdodDtcblxuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiB0aGlzIGluc3RhbmNlIGlzIGJlaW5nIHVzZWQgdG8gcHJpbnQgYSBQREYuXG5cdCAqL1xuXHRmdW5jdGlvbiBpc1ByaW50aW5nUERGKCkge1xuXG5cdFx0cmV0dXJuICggL3ByaW50LXBkZi9naSApLnRlc3QoIHdpbmRvdy5sb2NhdGlvbi5zZWFyY2ggKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIEhpZGVzIHRoZSBhZGRyZXNzIGJhciBpZiB3ZSdyZSBvbiBhIG1vYmlsZSBkZXZpY2UuXG5cdCAqL1xuXHRmdW5jdGlvbiBoaWRlQWRkcmVzc0JhcigpIHtcblxuXHRcdGlmKCBjb25maWcuaGlkZUFkZHJlc3NCYXIgJiYgaXNNb2JpbGVEZXZpY2UgKSB7XG5cdFx0XHQvLyBFdmVudHMgdGhhdCBzaG91bGQgdHJpZ2dlciB0aGUgYWRkcmVzcyBiYXIgdG8gaGlkZVxuXHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoICdsb2FkJywgcmVtb3ZlQWRkcmVzc0JhciwgZmFsc2UgKTtcblx0XHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAnb3JpZW50YXRpb25jaGFuZ2UnLCByZW1vdmVBZGRyZXNzQmFyLCBmYWxzZSApO1xuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIENhdXNlcyB0aGUgYWRkcmVzcyBiYXIgdG8gaGlkZSBvbiBtb2JpbGUgZGV2aWNlcyxcblx0ICogbW9yZSB2ZXJ0aWNhbCBzcGFjZSBmdHcuXG5cdCAqL1xuXHRmdW5jdGlvbiByZW1vdmVBZGRyZXNzQmFyKCkge1xuXG5cdFx0c2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHR3aW5kb3cuc2Nyb2xsVG8oIDAsIDEgKTtcblx0XHR9LCAxMCApO1xuXG5cdH1cblxuXHQvKipcblx0ICogRGlzcGF0Y2hlcyBhbiBldmVudCBvZiB0aGUgc3BlY2lmaWVkIHR5cGUgZnJvbSB0aGVcblx0ICogcmV2ZWFsIERPTSBlbGVtZW50LlxuXHQgKi9cblx0ZnVuY3Rpb24gZGlzcGF0Y2hFdmVudCggdHlwZSwgYXJncyApIHtcblxuXHRcdHZhciBldmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCAnSFRNTEV2ZW50cycsIDEsIDIgKTtcblx0XHRldmVudC5pbml0RXZlbnQoIHR5cGUsIHRydWUsIHRydWUgKTtcblx0XHRleHRlbmQoIGV2ZW50LCBhcmdzICk7XG5cdFx0ZG9tLndyYXBwZXIuZGlzcGF0Y2hFdmVudCggZXZlbnQgKTtcblxuXHRcdC8vIElmIHdlJ3JlIGluIGFuIGlmcmFtZSwgcG9zdCBlYWNoIHJldmVhbC5qcyBldmVudCB0byB0aGVcblx0XHQvLyBwYXJlbnQgd2luZG93LiBVc2VkIGJ5IHRoZSBub3RlcyBwbHVnaW5cblx0XHRpZiggY29uZmlnLnBvc3RNZXNzYWdlRXZlbnRzICYmIHdpbmRvdy5wYXJlbnQgIT09IHdpbmRvdy5zZWxmICkge1xuXHRcdFx0d2luZG93LnBhcmVudC5wb3N0TWVzc2FnZSggSlNPTi5zdHJpbmdpZnkoeyBuYW1lc3BhY2U6ICdyZXZlYWwnLCBldmVudE5hbWU6IHR5cGUsIHN0YXRlOiBnZXRTdGF0ZSgpIH0pLCAnKicgKTtcblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBXcmFwIGFsbCBsaW5rcyBpbiAzRCBnb29kbmVzcy5cblx0ICovXG5cdGZ1bmN0aW9uIGVuYWJsZVJvbGxpbmdMaW5rcygpIHtcblxuXHRcdGlmKCBmZWF0dXJlcy50cmFuc2Zvcm1zM2QgJiYgISggJ21zUGVyc3BlY3RpdmUnIGluIGRvY3VtZW50LmJvZHkuc3R5bGUgKSApIHtcblx0XHRcdHZhciBhbmNob3JzID0gZG9tLndyYXBwZXIucXVlcnlTZWxlY3RvckFsbCggU0xJREVTX1NFTEVDVE9SICsgJyBhJyApO1xuXG5cdFx0XHRmb3IoIHZhciBpID0gMCwgbGVuID0gYW5jaG9ycy5sZW5ndGg7IGkgPCBsZW47IGkrKyApIHtcblx0XHRcdFx0dmFyIGFuY2hvciA9IGFuY2hvcnNbaV07XG5cblx0XHRcdFx0aWYoIGFuY2hvci50ZXh0Q29udGVudCAmJiAhYW5jaG9yLnF1ZXJ5U2VsZWN0b3IoICcqJyApICYmICggIWFuY2hvci5jbGFzc05hbWUgfHwgIWFuY2hvci5jbGFzc0xpc3QuY29udGFpbnMoIGFuY2hvciwgJ3JvbGwnICkgKSApIHtcblx0XHRcdFx0XHR2YXIgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcblx0XHRcdFx0XHRzcGFuLnNldEF0dHJpYnV0ZSgnZGF0YS10aXRsZScsIGFuY2hvci50ZXh0KTtcblx0XHRcdFx0XHRzcGFuLmlubmVySFRNTCA9IGFuY2hvci5pbm5lckhUTUw7XG5cblx0XHRcdFx0XHRhbmNob3IuY2xhc3NMaXN0LmFkZCggJ3JvbGwnICk7XG5cdFx0XHRcdFx0YW5jaG9yLmlubmVySFRNTCA9ICcnO1xuXHRcdFx0XHRcdGFuY2hvci5hcHBlbmRDaGlsZChzcGFuKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIFVud3JhcCBhbGwgM0QgbGlua3MuXG5cdCAqL1xuXHRmdW5jdGlvbiBkaXNhYmxlUm9sbGluZ0xpbmtzKCkge1xuXG5cdFx0dmFyIGFuY2hvcnMgPSBkb20ud3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKCBTTElERVNfU0VMRUNUT1IgKyAnIGEucm9sbCcgKTtcblxuXHRcdGZvciggdmFyIGkgPSAwLCBsZW4gPSBhbmNob3JzLmxlbmd0aDsgaSA8IGxlbjsgaSsrICkge1xuXHRcdFx0dmFyIGFuY2hvciA9IGFuY2hvcnNbaV07XG5cdFx0XHR2YXIgc3BhbiA9IGFuY2hvci5xdWVyeVNlbGVjdG9yKCAnc3BhbicgKTtcblxuXHRcdFx0aWYoIHNwYW4gKSB7XG5cdFx0XHRcdGFuY2hvci5jbGFzc0xpc3QucmVtb3ZlKCAncm9sbCcgKTtcblx0XHRcdFx0YW5jaG9yLmlubmVySFRNTCA9IHNwYW4uaW5uZXJIVE1MO1xuXHRcdFx0fVxuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIEJpbmQgcHJldmlldyBmcmFtZSBsaW5rcy5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IFtzZWxlY3Rvcj1hXSAtIHNlbGVjdG9yIGZvciBhbmNob3JzXG5cdCAqL1xuXHRmdW5jdGlvbiBlbmFibGVQcmV2aWV3TGlua3MoIHNlbGVjdG9yICkge1xuXG5cdFx0dmFyIGFuY2hvcnMgPSB0b0FycmF5KCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCBzZWxlY3RvciA/IHNlbGVjdG9yIDogJ2EnICkgKTtcblxuXHRcdGFuY2hvcnMuZm9yRWFjaCggZnVuY3Rpb24oIGVsZW1lbnQgKSB7XG5cdFx0XHRpZiggL14oaHR0cHx3d3cpL2dpLnRlc3QoIGVsZW1lbnQuZ2V0QXR0cmlidXRlKCAnaHJlZicgKSApICkge1xuXHRcdFx0XHRlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdjbGljaycsIG9uUHJldmlld0xpbmtDbGlja2VkLCBmYWxzZSApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIFVuYmluZCBwcmV2aWV3IGZyYW1lIGxpbmtzLlxuXHQgKi9cblx0ZnVuY3Rpb24gZGlzYWJsZVByZXZpZXdMaW5rcygpIHtcblxuXHRcdHZhciBhbmNob3JzID0gdG9BcnJheSggZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCggJ2EnICkgKTtcblxuXHRcdGFuY2hvcnMuZm9yRWFjaCggZnVuY3Rpb24oIGVsZW1lbnQgKSB7XG5cdFx0XHRpZiggL14oaHR0cHx3d3cpL2dpLnRlc3QoIGVsZW1lbnQuZ2V0QXR0cmlidXRlKCAnaHJlZicgKSApICkge1xuXHRcdFx0XHRlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoICdjbGljaycsIG9uUHJldmlld0xpbmtDbGlja2VkLCBmYWxzZSApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIE9wZW5zIGEgcHJldmlldyB3aW5kb3cgZm9yIHRoZSB0YXJnZXQgVVJMLlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gdXJsIC0gdXJsIGZvciBwcmV2aWV3IGlmcmFtZSBzcmNcblx0ICovXG5cdGZ1bmN0aW9uIHNob3dQcmV2aWV3KCB1cmwgKSB7XG5cblx0XHRjbG9zZU92ZXJsYXkoKTtcblxuXHRcdGRvbS5vdmVybGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2RpdicgKTtcblx0XHRkb20ub3ZlcmxheS5jbGFzc0xpc3QuYWRkKCAnb3ZlcmxheScgKTtcblx0XHRkb20ub3ZlcmxheS5jbGFzc0xpc3QuYWRkKCAnb3ZlcmxheS1wcmV2aWV3JyApO1xuXHRcdGRvbS53cmFwcGVyLmFwcGVuZENoaWxkKCBkb20ub3ZlcmxheSApO1xuXG5cdFx0ZG9tLm92ZXJsYXkuaW5uZXJIVE1MID0gW1xuXHRcdFx0JzxoZWFkZXI+Jyxcblx0XHRcdFx0JzxhIGNsYXNzPVwiY2xvc2VcIiBocmVmPVwiI1wiPjxzcGFuIGNsYXNzPVwiaWNvblwiPjwvc3Bhbj48L2E+Jyxcblx0XHRcdFx0JzxhIGNsYXNzPVwiZXh0ZXJuYWxcIiBocmVmPVwiJysgdXJsICsnXCIgdGFyZ2V0PVwiX2JsYW5rXCI+PHNwYW4gY2xhc3M9XCJpY29uXCI+PC9zcGFuPjwvYT4nLFxuXHRcdFx0JzwvaGVhZGVyPicsXG5cdFx0XHQnPGRpdiBjbGFzcz1cInNwaW5uZXJcIj48L2Rpdj4nLFxuXHRcdFx0JzxkaXYgY2xhc3M9XCJ2aWV3cG9ydFwiPicsXG5cdFx0XHRcdCc8aWZyYW1lIHNyYz1cIicrIHVybCArJ1wiPjwvaWZyYW1lPicsXG5cdFx0XHRcdCc8c21hbGwgY2xhc3M9XCJ2aWV3cG9ydC1pbm5lclwiPicsXG5cdFx0XHRcdFx0JzxzcGFuIGNsYXNzPVwieC1mcmFtZS1lcnJvclwiPlVuYWJsZSB0byBsb2FkIGlmcmFtZS4gVGhpcyBpcyBsaWtlbHkgZHVlIHRvIHRoZSBzaXRlXFwncyBwb2xpY3kgKHgtZnJhbWUtb3B0aW9ucykuPC9zcGFuPicsXG5cdFx0XHRcdCc8L3NtYWxsPicsXG5cdFx0XHQnPC9kaXY+J1xuXHRcdF0uam9pbignJyk7XG5cblx0XHRkb20ub3ZlcmxheS5xdWVyeVNlbGVjdG9yKCAnaWZyYW1lJyApLmFkZEV2ZW50TGlzdGVuZXIoICdsb2FkJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0ZG9tLm92ZXJsYXkuY2xhc3NMaXN0LmFkZCggJ2xvYWRlZCcgKTtcblx0XHR9LCBmYWxzZSApO1xuXG5cdFx0ZG9tLm92ZXJsYXkucXVlcnlTZWxlY3RvciggJy5jbG9zZScgKS5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRjbG9zZU92ZXJsYXkoKTtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0fSwgZmFsc2UgKTtcblxuXHRcdGRvbS5vdmVybGF5LnF1ZXJ5U2VsZWN0b3IoICcuZXh0ZXJuYWwnICkuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0Y2xvc2VPdmVybGF5KCk7XG5cdFx0fSwgZmFsc2UgKTtcblxuXHRcdHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0ZG9tLm92ZXJsYXkuY2xhc3NMaXN0LmFkZCggJ3Zpc2libGUnICk7XG5cdFx0fSwgMSApO1xuXG5cdH1cblxuXHQvKipcblx0ICogT3BlbnMgYW4gb3ZlcmxheSB3aW5kb3cgd2l0aCBoZWxwIG1hdGVyaWFsLlxuXHQgKi9cblx0ZnVuY3Rpb24gc2hvd0hlbHAoKSB7XG5cblx0XHRpZiggY29uZmlnLmhlbHAgKSB7XG5cblx0XHRcdGNsb3NlT3ZlcmxheSgpO1xuXG5cdFx0XHRkb20ub3ZlcmxheSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7XG5cdFx0XHRkb20ub3ZlcmxheS5jbGFzc0xpc3QuYWRkKCAnb3ZlcmxheScgKTtcblx0XHRcdGRvbS5vdmVybGF5LmNsYXNzTGlzdC5hZGQoICdvdmVybGF5LWhlbHAnICk7XG5cdFx0XHRkb20ud3JhcHBlci5hcHBlbmRDaGlsZCggZG9tLm92ZXJsYXkgKTtcblxuXHRcdFx0dmFyIGh0bWwgPSAnPHAgY2xhc3M9XCJ0aXRsZVwiPktleWJvYXJkIFNob3J0Y3V0czwvcD48YnIvPic7XG5cblx0XHRcdGh0bWwgKz0gJzx0YWJsZT48dGg+S0VZPC90aD48dGg+QUNUSU9OPC90aD4nO1xuXHRcdFx0Zm9yKCB2YXIga2V5IGluIGtleWJvYXJkU2hvcnRjdXRzICkge1xuXHRcdFx0XHRodG1sICs9ICc8dHI+PHRkPicgKyBrZXkgKyAnPC90ZD48dGQ+JyArIGtleWJvYXJkU2hvcnRjdXRzWyBrZXkgXSArICc8L3RkPjwvdHI+Jztcblx0XHRcdH1cblxuXHRcdFx0aHRtbCArPSAnPC90YWJsZT4nO1xuXG5cdFx0XHRkb20ub3ZlcmxheS5pbm5lckhUTUwgPSBbXG5cdFx0XHRcdCc8aGVhZGVyPicsXG5cdFx0XHRcdFx0JzxhIGNsYXNzPVwiY2xvc2VcIiBocmVmPVwiI1wiPjxzcGFuIGNsYXNzPVwiaWNvblwiPjwvc3Bhbj48L2E+Jyxcblx0XHRcdFx0JzwvaGVhZGVyPicsXG5cdFx0XHRcdCc8ZGl2IGNsYXNzPVwidmlld3BvcnRcIj4nLFxuXHRcdFx0XHRcdCc8ZGl2IGNsYXNzPVwidmlld3BvcnQtaW5uZXJcIj4nKyBodG1sICsnPC9kaXY+Jyxcblx0XHRcdFx0JzwvZGl2Pidcblx0XHRcdF0uam9pbignJyk7XG5cblx0XHRcdGRvbS5vdmVybGF5LnF1ZXJ5U2VsZWN0b3IoICcuY2xvc2UnICkuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0XHRjbG9zZU92ZXJsYXkoKTtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdH0sIGZhbHNlICk7XG5cblx0XHRcdHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRkb20ub3ZlcmxheS5jbGFzc0xpc3QuYWRkKCAndmlzaWJsZScgKTtcblx0XHRcdH0sIDEgKTtcblxuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIENsb3NlcyBhbnkgY3VycmVudGx5IG9wZW4gb3ZlcmxheS5cblx0ICovXG5cdGZ1bmN0aW9uIGNsb3NlT3ZlcmxheSgpIHtcblxuXHRcdGlmKCBkb20ub3ZlcmxheSApIHtcblx0XHRcdGRvbS5vdmVybGF5LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoIGRvbS5vdmVybGF5ICk7XG5cdFx0XHRkb20ub3ZlcmxheSA9IG51bGw7XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogQXBwbGllcyBKYXZhU2NyaXB0LWNvbnRyb2xsZWQgbGF5b3V0IHJ1bGVzIHRvIHRoZVxuXHQgKiBwcmVzZW50YXRpb24uXG5cdCAqL1xuXHRmdW5jdGlvbiBsYXlvdXQoKSB7XG5cblx0XHRpZiggZG9tLndyYXBwZXIgJiYgIWlzUHJpbnRpbmdQREYoKSApIHtcblxuXHRcdFx0dmFyIHNpemUgPSBnZXRDb21wdXRlZFNsaWRlU2l6ZSgpO1xuXG5cdFx0XHQvLyBMYXlvdXQgdGhlIGNvbnRlbnRzIG9mIHRoZSBzbGlkZXNcblx0XHRcdGxheW91dFNsaWRlQ29udGVudHMoIGNvbmZpZy53aWR0aCwgY29uZmlnLmhlaWdodCApO1xuXG5cdFx0XHRkb20uc2xpZGVzLnN0eWxlLndpZHRoID0gc2l6ZS53aWR0aCArICdweCc7XG5cdFx0XHRkb20uc2xpZGVzLnN0eWxlLmhlaWdodCA9IHNpemUuaGVpZ2h0ICsgJ3B4JztcblxuXHRcdFx0Ly8gRGV0ZXJtaW5lIHNjYWxlIG9mIGNvbnRlbnQgdG8gZml0IHdpdGhpbiBhdmFpbGFibGUgc3BhY2Vcblx0XHRcdHNjYWxlID0gTWF0aC5taW4oIHNpemUucHJlc2VudGF0aW9uV2lkdGggLyBzaXplLndpZHRoLCBzaXplLnByZXNlbnRhdGlvbkhlaWdodCAvIHNpemUuaGVpZ2h0ICk7XG5cblx0XHRcdC8vIFJlc3BlY3QgbWF4L21pbiBzY2FsZSBzZXR0aW5nc1xuXHRcdFx0c2NhbGUgPSBNYXRoLm1heCggc2NhbGUsIGNvbmZpZy5taW5TY2FsZSApO1xuXHRcdFx0c2NhbGUgPSBNYXRoLm1pbiggc2NhbGUsIGNvbmZpZy5tYXhTY2FsZSApO1xuXG5cdFx0XHQvLyBEb24ndCBhcHBseSBhbnkgc2NhbGluZyBzdHlsZXMgaWYgc2NhbGUgaXMgMVxuXHRcdFx0aWYoIHNjYWxlID09PSAxICkge1xuXHRcdFx0XHRkb20uc2xpZGVzLnN0eWxlLnpvb20gPSAnJztcblx0XHRcdFx0ZG9tLnNsaWRlcy5zdHlsZS5sZWZ0ID0gJyc7XG5cdFx0XHRcdGRvbS5zbGlkZXMuc3R5bGUudG9wID0gJyc7XG5cdFx0XHRcdGRvbS5zbGlkZXMuc3R5bGUuYm90dG9tID0gJyc7XG5cdFx0XHRcdGRvbS5zbGlkZXMuc3R5bGUucmlnaHQgPSAnJztcblx0XHRcdFx0dHJhbnNmb3JtU2xpZGVzKCB7IGxheW91dDogJycgfSApO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdC8vIFByZWZlciB6b29tIGZvciBzY2FsaW5nIHVwIHNvIHRoYXQgY29udGVudCByZW1haW5zIGNyaXNwLlxuXHRcdFx0XHQvLyBEb24ndCB1c2Ugem9vbSB0byBzY2FsZSBkb3duIHNpbmNlIHRoYXQgY2FuIGxlYWQgdG8gc2hpZnRzXG5cdFx0XHRcdC8vIGluIHRleHQgbGF5b3V0L2xpbmUgYnJlYWtzLlxuXHRcdFx0XHRpZiggc2NhbGUgPiAxICYmIGZlYXR1cmVzLnpvb20gKSB7XG5cdFx0XHRcdFx0ZG9tLnNsaWRlcy5zdHlsZS56b29tID0gc2NhbGU7XG5cdFx0XHRcdFx0ZG9tLnNsaWRlcy5zdHlsZS5sZWZ0ID0gJyc7XG5cdFx0XHRcdFx0ZG9tLnNsaWRlcy5zdHlsZS50b3AgPSAnJztcblx0XHRcdFx0XHRkb20uc2xpZGVzLnN0eWxlLmJvdHRvbSA9ICcnO1xuXHRcdFx0XHRcdGRvbS5zbGlkZXMuc3R5bGUucmlnaHQgPSAnJztcblx0XHRcdFx0XHR0cmFuc2Zvcm1TbGlkZXMoIHsgbGF5b3V0OiAnJyB9ICk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gQXBwbHkgc2NhbGUgdHJhbnNmb3JtIGFzIGEgZmFsbGJhY2tcblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0ZG9tLnNsaWRlcy5zdHlsZS56b29tID0gJyc7XG5cdFx0XHRcdFx0ZG9tLnNsaWRlcy5zdHlsZS5sZWZ0ID0gJzUwJSc7XG5cdFx0XHRcdFx0ZG9tLnNsaWRlcy5zdHlsZS50b3AgPSAnNTAlJztcblx0XHRcdFx0XHRkb20uc2xpZGVzLnN0eWxlLmJvdHRvbSA9ICdhdXRvJztcblx0XHRcdFx0XHRkb20uc2xpZGVzLnN0eWxlLnJpZ2h0ID0gJ2F1dG8nO1xuXHRcdFx0XHRcdHRyYW5zZm9ybVNsaWRlcyggeyBsYXlvdXQ6ICd0cmFuc2xhdGUoLTUwJSwgLTUwJSkgc2NhbGUoJysgc2NhbGUgKycpJyB9ICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gU2VsZWN0IGFsbCBzbGlkZXMsIHZlcnRpY2FsIGFuZCBob3Jpem9udGFsXG5cdFx0XHR2YXIgc2xpZGVzID0gdG9BcnJheSggZG9tLndyYXBwZXIucXVlcnlTZWxlY3RvckFsbCggU0xJREVTX1NFTEVDVE9SICkgKTtcblxuXHRcdFx0Zm9yKCB2YXIgaSA9IDAsIGxlbiA9IHNsaWRlcy5sZW5ndGg7IGkgPCBsZW47IGkrKyApIHtcblx0XHRcdFx0dmFyIHNsaWRlID0gc2xpZGVzWyBpIF07XG5cblx0XHRcdFx0Ly8gRG9uJ3QgYm90aGVyIHVwZGF0aW5nIGludmlzaWJsZSBzbGlkZXNcblx0XHRcdFx0aWYoIHNsaWRlLnN0eWxlLmRpc3BsYXkgPT09ICdub25lJyApIHtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmKCBjb25maWcuY2VudGVyIHx8IHNsaWRlLmNsYXNzTGlzdC5jb250YWlucyggJ2NlbnRlcicgKSApIHtcblx0XHRcdFx0XHQvLyBWZXJ0aWNhbCBzdGFja3MgYXJlIG5vdCBjZW50cmVkIHNpbmNlIHRoZWlyIHNlY3Rpb25cblx0XHRcdFx0XHQvLyBjaGlsZHJlbiB3aWxsIGJlXG5cdFx0XHRcdFx0aWYoIHNsaWRlLmNsYXNzTGlzdC5jb250YWlucyggJ3N0YWNrJyApICkge1xuXHRcdFx0XHRcdFx0c2xpZGUuc3R5bGUudG9wID0gMDtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRzbGlkZS5zdHlsZS50b3AgPSBNYXRoLm1heCggKCBzaXplLmhlaWdodCAtIHNsaWRlLnNjcm9sbEhlaWdodCApIC8gMiwgMCApICsgJ3B4Jztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0c2xpZGUuc3R5bGUudG9wID0gJyc7XG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXG5cdFx0XHR1cGRhdGVQcm9ncmVzcygpO1xuXHRcdFx0dXBkYXRlUGFyYWxsYXgoKTtcblxuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIEFwcGxpZXMgbGF5b3V0IGxvZ2ljIHRvIHRoZSBjb250ZW50cyBvZiBhbGwgc2xpZGVzIGluXG5cdCAqIHRoZSBwcmVzZW50YXRpb24uXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfG51bWJlcn0gd2lkdGhcblx0ICogQHBhcmFtIHtzdHJpbmd8bnVtYmVyfSBoZWlnaHRcblx0ICovXG5cdGZ1bmN0aW9uIGxheW91dFNsaWRlQ29udGVudHMoIHdpZHRoLCBoZWlnaHQgKSB7XG5cblx0XHQvLyBIYW5kbGUgc2l6aW5nIG9mIGVsZW1lbnRzIHdpdGggdGhlICdzdHJldGNoJyBjbGFzc1xuXHRcdHRvQXJyYXkoIGRvbS5zbGlkZXMucXVlcnlTZWxlY3RvckFsbCggJ3NlY3Rpb24gPiAuc3RyZXRjaCcgKSApLmZvckVhY2goIGZ1bmN0aW9uKCBlbGVtZW50ICkge1xuXG5cdFx0XHQvLyBEZXRlcm1pbmUgaG93IG11Y2ggdmVydGljYWwgc3BhY2Ugd2UgY2FuIHVzZVxuXHRcdFx0dmFyIHJlbWFpbmluZ0hlaWdodCA9IGdldFJlbWFpbmluZ0hlaWdodCggZWxlbWVudCwgaGVpZ2h0ICk7XG5cblx0XHRcdC8vIENvbnNpZGVyIHRoZSBhc3BlY3QgcmF0aW8gb2YgbWVkaWEgZWxlbWVudHNcblx0XHRcdGlmKCAvKGltZ3x2aWRlbykvZ2kudGVzdCggZWxlbWVudC5ub2RlTmFtZSApICkge1xuXHRcdFx0XHR2YXIgbncgPSBlbGVtZW50Lm5hdHVyYWxXaWR0aCB8fCBlbGVtZW50LnZpZGVvV2lkdGgsXG5cdFx0XHRcdFx0bmggPSBlbGVtZW50Lm5hdHVyYWxIZWlnaHQgfHwgZWxlbWVudC52aWRlb0hlaWdodDtcblxuXHRcdFx0XHR2YXIgZXMgPSBNYXRoLm1pbiggd2lkdGggLyBudywgcmVtYWluaW5nSGVpZ2h0IC8gbmggKTtcblxuXHRcdFx0XHRlbGVtZW50LnN0eWxlLndpZHRoID0gKCBudyAqIGVzICkgKyAncHgnO1xuXHRcdFx0XHRlbGVtZW50LnN0eWxlLmhlaWdodCA9ICggbmggKiBlcyApICsgJ3B4JztcblxuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGVsZW1lbnQuc3R5bGUud2lkdGggPSB3aWR0aCArICdweCc7XG5cdFx0XHRcdGVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gcmVtYWluaW5nSGVpZ2h0ICsgJ3B4Jztcblx0XHRcdH1cblxuXHRcdH0gKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIENhbGN1bGF0ZXMgdGhlIGNvbXB1dGVkIHBpeGVsIHNpemUgb2Ygb3VyIHNsaWRlcy4gVGhlc2Vcblx0ICogdmFsdWVzIGFyZSBiYXNlZCBvbiB0aGUgd2lkdGggYW5kIGhlaWdodCBjb25maWd1cmF0aW9uXG5cdCAqIG9wdGlvbnMuXG5cdCAqXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBbcHJlc2VudGF0aW9uV2lkdGg9ZG9tLndyYXBwZXIub2Zmc2V0V2lkdGhdXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBbcHJlc2VudGF0aW9uSGVpZ2h0PWRvbS53cmFwcGVyLm9mZnNldEhlaWdodF1cblx0ICovXG5cdGZ1bmN0aW9uIGdldENvbXB1dGVkU2xpZGVTaXplKCBwcmVzZW50YXRpb25XaWR0aCwgcHJlc2VudGF0aW9uSGVpZ2h0ICkge1xuXG5cdFx0dmFyIHNpemUgPSB7XG5cdFx0XHQvLyBTbGlkZSBzaXplXG5cdFx0XHR3aWR0aDogY29uZmlnLndpZHRoLFxuXHRcdFx0aGVpZ2h0OiBjb25maWcuaGVpZ2h0LFxuXG5cdFx0XHQvLyBQcmVzZW50YXRpb24gc2l6ZVxuXHRcdFx0cHJlc2VudGF0aW9uV2lkdGg6IHByZXNlbnRhdGlvbldpZHRoIHx8IGRvbS53cmFwcGVyLm9mZnNldFdpZHRoLFxuXHRcdFx0cHJlc2VudGF0aW9uSGVpZ2h0OiBwcmVzZW50YXRpb25IZWlnaHQgfHwgZG9tLndyYXBwZXIub2Zmc2V0SGVpZ2h0XG5cdFx0fTtcblxuXHRcdC8vIFJlZHVjZSBhdmFpbGFibGUgc3BhY2UgYnkgbWFyZ2luXG5cdFx0c2l6ZS5wcmVzZW50YXRpb25XaWR0aCAtPSAoIHNpemUucHJlc2VudGF0aW9uV2lkdGggKiBjb25maWcubWFyZ2luICk7XG5cdFx0c2l6ZS5wcmVzZW50YXRpb25IZWlnaHQgLT0gKCBzaXplLnByZXNlbnRhdGlvbkhlaWdodCAqIGNvbmZpZy5tYXJnaW4gKTtcblxuXHRcdC8vIFNsaWRlIHdpZHRoIG1heSBiZSBhIHBlcmNlbnRhZ2Ugb2YgYXZhaWxhYmxlIHdpZHRoXG5cdFx0aWYoIHR5cGVvZiBzaXplLndpZHRoID09PSAnc3RyaW5nJyAmJiAvJSQvLnRlc3QoIHNpemUud2lkdGggKSApIHtcblx0XHRcdHNpemUud2lkdGggPSBwYXJzZUludCggc2l6ZS53aWR0aCwgMTAgKSAvIDEwMCAqIHNpemUucHJlc2VudGF0aW9uV2lkdGg7XG5cdFx0fVxuXG5cdFx0Ly8gU2xpZGUgaGVpZ2h0IG1heSBiZSBhIHBlcmNlbnRhZ2Ugb2YgYXZhaWxhYmxlIGhlaWdodFxuXHRcdGlmKCB0eXBlb2Ygc2l6ZS5oZWlnaHQgPT09ICdzdHJpbmcnICYmIC8lJC8udGVzdCggc2l6ZS5oZWlnaHQgKSApIHtcblx0XHRcdHNpemUuaGVpZ2h0ID0gcGFyc2VJbnQoIHNpemUuaGVpZ2h0LCAxMCApIC8gMTAwICogc2l6ZS5wcmVzZW50YXRpb25IZWlnaHQ7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHNpemU7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBTdG9yZXMgdGhlIHZlcnRpY2FsIGluZGV4IG9mIGEgc3RhY2sgc28gdGhhdCB0aGUgc2FtZVxuXHQgKiB2ZXJ0aWNhbCBzbGlkZSBjYW4gYmUgc2VsZWN0ZWQgd2hlbiBuYXZpZ2F0aW5nIHRvIGFuZFxuXHQgKiBmcm9tIHRoZSBzdGFjay5cblx0ICpcblx0ICogQHBhcmFtIHtIVE1MRWxlbWVudH0gc3RhY2sgVGhlIHZlcnRpY2FsIHN0YWNrIGVsZW1lbnRcblx0ICogQHBhcmFtIHtzdHJpbmd8bnVtYmVyfSBbdj0wXSBJbmRleCB0byBtZW1vcml6ZVxuXHQgKi9cblx0ZnVuY3Rpb24gc2V0UHJldmlvdXNWZXJ0aWNhbEluZGV4KCBzdGFjaywgdiApIHtcblxuXHRcdGlmKCB0eXBlb2Ygc3RhY2sgPT09ICdvYmplY3QnICYmIHR5cGVvZiBzdGFjay5zZXRBdHRyaWJ1dGUgPT09ICdmdW5jdGlvbicgKSB7XG5cdFx0XHRzdGFjay5zZXRBdHRyaWJ1dGUoICdkYXRhLXByZXZpb3VzLWluZGV4dicsIHYgfHwgMCApO1xuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIFJldHJpZXZlcyB0aGUgdmVydGljYWwgaW5kZXggd2hpY2ggd2FzIHN0b3JlZCB1c2luZ1xuXHQgKiAjc2V0UHJldmlvdXNWZXJ0aWNhbEluZGV4KCkgb3IgMCBpZiBubyBwcmV2aW91cyBpbmRleFxuXHQgKiBleGlzdHMuXG5cdCAqXG5cdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHN0YWNrIFRoZSB2ZXJ0aWNhbCBzdGFjayBlbGVtZW50XG5cdCAqL1xuXHRmdW5jdGlvbiBnZXRQcmV2aW91c1ZlcnRpY2FsSW5kZXgoIHN0YWNrICkge1xuXG5cdFx0aWYoIHR5cGVvZiBzdGFjayA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIHN0YWNrLnNldEF0dHJpYnV0ZSA9PT0gJ2Z1bmN0aW9uJyAmJiBzdGFjay5jbGFzc0xpc3QuY29udGFpbnMoICdzdGFjaycgKSApIHtcblx0XHRcdC8vIFByZWZlciBtYW51YWxseSBkZWZpbmVkIHN0YXJ0LWluZGV4dlxuXHRcdFx0dmFyIGF0dHJpYnV0ZU5hbWUgPSBzdGFjay5oYXNBdHRyaWJ1dGUoICdkYXRhLXN0YXJ0LWluZGV4dicgKSA/ICdkYXRhLXN0YXJ0LWluZGV4dicgOiAnZGF0YS1wcmV2aW91cy1pbmRleHYnO1xuXG5cdFx0XHRyZXR1cm4gcGFyc2VJbnQoIHN0YWNrLmdldEF0dHJpYnV0ZSggYXR0cmlidXRlTmFtZSApIHx8IDAsIDEwICk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIDA7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBEaXNwbGF5cyB0aGUgb3ZlcnZpZXcgb2Ygc2xpZGVzIChxdWljayBuYXYpIGJ5IHNjYWxpbmdcblx0ICogZG93biBhbmQgYXJyYW5naW5nIGFsbCBzbGlkZSBlbGVtZW50cy5cblx0ICovXG5cdGZ1bmN0aW9uIGFjdGl2YXRlT3ZlcnZpZXcoKSB7XG5cblx0XHQvLyBPbmx5IHByb2NlZWQgaWYgZW5hYmxlZCBpbiBjb25maWdcblx0XHRpZiggY29uZmlnLm92ZXJ2aWV3ICYmICFpc092ZXJ2aWV3KCkgKSB7XG5cblx0XHRcdG92ZXJ2aWV3ID0gdHJ1ZTtcblxuXHRcdFx0ZG9tLndyYXBwZXIuY2xhc3NMaXN0LmFkZCggJ292ZXJ2aWV3JyApO1xuXHRcdFx0ZG9tLndyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZSggJ292ZXJ2aWV3LWRlYWN0aXZhdGluZycgKTtcblxuXHRcdFx0aWYoIGZlYXR1cmVzLm92ZXJ2aWV3VHJhbnNpdGlvbnMgKSB7XG5cdFx0XHRcdHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGRvbS53cmFwcGVyLmNsYXNzTGlzdC5hZGQoICdvdmVydmlldy1hbmltYXRlZCcgKTtcblx0XHRcdFx0fSwgMSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBEb24ndCBhdXRvLXNsaWRlIHdoaWxlIGluIG92ZXJ2aWV3IG1vZGVcblx0XHRcdGNhbmNlbEF1dG9TbGlkZSgpO1xuXG5cdFx0XHQvLyBNb3ZlIHRoZSBiYWNrZ3JvdW5kcyBlbGVtZW50IGludG8gdGhlIHNsaWRlIGNvbnRhaW5lciB0b1xuXHRcdFx0Ly8gdGhhdCB0aGUgc2FtZSBzY2FsaW5nIGlzIGFwcGxpZWRcblx0XHRcdGRvbS5zbGlkZXMuYXBwZW5kQ2hpbGQoIGRvbS5iYWNrZ3JvdW5kICk7XG5cblx0XHRcdC8vIENsaWNraW5nIG9uIGFuIG92ZXJ2aWV3IHNsaWRlIG5hdmlnYXRlcyB0byBpdFxuXHRcdFx0dG9BcnJheSggZG9tLndyYXBwZXIucXVlcnlTZWxlY3RvckFsbCggU0xJREVTX1NFTEVDVE9SICkgKS5mb3JFYWNoKCBmdW5jdGlvbiggc2xpZGUgKSB7XG5cdFx0XHRcdGlmKCAhc2xpZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCAnc3RhY2snICkgKSB7XG5cdFx0XHRcdFx0c2xpZGUuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgb25PdmVydmlld1NsaWRlQ2xpY2tlZCwgdHJ1ZSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cblx0XHRcdC8vIENhbGN1bGF0ZSBzbGlkZSBzaXplc1xuXHRcdFx0dmFyIG1hcmdpbiA9IDcwO1xuXHRcdFx0dmFyIHNsaWRlU2l6ZSA9IGdldENvbXB1dGVkU2xpZGVTaXplKCk7XG5cdFx0XHRvdmVydmlld1NsaWRlV2lkdGggPSBzbGlkZVNpemUud2lkdGggKyBtYXJnaW47XG5cdFx0XHRvdmVydmlld1NsaWRlSGVpZ2h0ID0gc2xpZGVTaXplLmhlaWdodCArIG1hcmdpbjtcblxuXHRcdFx0Ly8gUmV2ZXJzZSBpbiBSVEwgbW9kZVxuXHRcdFx0aWYoIGNvbmZpZy5ydGwgKSB7XG5cdFx0XHRcdG92ZXJ2aWV3U2xpZGVXaWR0aCA9IC1vdmVydmlld1NsaWRlV2lkdGg7XG5cdFx0XHR9XG5cblx0XHRcdHVwZGF0ZVNsaWRlc1Zpc2liaWxpdHkoKTtcblx0XHRcdGxheW91dE92ZXJ2aWV3KCk7XG5cdFx0XHR1cGRhdGVPdmVydmlldygpO1xuXG5cdFx0XHRsYXlvdXQoKTtcblxuXHRcdFx0Ly8gTm90aWZ5IG9ic2VydmVycyBvZiB0aGUgb3ZlcnZpZXcgc2hvd2luZ1xuXHRcdFx0ZGlzcGF0Y2hFdmVudCggJ292ZXJ2aWV3c2hvd24nLCB7XG5cdFx0XHRcdCdpbmRleGgnOiBpbmRleGgsXG5cdFx0XHRcdCdpbmRleHYnOiBpbmRleHYsXG5cdFx0XHRcdCdjdXJyZW50U2xpZGUnOiBjdXJyZW50U2xpZGVcblx0XHRcdH0gKTtcblxuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIFVzZXMgQ1NTIHRyYW5zZm9ybXMgdG8gcG9zaXRpb24gYWxsIHNsaWRlcyBpbiBhIGdyaWQgZm9yXG5cdCAqIGRpc3BsYXkgaW5zaWRlIG9mIHRoZSBvdmVydmlldyBtb2RlLlxuXHQgKi9cblx0ZnVuY3Rpb24gbGF5b3V0T3ZlcnZpZXcoKSB7XG5cblx0XHQvLyBMYXlvdXQgc2xpZGVzXG5cdFx0dG9BcnJheSggZG9tLndyYXBwZXIucXVlcnlTZWxlY3RvckFsbCggSE9SSVpPTlRBTF9TTElERVNfU0VMRUNUT1IgKSApLmZvckVhY2goIGZ1bmN0aW9uKCBoc2xpZGUsIGggKSB7XG5cdFx0XHRoc2xpZGUuc2V0QXR0cmlidXRlKCAnZGF0YS1pbmRleC1oJywgaCApO1xuXHRcdFx0dHJhbnNmb3JtRWxlbWVudCggaHNsaWRlLCAndHJhbnNsYXRlM2QoJyArICggaCAqIG92ZXJ2aWV3U2xpZGVXaWR0aCApICsgJ3B4LCAwLCAwKScgKTtcblxuXHRcdFx0aWYoIGhzbGlkZS5jbGFzc0xpc3QuY29udGFpbnMoICdzdGFjaycgKSApIHtcblxuXHRcdFx0XHR0b0FycmF5KCBoc2xpZGUucXVlcnlTZWxlY3RvckFsbCggJ3NlY3Rpb24nICkgKS5mb3JFYWNoKCBmdW5jdGlvbiggdnNsaWRlLCB2ICkge1xuXHRcdFx0XHRcdHZzbGlkZS5zZXRBdHRyaWJ1dGUoICdkYXRhLWluZGV4LWgnLCBoICk7XG5cdFx0XHRcdFx0dnNsaWRlLnNldEF0dHJpYnV0ZSggJ2RhdGEtaW5kZXgtdicsIHYgKTtcblxuXHRcdFx0XHRcdHRyYW5zZm9ybUVsZW1lbnQoIHZzbGlkZSwgJ3RyYW5zbGF0ZTNkKDAsICcgKyAoIHYgKiBvdmVydmlld1NsaWRlSGVpZ2h0ICkgKyAncHgsIDApJyApO1xuXHRcdFx0XHR9ICk7XG5cblx0XHRcdH1cblx0XHR9ICk7XG5cblx0XHQvLyBMYXlvdXQgc2xpZGUgYmFja2dyb3VuZHNcblx0XHR0b0FycmF5KCBkb20uYmFja2dyb3VuZC5jaGlsZE5vZGVzICkuZm9yRWFjaCggZnVuY3Rpb24oIGhiYWNrZ3JvdW5kLCBoICkge1xuXHRcdFx0dHJhbnNmb3JtRWxlbWVudCggaGJhY2tncm91bmQsICd0cmFuc2xhdGUzZCgnICsgKCBoICogb3ZlcnZpZXdTbGlkZVdpZHRoICkgKyAncHgsIDAsIDApJyApO1xuXG5cdFx0XHR0b0FycmF5KCBoYmFja2dyb3VuZC5xdWVyeVNlbGVjdG9yQWxsKCAnLnNsaWRlLWJhY2tncm91bmQnICkgKS5mb3JFYWNoKCBmdW5jdGlvbiggdmJhY2tncm91bmQsIHYgKSB7XG5cdFx0XHRcdHRyYW5zZm9ybUVsZW1lbnQoIHZiYWNrZ3JvdW5kLCAndHJhbnNsYXRlM2QoMCwgJyArICggdiAqIG92ZXJ2aWV3U2xpZGVIZWlnaHQgKSArICdweCwgMCknICk7XG5cdFx0XHR9ICk7XG5cdFx0fSApO1xuXG5cdH1cblxuXHQvKipcblx0ICogTW92ZXMgdGhlIG92ZXJ2aWV3IHZpZXdwb3J0IHRvIHRoZSBjdXJyZW50IHNsaWRlcy5cblx0ICogQ2FsbGVkIGVhY2ggdGltZSB0aGUgY3VycmVudCBzbGlkZSBjaGFuZ2VzLlxuXHQgKi9cblx0ZnVuY3Rpb24gdXBkYXRlT3ZlcnZpZXcoKSB7XG5cblx0XHR0cmFuc2Zvcm1TbGlkZXMoIHtcblx0XHRcdG92ZXJ2aWV3OiBbXG5cdFx0XHRcdCd0cmFuc2xhdGVYKCcrICggLWluZGV4aCAqIG92ZXJ2aWV3U2xpZGVXaWR0aCApICsncHgpJyxcblx0XHRcdFx0J3RyYW5zbGF0ZVkoJysgKCAtaW5kZXh2ICogb3ZlcnZpZXdTbGlkZUhlaWdodCApICsncHgpJyxcblx0XHRcdFx0J3RyYW5zbGF0ZVooJysgKCB3aW5kb3cuaW5uZXJXaWR0aCA8IDQwMCA/IC0xMDAwIDogLTI1MDAgKSArJ3B4KSdcblx0XHRcdF0uam9pbiggJyAnIClcblx0XHR9ICk7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBFeGl0cyB0aGUgc2xpZGUgb3ZlcnZpZXcgYW5kIGVudGVycyB0aGUgY3VycmVudGx5XG5cdCAqIGFjdGl2ZSBzbGlkZS5cblx0ICovXG5cdGZ1bmN0aW9uIGRlYWN0aXZhdGVPdmVydmlldygpIHtcblxuXHRcdC8vIE9ubHkgcHJvY2VlZCBpZiBlbmFibGVkIGluIGNvbmZpZ1xuXHRcdGlmKCBjb25maWcub3ZlcnZpZXcgKSB7XG5cblx0XHRcdG92ZXJ2aWV3ID0gZmFsc2U7XG5cblx0XHRcdGRvbS53cmFwcGVyLmNsYXNzTGlzdC5yZW1vdmUoICdvdmVydmlldycgKTtcblx0XHRcdGRvbS53cmFwcGVyLmNsYXNzTGlzdC5yZW1vdmUoICdvdmVydmlldy1hbmltYXRlZCcgKTtcblxuXHRcdFx0Ly8gVGVtcG9yYXJpbHkgYWRkIGEgY2xhc3Mgc28gdGhhdCB0cmFuc2l0aW9ucyBjYW4gZG8gZGlmZmVyZW50IHRoaW5nc1xuXHRcdFx0Ly8gZGVwZW5kaW5nIG9uIHdoZXRoZXIgdGhleSBhcmUgZXhpdGluZy9lbnRlcmluZyBvdmVydmlldywgb3IganVzdFxuXHRcdFx0Ly8gbW92aW5nIGZyb20gc2xpZGUgdG8gc2xpZGVcblx0XHRcdGRvbS53cmFwcGVyLmNsYXNzTGlzdC5hZGQoICdvdmVydmlldy1kZWFjdGl2YXRpbmcnICk7XG5cblx0XHRcdHNldFRpbWVvdXQoIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0ZG9tLndyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZSggJ292ZXJ2aWV3LWRlYWN0aXZhdGluZycgKTtcblx0XHRcdH0sIDEgKTtcblxuXHRcdFx0Ly8gTW92ZSB0aGUgYmFja2dyb3VuZCBlbGVtZW50IGJhY2sgb3V0XG5cdFx0XHRkb20ud3JhcHBlci5hcHBlbmRDaGlsZCggZG9tLmJhY2tncm91bmQgKTtcblxuXHRcdFx0Ly8gQ2xlYW4gdXAgY2hhbmdlcyBtYWRlIHRvIHNsaWRlc1xuXHRcdFx0dG9BcnJheSggZG9tLndyYXBwZXIucXVlcnlTZWxlY3RvckFsbCggU0xJREVTX1NFTEVDVE9SICkgKS5mb3JFYWNoKCBmdW5jdGlvbiggc2xpZGUgKSB7XG5cdFx0XHRcdHRyYW5zZm9ybUVsZW1lbnQoIHNsaWRlLCAnJyApO1xuXG5cdFx0XHRcdHNsaWRlLnJlbW92ZUV2ZW50TGlzdGVuZXIoICdjbGljaycsIG9uT3ZlcnZpZXdTbGlkZUNsaWNrZWQsIHRydWUgKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0Ly8gQ2xlYW4gdXAgY2hhbmdlcyBtYWRlIHRvIGJhY2tncm91bmRzXG5cdFx0XHR0b0FycmF5KCBkb20uYmFja2dyb3VuZC5xdWVyeVNlbGVjdG9yQWxsKCAnLnNsaWRlLWJhY2tncm91bmQnICkgKS5mb3JFYWNoKCBmdW5jdGlvbiggYmFja2dyb3VuZCApIHtcblx0XHRcdFx0dHJhbnNmb3JtRWxlbWVudCggYmFja2dyb3VuZCwgJycgKTtcblx0XHRcdH0gKTtcblxuXHRcdFx0dHJhbnNmb3JtU2xpZGVzKCB7IG92ZXJ2aWV3OiAnJyB9ICk7XG5cblx0XHRcdHNsaWRlKCBpbmRleGgsIGluZGV4diApO1xuXG5cdFx0XHRsYXlvdXQoKTtcblxuXHRcdFx0Y3VlQXV0b1NsaWRlKCk7XG5cblx0XHRcdC8vIE5vdGlmeSBvYnNlcnZlcnMgb2YgdGhlIG92ZXJ2aWV3IGhpZGluZ1xuXHRcdFx0ZGlzcGF0Y2hFdmVudCggJ292ZXJ2aWV3aGlkZGVuJywge1xuXHRcdFx0XHQnaW5kZXhoJzogaW5kZXhoLFxuXHRcdFx0XHQnaW5kZXh2JzogaW5kZXh2LFxuXHRcdFx0XHQnY3VycmVudFNsaWRlJzogY3VycmVudFNsaWRlXG5cdFx0XHR9ICk7XG5cblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogVG9nZ2xlcyB0aGUgc2xpZGUgb3ZlcnZpZXcgbW9kZSBvbiBhbmQgb2ZmLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0Jvb2xlYW59IFtvdmVycmlkZV0gRmxhZyB3aGljaCBvdmVycmlkZXMgdGhlXG5cdCAqIHRvZ2dsZSBsb2dpYyBhbmQgZm9yY2libHkgc2V0cyB0aGUgZGVzaXJlZCBzdGF0ZS4gVHJ1ZSBtZWFuc1xuXHQgKiBvdmVydmlldyBpcyBvcGVuLCBmYWxzZSBtZWFucyBpdCdzIGNsb3NlZC5cblx0ICovXG5cdGZ1bmN0aW9uIHRvZ2dsZU92ZXJ2aWV3KCBvdmVycmlkZSApIHtcblxuXHRcdGlmKCB0eXBlb2Ygb3ZlcnJpZGUgPT09ICdib29sZWFuJyApIHtcblx0XHRcdG92ZXJyaWRlID8gYWN0aXZhdGVPdmVydmlldygpIDogZGVhY3RpdmF0ZU92ZXJ2aWV3KCk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0aXNPdmVydmlldygpID8gZGVhY3RpdmF0ZU92ZXJ2aWV3KCkgOiBhY3RpdmF0ZU92ZXJ2aWV3KCk7XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2tzIGlmIHRoZSBvdmVydmlldyBpcyBjdXJyZW50bHkgYWN0aXZlLlxuXHQgKlxuXHQgKiBAcmV0dXJuIHtCb29sZWFufSB0cnVlIGlmIHRoZSBvdmVydmlldyBpcyBhY3RpdmUsXG5cdCAqIGZhbHNlIG90aGVyd2lzZVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNPdmVydmlldygpIHtcblxuXHRcdHJldHVybiBvdmVydmlldztcblxuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiB0aGUgY3VycmVudCBvciBzcGVjaWZpZWQgc2xpZGUgaXMgdmVydGljYWxcblx0ICogKG5lc3RlZCB3aXRoaW4gYW5vdGhlciBzbGlkZSkuXG5cdCAqXG5cdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IFtzbGlkZT1jdXJyZW50U2xpZGVdIFRoZSBzbGlkZSB0byBjaGVja1xuXHQgKiBvcmllbnRhdGlvbiBvZlxuXHQgKiBAcmV0dXJuIHtCb29sZWFufVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNWZXJ0aWNhbFNsaWRlKCBzbGlkZSApIHtcblxuXHRcdC8vIFByZWZlciBzbGlkZSBhcmd1bWVudCwgb3RoZXJ3aXNlIHVzZSBjdXJyZW50IHNsaWRlXG5cdFx0c2xpZGUgPSBzbGlkZSA/IHNsaWRlIDogY3VycmVudFNsaWRlO1xuXG5cdFx0cmV0dXJuIHNsaWRlICYmIHNsaWRlLnBhcmVudE5vZGUgJiYgISFzbGlkZS5wYXJlbnROb2RlLm5vZGVOYW1lLm1hdGNoKCAvc2VjdGlvbi9pICk7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBIYW5kbGluZyB0aGUgZnVsbHNjcmVlbiBmdW5jdGlvbmFsaXR5IHZpYSB0aGUgZnVsbHNjcmVlbiBBUElcblx0ICpcblx0ICogQHNlZSBodHRwOi8vZnVsbHNjcmVlbi5zcGVjLndoYXR3Zy5vcmcvXG5cdCAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9ET00vVXNpbmdfZnVsbHNjcmVlbl9tb2RlXG5cdCAqL1xuXHRmdW5jdGlvbiBlbnRlckZ1bGxzY3JlZW4oKSB7XG5cblx0XHR2YXIgZWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcblxuXHRcdC8vIENoZWNrIHdoaWNoIGltcGxlbWVudGF0aW9uIGlzIGF2YWlsYWJsZVxuXHRcdHZhciByZXF1ZXN0TWV0aG9kID0gZWxlbWVudC5yZXF1ZXN0RnVsbHNjcmVlbiB8fFxuXHRcdFx0XHRcdFx0XHRlbGVtZW50LndlYmtpdFJlcXVlc3RGdWxsc2NyZWVuIHx8XG5cdFx0XHRcdFx0XHRcdGVsZW1lbnQud2Via2l0UmVxdWVzdEZ1bGxTY3JlZW4gfHxcblx0XHRcdFx0XHRcdFx0ZWxlbWVudC5tb3pSZXF1ZXN0RnVsbFNjcmVlbiB8fFxuXHRcdFx0XHRcdFx0XHRlbGVtZW50Lm1zUmVxdWVzdEZ1bGxzY3JlZW47XG5cblx0XHRpZiggcmVxdWVzdE1ldGhvZCApIHtcblx0XHRcdHJlcXVlc3RNZXRob2QuYXBwbHkoIGVsZW1lbnQgKTtcblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBFbnRlcnMgdGhlIHBhdXNlZCBtb2RlIHdoaWNoIGZhZGVzIGV2ZXJ5dGhpbmcgb24gc2NyZWVuIHRvXG5cdCAqIGJsYWNrLlxuXHQgKi9cblx0ZnVuY3Rpb24gcGF1c2UoKSB7XG5cblx0XHRpZiggY29uZmlnLnBhdXNlICkge1xuXHRcdFx0dmFyIHdhc1BhdXNlZCA9IGRvbS53cmFwcGVyLmNsYXNzTGlzdC5jb250YWlucyggJ3BhdXNlZCcgKTtcblxuXHRcdFx0Y2FuY2VsQXV0b1NsaWRlKCk7XG5cdFx0XHRkb20ud3JhcHBlci5jbGFzc0xpc3QuYWRkKCAncGF1c2VkJyApO1xuXG5cdFx0XHRpZiggd2FzUGF1c2VkID09PSBmYWxzZSApIHtcblx0XHRcdFx0ZGlzcGF0Y2hFdmVudCggJ3BhdXNlZCcgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBFeGl0cyBmcm9tIHRoZSBwYXVzZWQgbW9kZS5cblx0ICovXG5cdGZ1bmN0aW9uIHJlc3VtZSgpIHtcblxuXHRcdHZhciB3YXNQYXVzZWQgPSBkb20ud3JhcHBlci5jbGFzc0xpc3QuY29udGFpbnMoICdwYXVzZWQnICk7XG5cdFx0ZG9tLndyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZSggJ3BhdXNlZCcgKTtcblxuXHRcdGN1ZUF1dG9TbGlkZSgpO1xuXG5cdFx0aWYoIHdhc1BhdXNlZCApIHtcblx0XHRcdGRpc3BhdGNoRXZlbnQoICdyZXN1bWVkJyApO1xuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIFRvZ2dsZXMgdGhlIHBhdXNlZCBtb2RlIG9uIGFuZCBvZmYuXG5cdCAqL1xuXHRmdW5jdGlvbiB0b2dnbGVQYXVzZSggb3ZlcnJpZGUgKSB7XG5cblx0XHRpZiggdHlwZW9mIG92ZXJyaWRlID09PSAnYm9vbGVhbicgKSB7XG5cdFx0XHRvdmVycmlkZSA/IHBhdXNlKCkgOiByZXN1bWUoKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRpc1BhdXNlZCgpID8gcmVzdW1lKCkgOiBwYXVzZSgpO1xuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiB3ZSBhcmUgY3VycmVudGx5IGluIHRoZSBwYXVzZWQgbW9kZS5cblx0ICpcblx0ICogQHJldHVybiB7Qm9vbGVhbn1cblx0ICovXG5cdGZ1bmN0aW9uIGlzUGF1c2VkKCkge1xuXG5cdFx0cmV0dXJuIGRvbS53cmFwcGVyLmNsYXNzTGlzdC5jb250YWlucyggJ3BhdXNlZCcgKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIFRvZ2dsZXMgdGhlIGF1dG8gc2xpZGUgbW9kZSBvbiBhbmQgb2ZmLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0Jvb2xlYW59IFtvdmVycmlkZV0gRmxhZyB3aGljaCBzZXRzIHRoZSBkZXNpcmVkIHN0YXRlLlxuXHQgKiBUcnVlIG1lYW5zIGF1dG9wbGF5IHN0YXJ0cywgZmFsc2UgbWVhbnMgaXQgc3RvcHMuXG5cdCAqL1xuXG5cdGZ1bmN0aW9uIHRvZ2dsZUF1dG9TbGlkZSggb3ZlcnJpZGUgKSB7XG5cblx0XHRpZiggdHlwZW9mIG92ZXJyaWRlID09PSAnYm9vbGVhbicgKSB7XG5cdFx0XHRvdmVycmlkZSA/IHJlc3VtZUF1dG9TbGlkZSgpIDogcGF1c2VBdXRvU2xpZGUoKTtcblx0XHR9XG5cblx0XHRlbHNlIHtcblx0XHRcdGF1dG9TbGlkZVBhdXNlZCA/IHJlc3VtZUF1dG9TbGlkZSgpIDogcGF1c2VBdXRvU2xpZGUoKTtcblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVja3MgaWYgdGhlIGF1dG8gc2xpZGUgbW9kZSBpcyBjdXJyZW50bHkgb24uXG5cdCAqXG5cdCAqIEByZXR1cm4ge0Jvb2xlYW59XG5cdCAqL1xuXHRmdW5jdGlvbiBpc0F1dG9TbGlkaW5nKCkge1xuXG5cdFx0cmV0dXJuICEhKCBhdXRvU2xpZGUgJiYgIWF1dG9TbGlkZVBhdXNlZCApO1xuXG5cdH1cblxuXHQvKipcblx0ICogU3RlcHMgZnJvbSB0aGUgY3VycmVudCBwb2ludCBpbiB0aGUgcHJlc2VudGF0aW9uIHRvIHRoZVxuXHQgKiBzbGlkZSB3aGljaCBtYXRjaGVzIHRoZSBzcGVjaWZpZWQgaG9yaXpvbnRhbCBhbmQgdmVydGljYWxcblx0ICogaW5kaWNlcy5cblx0ICpcblx0ICogQHBhcmFtIHtudW1iZXJ9IFtoPWluZGV4aF0gSG9yaXpvbnRhbCBpbmRleCBvZiB0aGUgdGFyZ2V0IHNsaWRlXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBbdj1pbmRleHZdIFZlcnRpY2FsIGluZGV4IG9mIHRoZSB0YXJnZXQgc2xpZGVcblx0ICogQHBhcmFtIHtudW1iZXJ9IFtmXSBJbmRleCBvZiBhIGZyYWdtZW50IHdpdGhpbiB0aGVcblx0ICogdGFyZ2V0IHNsaWRlIHRvIGFjdGl2YXRlXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSBbb10gT3JpZ2luIGZvciB1c2UgaW4gbXVsdGltYXN0ZXIgZW52aXJvbm1lbnRzXG5cdCAqL1xuXHRmdW5jdGlvbiBzbGlkZSggaCwgdiwgZiwgbyApIHtcblxuXHRcdC8vIFJlbWVtYmVyIHdoZXJlIHdlIHdlcmUgYXQgYmVmb3JlXG5cdFx0cHJldmlvdXNTbGlkZSA9IGN1cnJlbnRTbGlkZTtcblxuXHRcdC8vIFF1ZXJ5IGFsbCBob3Jpem9udGFsIHNsaWRlcyBpbiB0aGUgZGVja1xuXHRcdHZhciBob3Jpem9udGFsU2xpZGVzID0gZG9tLndyYXBwZXIucXVlcnlTZWxlY3RvckFsbCggSE9SSVpPTlRBTF9TTElERVNfU0VMRUNUT1IgKTtcblxuXHRcdC8vIEFib3J0IGlmIHRoZXJlIGFyZSBubyBzbGlkZXNcblx0XHRpZiggaG9yaXpvbnRhbFNsaWRlcy5sZW5ndGggPT09IDAgKSByZXR1cm47XG5cblx0XHQvLyBJZiBubyB2ZXJ0aWNhbCBpbmRleCBpcyBzcGVjaWZpZWQgYW5kIHRoZSB1cGNvbWluZyBzbGlkZSBpcyBhXG5cdFx0Ly8gc3RhY2ssIHJlc3VtZSBhdCBpdHMgcHJldmlvdXMgdmVydGljYWwgaW5kZXhcblx0XHRpZiggdiA9PT0gdW5kZWZpbmVkICYmICFpc092ZXJ2aWV3KCkgKSB7XG5cdFx0XHR2ID0gZ2V0UHJldmlvdXNWZXJ0aWNhbEluZGV4KCBob3Jpem9udGFsU2xpZGVzWyBoIF0gKTtcblx0XHR9XG5cblx0XHQvLyBJZiB3ZSB3ZXJlIG9uIGEgdmVydGljYWwgc3RhY2ssIHJlbWVtYmVyIHdoYXQgdmVydGljYWwgaW5kZXhcblx0XHQvLyBpdCB3YXMgb24gc28gd2UgY2FuIHJlc3VtZSBhdCB0aGUgc2FtZSBwb3NpdGlvbiB3aGVuIHJldHVybmluZ1xuXHRcdGlmKCBwcmV2aW91c1NsaWRlICYmIHByZXZpb3VzU2xpZGUucGFyZW50Tm9kZSAmJiBwcmV2aW91c1NsaWRlLnBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKCAnc3RhY2snICkgKSB7XG5cdFx0XHRzZXRQcmV2aW91c1ZlcnRpY2FsSW5kZXgoIHByZXZpb3VzU2xpZGUucGFyZW50Tm9kZSwgaW5kZXh2ICk7XG5cdFx0fVxuXG5cdFx0Ly8gUmVtZW1iZXIgdGhlIHN0YXRlIGJlZm9yZSB0aGlzIHNsaWRlXG5cdFx0dmFyIHN0YXRlQmVmb3JlID0gc3RhdGUuY29uY2F0KCk7XG5cblx0XHQvLyBSZXNldCB0aGUgc3RhdGUgYXJyYXlcblx0XHRzdGF0ZS5sZW5ndGggPSAwO1xuXG5cdFx0dmFyIGluZGV4aEJlZm9yZSA9IGluZGV4aCB8fCAwLFxuXHRcdFx0aW5kZXh2QmVmb3JlID0gaW5kZXh2IHx8IDA7XG5cblx0XHQvLyBBY3RpdmF0ZSBhbmQgdHJhbnNpdGlvbiB0byB0aGUgbmV3IHNsaWRlXG5cdFx0aW5kZXhoID0gdXBkYXRlU2xpZGVzKCBIT1JJWk9OVEFMX1NMSURFU19TRUxFQ1RPUiwgaCA9PT0gdW5kZWZpbmVkID8gaW5kZXhoIDogaCApO1xuXHRcdGluZGV4diA9IHVwZGF0ZVNsaWRlcyggVkVSVElDQUxfU0xJREVTX1NFTEVDVE9SLCB2ID09PSB1bmRlZmluZWQgPyBpbmRleHYgOiB2ICk7XG5cblx0XHQvLyBVcGRhdGUgdGhlIHZpc2liaWxpdHkgb2Ygc2xpZGVzIG5vdyB0aGF0IHRoZSBpbmRpY2VzIGhhdmUgY2hhbmdlZFxuXHRcdHVwZGF0ZVNsaWRlc1Zpc2liaWxpdHkoKTtcblxuXHRcdGxheW91dCgpO1xuXG5cdFx0Ly8gQXBwbHkgdGhlIG5ldyBzdGF0ZVxuXHRcdHN0YXRlTG9vcDogZm9yKCB2YXIgaSA9IDAsIGxlbiA9IHN0YXRlLmxlbmd0aDsgaSA8IGxlbjsgaSsrICkge1xuXHRcdFx0Ly8gQ2hlY2sgaWYgdGhpcyBzdGF0ZSBleGlzdGVkIG9uIHRoZSBwcmV2aW91cyBzbGlkZS4gSWYgaXRcblx0XHRcdC8vIGRpZCwgd2Ugd2lsbCBhdm9pZCBhZGRpbmcgaXQgcmVwZWF0ZWRseVxuXHRcdFx0Zm9yKCB2YXIgaiA9IDA7IGogPCBzdGF0ZUJlZm9yZS5sZW5ndGg7IGorKyApIHtcblx0XHRcdFx0aWYoIHN0YXRlQmVmb3JlW2pdID09PSBzdGF0ZVtpXSApIHtcblx0XHRcdFx0XHRzdGF0ZUJlZm9yZS5zcGxpY2UoIGosIDEgKTtcblx0XHRcdFx0XHRjb250aW51ZSBzdGF0ZUxvb3A7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC5hZGQoIHN0YXRlW2ldICk7XG5cblx0XHRcdC8vIERpc3BhdGNoIGN1c3RvbSBldmVudCBtYXRjaGluZyB0aGUgc3RhdGUncyBuYW1lXG5cdFx0XHRkaXNwYXRjaEV2ZW50KCBzdGF0ZVtpXSApO1xuXHRcdH1cblxuXHRcdC8vIENsZWFuIHVwIHRoZSByZW1haW5zIG9mIHRoZSBwcmV2aW91cyBzdGF0ZVxuXHRcdHdoaWxlKCBzdGF0ZUJlZm9yZS5sZW5ndGggKSB7XG5cdFx0XHRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSggc3RhdGVCZWZvcmUucG9wKCkgKTtcblx0XHR9XG5cblx0XHQvLyBVcGRhdGUgdGhlIG92ZXJ2aWV3IGlmIGl0J3MgY3VycmVudGx5IGFjdGl2ZVxuXHRcdGlmKCBpc092ZXJ2aWV3KCkgKSB7XG5cdFx0XHR1cGRhdGVPdmVydmlldygpO1xuXHRcdH1cblxuXHRcdC8vIEZpbmQgdGhlIGN1cnJlbnQgaG9yaXpvbnRhbCBzbGlkZSBhbmQgYW55IHBvc3NpYmxlIHZlcnRpY2FsIHNsaWRlc1xuXHRcdC8vIHdpdGhpbiBpdFxuXHRcdHZhciBjdXJyZW50SG9yaXpvbnRhbFNsaWRlID0gaG9yaXpvbnRhbFNsaWRlc1sgaW5kZXhoIF0sXG5cdFx0XHRjdXJyZW50VmVydGljYWxTbGlkZXMgPSBjdXJyZW50SG9yaXpvbnRhbFNsaWRlLnF1ZXJ5U2VsZWN0b3JBbGwoICdzZWN0aW9uJyApO1xuXG5cdFx0Ly8gU3RvcmUgcmVmZXJlbmNlcyB0byB0aGUgcHJldmlvdXMgYW5kIGN1cnJlbnQgc2xpZGVzXG5cdFx0Y3VycmVudFNsaWRlID0gY3VycmVudFZlcnRpY2FsU2xpZGVzWyBpbmRleHYgXSB8fCBjdXJyZW50SG9yaXpvbnRhbFNsaWRlO1xuXG5cdFx0Ly8gU2hvdyBmcmFnbWVudCwgaWYgc3BlY2lmaWVkXG5cdFx0aWYoIHR5cGVvZiBmICE9PSAndW5kZWZpbmVkJyApIHtcblx0XHRcdG5hdmlnYXRlRnJhZ21lbnQoIGYgKTtcblx0XHR9XG5cblx0XHQvLyBEaXNwYXRjaCBhbiBldmVudCBpZiB0aGUgc2xpZGUgY2hhbmdlZFxuXHRcdHZhciBzbGlkZUNoYW5nZWQgPSAoIGluZGV4aCAhPT0gaW5kZXhoQmVmb3JlIHx8IGluZGV4diAhPT0gaW5kZXh2QmVmb3JlICk7XG5cdFx0aWYoIHNsaWRlQ2hhbmdlZCApIHtcblx0XHRcdGRpc3BhdGNoRXZlbnQoICdzbGlkZWNoYW5nZWQnLCB7XG5cdFx0XHRcdCdpbmRleGgnOiBpbmRleGgsXG5cdFx0XHRcdCdpbmRleHYnOiBpbmRleHYsXG5cdFx0XHRcdCdwcmV2aW91c1NsaWRlJzogcHJldmlvdXNTbGlkZSxcblx0XHRcdFx0J2N1cnJlbnRTbGlkZSc6IGN1cnJlbnRTbGlkZSxcblx0XHRcdFx0J29yaWdpbic6IG9cblx0XHRcdH0gKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHQvLyBFbnN1cmUgdGhhdCB0aGUgcHJldmlvdXMgc2xpZGUgaXMgbmV2ZXIgdGhlIHNhbWUgYXMgdGhlIGN1cnJlbnRcblx0XHRcdHByZXZpb3VzU2xpZGUgPSBudWxsO1xuXHRcdH1cblxuXHRcdC8vIFNvbHZlcyBhbiBlZGdlIGNhc2Ugd2hlcmUgdGhlIHByZXZpb3VzIHNsaWRlIG1haW50YWlucyB0aGVcblx0XHQvLyAncHJlc2VudCcgY2xhc3Mgd2hlbiBuYXZpZ2F0aW5nIGJldHdlZW4gYWRqYWNlbnQgdmVydGljYWxcblx0XHQvLyBzdGFja3Ncblx0XHRpZiggcHJldmlvdXNTbGlkZSApIHtcblx0XHRcdHByZXZpb3VzU2xpZGUuY2xhc3NMaXN0LnJlbW92ZSggJ3ByZXNlbnQnICk7XG5cdFx0XHRwcmV2aW91c1NsaWRlLnNldEF0dHJpYnV0ZSggJ2FyaWEtaGlkZGVuJywgJ3RydWUnICk7XG5cblx0XHRcdC8vIFJlc2V0IGFsbCBzbGlkZXMgdXBvbiBuYXZpZ2F0ZSB0byBob21lXG5cdFx0XHQvLyBJc3N1ZTogIzI4NVxuXHRcdFx0aWYgKCBkb20ud3JhcHBlci5xdWVyeVNlbGVjdG9yKCBIT01FX1NMSURFX1NFTEVDVE9SICkuY2xhc3NMaXN0LmNvbnRhaW5zKCAncHJlc2VudCcgKSApIHtcblx0XHRcdFx0Ly8gTGF1bmNoIGFzeW5jIHRhc2tcblx0XHRcdFx0c2V0VGltZW91dCggZnVuY3Rpb24gKCkge1xuXHRcdFx0XHRcdHZhciBzbGlkZXMgPSB0b0FycmF5KCBkb20ud3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKCBIT1JJWk9OVEFMX1NMSURFU19TRUxFQ1RPUiArICcuc3RhY2snKSApLCBpO1xuXHRcdFx0XHRcdGZvciggaSBpbiBzbGlkZXMgKSB7XG5cdFx0XHRcdFx0XHRpZiggc2xpZGVzW2ldICkge1xuXHRcdFx0XHRcdFx0XHQvLyBSZXNldCBzdGFja1xuXHRcdFx0XHRcdFx0XHRzZXRQcmV2aW91c1ZlcnRpY2FsSW5kZXgoIHNsaWRlc1tpXSwgMCApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSwgMCApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIEhhbmRsZSBlbWJlZGRlZCBjb250ZW50XG5cdFx0aWYoIHNsaWRlQ2hhbmdlZCB8fCAhcHJldmlvdXNTbGlkZSApIHtcblx0XHRcdHN0b3BFbWJlZGRlZENvbnRlbnQoIHByZXZpb3VzU2xpZGUgKTtcblx0XHRcdHN0YXJ0RW1iZWRkZWRDb250ZW50KCBjdXJyZW50U2xpZGUgKTtcblx0XHR9XG5cblx0XHQvLyBBbm5vdW5jZSB0aGUgY3VycmVudCBzbGlkZSBjb250ZW50cywgZm9yIHNjcmVlbiByZWFkZXJzXG5cdFx0ZG9tLnN0YXR1c0Rpdi50ZXh0Q29udGVudCA9IGdldFN0YXR1c1RleHQoIGN1cnJlbnRTbGlkZSApO1xuXG5cdFx0dXBkYXRlQ29udHJvbHMoKTtcblx0XHR1cGRhdGVQcm9ncmVzcygpO1xuXHRcdHVwZGF0ZUJhY2tncm91bmQoKTtcblx0XHR1cGRhdGVQYXJhbGxheCgpO1xuXHRcdHVwZGF0ZVNsaWRlTnVtYmVyKCk7XG5cdFx0dXBkYXRlTm90ZXMoKTtcblxuXHRcdC8vIFVwZGF0ZSB0aGUgVVJMIGhhc2hcblx0XHR3cml0ZVVSTCgpO1xuXG5cdFx0Y3VlQXV0b1NsaWRlKCk7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBTeW5jcyB0aGUgcHJlc2VudGF0aW9uIHdpdGggdGhlIGN1cnJlbnQgRE9NLiBVc2VmdWxcblx0ICogd2hlbiBuZXcgc2xpZGVzIG9yIGNvbnRyb2wgZWxlbWVudHMgYXJlIGFkZGVkIG9yIHdoZW5cblx0ICogdGhlIGNvbmZpZ3VyYXRpb24gaGFzIGNoYW5nZWQuXG5cdCAqL1xuXHRmdW5jdGlvbiBzeW5jKCkge1xuXG5cdFx0Ly8gU3Vic2NyaWJlIHRvIGlucHV0XG5cdFx0cmVtb3ZlRXZlbnRMaXN0ZW5lcnMoKTtcblx0XHRhZGRFdmVudExpc3RlbmVycygpO1xuXG5cdFx0Ly8gRm9yY2UgYSBsYXlvdXQgdG8gbWFrZSBzdXJlIHRoZSBjdXJyZW50IGNvbmZpZyBpcyBhY2NvdW50ZWQgZm9yXG5cdFx0bGF5b3V0KCk7XG5cblx0XHQvLyBSZWZsZWN0IHRoZSBjdXJyZW50IGF1dG9TbGlkZSB2YWx1ZVxuXHRcdGF1dG9TbGlkZSA9IGNvbmZpZy5hdXRvU2xpZGU7XG5cblx0XHQvLyBTdGFydCBhdXRvLXNsaWRpbmcgaWYgaXQncyBlbmFibGVkXG5cdFx0Y3VlQXV0b1NsaWRlKCk7XG5cblx0XHQvLyBSZS1jcmVhdGUgdGhlIHNsaWRlIGJhY2tncm91bmRzXG5cdFx0Y3JlYXRlQmFja2dyb3VuZHMoKTtcblxuXHRcdC8vIFdyaXRlIHRoZSBjdXJyZW50IGhhc2ggdG8gdGhlIFVSTFxuXHRcdHdyaXRlVVJMKCk7XG5cblx0XHRzb3J0QWxsRnJhZ21lbnRzKCk7XG5cblx0XHR1cGRhdGVDb250cm9scygpO1xuXHRcdHVwZGF0ZVByb2dyZXNzKCk7XG5cdFx0dXBkYXRlQmFja2dyb3VuZCggdHJ1ZSApO1xuXHRcdHVwZGF0ZVNsaWRlTnVtYmVyKCk7XG5cdFx0dXBkYXRlU2xpZGVzVmlzaWJpbGl0eSgpO1xuXHRcdHVwZGF0ZU5vdGVzKCk7XG5cblx0XHRmb3JtYXRFbWJlZGRlZENvbnRlbnQoKTtcblx0XHRzdGFydEVtYmVkZGVkQ29udGVudCggY3VycmVudFNsaWRlICk7XG5cblx0XHRpZiggaXNPdmVydmlldygpICkge1xuXHRcdFx0bGF5b3V0T3ZlcnZpZXcoKTtcblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBSZXNldHMgYWxsIHZlcnRpY2FsIHNsaWRlcyBzbyB0aGF0IG9ubHkgdGhlIGZpcnN0XG5cdCAqIGlzIHZpc2libGUuXG5cdCAqL1xuXHRmdW5jdGlvbiByZXNldFZlcnRpY2FsU2xpZGVzKCkge1xuXG5cdFx0dmFyIGhvcml6b250YWxTbGlkZXMgPSB0b0FycmF5KCBkb20ud3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKCBIT1JJWk9OVEFMX1NMSURFU19TRUxFQ1RPUiApICk7XG5cdFx0aG9yaXpvbnRhbFNsaWRlcy5mb3JFYWNoKCBmdW5jdGlvbiggaG9yaXpvbnRhbFNsaWRlICkge1xuXG5cdFx0XHR2YXIgdmVydGljYWxTbGlkZXMgPSB0b0FycmF5KCBob3Jpem9udGFsU2xpZGUucXVlcnlTZWxlY3RvckFsbCggJ3NlY3Rpb24nICkgKTtcblx0XHRcdHZlcnRpY2FsU2xpZGVzLmZvckVhY2goIGZ1bmN0aW9uKCB2ZXJ0aWNhbFNsaWRlLCB5ICkge1xuXG5cdFx0XHRcdGlmKCB5ID4gMCApIHtcblx0XHRcdFx0XHR2ZXJ0aWNhbFNsaWRlLmNsYXNzTGlzdC5yZW1vdmUoICdwcmVzZW50JyApO1xuXHRcdFx0XHRcdHZlcnRpY2FsU2xpZGUuY2xhc3NMaXN0LnJlbW92ZSggJ3Bhc3QnICk7XG5cdFx0XHRcdFx0dmVydGljYWxTbGlkZS5jbGFzc0xpc3QuYWRkKCAnZnV0dXJlJyApO1xuXHRcdFx0XHRcdHZlcnRpY2FsU2xpZGUuc2V0QXR0cmlidXRlKCAnYXJpYS1oaWRkZW4nLCAndHJ1ZScgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9ICk7XG5cblx0XHR9ICk7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBTb3J0cyBhbmQgZm9ybWF0cyBhbGwgb2YgZnJhZ21lbnRzIGluIHRoZVxuXHQgKiBwcmVzZW50YXRpb24uXG5cdCAqL1xuXHRmdW5jdGlvbiBzb3J0QWxsRnJhZ21lbnRzKCkge1xuXG5cdFx0dmFyIGhvcml6b250YWxTbGlkZXMgPSB0b0FycmF5KCBkb20ud3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKCBIT1JJWk9OVEFMX1NMSURFU19TRUxFQ1RPUiApICk7XG5cdFx0aG9yaXpvbnRhbFNsaWRlcy5mb3JFYWNoKCBmdW5jdGlvbiggaG9yaXpvbnRhbFNsaWRlICkge1xuXG5cdFx0XHR2YXIgdmVydGljYWxTbGlkZXMgPSB0b0FycmF5KCBob3Jpem9udGFsU2xpZGUucXVlcnlTZWxlY3RvckFsbCggJ3NlY3Rpb24nICkgKTtcblx0XHRcdHZlcnRpY2FsU2xpZGVzLmZvckVhY2goIGZ1bmN0aW9uKCB2ZXJ0aWNhbFNsaWRlLCB5ICkge1xuXG5cdFx0XHRcdHNvcnRGcmFnbWVudHMoIHZlcnRpY2FsU2xpZGUucXVlcnlTZWxlY3RvckFsbCggJy5mcmFnbWVudCcgKSApO1xuXG5cdFx0XHR9ICk7XG5cblx0XHRcdGlmKCB2ZXJ0aWNhbFNsaWRlcy5sZW5ndGggPT09IDAgKSBzb3J0RnJhZ21lbnRzKCBob3Jpem9udGFsU2xpZGUucXVlcnlTZWxlY3RvckFsbCggJy5mcmFnbWVudCcgKSApO1xuXG5cdFx0fSApO1xuXG5cdH1cblxuXHQvKipcblx0ICogUmFuZG9tbHkgc2h1ZmZsZXMgYWxsIHNsaWRlcyBpbiB0aGUgZGVjay5cblx0ICovXG5cdGZ1bmN0aW9uIHNodWZmbGUoKSB7XG5cblx0XHR2YXIgc2xpZGVzID0gdG9BcnJheSggZG9tLndyYXBwZXIucXVlcnlTZWxlY3RvckFsbCggSE9SSVpPTlRBTF9TTElERVNfU0VMRUNUT1IgKSApO1xuXG5cdFx0c2xpZGVzLmZvckVhY2goIGZ1bmN0aW9uKCBzbGlkZSApIHtcblxuXHRcdFx0Ly8gSW5zZXJ0IHRoaXMgc2xpZGUgbmV4dCB0byBhbm90aGVyIHJhbmRvbSBzbGlkZS4gVGhpcyBtYXlcblx0XHRcdC8vIGNhdXNlIHRoZSBzbGlkZSB0byBpbnNlcnQgYmVmb3JlIGl0c2VsZiBidXQgdGhhdCdzIGZpbmUuXG5cdFx0XHRkb20uc2xpZGVzLmluc2VydEJlZm9yZSggc2xpZGUsIHNsaWRlc1sgTWF0aC5mbG9vciggTWF0aC5yYW5kb20oKSAqIHNsaWRlcy5sZW5ndGggKSBdICk7XG5cblx0XHR9ICk7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBVcGRhdGVzIG9uZSBkaW1lbnNpb24gb2Ygc2xpZGVzIGJ5IHNob3dpbmcgdGhlIHNsaWRlXG5cdCAqIHdpdGggdGhlIHNwZWNpZmllZCBpbmRleC5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yIEEgQ1NTIHNlbGVjdG9yIHRoYXQgd2lsbCBmZXRjaFxuXHQgKiB0aGUgZ3JvdXAgb2Ygc2xpZGVzIHdlIGFyZSB3b3JraW5nIHdpdGhcblx0ICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IFRoZSBpbmRleCBvZiB0aGUgc2xpZGUgdGhhdCBzaG91bGQgYmVcblx0ICogc2hvd25cblx0ICpcblx0ICogQHJldHVybiB7bnVtYmVyfSBUaGUgaW5kZXggb2YgdGhlIHNsaWRlIHRoYXQgaXMgbm93IHNob3duLFxuXHQgKiBtaWdodCBkaWZmZXIgZnJvbSB0aGUgcGFzc2VkIGluIGluZGV4IGlmIGl0IHdhcyBvdXQgb2Zcblx0ICogYm91bmRzLlxuXHQgKi9cblx0ZnVuY3Rpb24gdXBkYXRlU2xpZGVzKCBzZWxlY3RvciwgaW5kZXggKSB7XG5cblx0XHQvLyBTZWxlY3QgYWxsIHNsaWRlcyBhbmQgY29udmVydCB0aGUgTm9kZUxpc3QgcmVzdWx0IHRvXG5cdFx0Ly8gYW4gYXJyYXlcblx0XHR2YXIgc2xpZGVzID0gdG9BcnJheSggZG9tLndyYXBwZXIucXVlcnlTZWxlY3RvckFsbCggc2VsZWN0b3IgKSApLFxuXHRcdFx0c2xpZGVzTGVuZ3RoID0gc2xpZGVzLmxlbmd0aDtcblxuXHRcdHZhciBwcmludE1vZGUgPSBpc1ByaW50aW5nUERGKCk7XG5cblx0XHRpZiggc2xpZGVzTGVuZ3RoICkge1xuXG5cdFx0XHQvLyBTaG91bGQgdGhlIGluZGV4IGxvb3A/XG5cdFx0XHRpZiggY29uZmlnLmxvb3AgKSB7XG5cdFx0XHRcdGluZGV4ICU9IHNsaWRlc0xlbmd0aDtcblxuXHRcdFx0XHRpZiggaW5kZXggPCAwICkge1xuXHRcdFx0XHRcdGluZGV4ID0gc2xpZGVzTGVuZ3RoICsgaW5kZXg7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gRW5mb3JjZSBtYXggYW5kIG1pbmltdW0gaW5kZXggYm91bmRzXG5cdFx0XHRpbmRleCA9IE1hdGgubWF4KCBNYXRoLm1pbiggaW5kZXgsIHNsaWRlc0xlbmd0aCAtIDEgKSwgMCApO1xuXG5cdFx0XHRmb3IoIHZhciBpID0gMDsgaSA8IHNsaWRlc0xlbmd0aDsgaSsrICkge1xuXHRcdFx0XHR2YXIgZWxlbWVudCA9IHNsaWRlc1tpXTtcblxuXHRcdFx0XHR2YXIgcmV2ZXJzZSA9IGNvbmZpZy5ydGwgJiYgIWlzVmVydGljYWxTbGlkZSggZWxlbWVudCApO1xuXG5cdFx0XHRcdGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSggJ3Bhc3QnICk7XG5cdFx0XHRcdGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSggJ3ByZXNlbnQnICk7XG5cdFx0XHRcdGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSggJ2Z1dHVyZScgKTtcblxuXHRcdFx0XHQvLyBodHRwOi8vd3d3LnczLm9yZy9odG1sL3dnL2RyYWZ0cy9odG1sL21hc3Rlci9lZGl0aW5nLmh0bWwjdGhlLWhpZGRlbi1hdHRyaWJ1dGVcblx0XHRcdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGUoICdoaWRkZW4nLCAnJyApO1xuXHRcdFx0XHRlbGVtZW50LnNldEF0dHJpYnV0ZSggJ2FyaWEtaGlkZGVuJywgJ3RydWUnICk7XG5cblx0XHRcdFx0Ly8gSWYgdGhpcyBlbGVtZW50IGNvbnRhaW5zIHZlcnRpY2FsIHNsaWRlc1xuXHRcdFx0XHRpZiggZWxlbWVudC5xdWVyeVNlbGVjdG9yKCAnc2VjdGlvbicgKSApIHtcblx0XHRcdFx0XHRlbGVtZW50LmNsYXNzTGlzdC5hZGQoICdzdGFjaycgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIElmIHdlJ3JlIHByaW50aW5nIHN0YXRpYyBzbGlkZXMsIGFsbCBzbGlkZXMgYXJlIFwicHJlc2VudFwiXG5cdFx0XHRcdGlmKCBwcmludE1vZGUgKSB7XG5cdFx0XHRcdFx0ZWxlbWVudC5jbGFzc0xpc3QuYWRkKCAncHJlc2VudCcgKTtcblx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmKCBpIDwgaW5kZXggKSB7XG5cdFx0XHRcdFx0Ly8gQW55IGVsZW1lbnQgcHJldmlvdXMgdG8gaW5kZXggaXMgZ2l2ZW4gdGhlICdwYXN0JyBjbGFzc1xuXHRcdFx0XHRcdGVsZW1lbnQuY2xhc3NMaXN0LmFkZCggcmV2ZXJzZSA/ICdmdXR1cmUnIDogJ3Bhc3QnICk7XG5cblx0XHRcdFx0XHRpZiggY29uZmlnLmZyYWdtZW50cyApIHtcblx0XHRcdFx0XHRcdHZhciBwYXN0RnJhZ21lbnRzID0gdG9BcnJheSggZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnLmZyYWdtZW50JyApICk7XG5cblx0XHRcdFx0XHRcdC8vIFNob3cgYWxsIGZyYWdtZW50cyBvbiBwcmlvciBzbGlkZXNcblx0XHRcdFx0XHRcdHdoaWxlKCBwYXN0RnJhZ21lbnRzLmxlbmd0aCApIHtcblx0XHRcdFx0XHRcdFx0dmFyIHBhc3RGcmFnbWVudCA9IHBhc3RGcmFnbWVudHMucG9wKCk7XG5cdFx0XHRcdFx0XHRcdHBhc3RGcmFnbWVudC5jbGFzc0xpc3QuYWRkKCAndmlzaWJsZScgKTtcblx0XHRcdFx0XHRcdFx0cGFzdEZyYWdtZW50LmNsYXNzTGlzdC5yZW1vdmUoICdjdXJyZW50LWZyYWdtZW50JyApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmKCBpID4gaW5kZXggKSB7XG5cdFx0XHRcdFx0Ly8gQW55IGVsZW1lbnQgc3Vic2VxdWVudCB0byBpbmRleCBpcyBnaXZlbiB0aGUgJ2Z1dHVyZScgY2xhc3Ncblx0XHRcdFx0XHRlbGVtZW50LmNsYXNzTGlzdC5hZGQoIHJldmVyc2UgPyAncGFzdCcgOiAnZnV0dXJlJyApO1xuXG5cdFx0XHRcdFx0aWYoIGNvbmZpZy5mcmFnbWVudHMgKSB7XG5cdFx0XHRcdFx0XHR2YXIgZnV0dXJlRnJhZ21lbnRzID0gdG9BcnJheSggZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnLmZyYWdtZW50LnZpc2libGUnICkgKTtcblxuXHRcdFx0XHRcdFx0Ly8gTm8gZnJhZ21lbnRzIGluIGZ1dHVyZSBzbGlkZXMgc2hvdWxkIGJlIHZpc2libGUgYWhlYWQgb2YgdGltZVxuXHRcdFx0XHRcdFx0d2hpbGUoIGZ1dHVyZUZyYWdtZW50cy5sZW5ndGggKSB7XG5cdFx0XHRcdFx0XHRcdHZhciBmdXR1cmVGcmFnbWVudCA9IGZ1dHVyZUZyYWdtZW50cy5wb3AoKTtcblx0XHRcdFx0XHRcdFx0ZnV0dXJlRnJhZ21lbnQuY2xhc3NMaXN0LnJlbW92ZSggJ3Zpc2libGUnICk7XG5cdFx0XHRcdFx0XHRcdGZ1dHVyZUZyYWdtZW50LmNsYXNzTGlzdC5yZW1vdmUoICdjdXJyZW50LWZyYWdtZW50JyApO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBNYXJrIHRoZSBjdXJyZW50IHNsaWRlIGFzIHByZXNlbnRcblx0XHRcdHNsaWRlc1tpbmRleF0uY2xhc3NMaXN0LmFkZCggJ3ByZXNlbnQnICk7XG5cdFx0XHRzbGlkZXNbaW5kZXhdLnJlbW92ZUF0dHJpYnV0ZSggJ2hpZGRlbicgKTtcblx0XHRcdHNsaWRlc1tpbmRleF0ucmVtb3ZlQXR0cmlidXRlKCAnYXJpYS1oaWRkZW4nICk7XG5cblx0XHRcdC8vIElmIHRoaXMgc2xpZGUgaGFzIGEgc3RhdGUgYXNzb2NpYXRlZCB3aXRoIGl0LCBhZGQgaXRcblx0XHRcdC8vIG9udG8gdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIGRlY2tcblx0XHRcdHZhciBzbGlkZVN0YXRlID0gc2xpZGVzW2luZGV4XS5nZXRBdHRyaWJ1dGUoICdkYXRhLXN0YXRlJyApO1xuXHRcdFx0aWYoIHNsaWRlU3RhdGUgKSB7XG5cdFx0XHRcdHN0YXRlID0gc3RhdGUuY29uY2F0KCBzbGlkZVN0YXRlLnNwbGl0KCAnICcgKSApO1xuXHRcdFx0fVxuXG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0Ly8gU2luY2UgdGhlcmUgYXJlIG5vIHNsaWRlcyB3ZSBjYW4ndCBiZSBhbnl3aGVyZSBiZXlvbmQgdGhlXG5cdFx0XHQvLyB6ZXJvdGggaW5kZXhcblx0XHRcdGluZGV4ID0gMDtcblx0XHR9XG5cblx0XHRyZXR1cm4gaW5kZXg7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBPcHRpbWl6YXRpb24gbWV0aG9kOyBoaWRlIGFsbCBzbGlkZXMgdGhhdCBhcmUgZmFyIGF3YXlcblx0ICogZnJvbSB0aGUgcHJlc2VudCBzbGlkZS5cblx0ICovXG5cdGZ1bmN0aW9uIHVwZGF0ZVNsaWRlc1Zpc2liaWxpdHkoKSB7XG5cblx0XHQvLyBTZWxlY3QgYWxsIHNsaWRlcyBhbmQgY29udmVydCB0aGUgTm9kZUxpc3QgcmVzdWx0IHRvXG5cdFx0Ly8gYW4gYXJyYXlcblx0XHR2YXIgaG9yaXpvbnRhbFNsaWRlcyA9IHRvQXJyYXkoIGRvbS53cmFwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoIEhPUklaT05UQUxfU0xJREVTX1NFTEVDVE9SICkgKSxcblx0XHRcdGhvcml6b250YWxTbGlkZXNMZW5ndGggPSBob3Jpem9udGFsU2xpZGVzLmxlbmd0aCxcblx0XHRcdGRpc3RhbmNlWCxcblx0XHRcdGRpc3RhbmNlWTtcblxuXHRcdGlmKCBob3Jpem9udGFsU2xpZGVzTGVuZ3RoICYmIHR5cGVvZiBpbmRleGggIT09ICd1bmRlZmluZWQnICkge1xuXG5cdFx0XHQvLyBUaGUgbnVtYmVyIG9mIHN0ZXBzIGF3YXkgZnJvbSB0aGUgcHJlc2VudCBzbGlkZSB0aGF0IHdpbGxcblx0XHRcdC8vIGJlIHZpc2libGVcblx0XHRcdHZhciB2aWV3RGlzdGFuY2UgPSBpc092ZXJ2aWV3KCkgPyAxMCA6IGNvbmZpZy52aWV3RGlzdGFuY2U7XG5cblx0XHRcdC8vIExpbWl0IHZpZXcgZGlzdGFuY2Ugb24gd2Vha2VyIGRldmljZXNcblx0XHRcdGlmKCBpc01vYmlsZURldmljZSApIHtcblx0XHRcdFx0dmlld0Rpc3RhbmNlID0gaXNPdmVydmlldygpID8gNiA6IDI7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEFsbCBzbGlkZXMgbmVlZCB0byBiZSB2aXNpYmxlIHdoZW4gZXhwb3J0aW5nIHRvIFBERlxuXHRcdFx0aWYoIGlzUHJpbnRpbmdQREYoKSApIHtcblx0XHRcdFx0dmlld0Rpc3RhbmNlID0gTnVtYmVyLk1BWF9WQUxVRTtcblx0XHRcdH1cblxuXHRcdFx0Zm9yKCB2YXIgeCA9IDA7IHggPCBob3Jpem9udGFsU2xpZGVzTGVuZ3RoOyB4KysgKSB7XG5cdFx0XHRcdHZhciBob3Jpem9udGFsU2xpZGUgPSBob3Jpem9udGFsU2xpZGVzW3hdO1xuXG5cdFx0XHRcdHZhciB2ZXJ0aWNhbFNsaWRlcyA9IHRvQXJyYXkoIGhvcml6b250YWxTbGlkZS5xdWVyeVNlbGVjdG9yQWxsKCAnc2VjdGlvbicgKSApLFxuXHRcdFx0XHRcdHZlcnRpY2FsU2xpZGVzTGVuZ3RoID0gdmVydGljYWxTbGlkZXMubGVuZ3RoO1xuXG5cdFx0XHRcdC8vIERldGVybWluZSBob3cgZmFyIGF3YXkgdGhpcyBzbGlkZSBpcyBmcm9tIHRoZSBwcmVzZW50XG5cdFx0XHRcdGRpc3RhbmNlWCA9IE1hdGguYWJzKCAoIGluZGV4aCB8fCAwICkgLSB4ICkgfHwgMDtcblxuXHRcdFx0XHQvLyBJZiB0aGUgcHJlc2VudGF0aW9uIGlzIGxvb3BlZCwgZGlzdGFuY2Ugc2hvdWxkIG1lYXN1cmVcblx0XHRcdFx0Ly8gMSBiZXR3ZWVuIHRoZSBmaXJzdCBhbmQgbGFzdCBzbGlkZXNcblx0XHRcdFx0aWYoIGNvbmZpZy5sb29wICkge1xuXHRcdFx0XHRcdGRpc3RhbmNlWCA9IE1hdGguYWJzKCAoICggaW5kZXhoIHx8IDAgKSAtIHggKSAlICggaG9yaXpvbnRhbFNsaWRlc0xlbmd0aCAtIHZpZXdEaXN0YW5jZSApICkgfHwgMDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIFNob3cgdGhlIGhvcml6b250YWwgc2xpZGUgaWYgaXQncyB3aXRoaW4gdGhlIHZpZXcgZGlzdGFuY2Vcblx0XHRcdFx0aWYoIGRpc3RhbmNlWCA8IHZpZXdEaXN0YW5jZSApIHtcblx0XHRcdFx0XHRzaG93U2xpZGUoIGhvcml6b250YWxTbGlkZSApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdGhpZGVTbGlkZSggaG9yaXpvbnRhbFNsaWRlICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiggdmVydGljYWxTbGlkZXNMZW5ndGggKSB7XG5cblx0XHRcdFx0XHR2YXIgb3kgPSBnZXRQcmV2aW91c1ZlcnRpY2FsSW5kZXgoIGhvcml6b250YWxTbGlkZSApO1xuXG5cdFx0XHRcdFx0Zm9yKCB2YXIgeSA9IDA7IHkgPCB2ZXJ0aWNhbFNsaWRlc0xlbmd0aDsgeSsrICkge1xuXHRcdFx0XHRcdFx0dmFyIHZlcnRpY2FsU2xpZGUgPSB2ZXJ0aWNhbFNsaWRlc1t5XTtcblxuXHRcdFx0XHRcdFx0ZGlzdGFuY2VZID0geCA9PT0gKCBpbmRleGggfHwgMCApID8gTWF0aC5hYnMoICggaW5kZXh2IHx8IDAgKSAtIHkgKSA6IE1hdGguYWJzKCB5IC0gb3kgKTtcblxuXHRcdFx0XHRcdFx0aWYoIGRpc3RhbmNlWCArIGRpc3RhbmNlWSA8IHZpZXdEaXN0YW5jZSApIHtcblx0XHRcdFx0XHRcdFx0c2hvd1NsaWRlKCB2ZXJ0aWNhbFNsaWRlICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdFx0aGlkZVNsaWRlKCB2ZXJ0aWNhbFNsaWRlICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIFBpY2sgdXAgbm90ZXMgZnJvbSB0aGUgY3VycmVudCBzbGlkZSBhbmQgZGlzcGxheSB0aGVtXG5cdCAqIHRvIHRoZSB2aWV3ZXIuXG5cdCAqXG5cdCAqIEBzZWUge0BsaW5rIGNvbmZpZy5zaG93Tm90ZXN9XG5cdCAqL1xuXHRmdW5jdGlvbiB1cGRhdGVOb3RlcygpIHtcblxuXHRcdGlmKCBjb25maWcuc2hvd05vdGVzICYmIGRvbS5zcGVha2VyTm90ZXMgJiYgY3VycmVudFNsaWRlICYmICFpc1ByaW50aW5nUERGKCkgKSB7XG5cblx0XHRcdGRvbS5zcGVha2VyTm90ZXMuaW5uZXJIVE1MID0gZ2V0U2xpZGVOb3RlcygpIHx8ICcnO1xuXG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogVXBkYXRlcyB0aGUgcHJvZ3Jlc3MgYmFyIHRvIHJlZmxlY3QgdGhlIGN1cnJlbnQgc2xpZGUuXG5cdCAqL1xuXHRmdW5jdGlvbiB1cGRhdGVQcm9ncmVzcygpIHtcblxuXHRcdC8vIFVwZGF0ZSBwcm9ncmVzcyBpZiBlbmFibGVkXG5cdFx0aWYoIGNvbmZpZy5wcm9ncmVzcyAmJiBkb20ucHJvZ3Jlc3NiYXIgKSB7XG5cblx0XHRcdGRvbS5wcm9ncmVzc2Jhci5zdHlsZS53aWR0aCA9IGdldFByb2dyZXNzKCkgKiBkb20ud3JhcHBlci5vZmZzZXRXaWR0aCArICdweCc7XG5cblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBVcGRhdGVzIHRoZSBzbGlkZSBudW1iZXIgZGl2IHRvIHJlZmxlY3QgdGhlIGN1cnJlbnQgc2xpZGUuXG5cdCAqXG5cdCAqIFRoZSBmb2xsb3dpbmcgc2xpZGUgbnVtYmVyIGZvcm1hdHMgYXJlIGF2YWlsYWJsZTpcblx0ICogIFwiaC52XCI6XHRob3Jpem9udGFsIC4gdmVydGljYWwgc2xpZGUgbnVtYmVyIChkZWZhdWx0KVxuXHQgKiAgXCJoL3ZcIjpcdGhvcml6b250YWwgLyB2ZXJ0aWNhbCBzbGlkZSBudW1iZXJcblx0ICogICAgXCJjXCI6XHRmbGF0dGVuZWQgc2xpZGUgbnVtYmVyXG5cdCAqICBcImMvdFwiOlx0ZmxhdHRlbmVkIHNsaWRlIG51bWJlciAvIHRvdGFsIHNsaWRlc1xuXHQgKi9cblx0ZnVuY3Rpb24gdXBkYXRlU2xpZGVOdW1iZXIoKSB7XG5cblx0XHQvLyBVcGRhdGUgc2xpZGUgbnVtYmVyIGlmIGVuYWJsZWRcblx0XHRpZiggY29uZmlnLnNsaWRlTnVtYmVyICYmIGRvbS5zbGlkZU51bWJlciApIHtcblxuXHRcdFx0dmFyIHZhbHVlID0gW107XG5cdFx0XHR2YXIgZm9ybWF0ID0gJ2gudic7XG5cblx0XHRcdC8vIENoZWNrIGlmIGEgY3VzdG9tIG51bWJlciBmb3JtYXQgaXMgYXZhaWxhYmxlXG5cdFx0XHRpZiggdHlwZW9mIGNvbmZpZy5zbGlkZU51bWJlciA9PT0gJ3N0cmluZycgKSB7XG5cdFx0XHRcdGZvcm1hdCA9IGNvbmZpZy5zbGlkZU51bWJlcjtcblx0XHRcdH1cblxuXHRcdFx0c3dpdGNoKCBmb3JtYXQgKSB7XG5cdFx0XHRcdGNhc2UgJ2MnOlxuXHRcdFx0XHRcdHZhbHVlLnB1c2goIGdldFNsaWRlUGFzdENvdW50KCkgKyAxICk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ2MvdCc6XG5cdFx0XHRcdFx0dmFsdWUucHVzaCggZ2V0U2xpZGVQYXN0Q291bnQoKSArIDEsICcvJywgZ2V0VG90YWxTbGlkZXMoKSApO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdoL3YnOlxuXHRcdFx0XHRcdHZhbHVlLnB1c2goIGluZGV4aCArIDEgKTtcblx0XHRcdFx0XHRpZiggaXNWZXJ0aWNhbFNsaWRlKCkgKSB2YWx1ZS5wdXNoKCAnLycsIGluZGV4diArIDEgKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHR2YWx1ZS5wdXNoKCBpbmRleGggKyAxICk7XG5cdFx0XHRcdFx0aWYoIGlzVmVydGljYWxTbGlkZSgpICkgdmFsdWUucHVzaCggJy4nLCBpbmRleHYgKyAxICk7XG5cdFx0XHR9XG5cblx0XHRcdGRvbS5zbGlkZU51bWJlci5pbm5lckhUTUwgPSBmb3JtYXRTbGlkZU51bWJlciggdmFsdWVbMF0sIHZhbHVlWzFdLCB2YWx1ZVsyXSApO1xuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIEFwcGxpZXMgSFRNTCBmb3JtYXR0aW5nIHRvIGEgc2xpZGUgbnVtYmVyIGJlZm9yZSBpdCdzXG5cdCAqIHdyaXR0ZW4gdG8gdGhlIERPTS5cblx0ICpcblx0ICogQHBhcmFtIHtudW1iZXJ9IGEgQ3VycmVudCBzbGlkZVxuXHQgKiBAcGFyYW0ge3N0cmluZ30gZGVsaW1pdGVyIENoYXJhY3RlciB0byBzZXBhcmF0ZSBzbGlkZSBudW1iZXJzXG5cdCAqIEBwYXJhbSB7KG51bWJlcnwqKX0gYiBUb3RhbCBzbGlkZXNcblx0ICogQHJldHVybiB7c3RyaW5nfSBIVE1MIHN0cmluZyBmcmFnbWVudFxuXHQgKi9cblx0ZnVuY3Rpb24gZm9ybWF0U2xpZGVOdW1iZXIoIGEsIGRlbGltaXRlciwgYiApIHtcblxuXHRcdGlmKCB0eXBlb2YgYiA9PT0gJ251bWJlcicgJiYgIWlzTmFOKCBiICkgKSB7XG5cdFx0XHRyZXR1cm4gICc8c3BhbiBjbGFzcz1cInNsaWRlLW51bWJlci1hXCI+JysgYSArJzwvc3Bhbj4nICtcblx0XHRcdFx0XHQnPHNwYW4gY2xhc3M9XCJzbGlkZS1udW1iZXItZGVsaW1pdGVyXCI+JysgZGVsaW1pdGVyICsnPC9zcGFuPicgK1xuXHRcdFx0XHRcdCc8c3BhbiBjbGFzcz1cInNsaWRlLW51bWJlci1iXCI+JysgYiArJzwvc3Bhbj4nO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHJldHVybiAnPHNwYW4gY2xhc3M9XCJzbGlkZS1udW1iZXItYVwiPicrIGEgKyc8L3NwYW4+Jztcblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBVcGRhdGVzIHRoZSBzdGF0ZSBvZiBhbGwgY29udHJvbC9uYXZpZ2F0aW9uIGFycm93cy5cblx0ICovXG5cdGZ1bmN0aW9uIHVwZGF0ZUNvbnRyb2xzKCkge1xuXG5cdFx0dmFyIHJvdXRlcyA9IGF2YWlsYWJsZVJvdXRlcygpO1xuXHRcdHZhciBmcmFnbWVudHMgPSBhdmFpbGFibGVGcmFnbWVudHMoKTtcblxuXHRcdC8vIFJlbW92ZSB0aGUgJ2VuYWJsZWQnIGNsYXNzIGZyb20gYWxsIGRpcmVjdGlvbnNcblx0XHRkb20uY29udHJvbHNMZWZ0LmNvbmNhdCggZG9tLmNvbnRyb2xzUmlnaHQgKVxuXHRcdFx0XHRcdFx0LmNvbmNhdCggZG9tLmNvbnRyb2xzVXAgKVxuXHRcdFx0XHRcdFx0LmNvbmNhdCggZG9tLmNvbnRyb2xzRG93biApXG5cdFx0XHRcdFx0XHQuY29uY2F0KCBkb20uY29udHJvbHNQcmV2IClcblx0XHRcdFx0XHRcdC5jb25jYXQoIGRvbS5jb250cm9sc05leHQgKS5mb3JFYWNoKCBmdW5jdGlvbiggbm9kZSApIHtcblx0XHRcdG5vZGUuY2xhc3NMaXN0LnJlbW92ZSggJ2VuYWJsZWQnICk7XG5cdFx0XHRub2RlLmNsYXNzTGlzdC5yZW1vdmUoICdmcmFnbWVudGVkJyApO1xuXG5cdFx0XHQvLyBTZXQgJ2Rpc2FibGVkJyBhdHRyaWJ1dGUgb24gYWxsIGRpcmVjdGlvbnNcblx0XHRcdG5vZGUuc2V0QXR0cmlidXRlKCAnZGlzYWJsZWQnLCAnZGlzYWJsZWQnICk7XG5cdFx0fSApO1xuXG5cdFx0Ly8gQWRkIHRoZSAnZW5hYmxlZCcgY2xhc3MgdG8gdGhlIGF2YWlsYWJsZSByb3V0ZXM7IHJlbW92ZSAnZGlzYWJsZWQnIGF0dHJpYnV0ZSB0byBlbmFibGUgYnV0dG9uc1xuXHRcdGlmKCByb3V0ZXMubGVmdCApIGRvbS5jb250cm9sc0xlZnQuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkgeyBlbC5jbGFzc0xpc3QuYWRkKCAnZW5hYmxlZCcgKTsgZWwucmVtb3ZlQXR0cmlidXRlKCAnZGlzYWJsZWQnICk7IH0gKTtcblx0XHRpZiggcm91dGVzLnJpZ2h0ICkgZG9tLmNvbnRyb2xzUmlnaHQuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkgeyBlbC5jbGFzc0xpc3QuYWRkKCAnZW5hYmxlZCcgKTsgZWwucmVtb3ZlQXR0cmlidXRlKCAnZGlzYWJsZWQnICk7IH0gKTtcblx0XHRpZiggcm91dGVzLnVwICkgZG9tLmNvbnRyb2xzVXAuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkgeyBlbC5jbGFzc0xpc3QuYWRkKCAnZW5hYmxlZCcgKTsgZWwucmVtb3ZlQXR0cmlidXRlKCAnZGlzYWJsZWQnICk7IH0gKTtcblx0XHRpZiggcm91dGVzLmRvd24gKSBkb20uY29udHJvbHNEb3duLmZvckVhY2goIGZ1bmN0aW9uKCBlbCApIHsgZWwuY2xhc3NMaXN0LmFkZCggJ2VuYWJsZWQnICk7IGVsLnJlbW92ZUF0dHJpYnV0ZSggJ2Rpc2FibGVkJyApOyB9ICk7XG5cblx0XHQvLyBQcmV2L25leHQgYnV0dG9uc1xuXHRcdGlmKCByb3V0ZXMubGVmdCB8fCByb3V0ZXMudXAgKSBkb20uY29udHJvbHNQcmV2LmZvckVhY2goIGZ1bmN0aW9uKCBlbCApIHsgZWwuY2xhc3NMaXN0LmFkZCggJ2VuYWJsZWQnICk7IGVsLnJlbW92ZUF0dHJpYnV0ZSggJ2Rpc2FibGVkJyApOyB9ICk7XG5cdFx0aWYoIHJvdXRlcy5yaWdodCB8fCByb3V0ZXMuZG93biApIGRvbS5jb250cm9sc05leHQuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkgeyBlbC5jbGFzc0xpc3QuYWRkKCAnZW5hYmxlZCcgKTsgZWwucmVtb3ZlQXR0cmlidXRlKCAnZGlzYWJsZWQnICk7IH0gKTtcblxuXHRcdC8vIEhpZ2hsaWdodCBmcmFnbWVudCBkaXJlY3Rpb25zXG5cdFx0aWYoIGN1cnJlbnRTbGlkZSApIHtcblxuXHRcdFx0Ly8gQWx3YXlzIGFwcGx5IGZyYWdtZW50IGRlY29yYXRvciB0byBwcmV2L25leHQgYnV0dG9uc1xuXHRcdFx0aWYoIGZyYWdtZW50cy5wcmV2ICkgZG9tLmNvbnRyb2xzUHJldi5mb3JFYWNoKCBmdW5jdGlvbiggZWwgKSB7IGVsLmNsYXNzTGlzdC5hZGQoICdmcmFnbWVudGVkJywgJ2VuYWJsZWQnICk7IGVsLnJlbW92ZUF0dHJpYnV0ZSggJ2Rpc2FibGVkJyApOyB9ICk7XG5cdFx0XHRpZiggZnJhZ21lbnRzLm5leHQgKSBkb20uY29udHJvbHNOZXh0LmZvckVhY2goIGZ1bmN0aW9uKCBlbCApIHsgZWwuY2xhc3NMaXN0LmFkZCggJ2ZyYWdtZW50ZWQnLCAnZW5hYmxlZCcgKTsgZWwucmVtb3ZlQXR0cmlidXRlKCAnZGlzYWJsZWQnICk7IH0gKTtcblxuXHRcdFx0Ly8gQXBwbHkgZnJhZ21lbnQgZGVjb3JhdG9ycyB0byBkaXJlY3Rpb25hbCBidXR0b25zIGJhc2VkIG9uXG5cdFx0XHQvLyB3aGF0IHNsaWRlIGF4aXMgdGhleSBhcmUgaW5cblx0XHRcdGlmKCBpc1ZlcnRpY2FsU2xpZGUoIGN1cnJlbnRTbGlkZSApICkge1xuXHRcdFx0XHRpZiggZnJhZ21lbnRzLnByZXYgKSBkb20uY29udHJvbHNVcC5mb3JFYWNoKCBmdW5jdGlvbiggZWwgKSB7IGVsLmNsYXNzTGlzdC5hZGQoICdmcmFnbWVudGVkJywgJ2VuYWJsZWQnICk7IGVsLnJlbW92ZUF0dHJpYnV0ZSggJ2Rpc2FibGVkJyApOyB9ICk7XG5cdFx0XHRcdGlmKCBmcmFnbWVudHMubmV4dCApIGRvbS5jb250cm9sc0Rvd24uZm9yRWFjaCggZnVuY3Rpb24oIGVsICkgeyBlbC5jbGFzc0xpc3QuYWRkKCAnZnJhZ21lbnRlZCcsICdlbmFibGVkJyApOyBlbC5yZW1vdmVBdHRyaWJ1dGUoICdkaXNhYmxlZCcgKTsgfSApO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGlmKCBmcmFnbWVudHMucHJldiApIGRvbS5jb250cm9sc0xlZnQuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkgeyBlbC5jbGFzc0xpc3QuYWRkKCAnZnJhZ21lbnRlZCcsICdlbmFibGVkJyApOyBlbC5yZW1vdmVBdHRyaWJ1dGUoICdkaXNhYmxlZCcgKTsgfSApO1xuXHRcdFx0XHRpZiggZnJhZ21lbnRzLm5leHQgKSBkb20uY29udHJvbHNSaWdodC5mb3JFYWNoKCBmdW5jdGlvbiggZWwgKSB7IGVsLmNsYXNzTGlzdC5hZGQoICdmcmFnbWVudGVkJywgJ2VuYWJsZWQnICk7IGVsLnJlbW92ZUF0dHJpYnV0ZSggJ2Rpc2FibGVkJyApOyB9ICk7XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBVcGRhdGVzIHRoZSBiYWNrZ3JvdW5kIGVsZW1lbnRzIHRvIHJlZmxlY3QgdGhlIGN1cnJlbnRcblx0ICogc2xpZGUuXG5cdCAqXG5cdCAqIEBwYXJhbSB7Ym9vbGVhbn0gaW5jbHVkZUFsbCBJZiB0cnVlLCB0aGUgYmFja2dyb3VuZHMgb2Zcblx0ICogYWxsIHZlcnRpY2FsIHNsaWRlcyAobm90IGp1c3QgdGhlIHByZXNlbnQpIHdpbGwgYmUgdXBkYXRlZC5cblx0ICovXG5cdGZ1bmN0aW9uIHVwZGF0ZUJhY2tncm91bmQoIGluY2x1ZGVBbGwgKSB7XG5cblx0XHR2YXIgY3VycmVudEJhY2tncm91bmQgPSBudWxsO1xuXG5cdFx0Ly8gUmV2ZXJzZSBwYXN0L2Z1dHVyZSBjbGFzc2VzIHdoZW4gaW4gUlRMIG1vZGVcblx0XHR2YXIgaG9yaXpvbnRhbFBhc3QgPSBjb25maWcucnRsID8gJ2Z1dHVyZScgOiAncGFzdCcsXG5cdFx0XHRob3Jpem9udGFsRnV0dXJlID0gY29uZmlnLnJ0bCA/ICdwYXN0JyA6ICdmdXR1cmUnO1xuXG5cdFx0Ly8gVXBkYXRlIHRoZSBjbGFzc2VzIG9mIGFsbCBiYWNrZ3JvdW5kcyB0byBtYXRjaCB0aGVcblx0XHQvLyBzdGF0ZXMgb2YgdGhlaXIgc2xpZGVzIChwYXN0L3ByZXNlbnQvZnV0dXJlKVxuXHRcdHRvQXJyYXkoIGRvbS5iYWNrZ3JvdW5kLmNoaWxkTm9kZXMgKS5mb3JFYWNoKCBmdW5jdGlvbiggYmFja2dyb3VuZGgsIGggKSB7XG5cblx0XHRcdGJhY2tncm91bmRoLmNsYXNzTGlzdC5yZW1vdmUoICdwYXN0JyApO1xuXHRcdFx0YmFja2dyb3VuZGguY2xhc3NMaXN0LnJlbW92ZSggJ3ByZXNlbnQnICk7XG5cdFx0XHRiYWNrZ3JvdW5kaC5jbGFzc0xpc3QucmVtb3ZlKCAnZnV0dXJlJyApO1xuXG5cdFx0XHRpZiggaCA8IGluZGV4aCApIHtcblx0XHRcdFx0YmFja2dyb3VuZGguY2xhc3NMaXN0LmFkZCggaG9yaXpvbnRhbFBhc3QgKTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKCBoID4gaW5kZXhoICkge1xuXHRcdFx0XHRiYWNrZ3JvdW5kaC5jbGFzc0xpc3QuYWRkKCBob3Jpem9udGFsRnV0dXJlICk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0YmFja2dyb3VuZGguY2xhc3NMaXN0LmFkZCggJ3ByZXNlbnQnICk7XG5cblx0XHRcdFx0Ly8gU3RvcmUgYSByZWZlcmVuY2UgdG8gdGhlIGN1cnJlbnQgYmFja2dyb3VuZCBlbGVtZW50XG5cdFx0XHRcdGN1cnJlbnRCYWNrZ3JvdW5kID0gYmFja2dyb3VuZGg7XG5cdFx0XHR9XG5cblx0XHRcdGlmKCBpbmNsdWRlQWxsIHx8IGggPT09IGluZGV4aCApIHtcblx0XHRcdFx0dG9BcnJheSggYmFja2dyb3VuZGgucXVlcnlTZWxlY3RvckFsbCggJy5zbGlkZS1iYWNrZ3JvdW5kJyApICkuZm9yRWFjaCggZnVuY3Rpb24oIGJhY2tncm91bmR2LCB2ICkge1xuXG5cdFx0XHRcdFx0YmFja2dyb3VuZHYuY2xhc3NMaXN0LnJlbW92ZSggJ3Bhc3QnICk7XG5cdFx0XHRcdFx0YmFja2dyb3VuZHYuY2xhc3NMaXN0LnJlbW92ZSggJ3ByZXNlbnQnICk7XG5cdFx0XHRcdFx0YmFja2dyb3VuZHYuY2xhc3NMaXN0LnJlbW92ZSggJ2Z1dHVyZScgKTtcblxuXHRcdFx0XHRcdGlmKCB2IDwgaW5kZXh2ICkge1xuXHRcdFx0XHRcdFx0YmFja2dyb3VuZHYuY2xhc3NMaXN0LmFkZCggJ3Bhc3QnICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2UgaWYgKCB2ID4gaW5kZXh2ICkge1xuXHRcdFx0XHRcdFx0YmFja2dyb3VuZHYuY2xhc3NMaXN0LmFkZCggJ2Z1dHVyZScgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRiYWNrZ3JvdW5kdi5jbGFzc0xpc3QuYWRkKCAncHJlc2VudCcgKTtcblxuXHRcdFx0XHRcdFx0Ly8gT25seSBpZiB0aGlzIGlzIHRoZSBwcmVzZW50IGhvcml6b250YWwgYW5kIHZlcnRpY2FsIHNsaWRlXG5cdFx0XHRcdFx0XHRpZiggaCA9PT0gaW5kZXhoICkgY3VycmVudEJhY2tncm91bmQgPSBiYWNrZ3JvdW5kdjtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSApO1xuXHRcdFx0fVxuXG5cdFx0fSApO1xuXG5cdFx0Ly8gU3RvcCBhbnkgY3VycmVudGx5IHBsYXlpbmcgdmlkZW8gYmFja2dyb3VuZFxuXHRcdGlmKCBwcmV2aW91c0JhY2tncm91bmQgKSB7XG5cblx0XHRcdHZhciBwcmV2aW91c1ZpZGVvID0gcHJldmlvdXNCYWNrZ3JvdW5kLnF1ZXJ5U2VsZWN0b3IoICd2aWRlbycgKTtcblx0XHRcdGlmKCBwcmV2aW91c1ZpZGVvICkgcHJldmlvdXNWaWRlby5wYXVzZSgpO1xuXG5cdFx0fVxuXG5cdFx0aWYoIGN1cnJlbnRCYWNrZ3JvdW5kICkge1xuXG5cdFx0XHQvLyBTdGFydCB2aWRlbyBwbGF5YmFja1xuXHRcdFx0dmFyIGN1cnJlbnRWaWRlbyA9IGN1cnJlbnRCYWNrZ3JvdW5kLnF1ZXJ5U2VsZWN0b3IoICd2aWRlbycgKTtcblx0XHRcdGlmKCBjdXJyZW50VmlkZW8gKSB7XG5cblx0XHRcdFx0dmFyIHN0YXJ0VmlkZW8gPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjdXJyZW50VmlkZW8uY3VycmVudFRpbWUgPSAwO1xuXHRcdFx0XHRcdGN1cnJlbnRWaWRlby5wbGF5KCk7XG5cdFx0XHRcdFx0Y3VycmVudFZpZGVvLnJlbW92ZUV2ZW50TGlzdGVuZXIoICdsb2FkZWRkYXRhJywgc3RhcnRWaWRlbyApO1xuXHRcdFx0XHR9O1xuXG5cdFx0XHRcdGlmKCBjdXJyZW50VmlkZW8ucmVhZHlTdGF0ZSA+IDEgKSB7XG5cdFx0XHRcdFx0c3RhcnRWaWRlbygpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdGN1cnJlbnRWaWRlby5hZGRFdmVudExpc3RlbmVyKCAnbG9hZGVkZGF0YScsIHN0YXJ0VmlkZW8gKTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHRcdHZhciBiYWNrZ3JvdW5kSW1hZ2VVUkwgPSBjdXJyZW50QmFja2dyb3VuZC5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgfHwgJyc7XG5cblx0XHRcdC8vIFJlc3RhcnQgR0lGcyAoZG9lc24ndCB3b3JrIGluIEZpcmVmb3gpXG5cdFx0XHRpZiggL1xcLmdpZi9pLnRlc3QoIGJhY2tncm91bmRJbWFnZVVSTCApICkge1xuXHRcdFx0XHRjdXJyZW50QmFja2dyb3VuZC5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSAnJztcblx0XHRcdFx0d2luZG93LmdldENvbXB1dGVkU3R5bGUoIGN1cnJlbnRCYWNrZ3JvdW5kICkub3BhY2l0eTtcblx0XHRcdFx0Y3VycmVudEJhY2tncm91bmQuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYmFja2dyb3VuZEltYWdlVVJMO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBEb24ndCB0cmFuc2l0aW9uIGJldHdlZW4gaWRlbnRpY2FsIGJhY2tncm91bmRzLiBUaGlzXG5cdFx0XHQvLyBwcmV2ZW50cyB1bndhbnRlZCBmbGlja2VyLlxuXHRcdFx0dmFyIHByZXZpb3VzQmFja2dyb3VuZEhhc2ggPSBwcmV2aW91c0JhY2tncm91bmQgPyBwcmV2aW91c0JhY2tncm91bmQuZ2V0QXR0cmlidXRlKCAnZGF0YS1iYWNrZ3JvdW5kLWhhc2gnICkgOiBudWxsO1xuXHRcdFx0dmFyIGN1cnJlbnRCYWNrZ3JvdW5kSGFzaCA9IGN1cnJlbnRCYWNrZ3JvdW5kLmdldEF0dHJpYnV0ZSggJ2RhdGEtYmFja2dyb3VuZC1oYXNoJyApO1xuXHRcdFx0aWYoIGN1cnJlbnRCYWNrZ3JvdW5kSGFzaCAmJiBjdXJyZW50QmFja2dyb3VuZEhhc2ggPT09IHByZXZpb3VzQmFja2dyb3VuZEhhc2ggJiYgY3VycmVudEJhY2tncm91bmQgIT09IHByZXZpb3VzQmFja2dyb3VuZCApIHtcblx0XHRcdFx0ZG9tLmJhY2tncm91bmQuY2xhc3NMaXN0LmFkZCggJ25vLXRyYW5zaXRpb24nICk7XG5cdFx0XHR9XG5cblx0XHRcdHByZXZpb3VzQmFja2dyb3VuZCA9IGN1cnJlbnRCYWNrZ3JvdW5kO1xuXG5cdFx0fVxuXG5cdFx0Ly8gSWYgdGhlcmUncyBhIGJhY2tncm91bmQgYnJpZ2h0bmVzcyBmbGFnIGZvciB0aGlzIHNsaWRlLFxuXHRcdC8vIGJ1YmJsZSBpdCB0byB0aGUgLnJldmVhbCBjb250YWluZXJcblx0XHRpZiggY3VycmVudFNsaWRlICkge1xuXHRcdFx0WyAnaGFzLWxpZ2h0LWJhY2tncm91bmQnLCAnaGFzLWRhcmstYmFja2dyb3VuZCcgXS5mb3JFYWNoKCBmdW5jdGlvbiggY2xhc3NUb0J1YmJsZSApIHtcblx0XHRcdFx0aWYoIGN1cnJlbnRTbGlkZS5jbGFzc0xpc3QuY29udGFpbnMoIGNsYXNzVG9CdWJibGUgKSApIHtcblx0XHRcdFx0XHRkb20ud3JhcHBlci5jbGFzc0xpc3QuYWRkKCBjbGFzc1RvQnViYmxlICk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0ZG9tLndyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZSggY2xhc3NUb0J1YmJsZSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fVxuXG5cdFx0Ly8gQWxsb3cgdGhlIGZpcnN0IGJhY2tncm91bmQgdG8gYXBwbHkgd2l0aG91dCB0cmFuc2l0aW9uXG5cdFx0c2V0VGltZW91dCggZnVuY3Rpb24oKSB7XG5cdFx0XHRkb20uYmFja2dyb3VuZC5jbGFzc0xpc3QucmVtb3ZlKCAnbm8tdHJhbnNpdGlvbicgKTtcblx0XHR9LCAxICk7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBVcGRhdGVzIHRoZSBwb3NpdGlvbiBvZiB0aGUgcGFyYWxsYXggYmFja2dyb3VuZCBiYXNlZFxuXHQgKiBvbiB0aGUgY3VycmVudCBzbGlkZSBpbmRleC5cblx0ICovXG5cdGZ1bmN0aW9uIHVwZGF0ZVBhcmFsbGF4KCkge1xuXG5cdFx0aWYoIGNvbmZpZy5wYXJhbGxheEJhY2tncm91bmRJbWFnZSApIHtcblxuXHRcdFx0dmFyIGhvcml6b250YWxTbGlkZXMgPSBkb20ud3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKCBIT1JJWk9OVEFMX1NMSURFU19TRUxFQ1RPUiApLFxuXHRcdFx0XHR2ZXJ0aWNhbFNsaWRlcyA9IGRvbS53cmFwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoIFZFUlRJQ0FMX1NMSURFU19TRUxFQ1RPUiApO1xuXG5cdFx0XHR2YXIgYmFja2dyb3VuZFNpemUgPSBkb20uYmFja2dyb3VuZC5zdHlsZS5iYWNrZ3JvdW5kU2l6ZS5zcGxpdCggJyAnICksXG5cdFx0XHRcdGJhY2tncm91bmRXaWR0aCwgYmFja2dyb3VuZEhlaWdodDtcblxuXHRcdFx0aWYoIGJhY2tncm91bmRTaXplLmxlbmd0aCA9PT0gMSApIHtcblx0XHRcdFx0YmFja2dyb3VuZFdpZHRoID0gYmFja2dyb3VuZEhlaWdodCA9IHBhcnNlSW50KCBiYWNrZ3JvdW5kU2l6ZVswXSwgMTAgKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRiYWNrZ3JvdW5kV2lkdGggPSBwYXJzZUludCggYmFja2dyb3VuZFNpemVbMF0sIDEwICk7XG5cdFx0XHRcdGJhY2tncm91bmRIZWlnaHQgPSBwYXJzZUludCggYmFja2dyb3VuZFNpemVbMV0sIDEwICk7XG5cdFx0XHR9XG5cblx0XHRcdHZhciBzbGlkZVdpZHRoID0gZG9tLmJhY2tncm91bmQub2Zmc2V0V2lkdGgsXG5cdFx0XHRcdGhvcml6b250YWxTbGlkZUNvdW50ID0gaG9yaXpvbnRhbFNsaWRlcy5sZW5ndGgsXG5cdFx0XHRcdGhvcml6b250YWxPZmZzZXRNdWx0aXBsaWVyLFxuXHRcdFx0XHRob3Jpem9udGFsT2Zmc2V0O1xuXG5cdFx0XHRpZiggdHlwZW9mIGNvbmZpZy5wYXJhbGxheEJhY2tncm91bmRIb3Jpem9udGFsID09PSAnbnVtYmVyJyApIHtcblx0XHRcdFx0aG9yaXpvbnRhbE9mZnNldE11bHRpcGxpZXIgPSBjb25maWcucGFyYWxsYXhCYWNrZ3JvdW5kSG9yaXpvbnRhbDtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRob3Jpem9udGFsT2Zmc2V0TXVsdGlwbGllciA9IGhvcml6b250YWxTbGlkZUNvdW50ID4gMSA/ICggYmFja2dyb3VuZFdpZHRoIC0gc2xpZGVXaWR0aCApIC8gKCBob3Jpem9udGFsU2xpZGVDb3VudC0xICkgOiAwO1xuXHRcdFx0fVxuXG5cdFx0XHRob3Jpem9udGFsT2Zmc2V0ID0gaG9yaXpvbnRhbE9mZnNldE11bHRpcGxpZXIgKiBpbmRleGggKiAtMTtcblxuXHRcdFx0dmFyIHNsaWRlSGVpZ2h0ID0gZG9tLmJhY2tncm91bmQub2Zmc2V0SGVpZ2h0LFxuXHRcdFx0XHR2ZXJ0aWNhbFNsaWRlQ291bnQgPSB2ZXJ0aWNhbFNsaWRlcy5sZW5ndGgsXG5cdFx0XHRcdHZlcnRpY2FsT2Zmc2V0TXVsdGlwbGllcixcblx0XHRcdFx0dmVydGljYWxPZmZzZXQ7XG5cblx0XHRcdGlmKCB0eXBlb2YgY29uZmlnLnBhcmFsbGF4QmFja2dyb3VuZFZlcnRpY2FsID09PSAnbnVtYmVyJyApIHtcblx0XHRcdFx0dmVydGljYWxPZmZzZXRNdWx0aXBsaWVyID0gY29uZmlnLnBhcmFsbGF4QmFja2dyb3VuZFZlcnRpY2FsO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHZlcnRpY2FsT2Zmc2V0TXVsdGlwbGllciA9ICggYmFja2dyb3VuZEhlaWdodCAtIHNsaWRlSGVpZ2h0ICkgLyAoIHZlcnRpY2FsU2xpZGVDb3VudC0xICk7XG5cdFx0XHR9XG5cblx0XHRcdHZlcnRpY2FsT2Zmc2V0ID0gdmVydGljYWxTbGlkZUNvdW50ID4gMCA/ICB2ZXJ0aWNhbE9mZnNldE11bHRpcGxpZXIgKiBpbmRleHYgOiAwO1xuXG5cdFx0XHRkb20uYmFja2dyb3VuZC5zdHlsZS5iYWNrZ3JvdW5kUG9zaXRpb24gPSBob3Jpem9udGFsT2Zmc2V0ICsgJ3B4ICcgKyAtdmVydGljYWxPZmZzZXQgKyAncHgnO1xuXG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogQ2FsbGVkIHdoZW4gdGhlIGdpdmVuIHNsaWRlIGlzIHdpdGhpbiB0aGUgY29uZmlndXJlZCB2aWV3XG5cdCAqIGRpc3RhbmNlLiBTaG93cyB0aGUgc2xpZGUgZWxlbWVudCBhbmQgbG9hZHMgYW55IGNvbnRlbnRcblx0ICogdGhhdCBpcyBzZXQgdG8gbG9hZCBsYXppbHkgKGRhdGEtc3JjKS5cblx0ICpcblx0ICogQHBhcmFtIHtIVE1MRWxlbWVudH0gc2xpZGUgU2xpZGUgdG8gc2hvd1xuXHQgKi9cblx0ZnVuY3Rpb24gc2hvd1NsaWRlKCBzbGlkZSApIHtcblxuXHRcdC8vIFNob3cgdGhlIHNsaWRlIGVsZW1lbnRcblx0XHRzbGlkZS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcblxuXHRcdC8vIE1lZGlhIGVsZW1lbnRzIHdpdGggZGF0YS1zcmMgYXR0cmlidXRlc1xuXHRcdHRvQXJyYXkoIHNsaWRlLnF1ZXJ5U2VsZWN0b3JBbGwoICdpbWdbZGF0YS1zcmNdLCB2aWRlb1tkYXRhLXNyY10sIGF1ZGlvW2RhdGEtc3JjXScgKSApLmZvckVhY2goIGZ1bmN0aW9uKCBlbGVtZW50ICkge1xuXHRcdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGUoICdzcmMnLCBlbGVtZW50LmdldEF0dHJpYnV0ZSggJ2RhdGEtc3JjJyApICk7XG5cdFx0XHRlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSggJ2RhdGEtc3JjJyApO1xuXHRcdH0gKTtcblxuXHRcdC8vIE1lZGlhIGVsZW1lbnRzIHdpdGggPHNvdXJjZT4gY2hpbGRyZW5cblx0XHR0b0FycmF5KCBzbGlkZS5xdWVyeVNlbGVjdG9yQWxsKCAndmlkZW8sIGF1ZGlvJyApICkuZm9yRWFjaCggZnVuY3Rpb24oIG1lZGlhICkge1xuXHRcdFx0dmFyIHNvdXJjZXMgPSAwO1xuXG5cdFx0XHR0b0FycmF5KCBtZWRpYS5xdWVyeVNlbGVjdG9yQWxsKCAnc291cmNlW2RhdGEtc3JjXScgKSApLmZvckVhY2goIGZ1bmN0aW9uKCBzb3VyY2UgKSB7XG5cdFx0XHRcdHNvdXJjZS5zZXRBdHRyaWJ1dGUoICdzcmMnLCBzb3VyY2UuZ2V0QXR0cmlidXRlKCAnZGF0YS1zcmMnICkgKTtcblx0XHRcdFx0c291cmNlLnJlbW92ZUF0dHJpYnV0ZSggJ2RhdGEtc3JjJyApO1xuXHRcdFx0XHRzb3VyY2VzICs9IDE7XG5cdFx0XHR9ICk7XG5cblx0XHRcdC8vIElmIHdlIHJld3JvdGUgc291cmNlcyBmb3IgdGhpcyB2aWRlby9hdWRpbyBlbGVtZW50LCB3ZSBuZWVkXG5cdFx0XHQvLyB0byBtYW51YWxseSB0ZWxsIGl0IHRvIGxvYWQgZnJvbSBpdHMgbmV3IG9yaWdpblxuXHRcdFx0aWYoIHNvdXJjZXMgPiAwICkge1xuXHRcdFx0XHRtZWRpYS5sb2FkKCk7XG5cdFx0XHR9XG5cdFx0fSApO1xuXG5cblx0XHQvLyBTaG93IHRoZSBjb3JyZXNwb25kaW5nIGJhY2tncm91bmQgZWxlbWVudFxuXHRcdHZhciBpbmRpY2VzID0gZ2V0SW5kaWNlcyggc2xpZGUgKTtcblx0XHR2YXIgYmFja2dyb3VuZCA9IGdldFNsaWRlQmFja2dyb3VuZCggaW5kaWNlcy5oLCBpbmRpY2VzLnYgKTtcblx0XHRpZiggYmFja2dyb3VuZCApIHtcblx0XHRcdGJhY2tncm91bmQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG5cblx0XHRcdC8vIElmIHRoZSBiYWNrZ3JvdW5kIGNvbnRhaW5zIG1lZGlhLCBsb2FkIGl0XG5cdFx0XHRpZiggYmFja2dyb3VuZC5oYXNBdHRyaWJ1dGUoICdkYXRhLWxvYWRlZCcgKSA9PT0gZmFsc2UgKSB7XG5cdFx0XHRcdGJhY2tncm91bmQuc2V0QXR0cmlidXRlKCAnZGF0YS1sb2FkZWQnLCAndHJ1ZScgKTtcblxuXHRcdFx0XHR2YXIgYmFja2dyb3VuZEltYWdlID0gc2xpZGUuZ2V0QXR0cmlidXRlKCAnZGF0YS1iYWNrZ3JvdW5kLWltYWdlJyApLFxuXHRcdFx0XHRcdGJhY2tncm91bmRWaWRlbyA9IHNsaWRlLmdldEF0dHJpYnV0ZSggJ2RhdGEtYmFja2dyb3VuZC12aWRlbycgKSxcblx0XHRcdFx0XHRiYWNrZ3JvdW5kVmlkZW9Mb29wID0gc2xpZGUuaGFzQXR0cmlidXRlKCAnZGF0YS1iYWNrZ3JvdW5kLXZpZGVvLWxvb3AnICksXG5cdFx0XHRcdFx0YmFja2dyb3VuZFZpZGVvTXV0ZWQgPSBzbGlkZS5oYXNBdHRyaWJ1dGUoICdkYXRhLWJhY2tncm91bmQtdmlkZW8tbXV0ZWQnICksXG5cdFx0XHRcdFx0YmFja2dyb3VuZElmcmFtZSA9IHNsaWRlLmdldEF0dHJpYnV0ZSggJ2RhdGEtYmFja2dyb3VuZC1pZnJhbWUnICk7XG5cblx0XHRcdFx0Ly8gSW1hZ2VzXG5cdFx0XHRcdGlmKCBiYWNrZ3JvdW5kSW1hZ2UgKSB7XG5cdFx0XHRcdFx0YmFja2dyb3VuZC5zdHlsZS5iYWNrZ3JvdW5kSW1hZ2UgPSAndXJsKCcrIGJhY2tncm91bmRJbWFnZSArJyknO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIFZpZGVvc1xuXHRcdFx0XHRlbHNlIGlmICggYmFja2dyb3VuZFZpZGVvICYmICFpc1NwZWFrZXJOb3RlcygpICkge1xuXHRcdFx0XHRcdHZhciB2aWRlbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICd2aWRlbycgKTtcblxuXHRcdFx0XHRcdGlmKCBiYWNrZ3JvdW5kVmlkZW9Mb29wICkge1xuXHRcdFx0XHRcdFx0dmlkZW8uc2V0QXR0cmlidXRlKCAnbG9vcCcsICcnICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0aWYoIGJhY2tncm91bmRWaWRlb011dGVkICkge1xuXHRcdFx0XHRcdFx0dmlkZW8ubXV0ZWQgPSB0cnVlO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIFN1cHBvcnQgY29tbWEgc2VwYXJhdGVkIGxpc3RzIG9mIHZpZGVvIHNvdXJjZXNcblx0XHRcdFx0XHRiYWNrZ3JvdW5kVmlkZW8uc3BsaXQoICcsJyApLmZvckVhY2goIGZ1bmN0aW9uKCBzb3VyY2UgKSB7XG5cdFx0XHRcdFx0XHR2aWRlby5pbm5lckhUTUwgKz0gJzxzb3VyY2Ugc3JjPVwiJysgc291cmNlICsnXCI+Jztcblx0XHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0XHRiYWNrZ3JvdW5kLmFwcGVuZENoaWxkKCB2aWRlbyApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIElmcmFtZXNcblx0XHRcdFx0ZWxzZSBpZiggYmFja2dyb3VuZElmcmFtZSApIHtcblx0XHRcdFx0XHR2YXIgaWZyYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2lmcmFtZScgKTtcblx0XHRcdFx0XHRcdGlmcmFtZS5zZXRBdHRyaWJ1dGUoICdzcmMnLCBiYWNrZ3JvdW5kSWZyYW1lICk7XG5cdFx0XHRcdFx0XHRpZnJhbWUuc3R5bGUud2lkdGggID0gJzEwMCUnO1xuXHRcdFx0XHRcdFx0aWZyYW1lLnN0eWxlLmhlaWdodCA9ICcxMDAlJztcblx0XHRcdFx0XHRcdGlmcmFtZS5zdHlsZS5tYXhIZWlnaHQgPSAnMTAwJSc7XG5cdFx0XHRcdFx0XHRpZnJhbWUuc3R5bGUubWF4V2lkdGggPSAnMTAwJSc7XG5cblx0XHRcdFx0XHRiYWNrZ3JvdW5kLmFwcGVuZENoaWxkKCBpZnJhbWUgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIENhbGxlZCB3aGVuIHRoZSBnaXZlbiBzbGlkZSBpcyBtb3ZlZCBvdXRzaWRlIG9mIHRoZVxuXHQgKiBjb25maWd1cmVkIHZpZXcgZGlzdGFuY2UuXG5cdCAqXG5cdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHNsaWRlXG5cdCAqL1xuXHRmdW5jdGlvbiBoaWRlU2xpZGUoIHNsaWRlICkge1xuXG5cdFx0Ly8gSGlkZSB0aGUgc2xpZGUgZWxlbWVudFxuXHRcdHNsaWRlLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cblx0XHQvLyBIaWRlIHRoZSBjb3JyZXNwb25kaW5nIGJhY2tncm91bmQgZWxlbWVudFxuXHRcdHZhciBpbmRpY2VzID0gZ2V0SW5kaWNlcyggc2xpZGUgKTtcblx0XHR2YXIgYmFja2dyb3VuZCA9IGdldFNsaWRlQmFja2dyb3VuZCggaW5kaWNlcy5oLCBpbmRpY2VzLnYgKTtcblx0XHRpZiggYmFja2dyb3VuZCApIHtcblx0XHRcdGJhY2tncm91bmQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBEZXRlcm1pbmUgd2hhdCBhdmFpbGFibGUgcm91dGVzIHRoZXJlIGFyZSBmb3IgbmF2aWdhdGlvbi5cblx0ICpcblx0ICogQHJldHVybiB7e2xlZnQ6IGJvb2xlYW4sIHJpZ2h0OiBib29sZWFuLCB1cDogYm9vbGVhbiwgZG93bjogYm9vbGVhbn19XG5cdCAqL1xuXHRmdW5jdGlvbiBhdmFpbGFibGVSb3V0ZXMoKSB7XG5cblx0XHR2YXIgaG9yaXpvbnRhbFNsaWRlcyA9IGRvbS53cmFwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoIEhPUklaT05UQUxfU0xJREVTX1NFTEVDVE9SICksXG5cdFx0XHR2ZXJ0aWNhbFNsaWRlcyA9IGRvbS53cmFwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoIFZFUlRJQ0FMX1NMSURFU19TRUxFQ1RPUiApO1xuXG5cdFx0dmFyIHJvdXRlcyA9IHtcblx0XHRcdGxlZnQ6IGluZGV4aCA+IDAgfHwgY29uZmlnLmxvb3AsXG5cdFx0XHRyaWdodDogaW5kZXhoIDwgaG9yaXpvbnRhbFNsaWRlcy5sZW5ndGggLSAxIHx8IGNvbmZpZy5sb29wLFxuXHRcdFx0dXA6IGluZGV4diA+IDAsXG5cdFx0XHRkb3duOiBpbmRleHYgPCB2ZXJ0aWNhbFNsaWRlcy5sZW5ndGggLSAxXG5cdFx0fTtcblxuXHRcdC8vIHJldmVyc2UgaG9yaXpvbnRhbCBjb250cm9scyBmb3IgcnRsXG5cdFx0aWYoIGNvbmZpZy5ydGwgKSB7XG5cdFx0XHR2YXIgbGVmdCA9IHJvdXRlcy5sZWZ0O1xuXHRcdFx0cm91dGVzLmxlZnQgPSByb3V0ZXMucmlnaHQ7XG5cdFx0XHRyb3V0ZXMucmlnaHQgPSBsZWZ0O1xuXHRcdH1cblxuXHRcdHJldHVybiByb3V0ZXM7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIGFuIG9iamVjdCBkZXNjcmliaW5nIHRoZSBhdmFpbGFibGUgZnJhZ21lbnRcblx0ICogZGlyZWN0aW9ucy5cblx0ICpcblx0ICogQHJldHVybiB7e3ByZXY6IGJvb2xlYW4sIG5leHQ6IGJvb2xlYW59fVxuXHQgKi9cblx0ZnVuY3Rpb24gYXZhaWxhYmxlRnJhZ21lbnRzKCkge1xuXG5cdFx0aWYoIGN1cnJlbnRTbGlkZSAmJiBjb25maWcuZnJhZ21lbnRzICkge1xuXHRcdFx0dmFyIGZyYWdtZW50cyA9IGN1cnJlbnRTbGlkZS5xdWVyeVNlbGVjdG9yQWxsKCAnLmZyYWdtZW50JyApO1xuXHRcdFx0dmFyIGhpZGRlbkZyYWdtZW50cyA9IGN1cnJlbnRTbGlkZS5xdWVyeVNlbGVjdG9yQWxsKCAnLmZyYWdtZW50Om5vdCgudmlzaWJsZSknICk7XG5cblx0XHRcdHJldHVybiB7XG5cdFx0XHRcdHByZXY6IGZyYWdtZW50cy5sZW5ndGggLSBoaWRkZW5GcmFnbWVudHMubGVuZ3RoID4gMCxcblx0XHRcdFx0bmV4dDogISFoaWRkZW5GcmFnbWVudHMubGVuZ3RoXG5cdFx0XHR9O1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHJldHVybiB7IHByZXY6IGZhbHNlLCBuZXh0OiBmYWxzZSB9O1xuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIEVuZm9yY2VzIG9yaWdpbi1zcGVjaWZpYyBmb3JtYXQgcnVsZXMgZm9yIGVtYmVkZGVkIG1lZGlhLlxuXHQgKi9cblx0ZnVuY3Rpb24gZm9ybWF0RW1iZWRkZWRDb250ZW50KCkge1xuXG5cdFx0dmFyIF9hcHBlbmRQYXJhbVRvSWZyYW1lU291cmNlID0gZnVuY3Rpb24oIHNvdXJjZUF0dHJpYnV0ZSwgc291cmNlVVJMLCBwYXJhbSApIHtcblx0XHRcdHRvQXJyYXkoIGRvbS5zbGlkZXMucXVlcnlTZWxlY3RvckFsbCggJ2lmcmFtZVsnKyBzb3VyY2VBdHRyaWJ1dGUgKycqPVwiJysgc291cmNlVVJMICsnXCJdJyApICkuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkge1xuXHRcdFx0XHR2YXIgc3JjID0gZWwuZ2V0QXR0cmlidXRlKCBzb3VyY2VBdHRyaWJ1dGUgKTtcblx0XHRcdFx0aWYoIHNyYyAmJiBzcmMuaW5kZXhPZiggcGFyYW0gKSA9PT0gLTEgKSB7XG5cdFx0XHRcdFx0ZWwuc2V0QXR0cmlidXRlKCBzb3VyY2VBdHRyaWJ1dGUsIHNyYyArICggIS9cXD8vLnRlc3QoIHNyYyApID8gJz8nIDogJyYnICkgKyBwYXJhbSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHR9O1xuXG5cdFx0Ly8gWW91VHViZSBmcmFtZXMgbXVzdCBpbmNsdWRlIFwiP2VuYWJsZWpzYXBpPTFcIlxuXHRcdF9hcHBlbmRQYXJhbVRvSWZyYW1lU291cmNlKCAnc3JjJywgJ3lvdXR1YmUuY29tL2VtYmVkLycsICdlbmFibGVqc2FwaT0xJyApO1xuXHRcdF9hcHBlbmRQYXJhbVRvSWZyYW1lU291cmNlKCAnZGF0YS1zcmMnLCAneW91dHViZS5jb20vZW1iZWQvJywgJ2VuYWJsZWpzYXBpPTEnICk7XG5cblx0XHQvLyBWaW1lbyBmcmFtZXMgbXVzdCBpbmNsdWRlIFwiP2FwaT0xXCJcblx0XHRfYXBwZW5kUGFyYW1Ub0lmcmFtZVNvdXJjZSggJ3NyYycsICdwbGF5ZXIudmltZW8uY29tLycsICdhcGk9MScgKTtcblx0XHRfYXBwZW5kUGFyYW1Ub0lmcmFtZVNvdXJjZSggJ2RhdGEtc3JjJywgJ3BsYXllci52aW1lby5jb20vJywgJ2FwaT0xJyApO1xuXG5cdH1cblxuXHQvKipcblx0ICogU3RhcnQgcGxheWJhY2sgb2YgYW55IGVtYmVkZGVkIGNvbnRlbnQgaW5zaWRlIG9mXG5cdCAqIHRoZSBnaXZlbiBlbGVtZW50LlxuXHQgKlxuXHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBzbGlkZVxuXHQgKi9cblx0ZnVuY3Rpb24gc3RhcnRFbWJlZGRlZENvbnRlbnQoIGVsZW1lbnQgKSB7XG5cblx0XHRpZiggZWxlbWVudCAmJiAhaXNTcGVha2VyTm90ZXMoKSApIHtcblx0XHRcdC8vIFJlc3RhcnQgR0lGc1xuXHRcdFx0dG9BcnJheSggZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCAnaW1nW3NyYyQ9XCIuZ2lmXCJdJyApICkuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkge1xuXHRcdFx0XHQvLyBTZXR0aW5nIHRoZSBzYW1lIHVuY2hhbmdlZCBzb3VyY2UgbGlrZSB0aGlzIHdhcyBjb25maXJtZWRcblx0XHRcdFx0Ly8gdG8gd29yayBpbiBDaHJvbWUsIEZGICYgU2FmYXJpXG5cdFx0XHRcdGVsLnNldEF0dHJpYnV0ZSggJ3NyYycsIGVsLmdldEF0dHJpYnV0ZSggJ3NyYycgKSApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHQvLyBIVE1MNSBtZWRpYSBlbGVtZW50c1xuXHRcdFx0dG9BcnJheSggZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCAndmlkZW8sIGF1ZGlvJyApICkuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkge1xuXHRcdFx0XHRpZiggY2xvc2VzdFBhcmVudCggZWwsICcuZnJhZ21lbnQnICkgJiYgIWNsb3Nlc3RQYXJlbnQoIGVsLCAnLmZyYWdtZW50LnZpc2libGUnICkgKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYoIGVsLmhhc0F0dHJpYnV0ZSggJ2RhdGEtYXV0b3BsYXknICkgJiYgdHlwZW9mIGVsLnBsYXkgPT09ICdmdW5jdGlvbicgKSB7XG5cdFx0XHRcdFx0ZWwucGxheSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cblx0XHRcdC8vIE5vcm1hbCBpZnJhbWVzXG5cdFx0XHR0b0FycmF5KCBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICdpZnJhbWVbc3JjXScgKSApLmZvckVhY2goIGZ1bmN0aW9uKCBlbCApIHtcblx0XHRcdFx0aWYoIGNsb3Nlc3RQYXJlbnQoIGVsLCAnLmZyYWdtZW50JyApICYmICFjbG9zZXN0UGFyZW50KCBlbCwgJy5mcmFnbWVudC52aXNpYmxlJyApICkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHN0YXJ0RW1iZWRkZWRJZnJhbWUoIHsgdGFyZ2V0OiBlbCB9ICk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdC8vIExhenkgbG9hZGluZyBpZnJhbWVzXG5cdFx0XHR0b0FycmF5KCBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoICdpZnJhbWVbZGF0YS1zcmNdJyApICkuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkge1xuXHRcdFx0XHRpZiggY2xvc2VzdFBhcmVudCggZWwsICcuZnJhZ21lbnQnICkgJiYgIWNsb3Nlc3RQYXJlbnQoIGVsLCAnLmZyYWdtZW50LnZpc2libGUnICkgKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYoIGVsLmdldEF0dHJpYnV0ZSggJ3NyYycgKSAhPT0gZWwuZ2V0QXR0cmlidXRlKCAnZGF0YS1zcmMnICkgKSB7XG5cdFx0XHRcdFx0ZWwucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ2xvYWQnLCBzdGFydEVtYmVkZGVkSWZyYW1lICk7IC8vIHJlbW92ZSBmaXJzdCB0byBhdm9pZCBkdXBlc1xuXHRcdFx0XHRcdGVsLmFkZEV2ZW50TGlzdGVuZXIoICdsb2FkJywgc3RhcnRFbWJlZGRlZElmcmFtZSApO1xuXHRcdFx0XHRcdGVsLnNldEF0dHJpYnV0ZSggJ3NyYycsIGVsLmdldEF0dHJpYnV0ZSggJ2RhdGEtc3JjJyApICk7XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBcIlN0YXJ0c1wiIHRoZSBjb250ZW50IG9mIGFuIGVtYmVkZGVkIGlmcmFtZSB1c2luZyB0aGVcblx0ICogcG9zdE1lc3NhZ2UgQVBJLlxuXHQgKlxuXHQgKiBAcGFyYW0ge29iamVjdH0gZXZlbnQgLSBwb3N0TWVzc2FnZSBBUEkgZXZlbnRcblx0ICovXG5cdGZ1bmN0aW9uIHN0YXJ0RW1iZWRkZWRJZnJhbWUoIGV2ZW50ICkge1xuXG5cdFx0dmFyIGlmcmFtZSA9IGV2ZW50LnRhcmdldDtcblxuXHRcdGlmKCBpZnJhbWUgJiYgaWZyYW1lLmNvbnRlbnRXaW5kb3cgKSB7XG5cblx0XHRcdC8vIFlvdVR1YmUgcG9zdE1lc3NhZ2UgQVBJXG5cdFx0XHRpZiggL3lvdXR1YmVcXC5jb21cXC9lbWJlZFxcLy8udGVzdCggaWZyYW1lLmdldEF0dHJpYnV0ZSggJ3NyYycgKSApICYmIGlmcmFtZS5oYXNBdHRyaWJ1dGUoICdkYXRhLWF1dG9wbGF5JyApICkge1xuXHRcdFx0XHRpZnJhbWUuY29udGVudFdpbmRvdy5wb3N0TWVzc2FnZSggJ3tcImV2ZW50XCI6XCJjb21tYW5kXCIsXCJmdW5jXCI6XCJwbGF5VmlkZW9cIixcImFyZ3NcIjpcIlwifScsICcqJyApO1xuXHRcdFx0fVxuXHRcdFx0Ly8gVmltZW8gcG9zdE1lc3NhZ2UgQVBJXG5cdFx0XHRlbHNlIGlmKCAvcGxheWVyXFwudmltZW9cXC5jb21cXC8vLnRlc3QoIGlmcmFtZS5nZXRBdHRyaWJ1dGUoICdzcmMnICkgKSAmJiBpZnJhbWUuaGFzQXR0cmlidXRlKCAnZGF0YS1hdXRvcGxheScgKSApIHtcblx0XHRcdFx0aWZyYW1lLmNvbnRlbnRXaW5kb3cucG9zdE1lc3NhZ2UoICd7XCJtZXRob2RcIjpcInBsYXlcIn0nLCAnKicgKTtcblx0XHRcdH1cblx0XHRcdC8vIEdlbmVyaWMgcG9zdE1lc3NhZ2UgQVBJXG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0aWZyYW1lLmNvbnRlbnRXaW5kb3cucG9zdE1lc3NhZ2UoICdzbGlkZTpzdGFydCcsICcqJyApO1xuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogU3RvcCBwbGF5YmFjayBvZiBhbnkgZW1iZWRkZWQgY29udGVudCBpbnNpZGUgb2Zcblx0ICogdGhlIHRhcmdldGVkIHNsaWRlLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBzbGlkZVxuXHQgKi9cblx0ZnVuY3Rpb24gc3RvcEVtYmVkZGVkQ29udGVudCggc2xpZGUgKSB7XG5cblx0XHRpZiggc2xpZGUgJiYgc2xpZGUucGFyZW50Tm9kZSApIHtcblx0XHRcdC8vIEhUTUw1IG1lZGlhIGVsZW1lbnRzXG5cdFx0XHR0b0FycmF5KCBzbGlkZS5xdWVyeVNlbGVjdG9yQWxsKCAndmlkZW8sIGF1ZGlvJyApICkuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkge1xuXHRcdFx0XHRpZiggIWVsLmhhc0F0dHJpYnV0ZSggJ2RhdGEtaWdub3JlJyApICYmIHR5cGVvZiBlbC5wYXVzZSA9PT0gJ2Z1bmN0aW9uJyApIHtcblx0XHRcdFx0XHRlbC5wYXVzZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cblx0XHRcdC8vIEdlbmVyaWMgcG9zdE1lc3NhZ2UgQVBJIGZvciBub24tbGF6eSBsb2FkZWQgaWZyYW1lc1xuXHRcdFx0dG9BcnJheSggc2xpZGUucXVlcnlTZWxlY3RvckFsbCggJ2lmcmFtZScgKSApLmZvckVhY2goIGZ1bmN0aW9uKCBlbCApIHtcblx0XHRcdFx0ZWwuY29udGVudFdpbmRvdy5wb3N0TWVzc2FnZSggJ3NsaWRlOnN0b3AnLCAnKicgKTtcblx0XHRcdFx0ZWwucmVtb3ZlRXZlbnRMaXN0ZW5lciggJ2xvYWQnLCBzdGFydEVtYmVkZGVkSWZyYW1lICk7XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gWW91VHViZSBwb3N0TWVzc2FnZSBBUElcblx0XHRcdHRvQXJyYXkoIHNsaWRlLnF1ZXJ5U2VsZWN0b3JBbGwoICdpZnJhbWVbc3JjKj1cInlvdXR1YmUuY29tL2VtYmVkL1wiXScgKSApLmZvckVhY2goIGZ1bmN0aW9uKCBlbCApIHtcblx0XHRcdFx0aWYoICFlbC5oYXNBdHRyaWJ1dGUoICdkYXRhLWlnbm9yZScgKSAmJiB0eXBlb2YgZWwuY29udGVudFdpbmRvdy5wb3N0TWVzc2FnZSA9PT0gJ2Z1bmN0aW9uJyApIHtcblx0XHRcdFx0XHRlbC5jb250ZW50V2luZG93LnBvc3RNZXNzYWdlKCAne1wiZXZlbnRcIjpcImNvbW1hbmRcIixcImZ1bmNcIjpcInBhdXNlVmlkZW9cIixcImFyZ3NcIjpcIlwifScsICcqJyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gVmltZW8gcG9zdE1lc3NhZ2UgQVBJXG5cdFx0XHR0b0FycmF5KCBzbGlkZS5xdWVyeVNlbGVjdG9yQWxsKCAnaWZyYW1lW3NyYyo9XCJwbGF5ZXIudmltZW8uY29tL1wiXScgKSApLmZvckVhY2goIGZ1bmN0aW9uKCBlbCApIHtcblx0XHRcdFx0aWYoICFlbC5oYXNBdHRyaWJ1dGUoICdkYXRhLWlnbm9yZScgKSAmJiB0eXBlb2YgZWwuY29udGVudFdpbmRvdy5wb3N0TWVzc2FnZSA9PT0gJ2Z1bmN0aW9uJyApIHtcblx0XHRcdFx0XHRlbC5jb250ZW50V2luZG93LnBvc3RNZXNzYWdlKCAne1wibWV0aG9kXCI6XCJwYXVzZVwifScsICcqJyApO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gTGF6eSBsb2FkaW5nIGlmcmFtZXNcblx0XHRcdHRvQXJyYXkoIHNsaWRlLnF1ZXJ5U2VsZWN0b3JBbGwoICdpZnJhbWVbZGF0YS1zcmNdJyApICkuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkge1xuXHRcdFx0XHQvLyBPbmx5IHJlbW92aW5nIHRoZSBzcmMgZG9lc24ndCBhY3R1YWxseSB1bmxvYWQgdGhlIGZyYW1lXG5cdFx0XHRcdC8vIGluIGFsbCBicm93c2VycyAoRmlyZWZveCkgc28gd2Ugc2V0IGl0IHRvIGJsYW5rIGZpcnN0XG5cdFx0XHRcdGVsLnNldEF0dHJpYnV0ZSggJ3NyYycsICdhYm91dDpibGFuaycgKTtcblx0XHRcdFx0ZWwucmVtb3ZlQXR0cmlidXRlKCAnc3JjJyApO1xuXHRcdFx0fSApO1xuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIG51bWJlciBvZiBwYXN0IHNsaWRlcy4gVGhpcyBjYW4gYmUgdXNlZCBhcyBhIGdsb2JhbFxuXHQgKiBmbGF0dGVuZWQgaW5kZXggZm9yIHNsaWRlcy5cblx0ICpcblx0ICogQHJldHVybiB7bnVtYmVyfSBQYXN0IHNsaWRlIGNvdW50XG5cdCAqL1xuXHRmdW5jdGlvbiBnZXRTbGlkZVBhc3RDb3VudCgpIHtcblxuXHRcdHZhciBob3Jpem9udGFsU2xpZGVzID0gdG9BcnJheSggZG9tLndyYXBwZXIucXVlcnlTZWxlY3RvckFsbCggSE9SSVpPTlRBTF9TTElERVNfU0VMRUNUT1IgKSApO1xuXG5cdFx0Ly8gVGhlIG51bWJlciBvZiBwYXN0IHNsaWRlc1xuXHRcdHZhciBwYXN0Q291bnQgPSAwO1xuXG5cdFx0Ly8gU3RlcCB0aHJvdWdoIGFsbCBzbGlkZXMgYW5kIGNvdW50IHRoZSBwYXN0IG9uZXNcblx0XHRtYWluTG9vcDogZm9yKCB2YXIgaSA9IDA7IGkgPCBob3Jpem9udGFsU2xpZGVzLmxlbmd0aDsgaSsrICkge1xuXG5cdFx0XHR2YXIgaG9yaXpvbnRhbFNsaWRlID0gaG9yaXpvbnRhbFNsaWRlc1tpXTtcblx0XHRcdHZhciB2ZXJ0aWNhbFNsaWRlcyA9IHRvQXJyYXkoIGhvcml6b250YWxTbGlkZS5xdWVyeVNlbGVjdG9yQWxsKCAnc2VjdGlvbicgKSApO1xuXG5cdFx0XHRmb3IoIHZhciBqID0gMDsgaiA8IHZlcnRpY2FsU2xpZGVzLmxlbmd0aDsgaisrICkge1xuXG5cdFx0XHRcdC8vIFN0b3AgYXMgc29vbiBhcyB3ZSBhcnJpdmUgYXQgdGhlIHByZXNlbnRcblx0XHRcdFx0aWYoIHZlcnRpY2FsU2xpZGVzW2pdLmNsYXNzTGlzdC5jb250YWlucyggJ3ByZXNlbnQnICkgKSB7XG5cdFx0XHRcdFx0YnJlYWsgbWFpbkxvb3A7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRwYXN0Q291bnQrKztcblxuXHRcdFx0fVxuXG5cdFx0XHQvLyBTdG9wIGFzIHNvb24gYXMgd2UgYXJyaXZlIGF0IHRoZSBwcmVzZW50XG5cdFx0XHRpZiggaG9yaXpvbnRhbFNsaWRlLmNsYXNzTGlzdC5jb250YWlucyggJ3ByZXNlbnQnICkgKSB7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBEb24ndCBjb3VudCB0aGUgd3JhcHBpbmcgc2VjdGlvbiBmb3IgdmVydGljYWwgc2xpZGVzXG5cdFx0XHRpZiggaG9yaXpvbnRhbFNsaWRlLmNsYXNzTGlzdC5jb250YWlucyggJ3N0YWNrJyApID09PSBmYWxzZSApIHtcblx0XHRcdFx0cGFzdENvdW50Kys7XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0XHRyZXR1cm4gcGFzdENvdW50O1xuXG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyBhIHZhbHVlIHJhbmdpbmcgZnJvbSAwLTEgdGhhdCByZXByZXNlbnRzXG5cdCAqIGhvdyBmYXIgaW50byB0aGUgcHJlc2VudGF0aW9uIHdlIGhhdmUgbmF2aWdhdGVkLlxuXHQgKlxuXHQgKiBAcmV0dXJuIHtudW1iZXJ9XG5cdCAqL1xuXHRmdW5jdGlvbiBnZXRQcm9ncmVzcygpIHtcblxuXHRcdC8vIFRoZSBudW1iZXIgb2YgcGFzdCBhbmQgdG90YWwgc2xpZGVzXG5cdFx0dmFyIHRvdGFsQ291bnQgPSBnZXRUb3RhbFNsaWRlcygpO1xuXHRcdHZhciBwYXN0Q291bnQgPSBnZXRTbGlkZVBhc3RDb3VudCgpO1xuXG5cdFx0aWYoIGN1cnJlbnRTbGlkZSApIHtcblxuXHRcdFx0dmFyIGFsbEZyYWdtZW50cyA9IGN1cnJlbnRTbGlkZS5xdWVyeVNlbGVjdG9yQWxsKCAnLmZyYWdtZW50JyApO1xuXG5cdFx0XHQvLyBJZiB0aGVyZSBhcmUgZnJhZ21lbnRzIGluIHRoZSBjdXJyZW50IHNsaWRlIHRob3NlIHNob3VsZCBiZVxuXHRcdFx0Ly8gYWNjb3VudGVkIGZvciBpbiB0aGUgcHJvZ3Jlc3MuXG5cdFx0XHRpZiggYWxsRnJhZ21lbnRzLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRcdHZhciB2aXNpYmxlRnJhZ21lbnRzID0gY3VycmVudFNsaWRlLnF1ZXJ5U2VsZWN0b3JBbGwoICcuZnJhZ21lbnQudmlzaWJsZScgKTtcblxuXHRcdFx0XHQvLyBUaGlzIHZhbHVlIHJlcHJlc2VudHMgaG93IGJpZyBhIHBvcnRpb24gb2YgdGhlIHNsaWRlIHByb2dyZXNzXG5cdFx0XHRcdC8vIHRoYXQgaXMgbWFkZSB1cCBieSBpdHMgZnJhZ21lbnRzICgwLTEpXG5cdFx0XHRcdHZhciBmcmFnbWVudFdlaWdodCA9IDAuOTtcblxuXHRcdFx0XHQvLyBBZGQgZnJhZ21lbnQgcHJvZ3Jlc3MgdG8gdGhlIHBhc3Qgc2xpZGUgY291bnRcblx0XHRcdFx0cGFzdENvdW50ICs9ICggdmlzaWJsZUZyYWdtZW50cy5sZW5ndGggLyBhbGxGcmFnbWVudHMubGVuZ3RoICkgKiBmcmFnbWVudFdlaWdodDtcblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdHJldHVybiBwYXN0Q291bnQgLyAoIHRvdGFsQ291bnQgLSAxICk7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVja3MgaWYgdGhpcyBwcmVzZW50YXRpb24gaXMgcnVubmluZyBpbnNpZGUgb2YgdGhlXG5cdCAqIHNwZWFrZXIgbm90ZXMgd2luZG93LlxuXHQgKlxuXHQgKiBAcmV0dXJuIHtib29sZWFufVxuXHQgKi9cblx0ZnVuY3Rpb24gaXNTcGVha2VyTm90ZXMoKSB7XG5cblx0XHRyZXR1cm4gISF3aW5kb3cubG9jYXRpb24uc2VhcmNoLm1hdGNoKCAvcmVjZWl2ZXIvZ2kgKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIFJlYWRzIHRoZSBjdXJyZW50IFVSTCAoaGFzaCkgYW5kIG5hdmlnYXRlcyBhY2NvcmRpbmdseS5cblx0ICovXG5cdGZ1bmN0aW9uIHJlYWRVUkwoKSB7XG5cblx0XHR2YXIgaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoO1xuXG5cdFx0Ly8gQXR0ZW1wdCB0byBwYXJzZSB0aGUgaGFzaCBhcyBlaXRoZXIgYW4gaW5kZXggb3IgbmFtZVxuXHRcdHZhciBiaXRzID0gaGFzaC5zbGljZSggMiApLnNwbGl0KCAnLycgKSxcblx0XHRcdG5hbWUgPSBoYXNoLnJlcGxhY2UoIC8jfFxcLy9naSwgJycgKTtcblxuXHRcdC8vIElmIHRoZSBmaXJzdCBiaXQgaXMgaW52YWxpZCBhbmQgdGhlcmUgaXMgYSBuYW1lIHdlIGNhblxuXHRcdC8vIGFzc3VtZSB0aGF0IHRoaXMgaXMgYSBuYW1lZCBsaW5rXG5cdFx0aWYoIGlzTmFOKCBwYXJzZUludCggYml0c1swXSwgMTAgKSApICYmIG5hbWUubGVuZ3RoICkge1xuXHRcdFx0dmFyIGVsZW1lbnQ7XG5cblx0XHRcdC8vIEVuc3VyZSB0aGUgbmFtZWQgbGluayBpcyBhIHZhbGlkIEhUTUwgSUQgYXR0cmlidXRlXG5cdFx0XHRpZiggL15bYS16QS1aXVtcXHc6Li1dKiQvLnRlc3QoIG5hbWUgKSApIHtcblx0XHRcdFx0Ly8gRmluZCB0aGUgc2xpZGUgd2l0aCB0aGUgc3BlY2lmaWVkIElEXG5cdFx0XHRcdGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggbmFtZSApO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiggZWxlbWVudCApIHtcblx0XHRcdFx0Ly8gRmluZCB0aGUgcG9zaXRpb24gb2YgdGhlIG5hbWVkIHNsaWRlIGFuZCBuYXZpZ2F0ZSB0byBpdFxuXHRcdFx0XHR2YXIgaW5kaWNlcyA9IFJldmVhbC5nZXRJbmRpY2VzKCBlbGVtZW50ICk7XG5cdFx0XHRcdHNsaWRlKCBpbmRpY2VzLmgsIGluZGljZXMudiApO1xuXHRcdFx0fVxuXHRcdFx0Ly8gSWYgdGhlIHNsaWRlIGRvZXNuJ3QgZXhpc3QsIG5hdmlnYXRlIHRvIHRoZSBjdXJyZW50IHNsaWRlXG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0c2xpZGUoIGluZGV4aCB8fCAwLCBpbmRleHYgfHwgMCApO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdC8vIFJlYWQgdGhlIGluZGV4IGNvbXBvbmVudHMgb2YgdGhlIGhhc2hcblx0XHRcdHZhciBoID0gcGFyc2VJbnQoIGJpdHNbMF0sIDEwICkgfHwgMCxcblx0XHRcdFx0diA9IHBhcnNlSW50KCBiaXRzWzFdLCAxMCApIHx8IDA7XG5cblx0XHRcdGlmKCBoICE9PSBpbmRleGggfHwgdiAhPT0gaW5kZXh2ICkge1xuXHRcdFx0XHRzbGlkZSggaCwgdiApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIFVwZGF0ZXMgdGhlIHBhZ2UgVVJMIChoYXNoKSB0byByZWZsZWN0IHRoZSBjdXJyZW50XG5cdCAqIHN0YXRlLlxuXHQgKlxuXHQgKiBAcGFyYW0ge251bWJlcn0gZGVsYXkgVGhlIHRpbWUgaW4gbXMgdG8gd2FpdCBiZWZvcmVcblx0ICogd3JpdGluZyB0aGUgaGFzaFxuXHQgKi9cblx0ZnVuY3Rpb24gd3JpdGVVUkwoIGRlbGF5ICkge1xuXG5cdFx0aWYoIGNvbmZpZy5oaXN0b3J5ICkge1xuXG5cdFx0XHQvLyBNYWtlIHN1cmUgdGhlcmUncyBuZXZlciBtb3JlIHRoYW4gb25lIHRpbWVvdXQgcnVubmluZ1xuXHRcdFx0Y2xlYXJUaW1lb3V0KCB3cml0ZVVSTFRpbWVvdXQgKTtcblxuXHRcdFx0Ly8gSWYgYSBkZWxheSBpcyBzcGVjaWZpZWQsIHRpbWVvdXQgdGhpcyBjYWxsXG5cdFx0XHRpZiggdHlwZW9mIGRlbGF5ID09PSAnbnVtYmVyJyApIHtcblx0XHRcdFx0d3JpdGVVUkxUaW1lb3V0ID0gc2V0VGltZW91dCggd3JpdGVVUkwsIGRlbGF5ICk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmKCBjdXJyZW50U2xpZGUgKSB7XG5cdFx0XHRcdHZhciB1cmwgPSAnLyc7XG5cblx0XHRcdFx0Ly8gQXR0ZW1wdCB0byBjcmVhdGUgYSBuYW1lZCBsaW5rIGJhc2VkIG9uIHRoZSBzbGlkZSdzIElEXG5cdFx0XHRcdHZhciBpZCA9IGN1cnJlbnRTbGlkZS5nZXRBdHRyaWJ1dGUoICdpZCcgKTtcblx0XHRcdFx0aWYoIGlkICkge1xuXHRcdFx0XHRcdGlkID0gaWQucmVwbGFjZSggL1teYS16QS1aMC05XFwtXFxfXFw6XFwuXS9nLCAnJyApO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gSWYgdGhlIGN1cnJlbnQgc2xpZGUgaGFzIGFuIElELCB1c2UgdGhhdCBhcyBhIG5hbWVkIGxpbmtcblx0XHRcdFx0aWYoIHR5cGVvZiBpZCA9PT0gJ3N0cmluZycgJiYgaWQubGVuZ3RoICkge1xuXHRcdFx0XHRcdHVybCA9ICcvJyArIGlkO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vIE90aGVyd2lzZSB1c2UgdGhlIC9oL3YgaW5kZXhcblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0aWYoIGluZGV4aCA+IDAgfHwgaW5kZXh2ID4gMCApIHVybCArPSBpbmRleGg7XG5cdFx0XHRcdFx0aWYoIGluZGV4diA+IDAgKSB1cmwgKz0gJy8nICsgaW5kZXh2O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0d2luZG93LmxvY2F0aW9uLmhhc2ggPSB1cmw7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdH1cblx0LyoqXG5cdCAqIFJldHJpZXZlcyB0aGUgaC92IGxvY2F0aW9uIGFuZCBmcmFnbWVudCBvZiB0aGUgY3VycmVudCxcblx0ICogb3Igc3BlY2lmaWVkLCBzbGlkZS5cblx0ICpcblx0ICogQHBhcmFtIHtIVE1MRWxlbWVudH0gW3NsaWRlXSBJZiBzcGVjaWZpZWQsIHRoZSByZXR1cm5lZFxuXHQgKiBpbmRleCB3aWxsIGJlIGZvciB0aGlzIHNsaWRlIHJhdGhlciB0aGFuIHRoZSBjdXJyZW50bHlcblx0ICogYWN0aXZlIG9uZVxuXHQgKlxuXHQgKiBAcmV0dXJuIHt7aDogbnVtYmVyLCB2OiBudW1iZXIsIGY6IG51bWJlcn19XG5cdCAqL1xuXHRmdW5jdGlvbiBnZXRJbmRpY2VzKCBzbGlkZSApIHtcblxuXHRcdC8vIEJ5IGRlZmF1bHQsIHJldHVybiB0aGUgY3VycmVudCBpbmRpY2VzXG5cdFx0dmFyIGggPSBpbmRleGgsXG5cdFx0XHR2ID0gaW5kZXh2LFxuXHRcdFx0ZjtcblxuXHRcdC8vIElmIGEgc2xpZGUgaXMgc3BlY2lmaWVkLCByZXR1cm4gdGhlIGluZGljZXMgb2YgdGhhdCBzbGlkZVxuXHRcdGlmKCBzbGlkZSApIHtcblx0XHRcdHZhciBpc1ZlcnRpY2FsID0gaXNWZXJ0aWNhbFNsaWRlKCBzbGlkZSApO1xuXHRcdFx0dmFyIHNsaWRlaCA9IGlzVmVydGljYWwgPyBzbGlkZS5wYXJlbnROb2RlIDogc2xpZGU7XG5cblx0XHRcdC8vIFNlbGVjdCBhbGwgaG9yaXpvbnRhbCBzbGlkZXNcblx0XHRcdHZhciBob3Jpem9udGFsU2xpZGVzID0gdG9BcnJheSggZG9tLndyYXBwZXIucXVlcnlTZWxlY3RvckFsbCggSE9SSVpPTlRBTF9TTElERVNfU0VMRUNUT1IgKSApO1xuXG5cdFx0XHQvLyBOb3cgdGhhdCB3ZSBrbm93IHdoaWNoIHRoZSBob3Jpem9udGFsIHNsaWRlIGlzLCBnZXQgaXRzIGluZGV4XG5cdFx0XHRoID0gTWF0aC5tYXgoIGhvcml6b250YWxTbGlkZXMuaW5kZXhPZiggc2xpZGVoICksIDAgKTtcblxuXHRcdFx0Ly8gQXNzdW1lIHdlJ3JlIG5vdCB2ZXJ0aWNhbFxuXHRcdFx0diA9IHVuZGVmaW5lZDtcblxuXHRcdFx0Ly8gSWYgdGhpcyBpcyBhIHZlcnRpY2FsIHNsaWRlLCBncmFiIHRoZSB2ZXJ0aWNhbCBpbmRleFxuXHRcdFx0aWYoIGlzVmVydGljYWwgKSB7XG5cdFx0XHRcdHYgPSBNYXRoLm1heCggdG9BcnJheSggc2xpZGUucGFyZW50Tm9kZS5xdWVyeVNlbGVjdG9yQWxsKCAnc2VjdGlvbicgKSApLmluZGV4T2YoIHNsaWRlICksIDAgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiggIXNsaWRlICYmIGN1cnJlbnRTbGlkZSApIHtcblx0XHRcdHZhciBoYXNGcmFnbWVudHMgPSBjdXJyZW50U2xpZGUucXVlcnlTZWxlY3RvckFsbCggJy5mcmFnbWVudCcgKS5sZW5ndGggPiAwO1xuXHRcdFx0aWYoIGhhc0ZyYWdtZW50cyApIHtcblx0XHRcdFx0dmFyIGN1cnJlbnRGcmFnbWVudCA9IGN1cnJlbnRTbGlkZS5xdWVyeVNlbGVjdG9yKCAnLmN1cnJlbnQtZnJhZ21lbnQnICk7XG5cdFx0XHRcdGlmKCBjdXJyZW50RnJhZ21lbnQgJiYgY3VycmVudEZyYWdtZW50Lmhhc0F0dHJpYnV0ZSggJ2RhdGEtZnJhZ21lbnQtaW5kZXgnICkgKSB7XG5cdFx0XHRcdFx0ZiA9IHBhcnNlSW50KCBjdXJyZW50RnJhZ21lbnQuZ2V0QXR0cmlidXRlKCAnZGF0YS1mcmFnbWVudC1pbmRleCcgKSwgMTAgKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRmID0gY3VycmVudFNsaWRlLnF1ZXJ5U2VsZWN0b3JBbGwoICcuZnJhZ21lbnQudmlzaWJsZScgKS5sZW5ndGggLSAxO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHsgaDogaCwgdjogdiwgZjogZiB9O1xuXG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmVzIHRoZSB0b3RhbCBudW1iZXIgb2Ygc2xpZGVzIGluIHRoaXMgcHJlc2VudGF0aW9uLlxuXHQgKlxuXHQgKiBAcmV0dXJuIHtudW1iZXJ9XG5cdCAqL1xuXHRmdW5jdGlvbiBnZXRUb3RhbFNsaWRlcygpIHtcblxuXHRcdHJldHVybiBkb20ud3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKCBTTElERVNfU0VMRUNUT1IgKyAnOm5vdCguc3RhY2spJyApLmxlbmd0aDtcblxuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIHNsaWRlIGVsZW1lbnQgbWF0Y2hpbmcgdGhlIHNwZWNpZmllZCBpbmRleC5cblx0ICpcblx0ICogQHJldHVybiB7SFRNTEVsZW1lbnR9XG5cdCAqL1xuXHRmdW5jdGlvbiBnZXRTbGlkZSggeCwgeSApIHtcblxuXHRcdHZhciBob3Jpem9udGFsU2xpZGUgPSBkb20ud3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKCBIT1JJWk9OVEFMX1NMSURFU19TRUxFQ1RPUiApWyB4IF07XG5cdFx0dmFyIHZlcnRpY2FsU2xpZGVzID0gaG9yaXpvbnRhbFNsaWRlICYmIGhvcml6b250YWxTbGlkZS5xdWVyeVNlbGVjdG9yQWxsKCAnc2VjdGlvbicgKTtcblxuXHRcdGlmKCB2ZXJ0aWNhbFNsaWRlcyAmJiB2ZXJ0aWNhbFNsaWRlcy5sZW5ndGggJiYgdHlwZW9mIHkgPT09ICdudW1iZXInICkge1xuXHRcdFx0cmV0dXJuIHZlcnRpY2FsU2xpZGVzID8gdmVydGljYWxTbGlkZXNbIHkgXSA6IHVuZGVmaW5lZDtcblx0XHR9XG5cblx0XHRyZXR1cm4gaG9yaXpvbnRhbFNsaWRlO1xuXG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgYmFja2dyb3VuZCBlbGVtZW50IGZvciB0aGUgZ2l2ZW4gc2xpZGUuXG5cdCAqIEFsbCBzbGlkZXMsIGV2ZW4gdGhlIG9uZXMgd2l0aCBubyBiYWNrZ3JvdW5kIHByb3BlcnRpZXNcblx0ICogZGVmaW5lZCwgaGF2ZSBhIGJhY2tncm91bmQgZWxlbWVudCBzbyBhcyBsb25nIGFzIHRoZVxuXHQgKiBpbmRleCBpcyB2YWxpZCBhbiBlbGVtZW50IHdpbGwgYmUgcmV0dXJuZWQuXG5cdCAqXG5cdCAqIEBwYXJhbSB7bnVtYmVyfSB4IEhvcml6b250YWwgYmFja2dyb3VuZCBpbmRleFxuXHQgKiBAcGFyYW0ge251bWJlcn0geSBWZXJ0aWNhbCBiYWNrZ3JvdW5kIGluZGV4XG5cdCAqIEByZXR1cm4geyhIVE1MRWxlbWVudFtdfCopfVxuXHQgKi9cblx0ZnVuY3Rpb24gZ2V0U2xpZGVCYWNrZ3JvdW5kKCB4LCB5ICkge1xuXG5cdFx0Ly8gV2hlbiBwcmludGluZyB0byBQREYgdGhlIHNsaWRlIGJhY2tncm91bmRzIGFyZSBuZXN0ZWRcblx0XHQvLyBpbnNpZGUgb2YgdGhlIHNsaWRlc1xuXHRcdGlmKCBpc1ByaW50aW5nUERGKCkgKSB7XG5cdFx0XHR2YXIgc2xpZGUgPSBnZXRTbGlkZSggeCwgeSApO1xuXHRcdFx0aWYoIHNsaWRlICkge1xuXHRcdFx0XHRyZXR1cm4gc2xpZGUuc2xpZGVCYWNrZ3JvdW5kRWxlbWVudDtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcblx0XHR9XG5cblx0XHR2YXIgaG9yaXpvbnRhbEJhY2tncm91bmQgPSBkb20ud3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKCAnLmJhY2tncm91bmRzPi5zbGlkZS1iYWNrZ3JvdW5kJyApWyB4IF07XG5cdFx0dmFyIHZlcnRpY2FsQmFja2dyb3VuZHMgPSBob3Jpem9udGFsQmFja2dyb3VuZCAmJiBob3Jpem9udGFsQmFja2dyb3VuZC5xdWVyeVNlbGVjdG9yQWxsKCAnLnNsaWRlLWJhY2tncm91bmQnICk7XG5cblx0XHRpZiggdmVydGljYWxCYWNrZ3JvdW5kcyAmJiB2ZXJ0aWNhbEJhY2tncm91bmRzLmxlbmd0aCAmJiB0eXBlb2YgeSA9PT0gJ251bWJlcicgKSB7XG5cdFx0XHRyZXR1cm4gdmVydGljYWxCYWNrZ3JvdW5kcyA/IHZlcnRpY2FsQmFja2dyb3VuZHNbIHkgXSA6IHVuZGVmaW5lZDtcblx0XHR9XG5cblx0XHRyZXR1cm4gaG9yaXpvbnRhbEJhY2tncm91bmQ7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBSZXRyaWV2ZXMgdGhlIHNwZWFrZXIgbm90ZXMgZnJvbSBhIHNsaWRlLiBOb3RlcyBjYW4gYmVcblx0ICogZGVmaW5lZCBpbiB0d28gd2F5czpcblx0ICogMS4gQXMgYSBkYXRhLW5vdGVzIGF0dHJpYnV0ZSBvbiB0aGUgc2xpZGUgPHNlY3Rpb24+XG5cdCAqIDIuIEFzIGFuIDxhc2lkZSBjbGFzcz1cIm5vdGVzXCI+IGluc2lkZSBvZiB0aGUgc2xpZGVcblx0ICpcblx0ICogQHBhcmFtIHtIVE1MRWxlbWVudH0gW3NsaWRlPWN1cnJlbnRTbGlkZV1cblx0ICogQHJldHVybiB7KHN0cmluZ3xudWxsKX1cblx0ICovXG5cdGZ1bmN0aW9uIGdldFNsaWRlTm90ZXMoIHNsaWRlICkge1xuXG5cdFx0Ly8gRGVmYXVsdCB0byB0aGUgY3VycmVudCBzbGlkZVxuXHRcdHNsaWRlID0gc2xpZGUgfHwgY3VycmVudFNsaWRlO1xuXG5cdFx0Ly8gTm90ZXMgY2FuIGJlIHNwZWNpZmllZCB2aWEgdGhlIGRhdGEtbm90ZXMgYXR0cmlidXRlLi4uXG5cdFx0aWYoIHNsaWRlLmhhc0F0dHJpYnV0ZSggJ2RhdGEtbm90ZXMnICkgKSB7XG5cdFx0XHRyZXR1cm4gc2xpZGUuZ2V0QXR0cmlidXRlKCAnZGF0YS1ub3RlcycgKTtcblx0XHR9XG5cblx0XHQvLyAuLi4gb3IgdXNpbmcgYW4gPGFzaWRlIGNsYXNzPVwibm90ZXNcIj4gZWxlbWVudFxuXHRcdHZhciBub3Rlc0VsZW1lbnQgPSBzbGlkZS5xdWVyeVNlbGVjdG9yKCAnYXNpZGUubm90ZXMnICk7XG5cdFx0aWYoIG5vdGVzRWxlbWVudCApIHtcblx0XHRcdHJldHVybiBub3Rlc0VsZW1lbnQuaW5uZXJIVE1MO1xuXHRcdH1cblxuXHRcdHJldHVybiBudWxsO1xuXG5cdH1cblxuXHQvKipcblx0ICogUmV0cmlldmVzIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBwcmVzZW50YXRpb24gYXNcblx0ICogYW4gb2JqZWN0LiBUaGlzIHN0YXRlIGNhbiB0aGVuIGJlIHJlc3RvcmVkIGF0IGFueVxuXHQgKiB0aW1lLlxuXHQgKlxuXHQgKiBAcmV0dXJuIHt7aW5kZXhoOiBudW1iZXIsIGluZGV4djogbnVtYmVyLCBpbmRleGY6IG51bWJlciwgcGF1c2VkOiBib29sZWFuLCBvdmVydmlldzogYm9vbGVhbn19XG5cdCAqL1xuXHRmdW5jdGlvbiBnZXRTdGF0ZSgpIHtcblxuXHRcdHZhciBpbmRpY2VzID0gZ2V0SW5kaWNlcygpO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdGluZGV4aDogaW5kaWNlcy5oLFxuXHRcdFx0aW5kZXh2OiBpbmRpY2VzLnYsXG5cdFx0XHRpbmRleGY6IGluZGljZXMuZixcblx0XHRcdHBhdXNlZDogaXNQYXVzZWQoKSxcblx0XHRcdG92ZXJ2aWV3OiBpc092ZXJ2aWV3KClcblx0XHR9O1xuXG5cdH1cblxuXHQvKipcblx0ICogUmVzdG9yZXMgdGhlIHByZXNlbnRhdGlvbiB0byB0aGUgZ2l2ZW4gc3RhdGUuXG5cdCAqXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBzdGF0ZSBBcyBnZW5lcmF0ZWQgYnkgZ2V0U3RhdGUoKVxuXHQgKiBAc2VlIHtAbGluayBnZXRTdGF0ZX0gZ2VuZXJhdGVzIHRoZSBwYXJhbWV0ZXIgYHN0YXRlYFxuXHQgKi9cblx0ZnVuY3Rpb24gc2V0U3RhdGUoIHN0YXRlICkge1xuXG5cdFx0aWYoIHR5cGVvZiBzdGF0ZSA9PT0gJ29iamVjdCcgKSB7XG5cdFx0XHRzbGlkZSggZGVzZXJpYWxpemUoIHN0YXRlLmluZGV4aCApLCBkZXNlcmlhbGl6ZSggc3RhdGUuaW5kZXh2ICksIGRlc2VyaWFsaXplKCBzdGF0ZS5pbmRleGYgKSApO1xuXG5cdFx0XHR2YXIgcGF1c2VkRmxhZyA9IGRlc2VyaWFsaXplKCBzdGF0ZS5wYXVzZWQgKSxcblx0XHRcdFx0b3ZlcnZpZXdGbGFnID0gZGVzZXJpYWxpemUoIHN0YXRlLm92ZXJ2aWV3ICk7XG5cblx0XHRcdGlmKCB0eXBlb2YgcGF1c2VkRmxhZyA9PT0gJ2Jvb2xlYW4nICYmIHBhdXNlZEZsYWcgIT09IGlzUGF1c2VkKCkgKSB7XG5cdFx0XHRcdHRvZ2dsZVBhdXNlKCBwYXVzZWRGbGFnICk7XG5cdFx0XHR9XG5cblx0XHRcdGlmKCB0eXBlb2Ygb3ZlcnZpZXdGbGFnID09PSAnYm9vbGVhbicgJiYgb3ZlcnZpZXdGbGFnICE9PSBpc092ZXJ2aWV3KCkgKSB7XG5cdFx0XHRcdHRvZ2dsZU92ZXJ2aWV3KCBvdmVydmlld0ZsYWcgKTtcblx0XHRcdH1cblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm4gYSBzb3J0ZWQgZnJhZ21lbnRzIGxpc3QsIG9yZGVyZWQgYnkgYW4gaW5jcmVhc2luZ1xuXHQgKiBcImRhdGEtZnJhZ21lbnQtaW5kZXhcIiBhdHRyaWJ1dGUuXG5cdCAqXG5cdCAqIEZyYWdtZW50cyB3aWxsIGJlIHJldmVhbGVkIGluIHRoZSBvcmRlciB0aGF0IHRoZXkgYXJlIHJldHVybmVkIGJ5XG5cdCAqIHRoaXMgZnVuY3Rpb24sIHNvIHlvdSBjYW4gdXNlIHRoZSBpbmRleCBhdHRyaWJ1dGVzIHRvIGNvbnRyb2wgdGhlXG5cdCAqIG9yZGVyIG9mIGZyYWdtZW50IGFwcGVhcmFuY2UuXG5cdCAqXG5cdCAqIFRvIG1haW50YWluIGEgc2Vuc2libGUgZGVmYXVsdCBmcmFnbWVudCBvcmRlciwgZnJhZ21lbnRzIGFyZSBwcmVzdW1lZFxuXHQgKiB0byBiZSBwYXNzZWQgaW4gZG9jdW1lbnQgb3JkZXIuIFRoaXMgZnVuY3Rpb24gYWRkcyBhIFwiZnJhZ21lbnQtaW5kZXhcIlxuXHQgKiBhdHRyaWJ1dGUgdG8gZWFjaCBub2RlIGlmIHN1Y2ggYW4gYXR0cmlidXRlIGlzIG5vdCBhbHJlYWR5IHByZXNlbnQsXG5cdCAqIGFuZCBzZXRzIHRoYXQgYXR0cmlidXRlIHRvIGFuIGludGVnZXIgdmFsdWUgd2hpY2ggaXMgdGhlIHBvc2l0aW9uIG9mXG5cdCAqIHRoZSBmcmFnbWVudCB3aXRoaW4gdGhlIGZyYWdtZW50cyBsaXN0LlxuXHQgKlxuXHQgKiBAcGFyYW0ge29iamVjdFtdfCp9IGZyYWdtZW50c1xuXHQgKiBAcmV0dXJuIHtvYmplY3RbXX0gc29ydGVkIFNvcnRlZCBhcnJheSBvZiBmcmFnbWVudHNcblx0ICovXG5cdGZ1bmN0aW9uIHNvcnRGcmFnbWVudHMoIGZyYWdtZW50cyApIHtcblxuXHRcdGZyYWdtZW50cyA9IHRvQXJyYXkoIGZyYWdtZW50cyApO1xuXG5cdFx0dmFyIG9yZGVyZWQgPSBbXSxcblx0XHRcdHVub3JkZXJlZCA9IFtdLFxuXHRcdFx0c29ydGVkID0gW107XG5cblx0XHQvLyBHcm91cCBvcmRlcmVkIGFuZCB1bm9yZGVyZWQgZWxlbWVudHNcblx0XHRmcmFnbWVudHMuZm9yRWFjaCggZnVuY3Rpb24oIGZyYWdtZW50LCBpICkge1xuXHRcdFx0aWYoIGZyYWdtZW50Lmhhc0F0dHJpYnV0ZSggJ2RhdGEtZnJhZ21lbnQtaW5kZXgnICkgKSB7XG5cdFx0XHRcdHZhciBpbmRleCA9IHBhcnNlSW50KCBmcmFnbWVudC5nZXRBdHRyaWJ1dGUoICdkYXRhLWZyYWdtZW50LWluZGV4JyApLCAxMCApO1xuXG5cdFx0XHRcdGlmKCAhb3JkZXJlZFtpbmRleF0gKSB7XG5cdFx0XHRcdFx0b3JkZXJlZFtpbmRleF0gPSBbXTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdG9yZGVyZWRbaW5kZXhdLnB1c2goIGZyYWdtZW50ICk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0dW5vcmRlcmVkLnB1c2goIFsgZnJhZ21lbnQgXSApO1xuXHRcdFx0fVxuXHRcdH0gKTtcblxuXHRcdC8vIEFwcGVuZCBmcmFnbWVudHMgd2l0aG91dCBleHBsaWNpdCBpbmRpY2VzIGluIHRoZWlyXG5cdFx0Ly8gRE9NIG9yZGVyXG5cdFx0b3JkZXJlZCA9IG9yZGVyZWQuY29uY2F0KCB1bm9yZGVyZWQgKTtcblxuXHRcdC8vIE1hbnVhbGx5IGNvdW50IHRoZSBpbmRleCB1cCBwZXIgZ3JvdXAgdG8gZW5zdXJlIHRoZXJlXG5cdFx0Ly8gYXJlIG5vIGdhcHNcblx0XHR2YXIgaW5kZXggPSAwO1xuXG5cdFx0Ly8gUHVzaCBhbGwgZnJhZ21lbnRzIGluIHRoZWlyIHNvcnRlZCBvcmRlciB0byBhbiBhcnJheSxcblx0XHQvLyB0aGlzIGZsYXR0ZW5zIHRoZSBncm91cHNcblx0XHRvcmRlcmVkLmZvckVhY2goIGZ1bmN0aW9uKCBncm91cCApIHtcblx0XHRcdGdyb3VwLmZvckVhY2goIGZ1bmN0aW9uKCBmcmFnbWVudCApIHtcblx0XHRcdFx0c29ydGVkLnB1c2goIGZyYWdtZW50ICk7XG5cdFx0XHRcdGZyYWdtZW50LnNldEF0dHJpYnV0ZSggJ2RhdGEtZnJhZ21lbnQtaW5kZXgnLCBpbmRleCApO1xuXHRcdFx0fSApO1xuXG5cdFx0XHRpbmRleCArKztcblx0XHR9ICk7XG5cblx0XHRyZXR1cm4gc29ydGVkO1xuXG5cdH1cblxuXHQvKipcblx0ICogTmF2aWdhdGUgdG8gdGhlIHNwZWNpZmllZCBzbGlkZSBmcmFnbWVudC5cblx0ICpcblx0ICogQHBhcmFtIHs/bnVtYmVyfSBpbmRleCBUaGUgaW5kZXggb2YgdGhlIGZyYWdtZW50IHRoYXRcblx0ICogc2hvdWxkIGJlIHNob3duLCAtMSBtZWFucyBhbGwgYXJlIGludmlzaWJsZVxuXHQgKiBAcGFyYW0ge251bWJlcn0gb2Zmc2V0IEludGVnZXIgb2Zmc2V0IHRvIGFwcGx5IHRvIHRoZVxuXHQgKiBmcmFnbWVudCBpbmRleFxuXHQgKlxuXHQgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIGEgY2hhbmdlIHdhcyBtYWRlIGluIGFueVxuXHQgKiBmcmFnbWVudHMgdmlzaWJpbGl0eSBhcyBwYXJ0IG9mIHRoaXMgY2FsbFxuXHQgKi9cblx0ZnVuY3Rpb24gbmF2aWdhdGVGcmFnbWVudCggaW5kZXgsIG9mZnNldCApIHtcblxuXHRcdGlmKCBjdXJyZW50U2xpZGUgJiYgY29uZmlnLmZyYWdtZW50cyApIHtcblxuXHRcdFx0dmFyIGZyYWdtZW50cyA9IHNvcnRGcmFnbWVudHMoIGN1cnJlbnRTbGlkZS5xdWVyeVNlbGVjdG9yQWxsKCAnLmZyYWdtZW50JyApICk7XG5cdFx0XHRpZiggZnJhZ21lbnRzLmxlbmd0aCApIHtcblxuXHRcdFx0XHQvLyBJZiBubyBpbmRleCBpcyBzcGVjaWZpZWQsIGZpbmQgdGhlIGN1cnJlbnRcblx0XHRcdFx0aWYoIHR5cGVvZiBpbmRleCAhPT0gJ251bWJlcicgKSB7XG5cdFx0XHRcdFx0dmFyIGxhc3RWaXNpYmxlRnJhZ21lbnQgPSBzb3J0RnJhZ21lbnRzKCBjdXJyZW50U2xpZGUucXVlcnlTZWxlY3RvckFsbCggJy5mcmFnbWVudC52aXNpYmxlJyApICkucG9wKCk7XG5cblx0XHRcdFx0XHRpZiggbGFzdFZpc2libGVGcmFnbWVudCApIHtcblx0XHRcdFx0XHRcdGluZGV4ID0gcGFyc2VJbnQoIGxhc3RWaXNpYmxlRnJhZ21lbnQuZ2V0QXR0cmlidXRlKCAnZGF0YS1mcmFnbWVudC1pbmRleCcgKSB8fCAwLCAxMCApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdGluZGV4ID0gLTE7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gSWYgYW4gb2Zmc2V0IGlzIHNwZWNpZmllZCwgYXBwbHkgaXQgdG8gdGhlIGluZGV4XG5cdFx0XHRcdGlmKCB0eXBlb2Ygb2Zmc2V0ID09PSAnbnVtYmVyJyApIHtcblx0XHRcdFx0XHRpbmRleCArPSBvZmZzZXQ7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR2YXIgZnJhZ21lbnRzU2hvd24gPSBbXSxcblx0XHRcdFx0XHRmcmFnbWVudHNIaWRkZW4gPSBbXTtcblxuXHRcdFx0XHR0b0FycmF5KCBmcmFnbWVudHMgKS5mb3JFYWNoKCBmdW5jdGlvbiggZWxlbWVudCwgaSApIHtcblxuXHRcdFx0XHRcdGlmKCBlbGVtZW50Lmhhc0F0dHJpYnV0ZSggJ2RhdGEtZnJhZ21lbnQtaW5kZXgnICkgKSB7XG5cdFx0XHRcdFx0XHRpID0gcGFyc2VJbnQoIGVsZW1lbnQuZ2V0QXR0cmlidXRlKCAnZGF0YS1mcmFnbWVudC1pbmRleCcgKSwgMTAgKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHQvLyBWaXNpYmxlIGZyYWdtZW50c1xuXHRcdFx0XHRcdGlmKCBpIDw9IGluZGV4ICkge1xuXHRcdFx0XHRcdFx0aWYoICFlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyggJ3Zpc2libGUnICkgKSBmcmFnbWVudHNTaG93bi5wdXNoKCBlbGVtZW50ICk7XG5cdFx0XHRcdFx0XHRlbGVtZW50LmNsYXNzTGlzdC5hZGQoICd2aXNpYmxlJyApO1xuXHRcdFx0XHRcdFx0ZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCAnY3VycmVudC1mcmFnbWVudCcgKTtcblxuXHRcdFx0XHRcdFx0Ly8gQW5ub3VuY2UgdGhlIGZyYWdtZW50cyBvbmUgYnkgb25lIHRvIHRoZSBTY3JlZW4gUmVhZGVyXG5cdFx0XHRcdFx0XHRkb20uc3RhdHVzRGl2LnRleHRDb250ZW50ID0gZ2V0U3RhdHVzVGV4dCggZWxlbWVudCApO1xuXG5cdFx0XHRcdFx0XHRpZiggaSA9PT0gaW5kZXggKSB7XG5cdFx0XHRcdFx0XHRcdGVsZW1lbnQuY2xhc3NMaXN0LmFkZCggJ2N1cnJlbnQtZnJhZ21lbnQnICk7XG5cdFx0XHRcdFx0XHRcdHN0YXJ0RW1iZWRkZWRDb250ZW50KCBlbGVtZW50ICk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC8vIEhpZGRlbiBmcmFnbWVudHNcblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdGlmKCBlbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyggJ3Zpc2libGUnICkgKSBmcmFnbWVudHNIaWRkZW4ucHVzaCggZWxlbWVudCApO1xuXHRcdFx0XHRcdFx0ZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCAndmlzaWJsZScgKTtcblx0XHRcdFx0XHRcdGVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSggJ2N1cnJlbnQtZnJhZ21lbnQnICk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH0gKTtcblxuXHRcdFx0XHRpZiggZnJhZ21lbnRzSGlkZGVuLmxlbmd0aCApIHtcblx0XHRcdFx0XHRkaXNwYXRjaEV2ZW50KCAnZnJhZ21lbnRoaWRkZW4nLCB7IGZyYWdtZW50OiBmcmFnbWVudHNIaWRkZW5bMF0sIGZyYWdtZW50czogZnJhZ21lbnRzSGlkZGVuIH0gKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmKCBmcmFnbWVudHNTaG93bi5sZW5ndGggKSB7XG5cdFx0XHRcdFx0ZGlzcGF0Y2hFdmVudCggJ2ZyYWdtZW50c2hvd24nLCB7IGZyYWdtZW50OiBmcmFnbWVudHNTaG93blswXSwgZnJhZ21lbnRzOiBmcmFnbWVudHNTaG93biB9ICk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR1cGRhdGVDb250cm9scygpO1xuXHRcdFx0XHR1cGRhdGVQcm9ncmVzcygpO1xuXG5cdFx0XHRcdHJldHVybiAhISggZnJhZ21lbnRzU2hvd24ubGVuZ3RoIHx8IGZyYWdtZW50c0hpZGRlbi5sZW5ndGggKTtcblxuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXG5cdH1cblxuXHQvKipcblx0ICogTmF2aWdhdGUgdG8gdGhlIG5leHQgc2xpZGUgZnJhZ21lbnQuXG5cdCAqXG5cdCAqIEByZXR1cm4ge2Jvb2xlYW59IHRydWUgaWYgdGhlcmUgd2FzIGEgbmV4dCBmcmFnbWVudCxcblx0ICogZmFsc2Ugb3RoZXJ3aXNlXG5cdCAqL1xuXHRmdW5jdGlvbiBuZXh0RnJhZ21lbnQoKSB7XG5cblx0XHRyZXR1cm4gbmF2aWdhdGVGcmFnbWVudCggbnVsbCwgMSApO1xuXG5cdH1cblxuXHQvKipcblx0ICogTmF2aWdhdGUgdG8gdGhlIHByZXZpb3VzIHNsaWRlIGZyYWdtZW50LlxuXHQgKlxuXHQgKiBAcmV0dXJuIHtib29sZWFufSB0cnVlIGlmIHRoZXJlIHdhcyBhIHByZXZpb3VzIGZyYWdtZW50LFxuXHQgKiBmYWxzZSBvdGhlcndpc2Vcblx0ICovXG5cdGZ1bmN0aW9uIHByZXZpb3VzRnJhZ21lbnQoKSB7XG5cblx0XHRyZXR1cm4gbmF2aWdhdGVGcmFnbWVudCggbnVsbCwgLTEgKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIEN1ZXMgYSBuZXcgYXV0b21hdGVkIHNsaWRlIGlmIGVuYWJsZWQgaW4gdGhlIGNvbmZpZy5cblx0ICovXG5cdGZ1bmN0aW9uIGN1ZUF1dG9TbGlkZSgpIHtcblxuXHRcdGNhbmNlbEF1dG9TbGlkZSgpO1xuXG5cdFx0aWYoIGN1cnJlbnRTbGlkZSApIHtcblxuXHRcdFx0dmFyIGZyYWdtZW50ID0gY3VycmVudFNsaWRlLnF1ZXJ5U2VsZWN0b3IoICcuY3VycmVudC1mcmFnbWVudCcgKTtcblxuXHRcdFx0Ly8gV2hlbiB0aGUgc2xpZGUgZmlyc3QgYXBwZWFycyB0aGVyZSBpcyBubyBcImN1cnJlbnRcIiBmcmFnbWVudCBzb1xuXHRcdFx0Ly8gd2UgbG9vayBmb3IgYSBkYXRhLWF1dG9zbGlkZSB0aW1pbmcgb24gdGhlIGZpcnN0IGZyYWdtZW50XG5cdFx0XHRpZiggIWZyYWdtZW50ICkgZnJhZ21lbnQgPSBjdXJyZW50U2xpZGUucXVlcnlTZWxlY3RvciggJy5mcmFnbWVudCcgKTtcblxuXHRcdFx0dmFyIGZyYWdtZW50QXV0b1NsaWRlID0gZnJhZ21lbnQgPyBmcmFnbWVudC5nZXRBdHRyaWJ1dGUoICdkYXRhLWF1dG9zbGlkZScgKSA6IG51bGw7XG5cdFx0XHR2YXIgcGFyZW50QXV0b1NsaWRlID0gY3VycmVudFNsaWRlLnBhcmVudE5vZGUgPyBjdXJyZW50U2xpZGUucGFyZW50Tm9kZS5nZXRBdHRyaWJ1dGUoICdkYXRhLWF1dG9zbGlkZScgKSA6IG51bGw7XG5cdFx0XHR2YXIgc2xpZGVBdXRvU2xpZGUgPSBjdXJyZW50U2xpZGUuZ2V0QXR0cmlidXRlKCAnZGF0YS1hdXRvc2xpZGUnICk7XG5cblx0XHRcdC8vIFBpY2sgdmFsdWUgaW4gdGhlIGZvbGxvd2luZyBwcmlvcml0eSBvcmRlcjpcblx0XHRcdC8vIDEuIEN1cnJlbnQgZnJhZ21lbnQncyBkYXRhLWF1dG9zbGlkZVxuXHRcdFx0Ly8gMi4gQ3VycmVudCBzbGlkZSdzIGRhdGEtYXV0b3NsaWRlXG5cdFx0XHQvLyAzLiBQYXJlbnQgc2xpZGUncyBkYXRhLWF1dG9zbGlkZVxuXHRcdFx0Ly8gNC4gR2xvYmFsIGF1dG9TbGlkZSBzZXR0aW5nXG5cdFx0XHRpZiggZnJhZ21lbnRBdXRvU2xpZGUgKSB7XG5cdFx0XHRcdGF1dG9TbGlkZSA9IHBhcnNlSW50KCBmcmFnbWVudEF1dG9TbGlkZSwgMTAgKTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYoIHNsaWRlQXV0b1NsaWRlICkge1xuXHRcdFx0XHRhdXRvU2xpZGUgPSBwYXJzZUludCggc2xpZGVBdXRvU2xpZGUsIDEwICk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmKCBwYXJlbnRBdXRvU2xpZGUgKSB7XG5cdFx0XHRcdGF1dG9TbGlkZSA9IHBhcnNlSW50KCBwYXJlbnRBdXRvU2xpZGUsIDEwICk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0YXV0b1NsaWRlID0gY29uZmlnLmF1dG9TbGlkZTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gSWYgdGhlcmUgYXJlIG1lZGlhIGVsZW1lbnRzIHdpdGggZGF0YS1hdXRvcGxheSxcblx0XHRcdC8vIGF1dG9tYXRpY2FsbHkgc2V0IHRoZSBhdXRvU2xpZGUgZHVyYXRpb24gdG8gdGhlXG5cdFx0XHQvLyBsZW5ndGggb2YgdGhhdCBtZWRpYS4gTm90IGFwcGxpY2FibGUgaWYgdGhlIHNsaWRlXG5cdFx0XHQvLyBpcyBkaXZpZGVkIHVwIGludG8gZnJhZ21lbnRzLiBcblx0XHRcdC8vIHBsYXliYWNrUmF0ZSBpcyBhY2NvdW50ZWQgZm9yIGluIHRoZSBkdXJhdGlvbi5cblx0XHRcdGlmKCBjdXJyZW50U2xpZGUucXVlcnlTZWxlY3RvckFsbCggJy5mcmFnbWVudCcgKS5sZW5ndGggPT09IDAgKSB7XG5cdFx0XHRcdHRvQXJyYXkoIGN1cnJlbnRTbGlkZS5xdWVyeVNlbGVjdG9yQWxsKCAndmlkZW8sIGF1ZGlvJyApICkuZm9yRWFjaCggZnVuY3Rpb24oIGVsICkge1xuXHRcdFx0XHRcdGlmKCBlbC5oYXNBdHRyaWJ1dGUoICdkYXRhLWF1dG9wbGF5JyApICkge1xuXHRcdFx0XHRcdFx0aWYoIGF1dG9TbGlkZSAmJiAoZWwuZHVyYXRpb24gKiAxMDAwIC8gZWwucGxheWJhY2tSYXRlICkgPiBhdXRvU2xpZGUgKSB7XG5cdFx0XHRcdFx0XHRcdGF1dG9TbGlkZSA9ICggZWwuZHVyYXRpb24gKiAxMDAwIC8gZWwucGxheWJhY2tSYXRlICkgKyAxMDAwO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSApO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBDdWUgdGhlIG5leHQgYXV0by1zbGlkZSBpZjpcblx0XHRcdC8vIC0gVGhlcmUgaXMgYW4gYXV0b1NsaWRlIHZhbHVlXG5cdFx0XHQvLyAtIEF1dG8tc2xpZGluZyBpc24ndCBwYXVzZWQgYnkgdGhlIHVzZXJcblx0XHRcdC8vIC0gVGhlIHByZXNlbnRhdGlvbiBpc24ndCBwYXVzZWRcblx0XHRcdC8vIC0gVGhlIG92ZXJ2aWV3IGlzbid0IGFjdGl2ZVxuXHRcdFx0Ly8gLSBUaGUgcHJlc2VudGF0aW9uIGlzbid0IG92ZXJcblx0XHRcdGlmKCBhdXRvU2xpZGUgJiYgIWF1dG9TbGlkZVBhdXNlZCAmJiAhaXNQYXVzZWQoKSAmJiAhaXNPdmVydmlldygpICYmICggIVJldmVhbC5pc0xhc3RTbGlkZSgpIHx8IGF2YWlsYWJsZUZyYWdtZW50cygpLm5leHQgfHwgY29uZmlnLmxvb3AgPT09IHRydWUgKSApIHtcblx0XHRcdFx0YXV0b1NsaWRlVGltZW91dCA9IHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHR5cGVvZiBjb25maWcuYXV0b1NsaWRlTWV0aG9kID09PSAnZnVuY3Rpb24nID8gY29uZmlnLmF1dG9TbGlkZU1ldGhvZCgpIDogbmF2aWdhdGVOZXh0KCk7XG5cdFx0XHRcdFx0Y3VlQXV0b1NsaWRlKCk7XG5cdFx0XHRcdH0sIGF1dG9TbGlkZSApO1xuXHRcdFx0XHRhdXRvU2xpZGVTdGFydFRpbWUgPSBEYXRlLm5vdygpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiggYXV0b1NsaWRlUGxheWVyICkge1xuXHRcdFx0XHRhdXRvU2xpZGVQbGF5ZXIuc2V0UGxheWluZyggYXV0b1NsaWRlVGltZW91dCAhPT0gLTEgKTtcblx0XHRcdH1cblxuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIENhbmNlbHMgYW55IG9uZ29pbmcgcmVxdWVzdCB0byBhdXRvLXNsaWRlLlxuXHQgKi9cblx0ZnVuY3Rpb24gY2FuY2VsQXV0b1NsaWRlKCkge1xuXG5cdFx0Y2xlYXJUaW1lb3V0KCBhdXRvU2xpZGVUaW1lb3V0ICk7XG5cdFx0YXV0b1NsaWRlVGltZW91dCA9IC0xO1xuXG5cdH1cblxuXHRmdW5jdGlvbiBwYXVzZUF1dG9TbGlkZSgpIHtcblxuXHRcdGlmKCBhdXRvU2xpZGUgJiYgIWF1dG9TbGlkZVBhdXNlZCApIHtcblx0XHRcdGF1dG9TbGlkZVBhdXNlZCA9IHRydWU7XG5cdFx0XHRkaXNwYXRjaEV2ZW50KCAnYXV0b3NsaWRlcGF1c2VkJyApO1xuXHRcdFx0Y2xlYXJUaW1lb3V0KCBhdXRvU2xpZGVUaW1lb3V0ICk7XG5cblx0XHRcdGlmKCBhdXRvU2xpZGVQbGF5ZXIgKSB7XG5cdFx0XHRcdGF1dG9TbGlkZVBsYXllci5zZXRQbGF5aW5nKCBmYWxzZSApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHR9XG5cblx0ZnVuY3Rpb24gcmVzdW1lQXV0b1NsaWRlKCkge1xuXG5cdFx0aWYoIGF1dG9TbGlkZSAmJiBhdXRvU2xpZGVQYXVzZWQgKSB7XG5cdFx0XHRhdXRvU2xpZGVQYXVzZWQgPSBmYWxzZTtcblx0XHRcdGRpc3BhdGNoRXZlbnQoICdhdXRvc2xpZGVyZXN1bWVkJyApO1xuXHRcdFx0Y3VlQXV0b1NsaWRlKCk7XG5cdFx0fVxuXG5cdH1cblxuXHRmdW5jdGlvbiBuYXZpZ2F0ZUxlZnQoKSB7XG5cblx0XHQvLyBSZXZlcnNlIGZvciBSVExcblx0XHRpZiggY29uZmlnLnJ0bCApIHtcblx0XHRcdGlmKCAoIGlzT3ZlcnZpZXcoKSB8fCBuZXh0RnJhZ21lbnQoKSA9PT0gZmFsc2UgKSAmJiBhdmFpbGFibGVSb3V0ZXMoKS5sZWZ0ICkge1xuXHRcdFx0XHRzbGlkZSggaW5kZXhoICsgMSApO1xuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyBOb3JtYWwgbmF2aWdhdGlvblxuXHRcdGVsc2UgaWYoICggaXNPdmVydmlldygpIHx8IHByZXZpb3VzRnJhZ21lbnQoKSA9PT0gZmFsc2UgKSAmJiBhdmFpbGFibGVSb3V0ZXMoKS5sZWZ0ICkge1xuXHRcdFx0c2xpZGUoIGluZGV4aCAtIDEgKTtcblx0XHR9XG5cblx0fVxuXG5cdGZ1bmN0aW9uIG5hdmlnYXRlUmlnaHQoKSB7XG5cblx0XHQvLyBSZXZlcnNlIGZvciBSVExcblx0XHRpZiggY29uZmlnLnJ0bCApIHtcblx0XHRcdGlmKCAoIGlzT3ZlcnZpZXcoKSB8fCBwcmV2aW91c0ZyYWdtZW50KCkgPT09IGZhbHNlICkgJiYgYXZhaWxhYmxlUm91dGVzKCkucmlnaHQgKSB7XG5cdFx0XHRcdHNsaWRlKCBpbmRleGggLSAxICk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdC8vIE5vcm1hbCBuYXZpZ2F0aW9uXG5cdFx0ZWxzZSBpZiggKCBpc092ZXJ2aWV3KCkgfHwgbmV4dEZyYWdtZW50KCkgPT09IGZhbHNlICkgJiYgYXZhaWxhYmxlUm91dGVzKCkucmlnaHQgKSB7XG5cdFx0XHRzbGlkZSggaW5kZXhoICsgMSApO1xuXHRcdH1cblxuXHR9XG5cblx0ZnVuY3Rpb24gbmF2aWdhdGVVcCgpIHtcblxuXHRcdC8vIFByaW9yaXRpemUgaGlkaW5nIGZyYWdtZW50c1xuXHRcdGlmKCAoIGlzT3ZlcnZpZXcoKSB8fCBwcmV2aW91c0ZyYWdtZW50KCkgPT09IGZhbHNlICkgJiYgYXZhaWxhYmxlUm91dGVzKCkudXAgKSB7XG5cdFx0XHRzbGlkZSggaW5kZXhoLCBpbmRleHYgLSAxICk7XG5cdFx0fVxuXG5cdH1cblxuXHRmdW5jdGlvbiBuYXZpZ2F0ZURvd24oKSB7XG5cblx0XHQvLyBQcmlvcml0aXplIHJldmVhbGluZyBmcmFnbWVudHNcblx0XHRpZiggKCBpc092ZXJ2aWV3KCkgfHwgbmV4dEZyYWdtZW50KCkgPT09IGZhbHNlICkgJiYgYXZhaWxhYmxlUm91dGVzKCkuZG93biApIHtcblx0XHRcdHNsaWRlKCBpbmRleGgsIGluZGV4diArIDEgKTtcblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBOYXZpZ2F0ZXMgYmFja3dhcmRzLCBwcmlvcml0aXplZCBpbiB0aGUgZm9sbG93aW5nIG9yZGVyOlxuXHQgKiAxKSBQcmV2aW91cyBmcmFnbWVudFxuXHQgKiAyKSBQcmV2aW91cyB2ZXJ0aWNhbCBzbGlkZVxuXHQgKiAzKSBQcmV2aW91cyBob3Jpem9udGFsIHNsaWRlXG5cdCAqL1xuXHRmdW5jdGlvbiBuYXZpZ2F0ZVByZXYoKSB7XG5cblx0XHQvLyBQcmlvcml0aXplIHJldmVhbGluZyBmcmFnbWVudHNcblx0XHRpZiggcHJldmlvdXNGcmFnbWVudCgpID09PSBmYWxzZSApIHtcblx0XHRcdGlmKCBhdmFpbGFibGVSb3V0ZXMoKS51cCApIHtcblx0XHRcdFx0bmF2aWdhdGVVcCgpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdC8vIEZldGNoIHRoZSBwcmV2aW91cyBob3Jpem9udGFsIHNsaWRlLCBpZiB0aGVyZSBpcyBvbmVcblx0XHRcdFx0dmFyIHByZXZpb3VzU2xpZGU7XG5cblx0XHRcdFx0aWYoIGNvbmZpZy5ydGwgKSB7XG5cdFx0XHRcdFx0cHJldmlvdXNTbGlkZSA9IHRvQXJyYXkoIGRvbS53cmFwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoIEhPUklaT05UQUxfU0xJREVTX1NFTEVDVE9SICsgJy5mdXR1cmUnICkgKS5wb3AoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRwcmV2aW91c1NsaWRlID0gdG9BcnJheSggZG9tLndyYXBwZXIucXVlcnlTZWxlY3RvckFsbCggSE9SSVpPTlRBTF9TTElERVNfU0VMRUNUT1IgKyAnLnBhc3QnICkgKS5wb3AoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmKCBwcmV2aW91c1NsaWRlICkge1xuXHRcdFx0XHRcdHZhciB2ID0gKCBwcmV2aW91c1NsaWRlLnF1ZXJ5U2VsZWN0b3JBbGwoICdzZWN0aW9uJyApLmxlbmd0aCAtIDEgKSB8fCB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0dmFyIGggPSBpbmRleGggLSAxO1xuXHRcdFx0XHRcdHNsaWRlKCBoLCB2ICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgcmV2ZXJzZSBvZiAjbmF2aWdhdGVQcmV2KCkuXG5cdCAqL1xuXHRmdW5jdGlvbiBuYXZpZ2F0ZU5leHQoKSB7XG5cblx0XHQvLyBQcmlvcml0aXplIHJldmVhbGluZyBmcmFnbWVudHNcblx0XHRpZiggbmV4dEZyYWdtZW50KCkgPT09IGZhbHNlICkge1xuXHRcdFx0aWYoIGF2YWlsYWJsZVJvdXRlcygpLmRvd24gKSB7XG5cdFx0XHRcdG5hdmlnYXRlRG93bigpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiggY29uZmlnLnJ0bCApIHtcblx0XHRcdFx0bmF2aWdhdGVMZWZ0KCk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0bmF2aWdhdGVSaWdodCgpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiB0aGUgdGFyZ2V0IGVsZW1lbnQgcHJldmVudHMgdGhlIHRyaWdnZXJpbmcgb2Zcblx0ICogc3dpcGUgbmF2aWdhdGlvbi5cblx0ICovXG5cdGZ1bmN0aW9uIGlzU3dpcGVQcmV2ZW50ZWQoIHRhcmdldCApIHtcblxuXHRcdHdoaWxlKCB0YXJnZXQgJiYgdHlwZW9mIHRhcmdldC5oYXNBdHRyaWJ1dGUgPT09ICdmdW5jdGlvbicgKSB7XG5cdFx0XHRpZiggdGFyZ2V0Lmhhc0F0dHJpYnV0ZSggJ2RhdGEtcHJldmVudC1zd2lwZScgKSApIHJldHVybiB0cnVlO1xuXHRcdFx0dGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGU7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXG5cdH1cblxuXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cblx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gRVZFTlRTIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG5cblx0LyoqXG5cdCAqIENhbGxlZCBieSBhbGwgZXZlbnQgaGFuZGxlcnMgdGhhdCBhcmUgYmFzZWQgb24gdXNlclxuXHQgKiBpbnB1dC5cblx0ICpcblx0ICogQHBhcmFtIHtvYmplY3R9IFtldmVudF1cblx0ICovXG5cdGZ1bmN0aW9uIG9uVXNlcklucHV0KCBldmVudCApIHtcblxuXHRcdGlmKCBjb25maWcuYXV0b1NsaWRlU3RvcHBhYmxlICkge1xuXHRcdFx0cGF1c2VBdXRvU2xpZGUoKTtcblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBIYW5kbGVyIGZvciB0aGUgZG9jdW1lbnQgbGV2ZWwgJ2tleXByZXNzJyBldmVudC5cblx0ICpcblx0ICogQHBhcmFtIHtvYmplY3R9IGV2ZW50XG5cdCAqL1xuXHRmdW5jdGlvbiBvbkRvY3VtZW50S2V5UHJlc3MoIGV2ZW50ICkge1xuXG5cdFx0Ly8gQ2hlY2sgaWYgdGhlIHByZXNzZWQga2V5IGlzIHF1ZXN0aW9uIG1hcmtcblx0XHRpZiggZXZlbnQuc2hpZnRLZXkgJiYgZXZlbnQuY2hhckNvZGUgPT09IDYzICkge1xuXHRcdFx0aWYoIGRvbS5vdmVybGF5ICkge1xuXHRcdFx0XHRjbG9zZU92ZXJsYXkoKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRzaG93SGVscCggdHJ1ZSApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIEhhbmRsZXIgZm9yIHRoZSBkb2N1bWVudCBsZXZlbCAna2V5ZG93bicgZXZlbnQuXG5cdCAqXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBldmVudFxuXHQgKi9cblx0ZnVuY3Rpb24gb25Eb2N1bWVudEtleURvd24oIGV2ZW50ICkge1xuXG5cdFx0Ly8gSWYgdGhlcmUncyBhIGNvbmRpdGlvbiBzcGVjaWZpZWQgYW5kIGl0IHJldHVybnMgZmFsc2UsXG5cdFx0Ly8gaWdub3JlIHRoaXMgZXZlbnRcblx0XHRpZiggdHlwZW9mIGNvbmZpZy5rZXlib2FyZENvbmRpdGlvbiA9PT0gJ2Z1bmN0aW9uJyAmJiBjb25maWcua2V5Ym9hcmRDb25kaXRpb24oKSA9PT0gZmFsc2UgKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9XG5cblx0XHQvLyBSZW1lbWJlciBpZiBhdXRvLXNsaWRpbmcgd2FzIHBhdXNlZCBzbyB3ZSBjYW4gdG9nZ2xlIGl0XG5cdFx0dmFyIGF1dG9TbGlkZVdhc1BhdXNlZCA9IGF1dG9TbGlkZVBhdXNlZDtcblxuXHRcdG9uVXNlcklucHV0KCBldmVudCApO1xuXG5cdFx0Ly8gQ2hlY2sgaWYgdGhlcmUncyBhIGZvY3VzZWQgZWxlbWVudCB0aGF0IGNvdWxkIGJlIHVzaW5nXG5cdFx0Ly8gdGhlIGtleWJvYXJkXG5cdFx0dmFyIGFjdGl2ZUVsZW1lbnRJc0NFID0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmNvbnRlbnRFZGl0YWJsZSAhPT0gJ2luaGVyaXQnO1xuXHRcdHZhciBhY3RpdmVFbGVtZW50SXNJbnB1dCA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC50YWdOYW1lICYmIC9pbnB1dHx0ZXh0YXJlYS9pLnRlc3QoIGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQudGFnTmFtZSApO1xuXHRcdHZhciBhY3RpdmVFbGVtZW50SXNOb3RlcyA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5jbGFzc05hbWUgJiYgL3NwZWFrZXItbm90ZXMvaS50ZXN0KCBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmNsYXNzTmFtZSk7XG5cblx0XHQvLyBEaXNyZWdhcmQgdGhlIGV2ZW50IGlmIHRoZXJlJ3MgYSBmb2N1c2VkIGVsZW1lbnQgb3IgYVxuXHRcdC8vIGtleWJvYXJkIG1vZGlmaWVyIGtleSBpcyBwcmVzZW50XG5cdFx0aWYoIGFjdGl2ZUVsZW1lbnRJc0NFIHx8IGFjdGl2ZUVsZW1lbnRJc0lucHV0IHx8IGFjdGl2ZUVsZW1lbnRJc05vdGVzIHx8IChldmVudC5zaGlmdEtleSAmJiBldmVudC5rZXlDb2RlICE9PSAzMikgfHwgZXZlbnQuYWx0S2V5IHx8IGV2ZW50LmN0cmxLZXkgfHwgZXZlbnQubWV0YUtleSApIHJldHVybjtcblxuXHRcdC8vIFdoaWxlIHBhdXNlZCBvbmx5IGFsbG93IHJlc3VtZSBrZXlib2FyZCBldmVudHM7ICdiJywgJ3YnLCAnLidcblx0XHR2YXIgcmVzdW1lS2V5Q29kZXMgPSBbNjYsODYsMTkwLDE5MV07XG5cdFx0dmFyIGtleTtcblxuXHRcdC8vIEN1c3RvbSBrZXkgYmluZGluZ3MgZm9yIHRvZ2dsZVBhdXNlIHNob3VsZCBiZSBhYmxlIHRvIHJlc3VtZVxuXHRcdGlmKCB0eXBlb2YgY29uZmlnLmtleWJvYXJkID09PSAnb2JqZWN0JyApIHtcblx0XHRcdGZvcigga2V5IGluIGNvbmZpZy5rZXlib2FyZCApIHtcblx0XHRcdFx0aWYoIGNvbmZpZy5rZXlib2FyZFtrZXldID09PSAndG9nZ2xlUGF1c2UnICkge1xuXHRcdFx0XHRcdHJlc3VtZUtleUNvZGVzLnB1c2goIHBhcnNlSW50KCBrZXksIDEwICkgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmKCBpc1BhdXNlZCgpICYmIHJlc3VtZUtleUNvZGVzLmluZGV4T2YoIGV2ZW50LmtleUNvZGUgKSA9PT0gLTEgKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0dmFyIHRyaWdnZXJlZCA9IGZhbHNlO1xuXG5cdFx0Ly8gMS4gVXNlciBkZWZpbmVkIGtleSBiaW5kaW5nc1xuXHRcdGlmKCB0eXBlb2YgY29uZmlnLmtleWJvYXJkID09PSAnb2JqZWN0JyApIHtcblxuXHRcdFx0Zm9yKCBrZXkgaW4gY29uZmlnLmtleWJvYXJkICkge1xuXG5cdFx0XHRcdC8vIENoZWNrIGlmIHRoaXMgYmluZGluZyBtYXRjaGVzIHRoZSBwcmVzc2VkIGtleVxuXHRcdFx0XHRpZiggcGFyc2VJbnQoIGtleSwgMTAgKSA9PT0gZXZlbnQua2V5Q29kZSApIHtcblxuXHRcdFx0XHRcdHZhciB2YWx1ZSA9IGNvbmZpZy5rZXlib2FyZFsga2V5IF07XG5cblx0XHRcdFx0XHQvLyBDYWxsYmFjayBmdW5jdGlvblxuXHRcdFx0XHRcdGlmKCB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicgKSB7XG5cdFx0XHRcdFx0XHR2YWx1ZS5hcHBseSggbnVsbCwgWyBldmVudCBdICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC8vIFN0cmluZyBzaG9ydGN1dHMgdG8gcmV2ZWFsLmpzIEFQSVxuXHRcdFx0XHRcdGVsc2UgaWYoIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgdHlwZW9mIFJldmVhbFsgdmFsdWUgXSA9PT0gJ2Z1bmN0aW9uJyApIHtcblx0XHRcdFx0XHRcdFJldmVhbFsgdmFsdWUgXS5jYWxsKCk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0dHJpZ2dlcmVkID0gdHJ1ZTtcblxuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdC8vIDIuIFN5c3RlbSBkZWZpbmVkIGtleSBiaW5kaW5nc1xuXHRcdGlmKCB0cmlnZ2VyZWQgPT09IGZhbHNlICkge1xuXG5cdFx0XHQvLyBBc3N1bWUgdHJ1ZSBhbmQgdHJ5IHRvIHByb3ZlIGZhbHNlXG5cdFx0XHR0cmlnZ2VyZWQgPSB0cnVlO1xuXG5cdFx0XHRzd2l0Y2goIGV2ZW50LmtleUNvZGUgKSB7XG5cdFx0XHRcdC8vIHAsIHBhZ2UgdXBcblx0XHRcdFx0Y2FzZSA4MDogY2FzZSAzMzogbmF2aWdhdGVQcmV2KCk7IGJyZWFrO1xuXHRcdFx0XHQvLyBuLCBwYWdlIGRvd25cblx0XHRcdFx0Y2FzZSA3ODogY2FzZSAzNDogbmF2aWdhdGVOZXh0KCk7IGJyZWFrO1xuXHRcdFx0XHQvLyBoLCBsZWZ0XG5cdFx0XHRcdGNhc2UgNzI6IGNhc2UgMzc6IG5hdmlnYXRlTGVmdCgpOyBicmVhaztcblx0XHRcdFx0Ly8gbCwgcmlnaHRcblx0XHRcdFx0Y2FzZSA3NjogY2FzZSAzOTogbmF2aWdhdGVSaWdodCgpOyBicmVhaztcblx0XHRcdFx0Ly8gaywgdXBcblx0XHRcdFx0Y2FzZSA3NTogY2FzZSAzODogbmF2aWdhdGVVcCgpOyBicmVhaztcblx0XHRcdFx0Ly8gaiwgZG93blxuXHRcdFx0XHRjYXNlIDc0OiBjYXNlIDQwOiBuYXZpZ2F0ZURvd24oKTsgYnJlYWs7XG5cdFx0XHRcdC8vIGhvbWVcblx0XHRcdFx0Y2FzZSAzNjogc2xpZGUoIDAgKTsgYnJlYWs7XG5cdFx0XHRcdC8vIGVuZFxuXHRcdFx0XHRjYXNlIDM1OiBzbGlkZSggTnVtYmVyLk1BWF9WQUxVRSApOyBicmVhaztcblx0XHRcdFx0Ly8gc3BhY2Vcblx0XHRcdFx0Y2FzZSAzMjogaXNPdmVydmlldygpID8gZGVhY3RpdmF0ZU92ZXJ2aWV3KCkgOiBldmVudC5zaGlmdEtleSA/IG5hdmlnYXRlUHJldigpIDogbmF2aWdhdGVOZXh0KCk7IGJyZWFrO1xuXHRcdFx0XHQvLyByZXR1cm5cblx0XHRcdFx0Y2FzZSAxMzogaXNPdmVydmlldygpID8gZGVhY3RpdmF0ZU92ZXJ2aWV3KCkgOiB0cmlnZ2VyZWQgPSBmYWxzZTsgYnJlYWs7XG5cdFx0XHRcdC8vIHR3by1zcG90LCBzZW1pY29sb24sIGIsIHYsIHBlcmlvZCwgTG9naXRlY2ggcHJlc2VudGVyIHRvb2xzIFwiYmxhY2sgc2NyZWVuXCIgYnV0dG9uXG5cdFx0XHRcdGNhc2UgNTg6IGNhc2UgNTk6IGNhc2UgNjY6IGNhc2UgODY6IGNhc2UgMTkwOiBjYXNlIDE5MTogdG9nZ2xlUGF1c2UoKTsgYnJlYWs7XG5cdFx0XHRcdC8vIGZcblx0XHRcdFx0Y2FzZSA3MDogZW50ZXJGdWxsc2NyZWVuKCk7IGJyZWFrO1xuXHRcdFx0XHQvLyBhXG5cdFx0XHRcdGNhc2UgNjU6IGlmICggY29uZmlnLmF1dG9TbGlkZVN0b3BwYWJsZSApIHRvZ2dsZUF1dG9TbGlkZSggYXV0b1NsaWRlV2FzUGF1c2VkICk7IGJyZWFrO1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdHRyaWdnZXJlZCA9IGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0fVxuXG5cdFx0Ly8gSWYgdGhlIGlucHV0IHJlc3VsdGVkIGluIGEgdHJpZ2dlcmVkIGFjdGlvbiB3ZSBzaG91bGQgcHJldmVudFxuXHRcdC8vIHRoZSBicm93c2VycyBkZWZhdWx0IGJlaGF2aW9yXG5cdFx0aWYoIHRyaWdnZXJlZCApIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0ICYmIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0fVxuXHRcdC8vIEVTQyBvciBPIGtleVxuXHRcdGVsc2UgaWYgKCAoIGV2ZW50LmtleUNvZGUgPT09IDI3IHx8IGV2ZW50LmtleUNvZGUgPT09IDc5ICkgJiYgZmVhdHVyZXMudHJhbnNmb3JtczNkICkge1xuXHRcdFx0aWYoIGRvbS5vdmVybGF5ICkge1xuXHRcdFx0XHRjbG9zZU92ZXJsYXkoKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHR0b2dnbGVPdmVydmlldygpO1xuXHRcdFx0fVxuXG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCAmJiBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdH1cblxuXHRcdC8vIElmIGF1dG8tc2xpZGluZyBpcyBlbmFibGVkIHdlIG5lZWQgdG8gY3VlIHVwXG5cdFx0Ly8gYW5vdGhlciB0aW1lb3V0XG5cdFx0Y3VlQXV0b1NsaWRlKCk7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBIYW5kbGVyIGZvciB0aGUgJ3RvdWNoc3RhcnQnIGV2ZW50LCBlbmFibGVzIHN1cHBvcnQgZm9yXG5cdCAqIHN3aXBlIGFuZCBwaW5jaCBnZXN0dXJlcy5cblx0ICpcblx0ICogQHBhcmFtIHtvYmplY3R9IGV2ZW50XG5cdCAqL1xuXHRmdW5jdGlvbiBvblRvdWNoU3RhcnQoIGV2ZW50ICkge1xuXG5cdFx0aWYoIGlzU3dpcGVQcmV2ZW50ZWQoIGV2ZW50LnRhcmdldCApICkgcmV0dXJuIHRydWU7XG5cblx0XHR0b3VjaC5zdGFydFggPSBldmVudC50b3VjaGVzWzBdLmNsaWVudFg7XG5cdFx0dG91Y2guc3RhcnRZID0gZXZlbnQudG91Y2hlc1swXS5jbGllbnRZO1xuXHRcdHRvdWNoLnN0YXJ0Q291bnQgPSBldmVudC50b3VjaGVzLmxlbmd0aDtcblxuXHRcdC8vIElmIHRoZXJlJ3MgdHdvIHRvdWNoZXMgd2UgbmVlZCB0byBtZW1vcml6ZSB0aGUgZGlzdGFuY2Vcblx0XHQvLyBiZXR3ZWVuIHRob3NlIHR3byBwb2ludHMgdG8gZGV0ZWN0IHBpbmNoaW5nXG5cdFx0aWYoIGV2ZW50LnRvdWNoZXMubGVuZ3RoID09PSAyICYmIGNvbmZpZy5vdmVydmlldyApIHtcblx0XHRcdHRvdWNoLnN0YXJ0U3BhbiA9IGRpc3RhbmNlQmV0d2Vlbigge1xuXHRcdFx0XHR4OiBldmVudC50b3VjaGVzWzFdLmNsaWVudFgsXG5cdFx0XHRcdHk6IGV2ZW50LnRvdWNoZXNbMV0uY2xpZW50WVxuXHRcdFx0fSwge1xuXHRcdFx0XHR4OiB0b3VjaC5zdGFydFgsXG5cdFx0XHRcdHk6IHRvdWNoLnN0YXJ0WVxuXHRcdFx0fSApO1xuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIEhhbmRsZXIgZm9yIHRoZSAndG91Y2htb3ZlJyBldmVudC5cblx0ICpcblx0ICogQHBhcmFtIHtvYmplY3R9IGV2ZW50XG5cdCAqL1xuXHRmdW5jdGlvbiBvblRvdWNoTW92ZSggZXZlbnQgKSB7XG5cblx0XHRpZiggaXNTd2lwZVByZXZlbnRlZCggZXZlbnQudGFyZ2V0ICkgKSByZXR1cm4gdHJ1ZTtcblxuXHRcdC8vIEVhY2ggdG91Y2ggc2hvdWxkIG9ubHkgdHJpZ2dlciBvbmUgYWN0aW9uXG5cdFx0aWYoICF0b3VjaC5jYXB0dXJlZCApIHtcblx0XHRcdG9uVXNlcklucHV0KCBldmVudCApO1xuXG5cdFx0XHR2YXIgY3VycmVudFggPSBldmVudC50b3VjaGVzWzBdLmNsaWVudFg7XG5cdFx0XHR2YXIgY3VycmVudFkgPSBldmVudC50b3VjaGVzWzBdLmNsaWVudFk7XG5cblx0XHRcdC8vIElmIHRoZSB0b3VjaCBzdGFydGVkIHdpdGggdHdvIHBvaW50cyBhbmQgc3RpbGwgaGFzXG5cdFx0XHQvLyB0d28gYWN0aXZlIHRvdWNoZXM7IHRlc3QgZm9yIHRoZSBwaW5jaCBnZXN0dXJlXG5cdFx0XHRpZiggZXZlbnQudG91Y2hlcy5sZW5ndGggPT09IDIgJiYgdG91Y2guc3RhcnRDb3VudCA9PT0gMiAmJiBjb25maWcub3ZlcnZpZXcgKSB7XG5cblx0XHRcdFx0Ly8gVGhlIGN1cnJlbnQgZGlzdGFuY2UgaW4gcGl4ZWxzIGJldHdlZW4gdGhlIHR3byB0b3VjaCBwb2ludHNcblx0XHRcdFx0dmFyIGN1cnJlbnRTcGFuID0gZGlzdGFuY2VCZXR3ZWVuKCB7XG5cdFx0XHRcdFx0eDogZXZlbnQudG91Y2hlc1sxXS5jbGllbnRYLFxuXHRcdFx0XHRcdHk6IGV2ZW50LnRvdWNoZXNbMV0uY2xpZW50WVxuXHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0eDogdG91Y2guc3RhcnRYLFxuXHRcdFx0XHRcdHk6IHRvdWNoLnN0YXJ0WVxuXHRcdFx0XHR9ICk7XG5cblx0XHRcdFx0Ly8gSWYgdGhlIHNwYW4gaXMgbGFyZ2VyIHRoYW4gdGhlIGRlc2lyZSBhbW91bnQgd2UndmUgZ290XG5cdFx0XHRcdC8vIG91cnNlbHZlcyBhIHBpbmNoXG5cdFx0XHRcdGlmKCBNYXRoLmFicyggdG91Y2guc3RhcnRTcGFuIC0gY3VycmVudFNwYW4gKSA+IHRvdWNoLnRocmVzaG9sZCApIHtcblx0XHRcdFx0XHR0b3VjaC5jYXB0dXJlZCA9IHRydWU7XG5cblx0XHRcdFx0XHRpZiggY3VycmVudFNwYW4gPCB0b3VjaC5zdGFydFNwYW4gKSB7XG5cdFx0XHRcdFx0XHRhY3RpdmF0ZU92ZXJ2aWV3KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0ZGVhY3RpdmF0ZU92ZXJ2aWV3KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0fVxuXHRcdFx0Ly8gVGhlcmUgd2FzIG9ubHkgb25lIHRvdWNoIHBvaW50LCBsb29rIGZvciBhIHN3aXBlXG5cdFx0XHRlbHNlIGlmKCBldmVudC50b3VjaGVzLmxlbmd0aCA9PT0gMSAmJiB0b3VjaC5zdGFydENvdW50ICE9PSAyICkge1xuXG5cdFx0XHRcdHZhciBkZWx0YVggPSBjdXJyZW50WCAtIHRvdWNoLnN0YXJ0WCxcblx0XHRcdFx0XHRkZWx0YVkgPSBjdXJyZW50WSAtIHRvdWNoLnN0YXJ0WTtcblxuXHRcdFx0XHRpZiggZGVsdGFYID4gdG91Y2gudGhyZXNob2xkICYmIE1hdGguYWJzKCBkZWx0YVggKSA+IE1hdGguYWJzKCBkZWx0YVkgKSApIHtcblx0XHRcdFx0XHR0b3VjaC5jYXB0dXJlZCA9IHRydWU7XG5cdFx0XHRcdFx0bmF2aWdhdGVMZWZ0KCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiggZGVsdGFYIDwgLXRvdWNoLnRocmVzaG9sZCAmJiBNYXRoLmFicyggZGVsdGFYICkgPiBNYXRoLmFicyggZGVsdGFZICkgKSB7XG5cdFx0XHRcdFx0dG91Y2guY2FwdHVyZWQgPSB0cnVlO1xuXHRcdFx0XHRcdG5hdmlnYXRlUmlnaHQoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmKCBkZWx0YVkgPiB0b3VjaC50aHJlc2hvbGQgKSB7XG5cdFx0XHRcdFx0dG91Y2guY2FwdHVyZWQgPSB0cnVlO1xuXHRcdFx0XHRcdG5hdmlnYXRlVXAoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmKCBkZWx0YVkgPCAtdG91Y2gudGhyZXNob2xkICkge1xuXHRcdFx0XHRcdHRvdWNoLmNhcHR1cmVkID0gdHJ1ZTtcblx0XHRcdFx0XHRuYXZpZ2F0ZURvd24oKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIElmIHdlJ3JlIGVtYmVkZGVkLCBvbmx5IGJsb2NrIHRvdWNoIGV2ZW50cyBpZiB0aGV5IGhhdmVcblx0XHRcdFx0Ly8gdHJpZ2dlcmVkIGFuIGFjdGlvblxuXHRcdFx0XHRpZiggY29uZmlnLmVtYmVkZGVkICkge1xuXHRcdFx0XHRcdGlmKCB0b3VjaC5jYXB0dXJlZCB8fCBpc1ZlcnRpY2FsU2xpZGUoIGN1cnJlbnRTbGlkZSApICkge1xuXHRcdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0Ly8gTm90IGVtYmVkZGVkPyBCbG9jayB0aGVtIGFsbCB0byBhdm9pZCBuZWVkbGVzcyB0b3NzaW5nXG5cdFx0XHRcdC8vIGFyb3VuZCBvZiB0aGUgdmlld3BvcnQgaW4gaU9TXG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0fVxuXHRcdH1cblx0XHQvLyBUaGVyZSdzIGEgYnVnIHdpdGggc3dpcGluZyBvbiBzb21lIEFuZHJvaWQgZGV2aWNlcyB1bmxlc3Ncblx0XHQvLyB0aGUgZGVmYXVsdCBhY3Rpb24gaXMgYWx3YXlzIHByZXZlbnRlZFxuXHRcdGVsc2UgaWYoIFVBLm1hdGNoKCAvYW5kcm9pZC9naSApICkge1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBIYW5kbGVyIGZvciB0aGUgJ3RvdWNoZW5kJyBldmVudC5cblx0ICpcblx0ICogQHBhcmFtIHtvYmplY3R9IGV2ZW50XG5cdCAqL1xuXHRmdW5jdGlvbiBvblRvdWNoRW5kKCBldmVudCApIHtcblxuXHRcdHRvdWNoLmNhcHR1cmVkID0gZmFsc2U7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0IHBvaW50ZXIgZG93biB0byB0b3VjaCBzdGFydC5cblx0ICpcblx0ICogQHBhcmFtIHtvYmplY3R9IGV2ZW50XG5cdCAqL1xuXHRmdW5jdGlvbiBvblBvaW50ZXJEb3duKCBldmVudCApIHtcblxuXHRcdGlmKCBldmVudC5wb2ludGVyVHlwZSA9PT0gZXZlbnQuTVNQT0lOVEVSX1RZUEVfVE9VQ0ggfHwgZXZlbnQucG9pbnRlclR5cGUgPT09IFwidG91Y2hcIiApIHtcblx0XHRcdGV2ZW50LnRvdWNoZXMgPSBbeyBjbGllbnRYOiBldmVudC5jbGllbnRYLCBjbGllbnRZOiBldmVudC5jbGllbnRZIH1dO1xuXHRcdFx0b25Ub3VjaFN0YXJ0KCBldmVudCApO1xuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIENvbnZlcnQgcG9pbnRlciBtb3ZlIHRvIHRvdWNoIG1vdmUuXG5cdCAqXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBldmVudFxuXHQgKi9cblx0ZnVuY3Rpb24gb25Qb2ludGVyTW92ZSggZXZlbnQgKSB7XG5cblx0XHRpZiggZXZlbnQucG9pbnRlclR5cGUgPT09IGV2ZW50Lk1TUE9JTlRFUl9UWVBFX1RPVUNIIHx8IGV2ZW50LnBvaW50ZXJUeXBlID09PSBcInRvdWNoXCIgKSAge1xuXHRcdFx0ZXZlbnQudG91Y2hlcyA9IFt7IGNsaWVudFg6IGV2ZW50LmNsaWVudFgsIGNsaWVudFk6IGV2ZW50LmNsaWVudFkgfV07XG5cdFx0XHRvblRvdWNoTW92ZSggZXZlbnQgKTtcblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBDb252ZXJ0IHBvaW50ZXIgdXAgdG8gdG91Y2ggZW5kLlxuXHQgKlxuXHQgKiBAcGFyYW0ge29iamVjdH0gZXZlbnRcblx0ICovXG5cdGZ1bmN0aW9uIG9uUG9pbnRlclVwKCBldmVudCApIHtcblxuXHRcdGlmKCBldmVudC5wb2ludGVyVHlwZSA9PT0gZXZlbnQuTVNQT0lOVEVSX1RZUEVfVE9VQ0ggfHwgZXZlbnQucG9pbnRlclR5cGUgPT09IFwidG91Y2hcIiApICB7XG5cdFx0XHRldmVudC50b3VjaGVzID0gW3sgY2xpZW50WDogZXZlbnQuY2xpZW50WCwgY2xpZW50WTogZXZlbnQuY2xpZW50WSB9XTtcblx0XHRcdG9uVG91Y2hFbmQoIGV2ZW50ICk7XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogSGFuZGxlcyBtb3VzZSB3aGVlbCBzY3JvbGxpbmcsIHRocm90dGxlZCB0byBhdm9pZCBza2lwcGluZ1xuXHQgKiBtdWx0aXBsZSBzbGlkZXMuXG5cdCAqXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBldmVudFxuXHQgKi9cblx0ZnVuY3Rpb24gb25Eb2N1bWVudE1vdXNlU2Nyb2xsKCBldmVudCApIHtcblxuXHRcdGlmKCBEYXRlLm5vdygpIC0gbGFzdE1vdXNlV2hlZWxTdGVwID4gNjAwICkge1xuXG5cdFx0XHRsYXN0TW91c2VXaGVlbFN0ZXAgPSBEYXRlLm5vdygpO1xuXG5cdFx0XHR2YXIgZGVsdGEgPSBldmVudC5kZXRhaWwgfHwgLWV2ZW50LndoZWVsRGVsdGE7XG5cdFx0XHRpZiggZGVsdGEgPiAwICkge1xuXHRcdFx0XHRuYXZpZ2F0ZU5leHQoKTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYoIGRlbHRhIDwgMCApIHtcblx0XHRcdFx0bmF2aWdhdGVQcmV2KCk7XG5cdFx0XHR9XG5cblx0XHR9XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBDbGlja2luZyBvbiB0aGUgcHJvZ3Jlc3MgYmFyIHJlc3VsdHMgaW4gYSBuYXZpZ2F0aW9uIHRvIHRoZVxuXHQgKiBjbG9zZXN0IGFwcHJveGltYXRlIGhvcml6b250YWwgc2xpZGUgdXNpbmcgdGhpcyBlcXVhdGlvbjpcblx0ICpcblx0ICogKCBjbGlja1ggLyBwcmVzZW50YXRpb25XaWR0aCApICogbnVtYmVyT2ZTbGlkZXNcblx0ICpcblx0ICogQHBhcmFtIHtvYmplY3R9IGV2ZW50XG5cdCAqL1xuXHRmdW5jdGlvbiBvblByb2dyZXNzQ2xpY2tlZCggZXZlbnQgKSB7XG5cblx0XHRvblVzZXJJbnB1dCggZXZlbnQgKTtcblxuXHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHR2YXIgc2xpZGVzVG90YWwgPSB0b0FycmF5KCBkb20ud3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKCBIT1JJWk9OVEFMX1NMSURFU19TRUxFQ1RPUiApICkubGVuZ3RoO1xuXHRcdHZhciBzbGlkZUluZGV4ID0gTWF0aC5mbG9vciggKCBldmVudC5jbGllbnRYIC8gZG9tLndyYXBwZXIub2Zmc2V0V2lkdGggKSAqIHNsaWRlc1RvdGFsICk7XG5cblx0XHRpZiggY29uZmlnLnJ0bCApIHtcblx0XHRcdHNsaWRlSW5kZXggPSBzbGlkZXNUb3RhbCAtIHNsaWRlSW5kZXg7XG5cdFx0fVxuXG5cdFx0c2xpZGUoIHNsaWRlSW5kZXggKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIEV2ZW50IGhhbmRsZXIgZm9yIG5hdmlnYXRpb24gY29udHJvbCBidXR0b25zLlxuXHQgKi9cblx0ZnVuY3Rpb24gb25OYXZpZ2F0ZUxlZnRDbGlja2VkKCBldmVudCApIHsgZXZlbnQucHJldmVudERlZmF1bHQoKTsgb25Vc2VySW5wdXQoKTsgbmF2aWdhdGVMZWZ0KCk7IH1cblx0ZnVuY3Rpb24gb25OYXZpZ2F0ZVJpZ2h0Q2xpY2tlZCggZXZlbnQgKSB7IGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IG9uVXNlcklucHV0KCk7IG5hdmlnYXRlUmlnaHQoKTsgfVxuXHRmdW5jdGlvbiBvbk5hdmlnYXRlVXBDbGlja2VkKCBldmVudCApIHsgZXZlbnQucHJldmVudERlZmF1bHQoKTsgb25Vc2VySW5wdXQoKTsgbmF2aWdhdGVVcCgpOyB9XG5cdGZ1bmN0aW9uIG9uTmF2aWdhdGVEb3duQ2xpY2tlZCggZXZlbnQgKSB7IGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IG9uVXNlcklucHV0KCk7IG5hdmlnYXRlRG93bigpOyB9XG5cdGZ1bmN0aW9uIG9uTmF2aWdhdGVQcmV2Q2xpY2tlZCggZXZlbnQgKSB7IGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IG9uVXNlcklucHV0KCk7IG5hdmlnYXRlUHJldigpOyB9XG5cdGZ1bmN0aW9uIG9uTmF2aWdhdGVOZXh0Q2xpY2tlZCggZXZlbnQgKSB7IGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IG9uVXNlcklucHV0KCk7IG5hdmlnYXRlTmV4dCgpOyB9XG5cblx0LyoqXG5cdCAqIEhhbmRsZXIgZm9yIHRoZSB3aW5kb3cgbGV2ZWwgJ2hhc2hjaGFuZ2UnIGV2ZW50LlxuXHQgKlxuXHQgKiBAcGFyYW0ge29iamVjdH0gW2V2ZW50XVxuXHQgKi9cblx0ZnVuY3Rpb24gb25XaW5kb3dIYXNoQ2hhbmdlKCBldmVudCApIHtcblxuXHRcdHJlYWRVUkwoKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIEhhbmRsZXIgZm9yIHRoZSB3aW5kb3cgbGV2ZWwgJ3Jlc2l6ZScgZXZlbnQuXG5cdCAqXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBbZXZlbnRdXG5cdCAqL1xuXHRmdW5jdGlvbiBvbldpbmRvd1Jlc2l6ZSggZXZlbnQgKSB7XG5cblx0XHRsYXlvdXQoKTtcblxuXHR9XG5cblx0LyoqXG5cdCAqIEhhbmRsZSBmb3IgdGhlIHdpbmRvdyBsZXZlbCAndmlzaWJpbGl0eWNoYW5nZScgZXZlbnQuXG5cdCAqXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBbZXZlbnRdXG5cdCAqL1xuXHRmdW5jdGlvbiBvblBhZ2VWaXNpYmlsaXR5Q2hhbmdlKCBldmVudCApIHtcblxuXHRcdHZhciBpc0hpZGRlbiA9ICBkb2N1bWVudC53ZWJraXRIaWRkZW4gfHxcblx0XHRcdFx0XHRcdGRvY3VtZW50Lm1zSGlkZGVuIHx8XG5cdFx0XHRcdFx0XHRkb2N1bWVudC5oaWRkZW47XG5cblx0XHQvLyBJZiwgYWZ0ZXIgY2xpY2tpbmcgYSBsaW5rIG9yIHNpbWlsYXIgYW5kIHdlJ3JlIGNvbWluZyBiYWNrLFxuXHRcdC8vIGZvY3VzIHRoZSBkb2N1bWVudC5ib2R5IHRvIGVuc3VyZSB3ZSBjYW4gdXNlIGtleWJvYXJkIHNob3J0Y3V0c1xuXHRcdGlmKCBpc0hpZGRlbiA9PT0gZmFsc2UgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPT0gZG9jdW1lbnQuYm9keSApIHtcblx0XHRcdC8vIE5vdCBhbGwgZWxlbWVudHMgc3VwcG9ydCAuYmx1cigpIC0gU1ZHcyBhbW9uZyB0aGVtLlxuXHRcdFx0aWYoIHR5cGVvZiBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmJsdXIgPT09ICdmdW5jdGlvbicgKSB7XG5cdFx0XHRcdGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuYmx1cigpO1xuXHRcdFx0fVxuXHRcdFx0ZG9jdW1lbnQuYm9keS5mb2N1cygpO1xuXHRcdH1cblxuXHR9XG5cblx0LyoqXG5cdCAqIEludm9rZWQgd2hlbiBhIHNsaWRlIGlzIGFuZCB3ZSdyZSBpbiB0aGUgb3ZlcnZpZXcuXG5cdCAqXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBldmVudFxuXHQgKi9cblx0ZnVuY3Rpb24gb25PdmVydmlld1NsaWRlQ2xpY2tlZCggZXZlbnQgKSB7XG5cblx0XHQvLyBUT0RPIFRoZXJlJ3MgYSBidWcgaGVyZSB3aGVyZSB0aGUgZXZlbnQgbGlzdGVuZXJzIGFyZSBub3Rcblx0XHQvLyByZW1vdmVkIGFmdGVyIGRlYWN0aXZhdGluZyB0aGUgb3ZlcnZpZXcuXG5cdFx0aWYoIGV2ZW50c0FyZUJvdW5kICYmIGlzT3ZlcnZpZXcoKSApIHtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdHZhciBlbGVtZW50ID0gZXZlbnQudGFyZ2V0O1xuXG5cdFx0XHR3aGlsZSggZWxlbWVudCAmJiAhZWxlbWVudC5ub2RlTmFtZS5tYXRjaCggL3NlY3Rpb24vZ2kgKSApIHtcblx0XHRcdFx0ZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZTtcblx0XHRcdH1cblxuXHRcdFx0aWYoIGVsZW1lbnQgJiYgIWVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCAnZGlzYWJsZWQnICkgKSB7XG5cblx0XHRcdFx0ZGVhY3RpdmF0ZU92ZXJ2aWV3KCk7XG5cblx0XHRcdFx0aWYoIGVsZW1lbnQubm9kZU5hbWUubWF0Y2goIC9zZWN0aW9uL2dpICkgKSB7XG5cdFx0XHRcdFx0dmFyIGggPSBwYXJzZUludCggZWxlbWVudC5nZXRBdHRyaWJ1dGUoICdkYXRhLWluZGV4LWgnICksIDEwICksXG5cdFx0XHRcdFx0XHR2ID0gcGFyc2VJbnQoIGVsZW1lbnQuZ2V0QXR0cmlidXRlKCAnZGF0YS1pbmRleC12JyApLCAxMCApO1xuXG5cdFx0XHRcdFx0c2xpZGUoIGgsIHYgKTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogSGFuZGxlcyBjbGlja3Mgb24gbGlua3MgdGhhdCBhcmUgc2V0IHRvIHByZXZpZXcgaW4gdGhlXG5cdCAqIGlmcmFtZSBvdmVybGF5LlxuXHQgKlxuXHQgKiBAcGFyYW0ge29iamVjdH0gZXZlbnRcblx0ICovXG5cdGZ1bmN0aW9uIG9uUHJldmlld0xpbmtDbGlja2VkKCBldmVudCApIHtcblxuXHRcdGlmKCBldmVudC5jdXJyZW50VGFyZ2V0ICYmIGV2ZW50LmN1cnJlbnRUYXJnZXQuaGFzQXR0cmlidXRlKCAnaHJlZicgKSApIHtcblx0XHRcdHZhciB1cmwgPSBldmVudC5jdXJyZW50VGFyZ2V0LmdldEF0dHJpYnV0ZSggJ2hyZWYnICk7XG5cdFx0XHRpZiggdXJsICkge1xuXHRcdFx0XHRzaG93UHJldmlldyggdXJsICk7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdH1cblxuXHQvKipcblx0ICogSGFuZGxlcyBjbGljayBvbiB0aGUgYXV0by1zbGlkaW5nIGNvbnRyb2xzIGVsZW1lbnQuXG5cdCAqXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBbZXZlbnRdXG5cdCAqL1xuXHRmdW5jdGlvbiBvbkF1dG9TbGlkZVBsYXllckNsaWNrKCBldmVudCApIHtcblxuXHRcdC8vIFJlcGxheVxuXHRcdGlmKCBSZXZlYWwuaXNMYXN0U2xpZGUoKSAmJiBjb25maWcubG9vcCA9PT0gZmFsc2UgKSB7XG5cdFx0XHRzbGlkZSggMCwgMCApO1xuXHRcdFx0cmVzdW1lQXV0b1NsaWRlKCk7XG5cdFx0fVxuXHRcdC8vIFJlc3VtZVxuXHRcdGVsc2UgaWYoIGF1dG9TbGlkZVBhdXNlZCApIHtcblx0XHRcdHJlc3VtZUF1dG9TbGlkZSgpO1xuXHRcdH1cblx0XHQvLyBQYXVzZVxuXHRcdGVsc2Uge1xuXHRcdFx0cGF1c2VBdXRvU2xpZGUoKTtcblx0XHR9XG5cblx0fVxuXG5cblx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gUExBWUJBQ0sgQ09NUE9ORU5UIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cblxuXG5cdC8qKlxuXHQgKiBDb25zdHJ1Y3RvciBmb3IgdGhlIHBsYXliYWNrIGNvbXBvbmVudCwgd2hpY2ggZGlzcGxheXNcblx0ICogcGxheS9wYXVzZS9wcm9ncmVzcyBjb250cm9scy5cblx0ICpcblx0ICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY29udGFpbmVyIFRoZSBjb21wb25lbnQgd2lsbCBhcHBlbmRcblx0ICogaXRzZWxmIHRvIHRoaXNcblx0ICogQHBhcmFtIHtmdW5jdGlvbn0gcHJvZ3Jlc3NDaGVjayBBIG1ldGhvZCB3aGljaCB3aWxsIGJlXG5cdCAqIGNhbGxlZCBmcmVxdWVudGx5IHRvIGdldCB0aGUgY3VycmVudCBwcm9ncmVzcyBvbiBhIHJhbmdlXG5cdCAqIG9mIDAtMVxuXHQgKi9cblx0ZnVuY3Rpb24gUGxheWJhY2soIGNvbnRhaW5lciwgcHJvZ3Jlc3NDaGVjayApIHtcblxuXHRcdC8vIENvc21ldGljc1xuXHRcdHRoaXMuZGlhbWV0ZXIgPSAxMDA7XG5cdFx0dGhpcy5kaWFtZXRlcjIgPSB0aGlzLmRpYW1ldGVyLzI7XG5cdFx0dGhpcy50aGlja25lc3MgPSA2O1xuXG5cdFx0Ly8gRmxhZ3MgaWYgd2UgYXJlIGN1cnJlbnRseSBwbGF5aW5nXG5cdFx0dGhpcy5wbGF5aW5nID0gZmFsc2U7XG5cblx0XHQvLyBDdXJyZW50IHByb2dyZXNzIG9uIGEgMC0xIHJhbmdlXG5cdFx0dGhpcy5wcm9ncmVzcyA9IDA7XG5cblx0XHQvLyBVc2VkIHRvIGxvb3AgdGhlIGFuaW1hdGlvbiBzbW9vdGhseVxuXHRcdHRoaXMucHJvZ3Jlc3NPZmZzZXQgPSAxO1xuXG5cdFx0dGhpcy5jb250YWluZXIgPSBjb250YWluZXI7XG5cdFx0dGhpcy5wcm9ncmVzc0NoZWNrID0gcHJvZ3Jlc3NDaGVjaztcblxuXHRcdHRoaXMuY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2NhbnZhcycgKTtcblx0XHR0aGlzLmNhbnZhcy5jbGFzc05hbWUgPSAncGxheWJhY2snO1xuXHRcdHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy5kaWFtZXRlcjtcblx0XHR0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLmRpYW1ldGVyO1xuXHRcdHRoaXMuY2FudmFzLnN0eWxlLndpZHRoID0gdGhpcy5kaWFtZXRlcjIgKyAncHgnO1xuXHRcdHRoaXMuY2FudmFzLnN0eWxlLmhlaWdodCA9IHRoaXMuZGlhbWV0ZXIyICsgJ3B4Jztcblx0XHR0aGlzLmNvbnRleHQgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCAnMmQnICk7XG5cblx0XHR0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCggdGhpcy5jYW52YXMgKTtcblxuXHRcdHRoaXMucmVuZGVyKCk7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBAcGFyYW0gdmFsdWVcblx0ICovXG5cdFBsYXliYWNrLnByb3RvdHlwZS5zZXRQbGF5aW5nID0gZnVuY3Rpb24oIHZhbHVlICkge1xuXG5cdFx0dmFyIHdhc1BsYXlpbmcgPSB0aGlzLnBsYXlpbmc7XG5cblx0XHR0aGlzLnBsYXlpbmcgPSB2YWx1ZTtcblxuXHRcdC8vIFN0YXJ0IHJlcGFpbnRpbmcgaWYgd2Ugd2VyZW4ndCBhbHJlYWR5XG5cdFx0aWYoICF3YXNQbGF5aW5nICYmIHRoaXMucGxheWluZyApIHtcblx0XHRcdHRoaXMuYW5pbWF0ZSgpO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdHRoaXMucmVuZGVyKCk7XG5cdFx0fVxuXG5cdH07XG5cblx0UGxheWJhY2sucHJvdG90eXBlLmFuaW1hdGUgPSBmdW5jdGlvbigpIHtcblxuXHRcdHZhciBwcm9ncmVzc0JlZm9yZSA9IHRoaXMucHJvZ3Jlc3M7XG5cblx0XHR0aGlzLnByb2dyZXNzID0gdGhpcy5wcm9ncmVzc0NoZWNrKCk7XG5cblx0XHQvLyBXaGVuIHdlIGxvb3AsIG9mZnNldCB0aGUgcHJvZ3Jlc3Mgc28gdGhhdCBpdCBlYXNlc1xuXHRcdC8vIHNtb290aGx5IHJhdGhlciB0aGFuIGltbWVkaWF0ZWx5IHJlc2V0dGluZ1xuXHRcdGlmKCBwcm9ncmVzc0JlZm9yZSA+IDAuOCAmJiB0aGlzLnByb2dyZXNzIDwgMC4yICkge1xuXHRcdFx0dGhpcy5wcm9ncmVzc09mZnNldCA9IHRoaXMucHJvZ3Jlc3M7XG5cdFx0fVxuXG5cdFx0dGhpcy5yZW5kZXIoKTtcblxuXHRcdGlmKCB0aGlzLnBsYXlpbmcgKSB7XG5cdFx0XHRmZWF0dXJlcy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWVNZXRob2QuY2FsbCggd2luZG93LCB0aGlzLmFuaW1hdGUuYmluZCggdGhpcyApICk7XG5cdFx0fVxuXG5cdH07XG5cblx0LyoqXG5cdCAqIFJlbmRlcnMgdGhlIGN1cnJlbnQgcHJvZ3Jlc3MgYW5kIHBsYXliYWNrIHN0YXRlLlxuXHQgKi9cblx0UGxheWJhY2sucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0dmFyIHByb2dyZXNzID0gdGhpcy5wbGF5aW5nID8gdGhpcy5wcm9ncmVzcyA6IDAsXG5cdFx0XHRyYWRpdXMgPSAoIHRoaXMuZGlhbWV0ZXIyICkgLSB0aGlzLnRoaWNrbmVzcyxcblx0XHRcdHggPSB0aGlzLmRpYW1ldGVyMixcblx0XHRcdHkgPSB0aGlzLmRpYW1ldGVyMixcblx0XHRcdGljb25TaXplID0gMjg7XG5cblx0XHQvLyBFYXNlIHRvd2FyZHMgMVxuXHRcdHRoaXMucHJvZ3Jlc3NPZmZzZXQgKz0gKCAxIC0gdGhpcy5wcm9ncmVzc09mZnNldCApICogMC4xO1xuXG5cdFx0dmFyIGVuZEFuZ2xlID0gKCAtIE1hdGguUEkgLyAyICkgKyAoIHByb2dyZXNzICogKCBNYXRoLlBJICogMiApICk7XG5cdFx0dmFyIHN0YXJ0QW5nbGUgPSAoIC0gTWF0aC5QSSAvIDIgKSArICggdGhpcy5wcm9ncmVzc09mZnNldCAqICggTWF0aC5QSSAqIDIgKSApO1xuXG5cdFx0dGhpcy5jb250ZXh0LnNhdmUoKTtcblx0XHR0aGlzLmNvbnRleHQuY2xlYXJSZWN0KCAwLCAwLCB0aGlzLmRpYW1ldGVyLCB0aGlzLmRpYW1ldGVyICk7XG5cblx0XHQvLyBTb2xpZCBiYWNrZ3JvdW5kIGNvbG9yXG5cdFx0dGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuXHRcdHRoaXMuY29udGV4dC5hcmMoIHgsIHksIHJhZGl1cyArIDQsIDAsIE1hdGguUEkgKiAyLCBmYWxzZSApO1xuXHRcdHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSAncmdiYSggMCwgMCwgMCwgMC40ICknO1xuXHRcdHRoaXMuY29udGV4dC5maWxsKCk7XG5cblx0XHQvLyBEcmF3IHByb2dyZXNzIHRyYWNrXG5cdFx0dGhpcy5jb250ZXh0LmJlZ2luUGF0aCgpO1xuXHRcdHRoaXMuY29udGV4dC5hcmMoIHgsIHksIHJhZGl1cywgMCwgTWF0aC5QSSAqIDIsIGZhbHNlICk7XG5cdFx0dGhpcy5jb250ZXh0LmxpbmVXaWR0aCA9IHRoaXMudGhpY2tuZXNzO1xuXHRcdHRoaXMuY29udGV4dC5zdHJva2VTdHlsZSA9ICcjNjY2Jztcblx0XHR0aGlzLmNvbnRleHQuc3Ryb2tlKCk7XG5cblx0XHRpZiggdGhpcy5wbGF5aW5nICkge1xuXHRcdFx0Ly8gRHJhdyBwcm9ncmVzcyBvbiB0b3Agb2YgdHJhY2tcblx0XHRcdHRoaXMuY29udGV4dC5iZWdpblBhdGgoKTtcblx0XHRcdHRoaXMuY29udGV4dC5hcmMoIHgsIHksIHJhZGl1cywgc3RhcnRBbmdsZSwgZW5kQW5nbGUsIGZhbHNlICk7XG5cdFx0XHR0aGlzLmNvbnRleHQubGluZVdpZHRoID0gdGhpcy50aGlja25lc3M7XG5cdFx0XHR0aGlzLmNvbnRleHQuc3Ryb2tlU3R5bGUgPSAnI2ZmZic7XG5cdFx0XHR0aGlzLmNvbnRleHQuc3Ryb2tlKCk7XG5cdFx0fVxuXG5cdFx0dGhpcy5jb250ZXh0LnRyYW5zbGF0ZSggeCAtICggaWNvblNpemUgLyAyICksIHkgLSAoIGljb25TaXplIC8gMiApICk7XG5cblx0XHQvLyBEcmF3IHBsYXkvcGF1c2UgaWNvbnNcblx0XHRpZiggdGhpcy5wbGF5aW5nICkge1xuXHRcdFx0dGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9ICcjZmZmJztcblx0XHRcdHRoaXMuY29udGV4dC5maWxsUmVjdCggMCwgMCwgaWNvblNpemUgLyAyIC0gNCwgaWNvblNpemUgKTtcblx0XHRcdHRoaXMuY29udGV4dC5maWxsUmVjdCggaWNvblNpemUgLyAyICsgNCwgMCwgaWNvblNpemUgLyAyIC0gNCwgaWNvblNpemUgKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHR0aGlzLmNvbnRleHQuYmVnaW5QYXRoKCk7XG5cdFx0XHR0aGlzLmNvbnRleHQudHJhbnNsYXRlKCA0LCAwICk7XG5cdFx0XHR0aGlzLmNvbnRleHQubW92ZVRvKCAwLCAwICk7XG5cdFx0XHR0aGlzLmNvbnRleHQubGluZVRvKCBpY29uU2l6ZSAtIDQsIGljb25TaXplIC8gMiApO1xuXHRcdFx0dGhpcy5jb250ZXh0LmxpbmVUbyggMCwgaWNvblNpemUgKTtcblx0XHRcdHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSAnI2ZmZic7XG5cdFx0XHR0aGlzLmNvbnRleHQuZmlsbCgpO1xuXHRcdH1cblxuXHRcdHRoaXMuY29udGV4dC5yZXN0b3JlKCk7XG5cblx0fTtcblxuXHRQbGF5YmFjay5wcm90b3R5cGUub24gPSBmdW5jdGlvbiggdHlwZSwgbGlzdGVuZXIgKSB7XG5cdFx0dGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lciggdHlwZSwgbGlzdGVuZXIsIGZhbHNlICk7XG5cdH07XG5cblx0UGxheWJhY2sucHJvdG90eXBlLm9mZiA9IGZ1bmN0aW9uKCB0eXBlLCBsaXN0ZW5lciApIHtcblx0XHR0aGlzLmNhbnZhcy5yZW1vdmVFdmVudExpc3RlbmVyKCB0eXBlLCBsaXN0ZW5lciwgZmFsc2UgKTtcblx0fTtcblxuXHRQbGF5YmFjay5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0dGhpcy5wbGF5aW5nID0gZmFsc2U7XG5cblx0XHRpZiggdGhpcy5jYW52YXMucGFyZW50Tm9kZSApIHtcblx0XHRcdHRoaXMuY29udGFpbmVyLnJlbW92ZUNoaWxkKCB0aGlzLmNhbnZhcyApO1xuXHRcdH1cblxuXHR9O1xuXG5cblx0Ly8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuXHQvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIEFQSSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG5cdC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cblxuXG5cdFJldmVhbCA9IHtcblx0XHRWRVJTSU9OOiBWRVJTSU9OLFxuXG5cdFx0aW5pdGlhbGl6ZTogaW5pdGlhbGl6ZSxcblx0XHRjb25maWd1cmU6IGNvbmZpZ3VyZSxcblx0XHRzeW5jOiBzeW5jLFxuXG5cdFx0Ly8gTmF2aWdhdGlvbiBtZXRob2RzXG5cdFx0c2xpZGU6IHNsaWRlLFxuXHRcdGxlZnQ6IG5hdmlnYXRlTGVmdCxcblx0XHRyaWdodDogbmF2aWdhdGVSaWdodCxcblx0XHR1cDogbmF2aWdhdGVVcCxcblx0XHRkb3duOiBuYXZpZ2F0ZURvd24sXG5cdFx0cHJldjogbmF2aWdhdGVQcmV2LFxuXHRcdG5leHQ6IG5hdmlnYXRlTmV4dCxcblxuXHRcdC8vIEZyYWdtZW50IG1ldGhvZHNcblx0XHRuYXZpZ2F0ZUZyYWdtZW50OiBuYXZpZ2F0ZUZyYWdtZW50LFxuXHRcdHByZXZGcmFnbWVudDogcHJldmlvdXNGcmFnbWVudCxcblx0XHRuZXh0RnJhZ21lbnQ6IG5leHRGcmFnbWVudCxcblxuXHRcdC8vIERlcHJlY2F0ZWQgYWxpYXNlc1xuXHRcdG5hdmlnYXRlVG86IHNsaWRlLFxuXHRcdG5hdmlnYXRlTGVmdDogbmF2aWdhdGVMZWZ0LFxuXHRcdG5hdmlnYXRlUmlnaHQ6IG5hdmlnYXRlUmlnaHQsXG5cdFx0bmF2aWdhdGVVcDogbmF2aWdhdGVVcCxcblx0XHRuYXZpZ2F0ZURvd246IG5hdmlnYXRlRG93bixcblx0XHRuYXZpZ2F0ZVByZXY6IG5hdmlnYXRlUHJldixcblx0XHRuYXZpZ2F0ZU5leHQ6IG5hdmlnYXRlTmV4dCxcblxuXHRcdC8vIFNob3dzIGEgaGVscCBvdmVybGF5IHdpdGgga2V5Ym9hcmQgc2hvcnRjdXRzXG5cdFx0c2hvd0hlbHA6IHNob3dIZWxwLFxuXG5cdFx0Ly8gRm9yY2VzIGFuIHVwZGF0ZSBpbiBzbGlkZSBsYXlvdXRcblx0XHRsYXlvdXQ6IGxheW91dCxcblxuXHRcdC8vIFJhbmRvbWl6ZXMgdGhlIG9yZGVyIG9mIHNsaWRlc1xuXHRcdHNodWZmbGU6IHNodWZmbGUsXG5cblx0XHQvLyBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIHRoZSBhdmFpbGFibGUgcm91dGVzIGFzIGJvb2xlYW5zIChsZWZ0L3JpZ2h0L3RvcC9ib3R0b20pXG5cdFx0YXZhaWxhYmxlUm91dGVzOiBhdmFpbGFibGVSb3V0ZXMsXG5cblx0XHQvLyBSZXR1cm5zIGFuIG9iamVjdCB3aXRoIHRoZSBhdmFpbGFibGUgZnJhZ21lbnRzIGFzIGJvb2xlYW5zIChwcmV2L25leHQpXG5cdFx0YXZhaWxhYmxlRnJhZ21lbnRzOiBhdmFpbGFibGVGcmFnbWVudHMsXG5cblx0XHQvLyBUb2dnbGVzIHRoZSBvdmVydmlldyBtb2RlIG9uL29mZlxuXHRcdHRvZ2dsZU92ZXJ2aWV3OiB0b2dnbGVPdmVydmlldyxcblxuXHRcdC8vIFRvZ2dsZXMgdGhlIFwiYmxhY2sgc2NyZWVuXCIgbW9kZSBvbi9vZmZcblx0XHR0b2dnbGVQYXVzZTogdG9nZ2xlUGF1c2UsXG5cblx0XHQvLyBUb2dnbGVzIHRoZSBhdXRvIHNsaWRlIG1vZGUgb24vb2ZmXG5cdFx0dG9nZ2xlQXV0b1NsaWRlOiB0b2dnbGVBdXRvU2xpZGUsXG5cblx0XHQvLyBTdGF0ZSBjaGVja3Ncblx0XHRpc092ZXJ2aWV3OiBpc092ZXJ2aWV3LFxuXHRcdGlzUGF1c2VkOiBpc1BhdXNlZCxcblx0XHRpc0F1dG9TbGlkaW5nOiBpc0F1dG9TbGlkaW5nLFxuXG5cdFx0Ly8gQWRkcyBvciByZW1vdmVzIGFsbCBpbnRlcm5hbCBldmVudCBsaXN0ZW5lcnMgKHN1Y2ggYXMga2V5Ym9hcmQpXG5cdFx0YWRkRXZlbnRMaXN0ZW5lcnM6IGFkZEV2ZW50TGlzdGVuZXJzLFxuXHRcdHJlbW92ZUV2ZW50TGlzdGVuZXJzOiByZW1vdmVFdmVudExpc3RlbmVycyxcblxuXHRcdC8vIEZhY2lsaXR5IGZvciBwZXJzaXN0aW5nIGFuZCByZXN0b3JpbmcgdGhlIHByZXNlbnRhdGlvbiBzdGF0ZVxuXHRcdGdldFN0YXRlOiBnZXRTdGF0ZSxcblx0XHRzZXRTdGF0ZTogc2V0U3RhdGUsXG5cblx0XHQvLyBQcmVzZW50YXRpb24gcHJvZ3Jlc3Mgb24gcmFuZ2Ugb2YgMC0xXG5cdFx0Z2V0UHJvZ3Jlc3M6IGdldFByb2dyZXNzLFxuXG5cdFx0Ly8gUmV0dXJucyB0aGUgaW5kaWNlcyBvZiB0aGUgY3VycmVudCwgb3Igc3BlY2lmaWVkLCBzbGlkZVxuXHRcdGdldEluZGljZXM6IGdldEluZGljZXMsXG5cblx0XHRnZXRUb3RhbFNsaWRlczogZ2V0VG90YWxTbGlkZXMsXG5cblx0XHQvLyBSZXR1cm5zIHRoZSBzbGlkZSBlbGVtZW50IGF0IHRoZSBzcGVjaWZpZWQgaW5kZXhcblx0XHRnZXRTbGlkZTogZ2V0U2xpZGUsXG5cblx0XHQvLyBSZXR1cm5zIHRoZSBzbGlkZSBiYWNrZ3JvdW5kIGVsZW1lbnQgYXQgdGhlIHNwZWNpZmllZCBpbmRleFxuXHRcdGdldFNsaWRlQmFja2dyb3VuZDogZ2V0U2xpZGVCYWNrZ3JvdW5kLFxuXG5cdFx0Ly8gUmV0dXJucyB0aGUgc3BlYWtlciBub3RlcyBzdHJpbmcgZm9yIGEgc2xpZGUsIG9yIG51bGxcblx0XHRnZXRTbGlkZU5vdGVzOiBnZXRTbGlkZU5vdGVzLFxuXG5cdFx0Ly8gUmV0dXJucyB0aGUgcHJldmlvdXMgc2xpZGUgZWxlbWVudCwgbWF5IGJlIG51bGxcblx0XHRnZXRQcmV2aW91c1NsaWRlOiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiBwcmV2aW91c1NsaWRlO1xuXHRcdH0sXG5cblx0XHQvLyBSZXR1cm5zIHRoZSBjdXJyZW50IHNsaWRlIGVsZW1lbnRcblx0XHRnZXRDdXJyZW50U2xpZGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGN1cnJlbnRTbGlkZTtcblx0XHR9LFxuXG5cdFx0Ly8gUmV0dXJucyB0aGUgY3VycmVudCBzY2FsZSBvZiB0aGUgcHJlc2VudGF0aW9uIGNvbnRlbnRcblx0XHRnZXRTY2FsZTogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gc2NhbGU7XG5cdFx0fSxcblxuXHRcdC8vIFJldHVybnMgdGhlIGN1cnJlbnQgY29uZmlndXJhdGlvbiBvYmplY3Rcblx0XHRnZXRDb25maWc6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGNvbmZpZztcblx0XHR9LFxuXG5cdFx0Ly8gSGVscGVyIG1ldGhvZCwgcmV0cmlldmVzIHF1ZXJ5IHN0cmluZyBhcyBhIGtleS92YWx1ZSBoYXNoXG5cdFx0Z2V0UXVlcnlIYXNoOiBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBxdWVyeSA9IHt9O1xuXG5cdFx0XHRsb2NhdGlvbi5zZWFyY2gucmVwbGFjZSggL1tBLVowLTldKz89KFtcXHdcXC4lLV0qKS9naSwgZnVuY3Rpb24oYSkge1xuXHRcdFx0XHRxdWVyeVsgYS5zcGxpdCggJz0nICkuc2hpZnQoKSBdID0gYS5zcGxpdCggJz0nICkucG9wKCk7XG5cdFx0XHR9ICk7XG5cblx0XHRcdC8vIEJhc2ljIGRlc2VyaWFsaXphdGlvblxuXHRcdFx0Zm9yKCB2YXIgaSBpbiBxdWVyeSApIHtcblx0XHRcdFx0dmFyIHZhbHVlID0gcXVlcnlbIGkgXTtcblxuXHRcdFx0XHRxdWVyeVsgaSBdID0gZGVzZXJpYWxpemUoIHVuZXNjYXBlKCB2YWx1ZSApICk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBxdWVyeTtcblx0XHR9LFxuXG5cdFx0Ly8gUmV0dXJucyB0cnVlIGlmIHdlJ3JlIGN1cnJlbnRseSBvbiB0aGUgZmlyc3Qgc2xpZGVcblx0XHRpc0ZpcnN0U2xpZGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuICggaW5kZXhoID09PSAwICYmIGluZGV4diA9PT0gMCApO1xuXHRcdH0sXG5cblx0XHQvLyBSZXR1cm5zIHRydWUgaWYgd2UncmUgY3VycmVudGx5IG9uIHRoZSBsYXN0IHNsaWRlXG5cdFx0aXNMYXN0U2xpZGU6IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYoIGN1cnJlbnRTbGlkZSApIHtcblx0XHRcdFx0Ly8gRG9lcyB0aGlzIHNsaWRlIGhhcyBuZXh0IGEgc2libGluZz9cblx0XHRcdFx0aWYoIGN1cnJlbnRTbGlkZS5uZXh0RWxlbWVudFNpYmxpbmcgKSByZXR1cm4gZmFsc2U7XG5cblx0XHRcdFx0Ly8gSWYgaXQncyB2ZXJ0aWNhbCwgZG9lcyBpdHMgcGFyZW50IGhhdmUgYSBuZXh0IHNpYmxpbmc/XG5cdFx0XHRcdGlmKCBpc1ZlcnRpY2FsU2xpZGUoIGN1cnJlbnRTbGlkZSApICYmIGN1cnJlbnRTbGlkZS5wYXJlbnROb2RlLm5leHRFbGVtZW50U2libGluZyApIHJldHVybiBmYWxzZTtcblxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH0sXG5cblx0XHQvLyBDaGVja3MgaWYgcmV2ZWFsLmpzIGhhcyBiZWVuIGxvYWRlZCBhbmQgaXMgcmVhZHkgZm9yIHVzZVxuXHRcdGlzUmVhZHk6IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIGxvYWRlZDtcblx0XHR9LFxuXG5cdFx0Ly8gRm9yd2FyZCBldmVudCBiaW5kaW5nIHRvIHRoZSByZXZlYWwgRE9NIGVsZW1lbnRcblx0XHRhZGRFdmVudExpc3RlbmVyOiBmdW5jdGlvbiggdHlwZSwgbGlzdGVuZXIsIHVzZUNhcHR1cmUgKSB7XG5cdFx0XHRpZiggJ2FkZEV2ZW50TGlzdGVuZXInIGluIHdpbmRvdyApIHtcblx0XHRcdFx0KCBkb20ud3JhcHBlciB8fCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLnJldmVhbCcgKSApLmFkZEV2ZW50TGlzdGVuZXIoIHR5cGUsIGxpc3RlbmVyLCB1c2VDYXB0dXJlICk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRyZW1vdmVFdmVudExpc3RlbmVyOiBmdW5jdGlvbiggdHlwZSwgbGlzdGVuZXIsIHVzZUNhcHR1cmUgKSB7XG5cdFx0XHRpZiggJ2FkZEV2ZW50TGlzdGVuZXInIGluIHdpbmRvdyApIHtcblx0XHRcdFx0KCBkb20ud3JhcHBlciB8fCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCAnLnJldmVhbCcgKSApLnJlbW92ZUV2ZW50TGlzdGVuZXIoIHR5cGUsIGxpc3RlbmVyLCB1c2VDYXB0dXJlICk7XG5cdFx0XHR9XG5cdFx0fSxcblxuXHRcdC8vIFByb2dyYW1hdGljYWxseSB0cmlnZ2VycyBhIGtleWJvYXJkIGV2ZW50XG5cdFx0dHJpZ2dlcktleTogZnVuY3Rpb24oIGtleUNvZGUgKSB7XG5cdFx0XHRvbkRvY3VtZW50S2V5RG93biggeyBrZXlDb2RlOiBrZXlDb2RlIH0gKTtcblx0XHR9LFxuXG5cdFx0Ly8gUmVnaXN0ZXJzIGEgbmV3IHNob3J0Y3V0IHRvIGluY2x1ZGUgaW4gdGhlIGhlbHAgb3ZlcmxheVxuXHRcdHJlZ2lzdGVyS2V5Ym9hcmRTaG9ydGN1dDogZnVuY3Rpb24oIGtleSwgdmFsdWUgKSB7XG5cdFx0XHRrZXlib2FyZFNob3J0Y3V0c1trZXldID0gdmFsdWU7XG5cdFx0fVxuXHR9O1xuXG5cdHJldHVybiBSZXZlYWw7XG5cbn0pKTtcbiIsIi8qISBoZWFkLmNvcmUgLSB2MS4wLjIgKi9cbihmdW5jdGlvbihuLHQpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIobil7YVthLmxlbmd0aF09bn1mdW5jdGlvbiBrKG4pe3ZhciB0PW5ldyBSZWdFeHAoXCIgP1xcXFxiXCIrbitcIlxcXFxiXCIpO2MuY2xhc3NOYW1lPWMuY2xhc3NOYW1lLnJlcGxhY2UodCxcIlwiKX1mdW5jdGlvbiBwKG4sdCl7Zm9yKHZhciBpPTAscj1uLmxlbmd0aDtpPHI7aSsrKXQuY2FsbChuLG5baV0saSl9ZnVuY3Rpb24gdHQoKXt2YXIgdCxlLGYsbztjLmNsYXNzTmFtZT1jLmNsYXNzTmFtZS5yZXBsYWNlKC8gKHctfGVxLXxndC18Z3RlLXxsdC18bHRlLXxwb3J0cmFpdHxuby1wb3J0cmFpdHxsYW5kc2NhcGV8bm8tbGFuZHNjYXBlKVxcZCsvZyxcIlwiKTt0PW4uaW5uZXJXaWR0aHx8Yy5jbGllbnRXaWR0aDtlPW4ub3V0ZXJXaWR0aHx8bi5zY3JlZW4ud2lkdGg7dS5zY3JlZW4uaW5uZXJXaWR0aD10O3Uuc2NyZWVuLm91dGVyV2lkdGg9ZTtyKFwidy1cIit0KTtwKGkuc2NyZWVucyxmdW5jdGlvbihuKXt0Pm4/KGkuc2NyZWVuc0Nzcy5ndCYmcihcImd0LVwiK24pLGkuc2NyZWVuc0Nzcy5ndGUmJnIoXCJndGUtXCIrbikpOnQ8bj8oaS5zY3JlZW5zQ3NzLmx0JiZyKFwibHQtXCIrbiksaS5zY3JlZW5zQ3NzLmx0ZSYmcihcImx0ZS1cIituKSk6dD09PW4mJihpLnNjcmVlbnNDc3MubHRlJiZyKFwibHRlLVwiK24pLGkuc2NyZWVuc0Nzcy5lcSYmcihcImUtcVwiK24pLGkuc2NyZWVuc0Nzcy5ndGUmJnIoXCJndGUtXCIrbikpfSk7Zj1uLmlubmVySGVpZ2h0fHxjLmNsaWVudEhlaWdodDtvPW4ub3V0ZXJIZWlnaHR8fG4uc2NyZWVuLmhlaWdodDt1LnNjcmVlbi5pbm5lckhlaWdodD1mO3Uuc2NyZWVuLm91dGVySGVpZ2h0PW87dS5mZWF0dXJlKFwicG9ydHJhaXRcIixmPnQpO3UuZmVhdHVyZShcImxhbmRzY2FwZVwiLGY8dCl9ZnVuY3Rpb24gaXQoKXtuLmNsZWFyVGltZW91dChiKTtiPW4uc2V0VGltZW91dCh0dCw1MCl9dmFyIHk9bi5kb2N1bWVudCxydD1uLm5hdmlnYXRvcix1dD1uLmxvY2F0aW9uLGM9eS5kb2N1bWVudEVsZW1lbnQsYT1bXSxpPXtzY3JlZW5zOlsyNDAsMzIwLDQ4MCw2NDAsNzY4LDgwMCwxMDI0LDEyODAsMTQ0MCwxNjgwLDE5MjBdLHNjcmVlbnNDc3M6e2d0OiEwLGd0ZTohMSxsdDohMCxsdGU6ITEsZXE6ITF9LGJyb3dzZXJzOlt7aWU6e21pbjo2LG1heDoxMX19XSxicm93c2VyQ3NzOntndDohMCxndGU6ITEsbHQ6ITAsbHRlOiExLGVxOiEwfSxodG1sNTohMCxwYWdlOlwiLXBhZ2VcIixzZWN0aW9uOlwiLXNlY3Rpb25cIixoZWFkOlwiaGVhZFwifSx2LHUscyx3LG8saCxsLGQsZixnLG50LGUsYjtpZihuLmhlYWRfY29uZilmb3IodiBpbiBuLmhlYWRfY29uZiluLmhlYWRfY29uZlt2XSE9PXQmJihpW3ZdPW4uaGVhZF9jb25mW3ZdKTt1PW5baS5oZWFkXT1mdW5jdGlvbigpe3UucmVhZHkuYXBwbHkobnVsbCxhcmd1bWVudHMpfTt1LmZlYXR1cmU9ZnVuY3Rpb24obix0LGkpe3JldHVybiBuPyhPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodCk9PT1cIltvYmplY3QgRnVuY3Rpb25dXCImJih0PXQuY2FsbCgpKSxyKCh0P1wiXCI6XCJuby1cIikrbiksdVtuXT0hIXQsaXx8KGsoXCJuby1cIituKSxrKG4pLHUuZmVhdHVyZSgpKSx1KTooYy5jbGFzc05hbWUrPVwiIFwiK2Euam9pbihcIiBcIiksYT1bXSx1KX07dS5mZWF0dXJlKFwianNcIiwhMCk7cz1ydC51c2VyQWdlbnQudG9Mb3dlckNhc2UoKTt3PS9tb2JpbGV8YW5kcm9pZHxraW5kbGV8c2lsa3xtaWRwfHBob25lfCh3aW5kb3dzIC4rYXJtfHRvdWNoKS8udGVzdChzKTt1LmZlYXR1cmUoXCJtb2JpbGVcIix3LCEwKTt1LmZlYXR1cmUoXCJkZXNrdG9wXCIsIXcsITApO3M9LyhjaHJvbWV8ZmlyZWZveClbIFxcL10oW1xcdy5dKykvLmV4ZWMocyl8fC8oaXBob25lfGlwYWR8aXBvZCkoPzouKnZlcnNpb24pP1sgXFwvXShbXFx3Ll0rKS8uZXhlYyhzKXx8LyhhbmRyb2lkKSg/Oi4qdmVyc2lvbik/WyBcXC9dKFtcXHcuXSspLy5leGVjKHMpfHwvKHdlYmtpdHxvcGVyYSkoPzouKnZlcnNpb24pP1sgXFwvXShbXFx3Ll0rKS8uZXhlYyhzKXx8Lyhtc2llKSAoW1xcdy5dKykvLmV4ZWMocyl8fC8odHJpZGVudCkuK3J2OihcXHcuKSsvLmV4ZWMocyl8fFtdO289c1sxXTtoPXBhcnNlRmxvYXQoc1syXSk7c3dpdGNoKG8pe2Nhc2VcIm1zaWVcIjpjYXNlXCJ0cmlkZW50XCI6bz1cImllXCI7aD15LmRvY3VtZW50TW9kZXx8aDticmVhaztjYXNlXCJmaXJlZm94XCI6bz1cImZmXCI7YnJlYWs7Y2FzZVwiaXBvZFwiOmNhc2VcImlwYWRcIjpjYXNlXCJpcGhvbmVcIjpvPVwiaW9zXCI7YnJlYWs7Y2FzZVwid2Via2l0XCI6bz1cInNhZmFyaVwifWZvcih1LmJyb3dzZXI9e25hbWU6byx2ZXJzaW9uOmh9LHUuYnJvd3NlcltvXT0hMCxsPTAsZD1pLmJyb3dzZXJzLmxlbmd0aDtsPGQ7bCsrKWZvcihmIGluIGkuYnJvd3NlcnNbbF0paWYobz09PWYpZm9yKHIoZiksZz1pLmJyb3dzZXJzW2xdW2ZdLm1pbixudD1pLmJyb3dzZXJzW2xdW2ZdLm1heCxlPWc7ZTw9bnQ7ZSsrKWg+ZT8oaS5icm93c2VyQ3NzLmd0JiZyKFwiZ3QtXCIrZitlKSxpLmJyb3dzZXJDc3MuZ3RlJiZyKFwiZ3RlLVwiK2YrZSkpOmg8ZT8oaS5icm93c2VyQ3NzLmx0JiZyKFwibHQtXCIrZitlKSxpLmJyb3dzZXJDc3MubHRlJiZyKFwibHRlLVwiK2YrZSkpOmg9PT1lJiYoaS5icm93c2VyQ3NzLmx0ZSYmcihcImx0ZS1cIitmK2UpLGkuYnJvd3NlckNzcy5lcSYmcihcImVxLVwiK2YrZSksaS5icm93c2VyQ3NzLmd0ZSYmcihcImd0ZS1cIitmK2UpKTtlbHNlIHIoXCJuby1cIitmKTtyKG8pO3IobytwYXJzZUludChoLDEwKSk7aS5odG1sNSYmbz09PVwiaWVcIiYmaDw5JiZwKFwiYWJicnxhcnRpY2xlfGFzaWRlfGF1ZGlvfGNhbnZhc3xkZXRhaWxzfGZpZ2NhcHRpb258ZmlndXJlfGZvb3RlcnxoZWFkZXJ8aGdyb3VwfG1haW58bWFya3xtZXRlcnxuYXZ8b3V0cHV0fHByb2dyZXNzfHNlY3Rpb258c3VtbWFyeXx0aW1lfHZpZGVvXCIuc3BsaXQoXCJ8XCIpLGZ1bmN0aW9uKG4pe3kuY3JlYXRlRWxlbWVudChuKX0pO3AodXQucGF0aG5hbWUuc3BsaXQoXCIvXCIpLGZ1bmN0aW9uKG4sdSl7aWYodGhpcy5sZW5ndGg+MiYmdGhpc1t1KzFdIT09dCl1JiZyKHRoaXMuc2xpY2UodSx1KzEpLmpvaW4oXCItXCIpLnRvTG93ZXJDYXNlKCkraS5zZWN0aW9uKTtlbHNle3ZhciBmPW58fFwiaW5kZXhcIixlPWYuaW5kZXhPZihcIi5cIik7ZT4wJiYoZj1mLnN1YnN0cmluZygwLGUpKTtjLmlkPWYudG9Mb3dlckNhc2UoKStpLnBhZ2U7dXx8cihcInJvb3RcIitpLnNlY3Rpb24pfX0pO3Uuc2NyZWVuPXtoZWlnaHQ6bi5zY3JlZW4uaGVpZ2h0LHdpZHRoOm4uc2NyZWVuLndpZHRofTt0dCgpO2I9MDtuLmFkZEV2ZW50TGlzdGVuZXI/bi5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsaXQsITEpOm4uYXR0YWNoRXZlbnQoXCJvbnJlc2l6ZVwiLGl0KX0pKHdpbmRvdyk7XG4vKiEgaGVhZC5jc3MzIC0gdjEuMC4wICovXG4oZnVuY3Rpb24obix0KXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBhKG4pe2Zvcih2YXIgciBpbiBuKWlmKGlbbltyXV0hPT10KXJldHVybiEwO3JldHVybiExfWZ1bmN0aW9uIHIobil7dmFyIHQ9bi5jaGFyQXQoMCkudG9VcHBlckNhc2UoKStuLnN1YnN0cigxKSxpPShuK1wiIFwiK2Muam9pbih0K1wiIFwiKSt0KS5zcGxpdChcIiBcIik7cmV0dXJuISFhKGkpfXZhciBoPW4uZG9jdW1lbnQsbz1oLmNyZWF0ZUVsZW1lbnQoXCJpXCIpLGk9by5zdHlsZSxzPVwiIC1vLSAtbW96LSAtbXMtIC13ZWJraXQtIC1raHRtbC0gXCIuc3BsaXQoXCIgXCIpLGM9XCJXZWJraXQgTW96IE8gbXMgS2h0bWxcIi5zcGxpdChcIiBcIiksbD1uLmhlYWRfY29uZiYmbi5oZWFkX2NvbmYuaGVhZHx8XCJoZWFkXCIsdT1uW2xdLGY9e2dyYWRpZW50OmZ1bmN0aW9uKCl7dmFyIG49XCJiYWNrZ3JvdW5kLWltYWdlOlwiO3JldHVybiBpLmNzc1RleHQ9KG4rcy5qb2luKFwiZ3JhZGllbnQobGluZWFyLGxlZnQgdG9wLHJpZ2h0IGJvdHRvbSxmcm9tKCM5ZjkpLHRvKCNmZmYpKTtcIituKStzLmpvaW4oXCJsaW5lYXItZ3JhZGllbnQobGVmdCB0b3AsI2VlZSwjZmZmKTtcIituKSkuc2xpY2UoMCwtbi5sZW5ndGgpLCEhaS5iYWNrZ3JvdW5kSW1hZ2V9LHJnYmE6ZnVuY3Rpb24oKXtyZXR1cm4gaS5jc3NUZXh0PVwiYmFja2dyb3VuZC1jb2xvcjpyZ2JhKDAsMCwwLDAuNSlcIiwhIWkuYmFja2dyb3VuZENvbG9yfSxvcGFjaXR5OmZ1bmN0aW9uKCl7cmV0dXJuIG8uc3R5bGUub3BhY2l0eT09PVwiXCJ9LHRleHRzaGFkb3c6ZnVuY3Rpb24oKXtyZXR1cm4gaS50ZXh0U2hhZG93PT09XCJcIn0sbXVsdGlwbGViZ3M6ZnVuY3Rpb24oKXtpLmNzc1RleHQ9XCJiYWNrZ3JvdW5kOnVybChodHRwczovLyksdXJsKGh0dHBzOi8vKSxyZWQgdXJsKGh0dHBzOi8vKVwiO3ZhciBuPShpLmJhY2tncm91bmR8fFwiXCIpLm1hdGNoKC91cmwvZyk7cmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChuKT09PVwiW29iamVjdCBBcnJheV1cIiYmbi5sZW5ndGg9PT0zfSxib3hzaGFkb3c6ZnVuY3Rpb24oKXtyZXR1cm4gcihcImJveFNoYWRvd1wiKX0sYm9yZGVyaW1hZ2U6ZnVuY3Rpb24oKXtyZXR1cm4gcihcImJvcmRlckltYWdlXCIpfSxib3JkZXJyYWRpdXM6ZnVuY3Rpb24oKXtyZXR1cm4gcihcImJvcmRlclJhZGl1c1wiKX0sY3NzcmVmbGVjdGlvbnM6ZnVuY3Rpb24oKXtyZXR1cm4gcihcImJveFJlZmxlY3RcIil9LGNzc3RyYW5zZm9ybXM6ZnVuY3Rpb24oKXtyZXR1cm4gcihcInRyYW5zZm9ybVwiKX0sY3NzdHJhbnNpdGlvbnM6ZnVuY3Rpb24oKXtyZXR1cm4gcihcInRyYW5zaXRpb25cIil9LHRvdWNoOmZ1bmN0aW9uKCl7cmV0dXJuXCJvbnRvdWNoc3RhcnRcImluIG59LHJldGluYTpmdW5jdGlvbigpe3JldHVybiBuLmRldmljZVBpeGVsUmF0aW8+MX0sZm9udGZhY2U6ZnVuY3Rpb24oKXt2YXIgdD11LmJyb3dzZXIubmFtZSxuPXUuYnJvd3Nlci52ZXJzaW9uO3N3aXRjaCh0KXtjYXNlXCJpZVwiOnJldHVybiBuPj05O2Nhc2VcImNocm9tZVwiOnJldHVybiBuPj0xMztjYXNlXCJmZlwiOnJldHVybiBuPj02O2Nhc2VcImlvc1wiOnJldHVybiBuPj01O2Nhc2VcImFuZHJvaWRcIjpyZXR1cm4hMTtjYXNlXCJ3ZWJraXRcIjpyZXR1cm4gbj49NS4xO2Nhc2VcIm9wZXJhXCI6cmV0dXJuIG4+PTEwO2RlZmF1bHQ6cmV0dXJuITF9fX07Zm9yKHZhciBlIGluIGYpZltlXSYmdS5mZWF0dXJlKGUsZltlXS5jYWxsKCksITApO3UuZmVhdHVyZSgpfSkod2luZG93KTtcbi8qISBoZWFkLmxvYWQgLSB2MS4wLjMgKi9cbihmdW5jdGlvbihuLHQpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHcoKXt9ZnVuY3Rpb24gdShuLHQpe2lmKG4pe3R5cGVvZiBuPT1cIm9iamVjdFwiJiYobj1bXS5zbGljZS5jYWxsKG4pKTtmb3IodmFyIGk9MCxyPW4ubGVuZ3RoO2k8cjtpKyspdC5jYWxsKG4sbltpXSxpKX19ZnVuY3Rpb24gaXQobixpKXt2YXIgcj1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoaSkuc2xpY2UoOCwtMSk7cmV0dXJuIGkhPT10JiZpIT09bnVsbCYmcj09PW59ZnVuY3Rpb24gcyhuKXtyZXR1cm4gaXQoXCJGdW5jdGlvblwiLG4pfWZ1bmN0aW9uIGEobil7cmV0dXJuIGl0KFwiQXJyYXlcIixuKX1mdW5jdGlvbiBldChuKXt2YXIgaT1uLnNwbGl0KFwiL1wiKSx0PWlbaS5sZW5ndGgtMV0scj10LmluZGV4T2YoXCI/XCIpO3JldHVybiByIT09LTE/dC5zdWJzdHJpbmcoMCxyKTp0fWZ1bmN0aW9uIGYobil7KG49bnx8dyxuLl9kb25lKXx8KG4oKSxuLl9kb25lPTEpfWZ1bmN0aW9uIG90KG4sdCxyLHUpe3ZhciBmPXR5cGVvZiBuPT1cIm9iamVjdFwiP246e3Rlc3Q6bixzdWNjZXNzOiF0PyExOmEodCk/dDpbdF0sZmFpbHVyZTohcj8hMTphKHIpP3I6W3JdLGNhbGxiYWNrOnV8fHd9LGU9ISFmLnRlc3Q7cmV0dXJuIGUmJiEhZi5zdWNjZXNzPyhmLnN1Y2Nlc3MucHVzaChmLmNhbGxiYWNrKSxpLmxvYWQuYXBwbHkobnVsbCxmLnN1Y2Nlc3MpKTplfHwhZi5mYWlsdXJlP3UoKTooZi5mYWlsdXJlLnB1c2goZi5jYWxsYmFjayksaS5sb2FkLmFwcGx5KG51bGwsZi5mYWlsdXJlKSksaX1mdW5jdGlvbiB2KG4pe3ZhciB0PXt9LGkscjtpZih0eXBlb2Ygbj09XCJvYmplY3RcIilmb3IoaSBpbiBuKSFuW2ldfHwodD17bmFtZTppLHVybDpuW2ldfSk7ZWxzZSB0PXtuYW1lOmV0KG4pLHVybDpufTtyZXR1cm4ocj1jW3QubmFtZV0sciYmci51cmw9PT10LnVybCk/cjooY1t0Lm5hbWVdPXQsdCl9ZnVuY3Rpb24geShuKXtuPW58fGM7Zm9yKHZhciB0IGluIG4paWYobi5oYXNPd25Qcm9wZXJ0eSh0KSYmblt0XS5zdGF0ZSE9PWwpcmV0dXJuITE7cmV0dXJuITB9ZnVuY3Rpb24gc3Qobil7bi5zdGF0ZT1mdDt1KG4ub25wcmVsb2FkLGZ1bmN0aW9uKG4pe24uY2FsbCgpfSl9ZnVuY3Rpb24gaHQobil7bi5zdGF0ZT09PXQmJihuLnN0YXRlPW50LG4ub25wcmVsb2FkPVtdLHJ0KHt1cmw6bi51cmwsdHlwZTpcImNhY2hlXCJ9LGZ1bmN0aW9uKCl7c3Qobil9KSl9ZnVuY3Rpb24gY3QoKXt2YXIgbj1hcmd1bWVudHMsdD1uW24ubGVuZ3RoLTFdLHI9W10uc2xpY2UuY2FsbChuLDEpLGY9clswXTtyZXR1cm4ocyh0KXx8KHQ9bnVsbCksYShuWzBdKSk/KG5bMF0ucHVzaCh0KSxpLmxvYWQuYXBwbHkobnVsbCxuWzBdKSxpKTooZj8odShyLGZ1bmN0aW9uKG4pe3Mobil8fCFufHxodCh2KG4pKX0pLGIodihuWzBdKSxzKGYpP2Y6ZnVuY3Rpb24oKXtpLmxvYWQuYXBwbHkobnVsbCxyKX0pKTpiKHYoblswXSkpLGkpfWZ1bmN0aW9uIGx0KCl7dmFyIG49YXJndW1lbnRzLHQ9bltuLmxlbmd0aC0xXSxyPXt9O3JldHVybihzKHQpfHwodD1udWxsKSxhKG5bMF0pKT8oblswXS5wdXNoKHQpLGkubG9hZC5hcHBseShudWxsLG5bMF0pLGkpOih1KG4sZnVuY3Rpb24obil7biE9PXQmJihuPXYobikscltuLm5hbWVdPW4pfSksdShuLGZ1bmN0aW9uKG4pe24hPT10JiYobj12KG4pLGIobixmdW5jdGlvbigpe3kocikmJmYodCl9KSl9KSxpKX1mdW5jdGlvbiBiKG4sdCl7aWYodD10fHx3LG4uc3RhdGU9PT1sKXt0KCk7cmV0dXJufWlmKG4uc3RhdGU9PT10dCl7aS5yZWFkeShuLm5hbWUsdCk7cmV0dXJufWlmKG4uc3RhdGU9PT1udCl7bi5vbnByZWxvYWQucHVzaChmdW5jdGlvbigpe2Iobix0KX0pO3JldHVybn1uLnN0YXRlPXR0O3J0KG4sZnVuY3Rpb24oKXtuLnN0YXRlPWw7dCgpO3UoaFtuLm5hbWVdLGZ1bmN0aW9uKG4pe2Yobil9KTtvJiZ5KCkmJnUoaC5BTEwsZnVuY3Rpb24obil7ZihuKX0pfSl9ZnVuY3Rpb24gYXQobil7bj1ufHxcIlwiO3ZhciB0PW4uc3BsaXQoXCI/XCIpWzBdLnNwbGl0KFwiLlwiKTtyZXR1cm4gdFt0Lmxlbmd0aC0xXS50b0xvd2VyQ2FzZSgpfWZ1bmN0aW9uIHJ0KHQsaSl7ZnVuY3Rpb24gZSh0KXt0PXR8fG4uZXZlbnQ7dS5vbmxvYWQ9dS5vbnJlYWR5c3RhdGVjaGFuZ2U9dS5vbmVycm9yPW51bGw7aSgpfWZ1bmN0aW9uIG8oZil7Zj1mfHxuLmV2ZW50OyhmLnR5cGU9PT1cImxvYWRcInx8L2xvYWRlZHxjb21wbGV0ZS8udGVzdCh1LnJlYWR5U3RhdGUpJiYoIXIuZG9jdW1lbnRNb2RlfHxyLmRvY3VtZW50TW9kZTw5KSkmJihuLmNsZWFyVGltZW91dCh0LmVycm9yVGltZW91dCksbi5jbGVhclRpbWVvdXQodC5jc3NUaW1lb3V0KSx1Lm9ubG9hZD11Lm9ucmVhZHlzdGF0ZWNoYW5nZT11Lm9uZXJyb3I9bnVsbCxpKCkpfWZ1bmN0aW9uIHMoKXtpZih0LnN0YXRlIT09bCYmdC5jc3NSZXRyaWVzPD0yMCl7Zm9yKHZhciBpPTAsZj1yLnN0eWxlU2hlZXRzLmxlbmd0aDtpPGY7aSsrKWlmKHIuc3R5bGVTaGVldHNbaV0uaHJlZj09PXUuaHJlZil7byh7dHlwZTpcImxvYWRcIn0pO3JldHVybn10LmNzc1JldHJpZXMrKzt0LmNzc1RpbWVvdXQ9bi5zZXRUaW1lb3V0KHMsMjUwKX19dmFyIHUsaCxmO2k9aXx8dztoPWF0KHQudXJsKTtoPT09XCJjc3NcIj8odT1yLmNyZWF0ZUVsZW1lbnQoXCJsaW5rXCIpLHUudHlwZT1cInRleHQvXCIrKHQudHlwZXx8XCJjc3NcIiksdS5yZWw9XCJzdHlsZXNoZWV0XCIsdS5ocmVmPXQudXJsLHQuY3NzUmV0cmllcz0wLHQuY3NzVGltZW91dD1uLnNldFRpbWVvdXQocyw1MDApKToodT1yLmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIiksdS50eXBlPVwidGV4dC9cIisodC50eXBlfHxcImphdmFzY3JpcHRcIiksdS5zcmM9dC51cmwpO3Uub25sb2FkPXUub25yZWFkeXN0YXRlY2hhbmdlPW87dS5vbmVycm9yPWU7dS5hc3luYz0hMTt1LmRlZmVyPSExO3QuZXJyb3JUaW1lb3V0PW4uc2V0VGltZW91dChmdW5jdGlvbigpe2Uoe3R5cGU6XCJ0aW1lb3V0XCJ9KX0sN2UzKTtmPXIuaGVhZHx8ci5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF07Zi5pbnNlcnRCZWZvcmUodSxmLmxhc3RDaGlsZCl9ZnVuY3Rpb24gdnQoKXtmb3IodmFyIHQsdT1yLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpLG49MCxmPXUubGVuZ3RoO248ZjtuKyspaWYodD11W25dLmdldEF0dHJpYnV0ZShcImRhdGEtaGVhZGpzLWxvYWRcIiksISF0KXtpLmxvYWQodCk7cmV0dXJufX1mdW5jdGlvbiB5dChuLHQpe3ZhciB2LHAsZTtyZXR1cm4gbj09PXI/KG8/Zih0KTpkLnB1c2godCksaSk6KHMobikmJih0PW4sbj1cIkFMTFwiKSxhKG4pKT8odj17fSx1KG4sZnVuY3Rpb24obil7dltuXT1jW25dO2kucmVhZHkobixmdW5jdGlvbigpe3kodikmJmYodCl9KX0pLGkpOnR5cGVvZiBuIT1cInN0cmluZ1wifHwhcyh0KT9pOihwPWNbbl0scCYmcC5zdGF0ZT09PWx8fG49PT1cIkFMTFwiJiZ5KCkmJm8pPyhmKHQpLGkpOihlPWhbbl0sZT9lLnB1c2godCk6ZT1oW25dPVt0XSxpKX1mdW5jdGlvbiBlKCl7aWYoIXIuYm9keSl7bi5jbGVhclRpbWVvdXQoaS5yZWFkeVRpbWVvdXQpO2kucmVhZHlUaW1lb3V0PW4uc2V0VGltZW91dChlLDUwKTtyZXR1cm59b3x8KG89ITAsdnQoKSx1KGQsZnVuY3Rpb24obil7ZihuKX0pKX1mdW5jdGlvbiBrKCl7ci5hZGRFdmVudExpc3RlbmVyPyhyLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsaywhMSksZSgpKTpyLnJlYWR5U3RhdGU9PT1cImNvbXBsZXRlXCImJihyLmRldGFjaEV2ZW50KFwib25yZWFkeXN0YXRlY2hhbmdlXCIsayksZSgpKX12YXIgcj1uLmRvY3VtZW50LGQ9W10saD17fSxjPXt9LHV0PVwiYXN5bmNcImluIHIuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKXx8XCJNb3pBcHBlYXJhbmNlXCJpbiByLmRvY3VtZW50RWxlbWVudC5zdHlsZXx8bi5vcGVyYSxvLGc9bi5oZWFkX2NvbmYmJm4uaGVhZF9jb25mLmhlYWR8fFwiaGVhZFwiLGk9bltnXT1uW2ddfHxmdW5jdGlvbigpe2kucmVhZHkuYXBwbHkobnVsbCxhcmd1bWVudHMpfSxudD0xLGZ0PTIsdHQ9MyxsPTQscDtpZihyLnJlYWR5U3RhdGU9PT1cImNvbXBsZXRlXCIpZSgpO2Vsc2UgaWYoci5hZGRFdmVudExpc3RlbmVyKXIuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIixrLCExKSxuLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsZSwhMSk7ZWxzZXtyLmF0dGFjaEV2ZW50KFwib25yZWFkeXN0YXRlY2hhbmdlXCIsayk7bi5hdHRhY2hFdmVudChcIm9ubG9hZFwiLGUpO3A9ITE7dHJ5e3A9IW4uZnJhbWVFbGVtZW50JiZyLmRvY3VtZW50RWxlbWVudH1jYXRjaCh3dCl7fXAmJnAuZG9TY3JvbGwmJmZ1bmN0aW9uIHB0KCl7aWYoIW8pe3RyeXtwLmRvU2Nyb2xsKFwibGVmdFwiKX1jYXRjaCh0KXtuLmNsZWFyVGltZW91dChpLnJlYWR5VGltZW91dCk7aS5yZWFkeVRpbWVvdXQ9bi5zZXRUaW1lb3V0KHB0LDUwKTtyZXR1cm59ZSgpfX0oKX1pLmxvYWQ9aS5qcz11dD9sdDpjdDtpLnRlc3Q9b3Q7aS5yZWFkeT15dDtpLnJlYWR5KHIsZnVuY3Rpb24oKXt5KCkmJnUoaC5BTEwsZnVuY3Rpb24obil7ZihuKX0pO2kuZmVhdHVyZSYmaS5mZWF0dXJlKFwiZG9tbG9hZGVkXCIsITApfSl9KSh3aW5kb3cpO1xuLypcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWhlYWQubWluLmpzLm1hcFxuKi8iLCIvKipcbiAqIEhhbmRsZXMgb3BlbmluZyBvZiBhbmQgc3luY2hyb25pemF0aW9uIHdpdGggdGhlIHJldmVhbC5qc1xuICogbm90ZXMgd2luZG93LlxuICpcbiAqIEhhbmRzaGFrZSBwcm9jZXNzOlxuICogMS4gVGhpcyB3aW5kb3cgcG9zdHMgJ2Nvbm5lY3QnIHRvIG5vdGVzIHdpbmRvd1xuICogICAgLSBJbmNsdWRlcyBVUkwgb2YgcHJlc2VudGF0aW9uIHRvIHNob3dcbiAqIDIuIE5vdGVzIHdpbmRvdyByZXNwb25kcyB3aXRoICdjb25uZWN0ZWQnIHdoZW4gaXQgaXMgYXZhaWxhYmxlXG4gKiAzLiBUaGlzIHdpbmRvdyBwcm9jZWVkcyB0byBzZW5kIHRoZSBjdXJyZW50IHByZXNlbnRhdGlvbiBzdGF0ZVxuICogICAgdG8gdGhlIG5vdGVzIHdpbmRvd1xuICovXG4gdmFyIFJldmVhbCA9IHJlcXVpcmUoJ3JldmVhbC5qcy9qcy9yZXZlYWwuanMnKTtcbnZhciBSZXZlYWxOb3RlcyA9IChmdW5jdGlvbigpIHtcblxuXHRmdW5jdGlvbiBvcGVuTm90ZXMoIG5vdGVzRmlsZVBhdGggKSB7XG5cblx0XHRpZiggIW5vdGVzRmlsZVBhdGggKSB7XG5cdFx0XHR2YXIganNGaWxlTG9jYXRpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdzY3JpcHRbc3JjJD1cIm5vdGVzLmpzXCJdJykuc3JjOyAgLy8gdGhpcyBqcyBmaWxlIHBhdGhcblx0XHRcdGpzRmlsZUxvY2F0aW9uID0ganNGaWxlTG9jYXRpb24ucmVwbGFjZSgvbm90ZXNcXC5qcyhcXD8uKik/JC8sICcnKTsgICAvLyB0aGUganMgZm9sZGVyIHBhdGhcblx0XHRcdG5vdGVzRmlsZVBhdGggPSBqc0ZpbGVMb2NhdGlvbiArICdub3Rlcy5odG1sJztcblx0XHR9XG5cblx0XHR2YXIgbm90ZXNQb3B1cCA9IHdpbmRvdy5vcGVuKCBub3Rlc0ZpbGVQYXRoLCAncmV2ZWFsLmpzIC0gTm90ZXMnLCAnd2lkdGg9MTEwMCxoZWlnaHQ9NzAwJyApO1xuXG5cdFx0LyoqXG5cdFx0ICogQ29ubmVjdCB0byB0aGUgbm90ZXMgd2luZG93IHRocm91Z2ggYSBwb3N0bWVzc2FnZSBoYW5kc2hha2UuXG5cdFx0ICogVXNpbmcgcG9zdG1lc3NhZ2UgZW5hYmxlcyB1cyB0byB3b3JrIGluIHNpdHVhdGlvbnMgd2hlcmUgdGhlXG5cdFx0ICogb3JpZ2lucyBkaWZmZXIsIHN1Y2ggYXMgYSBwcmVzZW50YXRpb24gYmVpbmcgb3BlbmVkIGZyb20gdGhlXG5cdFx0ICogZmlsZSBzeXN0ZW0uXG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gY29ubmVjdCgpIHtcblx0XHRcdC8vIEtlZXAgdHJ5aW5nIHRvIGNvbm5lY3QgdW50aWwgd2UgZ2V0IGEgJ2Nvbm5lY3RlZCcgbWVzc2FnZSBiYWNrXG5cdFx0XHR2YXIgY29ubmVjdEludGVydmFsID0gc2V0SW50ZXJ2YWwoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRub3Rlc1BvcHVwLnBvc3RNZXNzYWdlKCBKU09OLnN0cmluZ2lmeSgge1xuXHRcdFx0XHRcdG5hbWVzcGFjZTogJ3JldmVhbC1ub3RlcycsXG5cdFx0XHRcdFx0dHlwZTogJ2Nvbm5lY3QnLFxuXHRcdFx0XHRcdHVybDogd2luZG93LmxvY2F0aW9uLnByb3RvY29sICsgJy8vJyArIHdpbmRvdy5sb2NhdGlvbi5ob3N0ICsgd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lICsgd2luZG93LmxvY2F0aW9uLnNlYXJjaCxcblx0XHRcdFx0XHRzdGF0ZTogUmV2ZWFsLmdldFN0YXRlKClcblx0XHRcdFx0fSApLCAnKicgKTtcblx0XHRcdH0sIDUwMCApO1xuXG5cdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ21lc3NhZ2UnLCBmdW5jdGlvbiggZXZlbnQgKSB7XG5cdFx0XHRcdHZhciBkYXRhID0gSlNPTi5wYXJzZSggZXZlbnQuZGF0YSApO1xuXHRcdFx0XHRpZiggZGF0YSAmJiBkYXRhLm5hbWVzcGFjZSA9PT0gJ3JldmVhbC1ub3RlcycgJiYgZGF0YS50eXBlID09PSAnY29ubmVjdGVkJyApIHtcblx0XHRcdFx0XHRjbGVhckludGVydmFsKCBjb25uZWN0SW50ZXJ2YWwgKTtcblx0XHRcdFx0XHRvbkNvbm5lY3RlZCgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cdFx0fVxuXG5cdFx0LyoqXG5cdFx0ICogUG9zdHMgdGhlIGN1cnJlbnQgc2xpZGUgZGF0YSB0byB0aGUgbm90ZXMgd2luZG93XG5cdFx0ICovXG5cdFx0ZnVuY3Rpb24gcG9zdCgpIHtcblxuXHRcdFx0dmFyIHNsaWRlRWxlbWVudCA9IFJldmVhbC5nZXRDdXJyZW50U2xpZGUoKSxcblx0XHRcdFx0bm90ZXNFbGVtZW50ID0gc2xpZGVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoICdhc2lkZS5ub3RlcycgKTtcblxuXHRcdFx0dmFyIG1lc3NhZ2VEYXRhID0ge1xuXHRcdFx0XHRuYW1lc3BhY2U6ICdyZXZlYWwtbm90ZXMnLFxuXHRcdFx0XHR0eXBlOiAnc3RhdGUnLFxuXHRcdFx0XHRub3RlczogJycsXG5cdFx0XHRcdG1hcmtkb3duOiBmYWxzZSxcblx0XHRcdFx0d2hpdGVzcGFjZTogJ25vcm1hbCcsXG5cdFx0XHRcdHN0YXRlOiBSZXZlYWwuZ2V0U3RhdGUoKVxuXHRcdFx0fTtcblxuXHRcdFx0Ly8gTG9vayBmb3Igbm90ZXMgZGVmaW5lZCBpbiBhIHNsaWRlIGF0dHJpYnV0ZVxuXHRcdFx0aWYoIHNsaWRlRWxlbWVudC5oYXNBdHRyaWJ1dGUoICdkYXRhLW5vdGVzJyApICkge1xuXHRcdFx0XHRtZXNzYWdlRGF0YS5ub3RlcyA9IHNsaWRlRWxlbWVudC5nZXRBdHRyaWJ1dGUoICdkYXRhLW5vdGVzJyApO1xuXHRcdFx0XHRtZXNzYWdlRGF0YS53aGl0ZXNwYWNlID0gJ3ByZS13cmFwJztcblx0XHRcdH1cblxuXHRcdFx0Ly8gTG9vayBmb3Igbm90ZXMgZGVmaW5lZCBpbiBhbiBhc2lkZSBlbGVtZW50XG5cdFx0XHRpZiggbm90ZXNFbGVtZW50ICkge1xuXHRcdFx0XHRtZXNzYWdlRGF0YS5ub3RlcyA9IG5vdGVzRWxlbWVudC5pbm5lckhUTUw7XG5cdFx0XHRcdG1lc3NhZ2VEYXRhLm1hcmtkb3duID0gdHlwZW9mIG5vdGVzRWxlbWVudC5nZXRBdHRyaWJ1dGUoICdkYXRhLW1hcmtkb3duJyApID09PSAnc3RyaW5nJztcblx0XHRcdH1cblxuXHRcdFx0bm90ZXNQb3B1cC5wb3N0TWVzc2FnZSggSlNPTi5zdHJpbmdpZnkoIG1lc3NhZ2VEYXRhICksICcqJyApO1xuXG5cdFx0fVxuXG5cdFx0LyoqXG5cdFx0ICogQ2FsbGVkIG9uY2Ugd2UgaGF2ZSBlc3RhYmxpc2hlZCBhIGNvbm5lY3Rpb24gdG8gdGhlIG5vdGVzXG5cdFx0ICogd2luZG93LlxuXHRcdCAqL1xuXHRcdGZ1bmN0aW9uIG9uQ29ubmVjdGVkKCkge1xuXG5cdFx0XHQvLyBNb25pdG9yIGV2ZW50cyB0aGF0IHRyaWdnZXIgYSBjaGFuZ2UgaW4gc3RhdGVcblx0XHRcdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCAnc2xpZGVjaGFuZ2VkJywgcG9zdCApO1xuXHRcdFx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoICdmcmFnbWVudHNob3duJywgcG9zdCApO1xuXHRcdFx0UmV2ZWFsLmFkZEV2ZW50TGlzdGVuZXIoICdmcmFnbWVudGhpZGRlbicsIHBvc3QgKTtcblx0XHRcdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCAnb3ZlcnZpZXdoaWRkZW4nLCBwb3N0ICk7XG5cdFx0XHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lciggJ292ZXJ2aWV3c2hvd24nLCBwb3N0ICk7XG5cdFx0XHRSZXZlYWwuYWRkRXZlbnRMaXN0ZW5lciggJ3BhdXNlZCcsIHBvc3QgKTtcblx0XHRcdFJldmVhbC5hZGRFdmVudExpc3RlbmVyKCAncmVzdW1lZCcsIHBvc3QgKTtcblxuXHRcdFx0Ly8gUG9zdCB0aGUgaW5pdGlhbCBzdGF0ZVxuXHRcdFx0cG9zdCgpO1xuXG5cdFx0fVxuXG5cdFx0Y29ubmVjdCgpO1xuXG5cdH1cblxuXHRpZiggIS9yZWNlaXZlci9pLnRlc3QoIHdpbmRvdy5sb2NhdGlvbi5zZWFyY2ggKSApIHtcblxuXHRcdC8vIElmIHRoZSB0aGVyZSdzIGEgJ25vdGVzJyBxdWVyeSBzZXQsIG9wZW4gZGlyZWN0bHlcblx0XHRpZiggd2luZG93LmxvY2F0aW9uLnNlYXJjaC5tYXRjaCggLyhcXD98XFwmKW5vdGVzL2dpICkgIT09IG51bGwgKSB7XG5cdFx0XHRvcGVuTm90ZXMoKTtcblx0XHR9XG5cblx0XHQvLyBPcGVuIHRoZSBub3RlcyB3aGVuIHRoZSAncycga2V5IGlzIGhpdFxuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoICdrZXlkb3duJywgZnVuY3Rpb24oIGV2ZW50ICkge1xuXHRcdFx0Ly8gRGlzcmVnYXJkIHRoZSBldmVudCBpZiB0aGUgdGFyZ2V0IGlzIGVkaXRhYmxlIG9yIGFcblx0XHRcdC8vIG1vZGlmaWVyIGlzIHByZXNlbnRcblx0XHRcdGlmICggZG9jdW1lbnQucXVlcnlTZWxlY3RvciggJzpmb2N1cycgKSAhPT0gbnVsbCB8fCBldmVudC5zaGlmdEtleSB8fCBldmVudC5hbHRLZXkgfHwgZXZlbnQuY3RybEtleSB8fCBldmVudC5tZXRhS2V5ICkgcmV0dXJuO1xuXG5cdFx0XHQvLyBEaXNyZWdhcmQgdGhlIGV2ZW50IGlmIGtleWJvYXJkIGlzIGRpc2FibGVkXG5cdFx0XHRpZiAoIFJldmVhbC5nZXRDb25maWcoKS5rZXlib2FyZCA9PT0gZmFsc2UgKSByZXR1cm47XG5cblx0XHRcdGlmKCBldmVudC5rZXlDb2RlID09PSA4MyApIHtcblx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0b3Blbk5vdGVzKCk7XG5cdFx0XHR9XG5cdFx0fSwgZmFsc2UgKTtcblxuXHRcdC8vIFNob3cgb3VyIGtleWJvYXJkIHNob3J0Y3V0IGluIHRoZSByZXZlYWwuanMgaGVscCBvdmVybGF5XG5cdFx0aWYoIHdpbmRvdy5SZXZlYWwgKSBSZXZlYWwucmVnaXN0ZXJLZXlib2FyZFNob3J0Y3V0KCAnUycsICdTcGVha2VyIG5vdGVzIHZpZXcnICk7XG5cblx0fVxuXG5cdHJldHVybiB7IG9wZW46IG9wZW5Ob3RlcyB9O1xuXG59KSgpO1xuIl19
