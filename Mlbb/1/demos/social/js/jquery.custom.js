/*------------------------------------------------------------------
jQuery document ready
-------------------------------------------------------------------*/
$(document).ready(function () {
	"use strict";
	// GET PAGE ID
	var pageid = $('.page').data("page");
	
	// LOAD PANEL LEFT
	$( "#panel-left" ).load( "panel-left.html", function() {
		var swipersubnav = new Swiper ('.panel__navigation', {
			direction: 'horizontal',
			effect: 'slide',
			slidesPerView: 1,
			slidesPerGroup: 1
		}); 
		swipersubnav.on('slideChangeTransitionEnd', function () {
			$(".panel").animate({ scrollTop: 0 }, "slow");
		});
		$(".opensubnav").on('click', function(e) { 
			swipersubnav.slideNext();
		});
		$(".backtonav").on('click', function(e) { 
			swipersubnav.slidePrev();
		});
	});
	
	// LOAD PANEL RIGHT
	$( "#panel-right" ).load( "panel-right.html" );
	
	//LOAD SOCIAL POPUP
	$( "#popup-social" ).load( "popup-social.html" );
	
	//LOAD ALERT POPUP
	$( "#popup-alert" ).load( "popup-alert.html" );
	
	//LOAD NOTIFICATIONS POPUP
	$( "#popup-notifications" ).load( "popup-notifications.html" );
	
	//LOAD BOTTOM NAVIGATION
	$( "#bottom-toolbar" ).load( "bottom-navigation.html", function() {
		var swipernav = new Swiper ('.swiper-toolbar', {
			direction: 'horizontal',
			effect: 'slide',
			slidesPerView: 1,
			slidesPerGroup: 1,
			spaceBetween: 0,
/* 			pagination: {
			el: '.bottom-navigation__pagination'
			}, */
			on: {
			reachEnd: function () {
			  $('.bottom-navigation__more').hide();
			},
			reachBeginning: function () {
			  $('.bottom-navigation__more').show();
			},
			}
		});
		$(".bottom-navigation").on('click', '.bottom-navigation__more' ,function(){
			swipernav.slideNext();
		});
	});

	
	
	//OPEN PANEL ACTION
	$(document).on('click', '.open-panel' ,function(){
	    var panelPosition = $(this).data("panel");	
		var panel = $('.panel--' + panelPosition);
		var bodyOverlay = $('.body-overlay');
		panel.addClass('active');
		bodyOverlay.css({display: 'block'}).addClass('active');
		$('body').addClass('with-panel-' + panelPosition + '-reveal');
		$(".body-overlay").on('click', function(e) { 
			$('.header__icon--menu').removeClass('open');
		    panel.css({display: ''}).removeClass('active');
			$(this).css({display: ''}).removeClass('active');
			$('body').addClass('panel-closing').removeClass('with-panel-' + panelPosition + '-reveal');	
		});
		
	});
	
	//OPEN POPUP ACTION
	$(document).on('click', '.open-popup' ,function(){
	    var popupdata = $(this).data("popup");
		var popup = $('.popup--' + popupdata);
		popup.css({display: 'block'}).addClass('active');
	});
	//
	$(document).on('click', '.close-popup' ,function(){
	    var popupdataclose = $(this).data("popup");
		var popupclose  = $('.popup--' + popupdataclose );
		popupclose.removeClass('active');	
	});


	$(document).on('click', '.header__icon--menu', function() {
		  $(this).toggleClass('open');
	});

	$(".page__content").scroll(function() {
		var topposition = $(this).position().top;
		if(  $(this).scrollTop() > topposition ) {
			$('.header--change').addClass('header--page'); 
		} else {
			$('.header--change').removeClass('header--page');
		}
	});
	
/*-------------- Page Login----------- */
   if (pageid == 'login') {
		$("#LoginForm").validate(); 

   } 
/*-------------- Page sliders----------- */
   if (pageid == 'sliders') {
		var galleryLinks = new Swiper('.slider-init-top', {
		  direction: 'horizontal',
		  spaceBetween: 10,
		  slidesPerView: "auto",
		  slideToClickedSlide: true,
		  centeredSlides: true,
		});
		
		var galleryImages = new Swiper('.slider-init-bottom', {
		  spaceBetween: 0,
		  slidesPerView: 1,
		  pagination: {
			el: '.slider-init-bottom__pagination',
			type: "bullets",
		  },

		});	

	    galleryLinks.controller.control = galleryImages;
		galleryImages.controller.control = galleryLinks;

   } 
/*-------------- Page Blog----------- */
   if (pageid == 'main') {
		$("#loadlist-main .card").hide();
		$("#showLess").hide();		
		var size_li = $("#loadlist-main .card").length;
		var nrposts = 3;
		$('#loadlist-main .card:lt('+nrposts+')').show();
		$('#loadMore').on('click', function(e) {
		nrposts= (nrposts+1 <= size_li) ? nrposts+1 : size_li;
		$('#loadlist-main .card:lt('+nrposts+')').show();
		if(nrposts == size_li){
		$('#loadMore').hide();
		$('#showLess').show();
		}
		$(".page__content").animate({ scrollTop: $('.page__content').prop("scrollHeight")}, 1000);
		});
		
		const videoplayer = new Plyr('#videoplayer');
   }

/*-------------- Page Contact----------- */
   if (pageid == 'contact') {
		$("#ContactForm").validate({
		submitHandler: function(form) {
		ajaxContact(form);
		return false;
		}
		});	
   } 
   
});