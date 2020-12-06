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
	
/*-------------- Page Index----------- */
   if (pageid == 'intro') {
		var swiperslider = new Swiper ('.slider-intro', {
			direction: 'horizontal',
			effect: 'slide',
			parallax: true,
			pagination: {
			el: '.swiper-pagination'
			},
			navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
			},
			autoplay: {
				delay: 2000,
			}
		}); 

   }
	
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
   if (pageid == 'blog') {
		$("#loadlist-blog .card").hide();
		$("#showLess").hide();		
		var size_li = $("#loadlist-blog .card").length;
		var nrposts = 4;
		$('#loadlist-blog .card:lt('+nrposts+')').show();
		$('#loadMore').on('click', function(e) {
		nrposts= (nrposts+2 <= size_li) ? nrposts+2 : size_li;
		$('#loadlist-blog .card:lt('+nrposts+')').show();
		if(nrposts == size_li){
		$('#loadMore').hide();
		$('#showLess').show();
		}
		$(".page__content").animate({ scrollTop: $('.page__content').prop("scrollHeight")}, 1000);
		});
   }
/*-------------- Page Blog Single----------- */
   if (pageid == 'blogsingle') {
		var swipersliderpage = new Swiper ('.swiper-container-pages', {
			direction: 'horizontal',
			effect: 'slide',
			parallax: true,
			pagination: {
			el: '.swiper-pagination'
			}
		}); 
	
   }
/*-------------- Page Photos----------- */
   if (pageid == 'photos') {
	   
	   

		$(".gallery-switch li").on('click', function(e) { 
			$('.gallery-switch li').removeClass('selected');
			$(this).addClass('selected');
			var nrperrow = $(this).attr("data-photos");
			if(nrperrow == "11") {
				$('.photo-gallery').addClass('photo-gallery--11');
				$('.photo-gallery').removeClass('photo-gallery--12');
				$('.photo-gallery').removeClass('photo-gallery--13');
				$('.photo-gallery').removeClass('photo-gallery--14');
			}
			else if(nrperrow == "12") {
				$('.photo-gallery').removeClass('photo-gallery--11');
				$('.photo-gallery').addClass('photo-gallery--12');
				$('.photo-gallery').removeClass('photo-gallery--13');
				$('.photo-gallery').removeClass('photo-gallery--14');
				
			}
			else if(nrperrow == "13") {
				$('.photo-gallery').removeClass('photo-gallery--11');
				$('.photo-gallery').removeClass('photo-gallery--12');
				$('.photo-gallery').addClass('photo-gallery--13');
				$('.photo-gallery').removeClass('photo-gallery--14');					
			}
			else if(nrperrow == "14") {
				$('.photo-gallery').removeClass('photo-gallery--11');
				$('.photo-gallery').removeClass('photo-gallery--12');
				$('.photo-gallery').removeClass('photo-gallery--13');
				$('.photo-gallery').addClass('photo-gallery--14');					
			}	
		});
  
		var $gallery = $('.photo-gallery a').simpleLightbox({
			overlay: true,
			captions: true,
			captionSelector: "self", 
			captionsData : "title",
			captionType: "attr"
		}); 
}
/*-------------- Page Videos----------- */
   if (pageid == 'videos') {
		const videoplayer = new Plyr('#videoplayer');
   }
/*-------------- Page Audio----------- */
   if (pageid == 'music') {


    var supportsAudio = !!document.createElement('audio').canPlayType;
    if (supportsAudio) {
        // initialize plyr
        var player = new Plyr('#audio1', {
            controls: [
				'play',
                'progress',
                'current-time',
                'duration',
                'mute',
				'volume'
            ]
        });
        // initialize playlist and controls
        var index = 0,
            playing = false,
            mediaPath = '../../assets/audio/',
            extension = '',
            tracks = [{
                "track": 1,
                "name": "Super Happy Song - Alex D.",
                "duration": "3:21",
                "file": "3"
            }, {
                "track": 2,
                "name": "The Mith - Vanderbild Studio",
                "duration": "4:26",
                "file": "2"
            }, {
                "track": 3,
                "name": "Paint the sky - Sarah J. (ReMix)",
                "duration": "3:18",
                "file": "1"
            }, {
                "track": 4,
                "name": "It's all good now - Dance Studio (Original)",
                "duration": "3:21",
                "file": "3"
            }, {
                "track": 5,
                "name": "Lion and the King's Men - Super Trupper (Mix)",
                "duration": "4:26",
                "file": "2"
            }, {
                "track": 6,
                "name": "The Forest Sound - Smith and The Band",
                "duration": "3:18",
                "file": "1"
            }],
            buildPlaylist = $.each(tracks, function(key, value) {
                var trackNumber = value.track,
                    trackName = value.name,
                    trackDuration = value.duration;
                if (trackNumber.toString().length === 1) {
                    trackNumber = '0' + trackNumber;
                }
                $('#playlist').append('<li> \
                    <div class="track"> \
                        <span class="track__nr">' + trackNumber + '.</span> \
                        <span class="track__title">' + trackName + '</span> \
                        <span class="track__lenght">' + trackDuration + '</span> \
                    </div> \
                </li>');
            }),
            trackCount = tracks.length,
            npAction = $('#music-toolbar-info'),
            npTitle = $('#music-toolbar-title'),
            audio = $('#audio1').on('play', function () {
                playing = true;
                npAction.text('Now Playing...');
            }).on('pause', function () {
                playing = false;
                npAction.text('Paused...');
            }).on('ended', function () {
                npAction.text('Paused...');
                if ((index + 1) < trackCount) {
                    index++;
                    loadTrack(index);
                    audio.play();
                } else {
                    audio.pause();
                    index = 0;
                    loadTrack(index);
                }
            }).get(0),
            btnPrev = $('#musicPrev').on('click', function () {
                if ((index - 1) > -1) {
                    index--;
                    loadTrack(index);
                    if (playing) {
                        audio.play();
                    }
                } else {
                    audio.pause();
                    index = 0;
                    loadTrack(index);
                }
            }),
            btnNext = $('#musicNext').on('click', function () {
                if ((index + 1) < trackCount) {
                    index++;
                    loadTrack(index);
                    if (playing) {
                        audio.play();
                    }
                } else {
                    audio.pause();
                    index = 0;
                    loadTrack(index);
                }
            }),
            li = $('#playlist li').on('click', function () {
                var id = parseInt($(this).index());
                if (id !== index) {
                    playTrack(id);
                }
            }),
            loadTrack = function (id) {
                $('#playlist .selected').removeClass('selected');
                $('#playlist li:eq(' + id + ')').addClass('selected');
                npTitle.text(tracks[id].name);
                index = id;
                audio.src = mediaPath + tracks[id].file + extension;
                updateDownload(id, audio.src);
            },
            updateDownload = function (id, source) {
                player.on('loadedmetadata', function () {
                    $('a[data-plyr="download"]').attr('href', source);
                });
            },
            playTrack = function (id) {
                loadTrack(id);
                audio.play();
            };
        extension = audio.canPlayType('audio/mpeg') ? '.mp3' : audio.canPlayType('audio/ogg') ? '.ogg' : '';
        loadTrack(index);
    } else {
        var noSupport = $('#audio1').text();
        $('.music-toolbar__header').append('<p class="no-support">' + noSupport + '</p>');
    }
	
	
	
	

   }   
