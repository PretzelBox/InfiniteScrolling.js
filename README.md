#infinitescrolling.js

plug-and-play support for infinite scrolling on AmeriCommerce category pages.

This script works by monitoring the bottom of the `$(window)` until it's within the last row of products in `.product-list`, at which point it will load the next page, find the products in said page, and append them to the current `.product-list`.

It uses the `?asyncpi` query string to keep track of the current page.

Use `$(document).on('ajaxLoad', function() { /* ... */ });` to call functions onload for new products.

By default, it will hide the Product Count, Show Per Page, and pagination, as these are unnecessary with the Infinite Scroll functionality. To change this, edit lines 116-124.