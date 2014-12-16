/*
 * InfiniteScrolling.js by Joah Gerstenberg
 *
 * Adds infinite scrolling to AmeriCommerce Category pages.
 *
 * This script works by monitoring the bottom of the $(window) until it's
 * within the last row of products in .product-list, at which point it
 * will load the next page, find the products in said page, and append
 * them to the current .product-list.
 *
 * It uses the ?asyncpi query string to keep track of the current page.
 * 
 * Use $(document).on('ajaxLoad', function() { ... }); to call 
 * functions onload for new products.
 *
 * By default, it will hide the Product Count, Show Per Page, and
 * pagination, as these are unnecessary with the Infinite Scroll
 * functionality. To change this, edit lines 116-124.
 */

function parseQuery() {
  var ar = location.search.match(/(\?|&).[^\?&]*/gi);
  var obj = {};
  for (var i = 0; i < ar.length; i++) {
    var temp = ar[i].substr(1, ar[i].length-1).split('=');
    obj[temp[0]] = temp[1];
  }
  return obj;
}

function compileQuery(o) {
  var temp = parseQuery();
  temp[o['key']] = o['val'];
  return '?' + $.param(temp);
}

var loaded = {};
var current = parseInt((function() {
  if (parseQuery()['pi']) {
    return parseQuery()['pi'];
  }
  return '1';
})(), 10);
var keepGoing = true;

function loadNext(isInitial) {
  if (!keepGoing) {
    $('.async-helper').remove();
    return false;
  }
  
  var nextPage = (function() { 
    if (isInitial) {
      return current + 1;
    } else if (parseQuery()['asyncpi']) {
      return parseInt(parseQuery()['asyncpi'], 10) + 1;
    } else {
      return 2;
    }
  })();
  
  if (loaded[nextPage]) {
    return false;
  }
  
  if (!isInitial) {
    $('.product-list').append('<div class="async-helper" style="height:1000px"></div>');
  }
  
  loaded[nextPage] = true;
  current = nextPage;
  
  if (!isInitial) {
    var newPath = location.pathname + compileQuery({ 'key': 'asyncpi', 'val': nextPage });
    window.history.replaceState({ path: newPath }, '', newPath);
  }
  
  $.ajax({
    url: location.pathname + compileQuery({ 'key': 'pi', 'val': nextPage }),
    type: 'GET',
    dataType: 'html',
    success: function(d) {
      var pl = $(d).find('.product-list');
      $('.product-list').find('.async-helper').remove();
      if (pl.html()) {
        $('.product-list').append(pl.html());
        $(document).trigger('ajaxLoad');
      } else {
        keepGoing = false;
        var newPath = location.pathname + compileQuery({ 'key': 'asyncpi', 'val': parseInt(parseQuery()['asyncpi'], 10) - 1 });
        window.history.replaceState({ path: newPath }, '', newPath);
      }
    },
    error: function(d) {
      console.log(d);
    }
  })
}

function loadTo(pi) {
  for (var i = 0; i < (pi - current); i++) {
    setTimeout(function() {
      loadNext(true);
    }, 150 * i);
  }
}

$(window).scroll(function() {
  if (($('.product-list').offset().top + $('.product-list').height()) - ($(window).scrollTop() + $(window).height()) < $('.product-list .row').last().height()) {
    loadNext();
  }
});

$(document).ready(function() {

  /* Hide Unnecessary Stuff
  **************************/

  $('[id*=lblProductCountTop]').each(function() { $(this).parent().attr('style', 'display: none !important;'); });
  $('[id*=lblNumPerPageDropDownLabel]').each(function() { $(this).parent().attr('style', 'display: none !important;'); });
  $('ul.pagination').each(function() { $(this).parent().parent().attr('style', 'display: none !important;'); });

  /**************************
  End Hide Unnecessary Stuff */


  if (parseQuery()['asyncpi']) {
    loadTo(parseInt(parseQuery()['asyncpi'], 10));
  }
});