/*-------------- Page Shop----------- */
   if (pageid == 'shop') {
		
		$("#loadlist-shop .card").hide();
		$("#showLess").hide();		
		var size_li = $("#loadlist-shop .card").length;
		var nrposts = 4;
		$('#loadlist-shop .card:lt('+nrposts+')').show();
		$('#loadMore').on('click', function(e) {
		nrposts= (nrposts+2 <= size_li) ? nrposts+2 : size_li;
		$('#loadlist-shop .card:lt('+nrposts+')').show();
		if(nrposts == size_li){
		$('#loadMore').hide();
		$('#showLess').show();
		}
		$(".page__content").animate({ scrollTop: $('.page__content').prop("scrollHeight")}, 1000);
		});
		
		
		var size_ini = 1;
		function increase_n(size) {
			var size_increase = size_ini++;
			$(".cart-items-nr").html(size_increase);
		}
		$(".addtocart").on('click', function(e) {
			
			increase_n(1);
			$('.cart-items-nr').addClass('animate');
			setTimeout(function() {
				$('.cart-items-nr').removeClass('animate');
			}, 1500);
		});
 
	   
		$(".quantity__button--plus").on('click', function(e) { 							  
			e.preventDefault();
			var fieldName = $(this).attr('field');
			var currentVal = parseInt($('input[name='+fieldName+']').val());
			if (!isNaN(currentVal)) {
				$('input[name='+fieldName+']').val(currentVal + 1);
			} else {
				$('input[name='+fieldName+']').val(0);
			}
			
		});
		$(".quantity__button--minus").on('click', function(e) { 
			e.preventDefault();
			var fieldName = $(this).attr('field');
			var currentVal = parseInt($('input[name='+fieldName+']').val());
			if (!isNaN(currentVal) && currentVal > 0) {
				$('input[name='+fieldName+']').val(currentVal - 1);
			} else {
				$('input[name='+fieldName+']').val(0);
			}
		});
		
		$(".delete-item").on('click', function(e) {
			var cartitem = $(this).data("delete-item");
			$('#item'+cartitem).fadeOut('slow');
		});
		
		
   } 

/*-------------- Page Shop Cart----------- */
   if (pageid == 'checkout') {
	   
		$( "#popup-success" ).load( "popup-success.html" );
		
		$(".quantity__button--plus").on('click', function(e) { 							  
			e.preventDefault();
			var fieldName = $(this).attr('field');
			var currentVal = parseInt($('input[name='+fieldName+']').val());
			if (!isNaN(currentVal)) {
				$('input[name='+fieldName+']').val(currentVal + 1);
			} else {
				$('input[name='+fieldName+']').val(0);
			}
			
		});
		$(".quantity__button--minus").on('click', function(e) { 
			e.preventDefault();
			var fieldName = $(this).attr('field');
			var currentVal = parseInt($('input[name='+fieldName+']').val());
			if (!isNaN(currentVal) && currentVal > 0) {
				$('input[name='+fieldName+']').val(currentVal - 1);
			} else {
				$('input[name='+fieldName+']').val(0);
			}
		});
		
		$(".delete-item").on('click', function(e) {
			var cartitem = $(this).data("delete-item");
			$('#item'+cartitem).fadeOut('slow');
		});
		
		$('input:radio[name="payment"]').change(function(){
			$('.option-hidden').hide();
			if($(this).val() == 'creditcard'){
			   $('#show-credit-cards').show();
			}
			if($(this).val() == 'paypal'){
				$('#show-paypal-info').show();
			}
		});
		
		
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