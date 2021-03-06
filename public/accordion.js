import {site, navigate, geometry} from 'wix-sdk';

$(function onDocumentReady() {
	'use strict';

	var templateSource = $('#accordion-template').html();
	var template = Handlebars.compile(templateSource);

	/* =============== Menu Building ========= */
	site.pages.list()
	.then(buildMenu)
	.then(attachListeners)
	.then(setCurrentPage)
	.then(updateAccordionHeight)
	.then(slideUpSubMenus);

	// Function that builds the menu given the site pages
	function buildMenu(sitePages) {
		//Add elements to menu
		$('.accordion').append(template({pages: sitePages}));
	}

	/* ============== Menu Building End  ============= */

	/* ============== Accordion Effects =============== */
	function attachListeners() {
		$('.main-menu-item').mouseover(slideDownSubmenu);
		$('.accordion').mouseleave(slideUpSubMenus);
		$('.main-menu-item, .sub-menu-item').click(menuItemClicked);
	}

	function slideDownSubmenu() {
		// slide the sub menu item below the main menu item (only if it's closed)
		if (!$(this).find('.sub-menu').is(':visible')) {
			//slide up all the link lists
			$('.sub-menu').slideUp();

			//now slide down the one closest to this.
			$(this).find('.sub-menu').slideDown();
		}
	}

	function slideUpSubMenus() {
		// slide up all the link lists
		$('.sub-menu:not(.active)').slideUp();

		// make sure the active one is open
		$('.sub-menu.active').slideDown();
	}

	// Override the accordion links' default behavior
	function menuItemClicked(event) {
		// Stops the main menu item from catching the same event
		event.stopPropagation();

		// Remove the current active one
		$('.active').removeClass('active');
		var itemClicked = $(this);
		setActiveMenuItem(itemClicked);

		navigate.toPage(itemClicked.attr('id'));
	}

	function setActiveMenuItem(item) {
		//Make the current item active.
		item.addClass('active');

		//Select closest submenu and mark it also as active.
		item.closest('.sub-menu').addClass('active');
	}

	function setCurrentPage() {
		return site.pages.getId().then(function (pageId) {
			setActiveMenuItem($('#' + pageId));
		});
	}

	function updateAccordionHeight() {
		return geometry.setHeight($('.accordion').height() + 10);
	}
});
