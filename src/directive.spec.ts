import * as angular from 'angular';
import * as i18n from 'i18next';

import { Ii18nProvider } from './interfaces';

import { TestFactories, ITestScope } from './testFactories';

declare let i18next: i18n.I18n;

describe('Unit: jm.i18next - Directive', () => {

	// tslint:disable:indent
	let $rootScope: ng.IRootScopeService;
	let $compile: ng.ICompileService;
	let $timeout: ng.ITimeoutService;
	let i18nextOptions: i18n.Options = TestFactories.getOptions();

	beforeEach(() => {

		angular.mock.module('jm.i18next', ($i18nextProvider: Ii18nProvider) => {
			i18next.init(i18nextOptions, (err, t) => {
				// console.log('resources loaded');
			});

			i18next.on('initialized', (options) => {
				// console.log('i18next initialized');
				i18nextOptions = options;
			});
		});

		inject((
			_$compile_: ng.ICompileService,
			_$rootScope_: ng.IRootScopeService,
			_$timeout_: ng.ITimeoutService) => {
			$compile = _$compile_;
			$rootScope = _$rootScope_;
			$timeout = _$timeout_;
		});

	});

	/*
	 * Tests
	 *  - simple strings
	 *  - passing options
	 *  - using $scope (coming soon)
	 *  - plurals
	 *  - context
	 *  - HTML
	 *    - simple
	 *    - with options
	 */

	describe('simple strings', () => {

		it('should return original key, because translation does not exist', () => {
			let c = $compile('<p ng-i18next="Key_Not_Found"></p>')($rootScope);
			$rootScope.$apply();
			expect(c.text()).toBe('Key_Not_Found');
		});

		it('should translate "hello" into German ("de-DE"; default language)', () => {
			let c = $compile('<p ng-i18next="hello"></p>')($rootScope);
			$rootScope.$apply();
			expect(c.text()).toBe('Herzlich Willkommen!');
		});

	});

	describe('passing options', () => {

		it('should translate "hello" into language passed by options ("dev")', () => {
			let c = $compile('<p ng-i18next="[i18next]({lng:\'dev\'})hello"></p>')($rootScope);
			$rootScope.$apply();
			expect(c.text()).toEqual('Welcome!');
		});

		it('should replace "{{name}}" in the translation string with name given by options', () => {
			let c = $compile('<p ng-i18next="[i18next]({name:\'Andre\'})helloName"></p>')($rootScope);
			$rootScope.$apply();
			expect(c.text()).toEqual('Herzlich Willkommen, Andre!');
		});

		it('should replace "{{name}}" in the translation string with scope letiable', () => {
			let scope: ITestScope = <ITestScope> $rootScope.$new();
			scope.name = "Wax";
			let c = $compile('<p ng-i18next="[i18next]({name: name})helloName"></p>')(scope);
			$rootScope.$apply();
			expect(c.text()).toEqual('Herzlich Willkommen, Wax!');
		});

		it('should update "{{name}}" in the translation string when scope letiable changes', () => {
			let scope: ITestScope = <ITestScope> $rootScope.$new();
			scope.name = "Wax";
			let c = $compile('<p ng-i18next="[i18next]({name: name})helloName"></p>')(scope);
			$rootScope.$apply();
			expect(c.text()).toEqual('Herzlich Willkommen, Wax!');
			scope.name = "Wayne";
			$rootScope.$apply();
			expect(c.text()).toEqual('Herzlich Willkommen, Wayne!');
		});

		it('should replace "{{name}}" in the translation string with name given by options and should use "dev" as language', () => {
			let c = $compile('<p ng-i18next="[i18next]({name:\'Andre\',lng:\'dev\'})helloName"></p>')($rootScope);
			$rootScope.$apply();
			expect(c.text()).toEqual('Welcome, Andre!');
		});

	});

	describe('using $scope', () => {

		// coming soon

	});

	describe('plurals', () => {

		describe('as text', () => {

			it('should use the single form', () => {
				let c = $compile('<p ng-i18next="[i18next]({count: 1})woman"></p>')($rootScope);
				$rootScope.$apply();
				expect(c.text()).toEqual('Frau');
			});

			it('should use the plural form', () => {
				let c = $compile('<p ng-i18next="[i18next]({count: 5})woman"></p>')($rootScope);
				$rootScope.$apply();
				expect(c.text()).toEqual('Frauen');
			});

		});

		describe('as html', () => {

			it('should use the single form', () => {
				let c = $compile('<p ng-i18next="[html:i18next]({count: 1})woman"></p>')($rootScope);
				$rootScope.$apply();
				expect(c.text()).toEqual('Frau');
			});

			it('should use the plural form', () => {
				let c = $compile('<p ng-i18next="[html:i18next]({count: 5})woman"></p>')($rootScope);
				$rootScope.$apply();
				expect(c.text()).toEqual('Frauen');
			});

		});

	});

	describe('context', () => {

		it('should use the "normal" form', () => {
			let c = $compile('<p ng-i18next="friend"></p>')($rootScope);
			$rootScope.$apply();
			expect(c.text()).toEqual('Freund');
		});

		it('should use the male form', () => {
			let c = $compile('<p ng-i18next="[i18next]({context:\'male\'})friend"></p>')($rootScope);
			$rootScope.$apply();
			expect(c.text()).toEqual('Fester Freund');
		});

		it('should use the female form', () => {
			let c = $compile('<p ng-i18next="[i18next]({context:\'female\'})friend"></p>')($rootScope);
			$rootScope.$apply();
			expect(c.text()).toEqual('Feste Freundin');
		});

	});

	describe('nesting translations', () => {

		it('should include another translation', () => {
			let c = $compile('<p ng-i18next="helloNesting"></p>')($rootScope);
			$rootScope.$apply();
			expect(c.text()).toEqual('Weißt du was? Du bist Herzlich Willkommen!');
		});

		it('should include another translation and should use "dev" as language', () => {
			let c = $compile('<p ng-i18next="[i18next]({lng:\'dev\'})helloNesting"></p>')($rootScope);
			$rootScope.$apply();
			expect(c.text()).toEqual('You know what? You\'re Welcome!');
		});

	});

	/***********************************************************
	 *
	 *                           HTML
	 *
	 ***********************************************************/

	describe('simple HTML', () => {

		it('should return original key, because translation does not exist', () => {
			let c = $compile('<p ng-i18next="[html]helloHTML"></p>')($rootScope);
			$rootScope.$apply();
			expect(c.html()).toBe('helloHTML');
		});

	});

	describe('simple HTML + options', () => {

		it('should translate "hello" into German ("de"; default language)', () => {
			let c = $compile('<p ng-i18next="[html:i18next]({name:\'Andre\'})helloNameHTML"></p>')($rootScope);
			$rootScope.$apply();
			expect(c.html()).toBe('<h1 class="ng-scope">Herzlich Willkommen, Andre!</h1>');
		});

		it('should translate "hello" into German and sanitize the substitution ("de"; default language)', () => {
			let c = $compile('<p ng-i18next="[html:i18next]({name:\'<img src=1 onError=alert()>\'})helloNameHTML"></p>')($rootScope);
			$rootScope.$apply();
			expect(c.html()).toBe('<h1 class="ng-scope">Herzlich Willkommen, &lt;img src="1"&gt;!</h1>');
		});

	});
	// tslint:enable:indent

});
