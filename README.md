# InfiniteScrolling.js

Adds infinite scrolling to AmeriCommerce Category pages.

----

###Usage

Enable it by calling `.infiniteScroll();` on `$('.product-list')` (or the wrapper containing the product list) - which, in Base, is `.product-list`.

It uses the `?asyncpi` query string to keep track of the current page.

You may provide an options object as a parameter when you call `.infiniteScroll()` with the following options:

  - `onclick`: specify a selector to monitor for click events to trigger 
      the load event*
  - `selector`: specify a different selector (defaults to whatever you called
      `.infiniteScroll()` on) to grab from AJAX-loaded page.
  - `loader`: specify a path for a gif to display while loading (only used when
      `onclick` isn't empty).

*Otherwise, this script works by monitoring the bottom of the `$(window)` until it's within the last row of products in `.product-list`, at which point it will load the next page, find the products in said page, andappend them to the current `.product-list`.

Use `$(document).on('ajaxLoad', function() { /* ...*/ });` to call functions `onload` for new products.

By default, it will hide the Product Count, Show Per Page, andpagination, as these are unnecessary with the Infinite Scroll functionality. To change this, edit lines 152-160.

---

###Examples

See the `examples` directory for modified Base category pages with the infinite scrolling script inserted.

`examples/withbutton.ac.html` has a "Load More Products" button to trigger the load event.

`examples/withoutbutton.ac.html` has the load event triggered on `$(window).scroll`.