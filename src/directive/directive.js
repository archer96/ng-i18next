angular.module('jm.i18next').directive('ngI18next', function ($rootScope, $i18next, $interpolate, $compile, $parse) {

	'use strict';

	function parse(scope, element, key) {

		var attr = 'text',
			attrs = [attr],
			string;

		/*
		 * Check if we want to translate an attribute
		 */
		if (key.indexOf('[') === 0) {
			var parts = key.split(']');
			key = parts[1];
			attr = parts[0].substr(1, parts[0].length - 1);
		}
		/*
		 * Cut of the ";" that might be at the end of the string
		 */
		if (key.indexOf(';') === key.length - 1) {
			key = key.substr(0, key.length - 2);
		}
		/*
		 * If passing options, split attr
		 */
		if (attr.indexOf(':') >= 0) {
			attrs = attr.split(':');
			attr = attrs[0];
		} else if (attr === 'i18next') {
			attrs[1] = 'i18next';
			attr = 'text';
		}

		if (attr !== 'i18next' && attrs[1] !== 'i18next') {

			string = $i18next(key);

		} else {

			var options = {},
				strippedKey = key;

			if (key.indexOf('(') >= 0 && key.indexOf(')') >= 0) {

				var keys = key.split(')');

				keys[0] = keys[0].substr(1, keys[0].length);

				options = $parse(keys[0])();

				strippedKey = keys[1];

			}

			string = $i18next(strippedKey, options);

		}

		if (attr === 'html') {

			element.html(string);

		} else if (attr === 'text') {

			element.text(string);

		} else {

			element.attr(attr, string);

		}

		/*
		 * Now compile the content of the element and bind the variables to
		 * the scope
		 */
		$compile(element.contents())(scope);

	}


	function localize(scope, element, key) {

		if (key.indexOf(';') >= 0) {

			var keys = key.split(';');

			for (var i = 0; i < keys.length; i++) {
				if (keys[i] !== '') {
					parse(scope, element, keys[i]);
				}
			}

		} else {
			parse(scope, element, key);
		}

	}

	return {

		// 'A': only as attribute
		restrict: 'A',

		scope: true,

		link: function postLink(scope, element, attrs) {

			attrs.$observe('ngI18next', function (value) {

				if (value === '') {
					scope.translationValue = element.text().replace(/^\s+|\s+$/g, '');
				} else {
					scope.translationValue = value;
				}

				if (!scope.translationValue) {
					// Well, seems that we don't have anything to translate...
					return;
				}

				localize(scope.$parent, element, scope.translationValue);

			});

			scope.$on('i18nextLanguageChange', function () {
				localize(scope.$parent, element, scope.translationValue);
			});

		}

	};

});
