$(document).ready(function(){
	prepareForAJAX();
	addAJAXLinks($('body'));

	window.onpopstate = function() {
		location.reload();
	}
});

function prepareForAJAX() {
	// to enable animation, we need absolute elements. this element 
	// will act as a spacer so the rest of the page doesn't go crazy
	var container = $('<div id="ajax-container">');
	$('section').wrap(container);
}

function addAJAXLinks(elements) {
	elements.find('a').click(function(event) { // add filter here to only target links to your own site

		// This will cause errors when run locally. Uncomment when running on a webserver.
		window.history.pushState("", "", $(this).attr('href'));

		event.preventDefault();

		// grab the outbound section element, and apply our absolute class
		var outboundSection = $('section');
		outboundSection.addClass('absolute');

		// create a div element to recieve the result of the AJAX request
		var inboundSection = $('<div id="temp">');

		// grab the container we added earlier
		var container = $('#ajax-container');
		container.css('height',outboundSection.height() + 'px');

		// show time! ajax request
		inboundSection.load($(this).attr('href') + ' section', function() {
			// that temp div we created isn't needed; grab section, that's what we want
			inboundSection = inboundSection.children('section');

			// use our function for adding AJAX links to process the elements we've received
			addAJAXLinks(inboundSection);

			// append our new content to the container
			container.append(inboundSection);

			// shove that new content way to the right, prepare for animation
			inboundSection.css('left',outboundSection.width() + 'px');

			// while we're here, update the site title. set this variable to your site title.
			// I've added a filter here that looks for an element unique to your home page so only
			// the site title is shown, feel free to replace with whatever will generate your title 
			// best. In my case, the first H1 element is used.
			var websiteTitle = "MySite.com"

			if(inboundSection.find('#unique-home-element').length > 0)
			{
				document.title = websiteTitle;
			}
			else
			{
				document.title = websiteTitle + " » " + inboundSection.find('h1').eq(0).text();
			}

			// animation code
			$('section').animate({left: '-=' + outboundSection.width() + 'px'},250,function(){
				// when animation is done, remove the old content
				outboundSection.remove();
				// animate the AJAX container to the height of the new content.
				container.animate({height: inboundSection.height()},400);
			});
		});
	
		// scroll the page to the top
		$("html, body").animate({ scrollTop: 0 }, "slow");

		// shut down that hyperlink
		event.preventDefault();
	});
}
