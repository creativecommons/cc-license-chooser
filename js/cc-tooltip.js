// <!--
/**
 * Creative Commons has made the contents of this file
 * available under a CC-GNU-GPL license:
 *
 * http://creativecommons.org/licenses/GPL/2.0/
 *
 * A copy of the full license can be found as part of this
 * distribution in the file COPYING.
 *
 * You may use this software in accordance with the
 * terms of that license. You agree that you are solely 
 * responsible for your use of this software and you
 * represent and warrant to Creative Commons that your use
 * of this software will comply with the CC-GNU-GPL.
 *
 * $Id: $
 *
 * Copyright 2005-2006, Creative Commons, www.creativecommons.org.
 *
 * cc-tooltip.js
 *
 * This is a quick javascript to generate g_tooltips. Put this script in the
 * head or somewhere. Just make sure to call init_tip() first.
 *
 * Need to make sure to also add this to your html somewhere:
 * <div id="tip_cloak" style="position:absolute; visibility:hidden; z-index:100">hidden tip</div>
 *
 */

/* Browser specific checks */
var cc_js_g_dom   = (document.getElementById) ? true : false;

/* If it's IE, handle it specially. */

var cc_js_g_ie5   = ((navigator.userAgent.indexOf("MSIE")>-1) && cc_js_g_dom) ? 
              true : false;

/* Otherwise, just pretend everyone's greater than or equal to
 * Netscape 5.
 *
 * Probably a reasonable guess.
 */

var cc_js_g_ns5   = ! cc_js_g_ie5;

/*
 * And everyone gets the dyn stuff, 'cause like, why not?
 */

var cc_ns_g_nodyn = false;

// NOTE: This avoids older error event in older browsers.
if (cc_ns_g_nodyn) { event = "no"; }

/* GLOBAL VARIABLES have a g_ prefix for var names */

var cc_js_g_follow_mouse  = false;// if true then tip follows mouse
var cc_js_tip_width           = 175;  // the generic width of a tip
var cc_js_g_off_x             = 20;   // x-offset for tip
var cc_js_g_off_y             = 10;   // y-offset for tip
var cc_js_g_popup_timeout     = 500;  // popup timeout
var cc_js_g_tooltip, cc_js_g_tipcss;        // globals for tooltip and tip css
var cc_js_g_timeout1, cc_js_g_timeout2;     // for setting timeouts
var cc_js_g_tip_on            = false;// check if over tooltip over link
var cc_js_g_mouse_x, cc_js_g_mouse_y;       // track the mouse coordinates

function cc_js_initTip() { init_tip(); }
/**
 * This initializes the cc_js_g_tooltip code. cc_js_g_tooltip is a global variable. Also
 * this sets up mouse tracking with cc_js_g_follow_mouse if set to true.
 */
function cc_js_init_tip() {
    if (cc_ns_g_nodyn) { return; }
    cc_js_g_tooltip   = cc_js_$('tip_cloak');
    cc_js_g_tipcss    = cc_js_g_tooltip.style;
    
    if (cc_js_g_tooltip && cc_js_g_follow_mouse) {
        document.onmousemove = track_mouse;
    }
}

/**
 * This build the tooltip and makes it visible..
 */
function cc_js_on_tooltip(evt, img) {
    if (!cc_js_g_tooltip) { return; }
    if (cc_js_g_timeout1) { clearTimeout(cc_js_g_timeout1); }   
    if (cc_js_g_timeout2) { clearTimeout(cc_js_g_timeout2); }
    cc_js_g_tip_on = true;
    
    var tip = '<div class="cc_js_tooltipimage"><img src="' + img + 
              '" border="0"/></div>';
    cc_js_g_tooltip.innerHTML = tip;

    if (!cc_js_g_follow_mouse) cc_js_position_tip(evt);
    else { cc_js_g_timeout1 = setTimeout("cc_js_g_tipcss.visibility='visible'", 
                                 cc_js_g_popup_timeout); }
}

/**
 * This is a generic cc_js_g_tooltip for displaying any html inside of a box.
 */
function cc_js_on_tooltip_html(evt, html) {
    if (!cc_js_g_tooltip) { return; }
    if (cc_js_g_timeout1) { clearTimeout(cc_js_g_timeout1); }   
    if (cc_js_g_timeout2) { clearTimeout(cc_js_g_timeout2); }
    cc_js_g_tip_on = true;
    
    var tip = '<div class="cc_js_tooltip">' + html + '</div>';
    cc_js_g_tooltip.innerHTML = tip;

    if (!cc_js_g_follow_mouse)  {
        cc_js_position_tip(evt);
    } else  {
        cc_js_g_timeout1 = setTimeout("cc_js_g_tipcss.visibility='visible'", 
                                cc_js_g_popup_timeout);
    }
}

function cc_js_track_mouse(evt) {
    cc_js_g_mouse_x = (cc_js_g_ns5) ? evt.pageX : 
                          window.event.clientX + document.body.scrollLeft;
    cc_js_g_mouse_y = (cc_js_g_ns5) ? evt.pageY : 
                          window.event.clientY + document.body.scrollTop;
    if (cc_js_g_tip_on) { cc_js_position_tip(evt); }
}

/**
 * This function cc_js_positions the tooltip.
 */
function cc_js_position_tip(evt) {
    if (!cc_js_g_follow_mouse) {
        cc_js_g_mouse_x = (cc_js_g_ns5)? evt.pageX : window.event.clientX + 
                    document.body.scrollLeft;
        cc_js_g_mouse_y = (cc_js_g_ns5)? evt.pageY : window.event.clientY + 
                    document.body.scrollTop;
    }
    // tooltip width and height
    var tpWd = (cc_js_g_ie5)? cc_js_g_tooltip.clientWidth : cc_js_g_tooltip.offsetWidth;
    var tpHt = (cc_js_g_ie5)? cc_js_g_tooltip.clientHeight : cc_js_g_tooltip.offsetHeight;
    // document area in view (subtract scrollbar width for ns)
    var winWd = (cc_js_g_ns5)? window.innerWidth - 20 + 
                window.pageXOffset : document.body.clientWidth + 
                                     document.body.scrollLeft;
    var winHt = (cc_js_g_ns5)? window.innerHeight - 20 + window.pageYOffset : 
                document.body.clientHeight + document.body.scrollTop;
    // check mouse position against tip and window dimensions
    // and position the cc_js_g_tooltip 
    if ((cc_js_g_mouse_x + cc_js_g_off_x + tpWd) > winWd) {
        cc_js_g_tipcss.left = cc_js_g_mouse_x - (tpWd + cc_js_g_off_x) + "px";
    } else { cc_js_g_tipcss.left = cc_js_g_mouse_x + cc_js_g_off_x + "px"; }
    if ((cc_js_g_mouse_y + cc_js_g_off_y + tpHt) > winHt)  {
        cc_js_g_tipcss.top = winHt - (tpHt + cc_js_g_off_y) + "px";
    } else { cc_js_g_tipcss.top = cc_js_g_mouse_y + cc_js_g_off_y + "px"; }
    if (!cc_js_g_follow_mouse)  {
        cc_js_g_timeout1 = setTimeout("cc_js_g_tipcss.visibility='visible'", 
                                cc_js_g_popup_timeout);
    }
}

/**
 * Hides the tooltip.
 */
function cc_js_hide_tip() {
    if (!cc_js_g_tooltip) { return; }
    cc_js_g_timeout2 = setTimeout("cc_js_g_tipcss.visibility='hidden'", cc_js_g_popup_timeout);
    cc_js_g_tip_on = false;
}

//-->
