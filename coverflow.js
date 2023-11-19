$(document).ready(function() {
    const coverflowImages = (options) => {
        let $overlay = $('#coverflowoverlay');
        let $enlargeArea = $('#coverenlargearea');
        if (!$overlay.length) {
            $overlay = $('<div id="coverflowoverlay" />').appendTo('body');
            $enlargeArea = $('<div id="coverenlargearea" />').appendTo('body');
        }
        const $overlayEnlarge = $overlay.add($enlargeArea);
        const $wrap = $('#' + options.coverid);
        const $frame = $wrap.find('div.frame:eq(0)');
        let frameInnerHTML = '';
        let activeItem = -1;
        const onSelectedItemClick = options.onselecteditemclick || selectedItemAction;

        // Preload images
        options.images.forEach((image) => {
            if (image[1] && options.preloadlarge) {
                const img = new Image();
                img.src = image[1];
            }
        });

        // Generate frame inner HTML
        options.images.forEach((image, index) => {
            frameInnerHTML += `<li style="background-image:url(${image[0]})" data-itemindex="${index}"></li>\n`;
        });
        $frame.find('ul:eq(0)').html(frameInnerHTML);

        const selectedItemAction = (e, activeItem) => {
            $overlay.css({ opacity: 0.9, zIndex: 1000 });
            $enlargeArea.html(
                `<img src="${options.images[activeItem][1]}" />` +
                (options.images[activeItem][2] ? `<div id="desc">${options.images[activeItem][2]}</div>` : '')
            );

            $enlargeArea.css({ opacity: 1, zIndex: 1001 })
                .data('isvisible', true)
                .find('img:eq(0)')
                .css({ maxWidth: $(window).width() * 0.95, maxHeight: $(window).height() });
            e.stopPropagation();
        };

        // Initialize Sly plugin
        $frame.sly({
            horizontal: 1,
            itemNav: 'forceCentered',
            smart: 1,
            activateMiddle: 1,
            activateOn: 'click',
            mouseDragging: 1,
            touchDragging: 1,
            releaseSwing: 1,
            startAt: 1,
            scrollBar: $wrap.find('.scrollbar'),
            scrollBy: 1,
            speed: 300,
            elasticBounds: 1,
            easing: 'swing',
            dragHandle: 1,
            dynamicHandle: 1,
            clickBar: 1,
            // Navigation buttons
            pagesBar: $wrap.find('.pages'),
            activatePageOn: 'click',
            // Callbacks
            active: (eventName, itemIndex) => {
                activeItem = itemIndex;
            }
        });

        $(window).on('resize', () => {
            $frame.sly('reload');
        });

        $frame.on('click', 'li', (e) => {
            const itemIndex = $(e.currentTarget).data('itemindex');
            if (itemIndex === activeItem) {
                onSelectedItemClick(e, activeItem);
            }
        });

        $overlayEnlarge.off().on('click', () => {
            if ($enlargeArea.data('isvisible')) {
                $overlayEnlarge.css({ opacity: 0, zIndex: -1 });
                $enlargeArea.data('isvisible', false);
            }
        });
    };

    // Initialization code
    coverflowImages({
        coverid: 'coverflow1',
        images: [
            ['images/thumbs/nassmall.jpg', 'images/nas.jpg','Angelina Jolie, is an American actress and filmmaker, and an Academy Award winner'],
            ['images/thumbs/nasrasmall.jpg', 'images/nasra.jpg', 'Milla Jovovich was born in Ukraine and immigrated with her parents to the United States when she\'s five.'],
            ['images/thumbs/nasrakassimsmall.jpg', 'images/nasrakassim.jpg'],
            ['images/thumbs/kassimsmall.jpg', 'images/kassim.jpg', 'Hayden Panettiere is a native of New York, and first appeared in a commercial at the age of 11 months.'],
            ['images/thumbs/nasmall.jpg', 'images/nas.jpg', 'Ashley was born in Granada Hills, California. She is the daughter of Naomi Judd, a country music singer and motivational speaker'] // <-- no comma after last image

],
        preloadlarge: true
    });
});
