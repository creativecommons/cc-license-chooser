// <![CDATA[
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
 * Copyright 2007, Creative Commons, www.creativecommons.org.
 * @author Asheesh Laroia <asheesh@asheesh.org>
 *
 * This is code to let Safari uses click on labels and end up with
 * check marks in checkboxes.
 */

function cc_js_call_me_on_label_selection(element) {
    // If we are not Safari, get out of here.
    // Note that even Konqueror doesn't need this fix.
    if (navigator.userAgent.indexOf('Safari') < 0) {
    	return;
    }
    // Otherwise, I guess someone clicked on the label called element
    // and I should click an associated checkbox.
    var find_this_id = element.htmlFor;
    find_this_id = find_this_id.substring('cc_js_'.length()); // remove leading cc_js_ 
    var check_me = cc_js_$(find_this_id);
    if (check_me === null) {
	return; // if there's nothing to check, that's odd but we're
		// not gonna do anything about it
    }
    
    check_me.focus();
    if (check_me.getAttribute('type') == 'checkbox') {
	if (!check_me.checked) {
	    check_me.checked = true;
	} else {
	    check_me.checked = false;
	}
    }

    cc_js_modify();
}

// ]]>
