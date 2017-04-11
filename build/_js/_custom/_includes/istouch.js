// New touch detection since Modernizr was removed
var istouch = {
	$html: '',
	is_touch_device: function () {
		return (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
	},
	init: function () {
		this.$html = document.querySelector('html');
		if (!istouch.is_touch_device()) {
			this.$html.classList.add('no-touchevents');
		} else {
			this.$html.classList.add('touchevents');
		}
	}
};
istouch.init();
module.exports = istouch;
