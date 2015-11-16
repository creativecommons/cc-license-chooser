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
 * Copyright 2006, Creative Commons, www.creativecommons.org.
 *
 * This is code that is used to generate licenses.
 *
 */

var cc_js_secret_license_url;
var cc_js_secret_disabled = [];

function cc_js_disable_widget() {
	message = cc_js_t('No license chosen');
	/* Clear the form fields out */
	/* save the license URL, the rest will be calculated from that */
	if (cc_js_license_array && 'url' in cc_js_license_array) {
		cc_js_secret_license_url = cc_js_license_array['url'];
		cc_js_license_array['url'] = '';
		cc_js_license_array['text'] = message;
	}
	cc_js_$('result_name').value = message;
	cc_js_secret_disabled = [];
	cc_js_$('result_uri').value = '';
	cc_js_$('result_img').value = '';
	// FIXME: localize below
	cc_js_insert_html(message, 'license_example');
	var boxes = ['remix', 'nc', 'sa'];
	for (var box_num = 0 ; box_num < boxes.length ; box_num++ ) { 
		box = boxes[box_num];
		if (cc_js_$(box).disabled == false) {
			cc_js_option_off(box);
			cc_js_secret_disabled.push(box);
		}
	}
	if (cc_js_$('jurisdiction')) {
		cc_js_$('jurisdiction').disabled = true;
	}
}

function cc_js_enable_widget() {
	/* restore the secret license URL, or if it's blank, the seed, or if that's blank, by 3.0 */
	for (var box_num = 0 ; box_num < cc_js_secret_disabled.length ; box_num++) {
		box = cc_js_secret_disabled[box_num];
		cc_js_option_on(box);
	}


    cc_js_option_on('remix');
    cc_js_option_on('nc');
    cc_js_option_on('sa');


    if (cc_js_$('jurisdiction')) {
		cc_js_$('jurisdiction').disabled = false;
	}
	cc_js_secret_disabled = [];
	cc_js_init();
}

function cc0_js_enable_widget() {
	/* restore the secret license URL, or if it's blank, the seed, or if that's blank, by 3.0 */

    cc_js_disable_widget();

    var strVar="";
    strVar += "<p xmlns:dct=\"http:\/\/purl.org\/dc\/terms\/\">";
    strVar += "<a rel=\"license\" href=\"http:\/\/creativecommons.org\/publicdomain\/zero\/1.0\/\">";
    strVar += "<img src=\"http:\/\/i.creativecommons.org\/p\/zero\/1.0\/88x31.png\" style=\"border-style: none;\" alt=\"CC0\"\/>";
    strVar += "<\/a>";
    strVar += "<br\/>";
    strVar += "To the extent possible under law, ";
    strVar += "<span rel=\"dct:publisher\" resource=\"[_:publisher]\">the person who associated CC0<\/span>";
    strVar += " with this work has waived all copyright and related or neighboring";
    strVar += " rights to this work.";
    strVar += "<\/p>";


    
    
	message = cc_js_t(strVar);

    cc_js_secret_license_url = 'http://creativecommons.org/publicdomain/zero/1.0/';
    
     
    //cc_js_$('result_name').value = message;
    
    cc_js_insert_html(message, 'license_example');

    cc_js_$('result_uri').value = 'http://creativecommons.org/publicdomain/zero/1.0/'; 
    cc_js_$('result_img').value = 'http://i.creativecommons.org/p/zero/1.0/88x31.png'; 
    cc_js_$('result_name').value = 'CC0 1.0 Universal (CC0 1.0) Public Domain Dedication'; 
    
}




// NOTE we have the object freedoms for dealing with freedom style choosing
var cc_js_share, cc_js_remix, cc_js_nc, cc_js_sa;

var cc_js_reset_jurisdiction_array = false;
var cc_js_default_jurisdiction = 'generic'; // the seed may change this

/**
 * cc_js_license_array is an array of our license options from global
 * variables...scary!
 * 
 * Here is what we are putting in this (its basically an object):
 *
 * cc_js_license_array['code'] = '';
 * cc_js_license_array['version'] = '';
 * cc_js_license_array['full_name'] = ''; // 'name' is reserved
 * cc_js_license_array['text'] = ''; cc_js_license_array['img'] = '';
 * cc_js_license_array['jurisdiction'] = '';
 * cc_js_license_array['generic'] = '';
*/
var cc_js_license_array;

var cc_js_license_root_url        = 'http://creativecommons.org/licenses';

var cc_js_warning_text            = '';

/**
 * Initialise our license codes, and reset the UI
 */
function cc_js_init() {
    /* default: by */
    
    
    cc_js_share = true;
    cc_js_remix = true;
    cc_js_nc    = false;
    cc_js_sa    = false;
    if ( cc_js_$("share") && cc_js_$("remix") ) {
	cc_js_$("share").checked = true;
	cc_js_$("remix").checked = true;
    }
    
    
    
    // But if there's a hidden form field telling us what to do,
    // then by Jove let's do that!
    cc_js_license_array = new Array();
    if (cc_js_$('seed_uri')) {
	cc_js_secret_license_url = cc_js_$F('seed_uri');
    }
    if (cc_js_secret_license_url) {
	cc_js_license_url_to_attributes(cc_js_secret_license_url);
    }
    
    else {
	// Otherwise, init this from scratch
	cc_js_modify(this);
    }
    
    
}

/**
 * TODO: Something here is broken! Please fix so we are really
 * getting the classnames!
 */
function cc_js_option_on (option) {
    var short_label_name = option + '-label';
    var label_name = 'cc_js_' + short_label_name;
    
    cc_js_$(option).disabled = false;
    
    if (option != 'share')  {
	cc_js_$(short_label_name).style.color = 'black';
    }
}

function cc_js_option_off (option) {
    var short_label_name = option + '-label';
    var label_name = 'cc_js_' + short_label_name;

    /** Commented-out code is removed because we have no share checkbox.
    	if ( cc_js_$(label_name).className )
	//    share_label_orig_class[label_name] = cc_js_$(label_name).className;
	
	//share_label_orig_color[label_name] = cc_js_$(label_name).style.color;
    */
    
    cc_js_$(option).disabled = true;
    cc_js_$(option).checked = false;
    cc_js_$(short_label_name).style.color = 'gray';
}

function cc_js_update_checkboxes_based_on_variables() {
    cc_js_$('share').checked = cc_js_share;
    cc_js_$('remix').checked = cc_js_remix;
    cc_js_$('nc').checked = cc_js_nc;
    cc_js_$('sa').checked = cc_js_sa;
}

function cc_js_update_variables_based_on_checkboxes() {	
    cc_js_share = cc_js_$('share').checked;
    cc_js_remix = cc_js_$('remix').checked;
    cc_js_nc = cc_js_$('nc').checked;
    cc_js_sa = cc_js_$('sa').checked;
}

/**
 * Main logic
 * Checks what the user pressed, sets licensing options based on it.
 */
function cc_js_modify(obj) {
    cc_js_warning_text = '';
    
    
    if ( cc_js_reset_jurisdiction_array ) {
	cc_js_reset_jurisdiction_list();
	cc_js_reset_jurisdiction_array = false;
    }
    
    cc_js_update_variables_based_on_checkboxes();
    cc_js_rest_of_modify();
}

function cc_js_rest_of_modify() {
    if ( cc_js_share && cc_js_remix ) {
	cc_js_option_on('share');
	cc_js_option_on('remix');
	cc_js_option_on('nc');
	cc_js_option_on('sa');
	
    } else if ( cc_js_share && !cc_js_remix ) {
	cc_js_option_on('share');
	cc_js_option_on('remix');
	cc_js_option_on('nc');
	cc_js_option_off('sa');
    } else if ( !cc_js_share && cc_js_remix ) {
	cc_js_option_on('share');
	cc_js_option_on('remix');
	cc_js_option_off('nc');
	cc_js_option_off('sa');
	
	// This next little block checks to see which 
	// jurisdictions support sampling and hides the ones
	// that don't
	// OH! You have to convert a list to an array object...
	var jurisdiction_options = cc_js_$('jurisdiction').options;
	for (var i = 0 ; i < jurisdiction_options.length; i++) {
		item = jurisdiction_options[i];
		if (item.value in cc_js_jurisdictions_array) {
		    if ('sampling' in cc_js_jurisdictions_array[item.value]) {
			if ( ! cc_js_jurisdictions_array[ item.value ]['sampling'] )
			    item.style.display = 'none';
		    }
		}
	    }
	
	cc_js_reset_jurisdiction_array = true;
	
    } else {
	// This is when nothing is selected
	cc_js_option_on('share');
	cc_js_option_on('remix');
	cc_js_option_off('nc');
	cc_js_option_off('sa');
    }
    
    // in this hacked version, it just calls update_hack direct
    cc_js_build_license_details();
    
    // Plus, update the hidden form fields with the name and uri
    cc_js_$('result_uri').value = cc_js_license_array['url'];
    cc_js_$('result_img').value = cc_js_license_array['img'];
    // FIXME: Is this the right way to localize?
    cc_js_$('result_name').value = 'Creative Commons ' + cc_js_license_array['full_name'] + ' ' + cc_js_license_array['version'] + ' ' + cc_js_t(cc_js_license_array['jurisdiction']);
}

/**
 * This resets the jurisdiction selection menu options' styles
 */
function cc_js_reset_jurisdiction_list ()
{
    var jurisdiction_options = cc_js_$('jurisdiction').options;
    for (var i = 0 ; i < jurisdiction_options.length; i++) {
	item = jurisdiction_options[i];
            item.style.display = 'block';
    }
    
}

function cc_js_position() {
    var pos = document.getElementsByName('pos');
    
    for (i = 0; i < pos.length; i++) {
	if ((pos[i].value == "floating") && (pos[i].checked)) return "position: fixed;";
    }
    return "margin-top:20px;";
}

function cc_js_license_url_to_attributes(url) {
    // this is not specified to work with sampling licenses
    // First assert that the root URL is at the start
    
    // This could be cleaned up a little.
    if (url.substr(0, cc_js_license_root_url.length) != cc_js_license_root_url) {
	return;
    }
    var remainder = url.substr(cc_js_license_root_url.length);
    
    if (remainder.substr(0, 1) != "/") {
	return;
    }
    remainder = remainder.substr(1);
    var parts = remainder.split("/");
    cc_js_set_attribs(parts[0]);
    if (parts.length > 1) {
	cc_js_set_version(parts[1]);
    }
    if (parts.length > 2) {
	cc_js_set_jurisdiction(parts[2]);
    }
    cc_js_rest_of_modify();
    if (parts[1] != cc_js_license_array['version']) {
	// if the versions are different, tell the user we upgraded his
	// license to the most recent license available for that jurisdiction
	var strong_warning = document.createElement('strong');
	
	if (cc_js_license_array['jurisdiction'] != "") {
	    // if they selected a jurisdiction:
	    strong_warning.appendChild(document.createTextNode(cc_js_t('We have updated the version of your license to the most recent one available in your jurisdiction.')));
	} else {
	    // if they selected no jurisdiction:
	    strong_warning.appendChild(document.createTextNode(cc_js_t('We have updated the version of your license to the most recent one available.')));
	}
	
	cc_js_$('license_example').appendChild(strong_warning);
    }
}

function cc_js_set_attribs(attrs) {
    var attrs_ra = attrs.split("-");
    for (var i = 0 ; i < attrs_ra.length; i++) {
	attr = attrs_ra[i];
	    if (attr == 'sa') {
		cc_js_share = true;
		cc_js_sa = true;
	    }
	    else if (attr == 'nc') {
		cc_js_nc = true;
	    }
	    else if (attr == 'nd') {
		cc_js_remix = false;
		cc_js_sa = false;
	    }
	}
    cc_js_update_checkboxes_based_on_variables();
}

function cc_js_set_version(ver) {
    // I do set the 'version', but during sanity-checking it is
    // overwritten by the latest version for the jurisdiction.  If
    // these disagree, we do alert the user.
    cc_js_license_array['version'] = ver;
}

function cc_js_set_jurisdiction(juri) {
    var juri_select = cc_js_$('jurisdiction');
    if (juri_select) {
	for (var i = 0 ; i < juri_select.childNodes.length; i++) {
	    var kid = juri_select.childNodes[i];
	    if (kid.value == juri) {
		kid.selected = 'selected';
	    }
	    else {
		kid.selected = '';
	    }
	}
    }
    // even if there is no jurisdiction selector,
    // we update the state
    cc_js_default_jurisdiction = juri;

}


function cc_js_build_license_url ()
{
    var license_url = cc_js_license_root_url + "/" + cc_js_license_array['code'] + 
	"/" + cc_js_license_array['version'] + "/" ;
    if ( cc_js_current_short_license_code(false)) {
        license_url += cc_js_current_short_license_code(true);
    }    
    cc_js_license_array['url'] = license_url;
}

/**
 * Builds the nicely formatted test about the work
 */
function cc_js_build_license_text ()
{
    var license_text     = '';
    var work_title       = '';
    var work_by          = '';
    var namespaces_array = new Array();
    
    var use_namespace_dc = false;
    var use_namespace_cc = false;
    
    var info_format_text = '';
    
    // I had to put this big try block around all the
    // prototype.js attempts to access nonexistent form fields...
    
    // The main bit of text including or not, jurisdiction love
    license_text_before_interpolation = cc_js_t("This ${work_type} is licensed under a <a rel=\"license\" href=\"${license_url}\">Creative Commons ${license_name} License</a>.");
    license_text = cc_js_gettext_style_interpolate(license_text_before_interpolation, {'work_type': cc_js_t('work'), 'license_url': cc_js_license_array['url'], 'license_name': (cc_js_license_array['full_name'] + ' ' + cc_js_license_array['jurisdiction'] + ' ' + cc_js_license_array['version'])});

    var namespace_text = '';
    if ( use_namespace_cc )
	{ namespaces_array.push('xmlns:cc="http://creativecommons.org/ns#"'); }
    
    if ( use_namespace_dc )
	{ namespaces_array.push('xmlns:dc="http://purl.org/dc/elements/1.1/"'); }
    if ( namespaces_array.length > 0 ) {
	namespace_text = '<span';
        for (var i = 0 ; i < namespaces_array.length; i++) {
		ns = namespaces_array[i];
                namespace_text += ' ' + ns;
	}
	namespace_text += '>';
	
	license_text = namespace_text + license_text + '</span>';
    }
    
    
    
    
    // set the array container here
    cc_js_license_array['text'] = license_text;
}

function cc_js_current_short_license_code(slash) {
	ret = ''
	if (cc_js_$('jurisdiction') && cc_js_$F('jurisdiction') != 'generic') {
		ret = cc_js_$F('jurisdiction');
	}
	else if (cc_js_default_jurisdiction == 'generic') {
		return ''; // even if slashed
	}
	else {
		ret = cc_js_default_jurisdiction;
	}
	if (slash) {
		ret = ret + '/';
	}
	return ret;
}

function cc_js_build_license_image ()
{
    cc_js_license_array['img'] = 
	'http://i.creativecommons.org/l/' + cc_js_license_array['code'] + 
	"/" + cc_js_license_array['version'] + "/" + 
	cc_js_current_short_license_code(true) + 
	'88x31.png';
}

/**
 * Builds the jurisdictions and sets things up properly...
 */
function cc_js_build_jurisdictions ()
{
    
    
    // TODO: The following is not working in internet explorer on wine
    
    // THIS fixes the generic being the default selection...
    var current_jurisdiction = '';
    
    if ( cc_js_$F('jurisdiction') )
	current_jurisdiction = cc_js_$F('jurisdiction');
    else
	current_jurisdiction = cc_js_default_jurisdiction;
    
    cc_js_license_array['jurisdiction'] = 
	cc_js_jurisdictions_array[current_jurisdiction]['name'];
    cc_js_license_array['generic'] = 
	cc_js_jurisdictions_array[current_jurisdiction]['generic'];
    
    cc_js_license_array['sampling'] = 
	cc_js_jurisdictions_array[current_jurisdiction]['sampling'];
    
    // NOTE: This is all a bit hacky to get around that there are
    // only 2 customized jurisdictions with sampling licenses
    // If current jurisdiction doesn't have, then we just set
    // to generic sampling...cool?
    if ( cc_js_license_array['code'] == 'sampling' ) {
	if ( cc_js_jurisdictions_array[current_jurisdiction]['sampling'] ) {  
	    cc_js_license_array['version'] = 
		cc_js_jurisdictions_array[current_jurisdiction]['sampling'];
	} else {
	    cc_js_license_array['version'] =
		cc_js_jurisdictions_array['generic']['sampling'];
	    cc_js_license_array['generic'] = true;
	}
    } else
	cc_js_license_array['version'] = 
	    cc_js_jurisdictions_array[current_jurisdiction]['version'];
    
    
    if ( ! cc_js_license_array['version'] )
	cc_js_license_array['version'] = cc_js_default_version_number;
}

function cc_js_no_license_selection () {
    cc_js_$('license_selected').style.display = 'none';
}

function cc_js_some_license_selection () {
    cc_js_$('license_selected').style.display = 'block';
}

function cc_js_build_license_details ()
{
    cc_js_some_license_selection(); // This is purely cosmetic.
    
    if (!cc_js_share) {
	if (!cc_js_remix) {
	    cc_js_no_license_selection();
	    return;
	} else {
	    cc_js_update_hack('sampling', '1.0', 'Sampling', 'Remix');
	}
    } else {
	if (!cc_js_remix) {
	    if (cc_js_nc) {
		cc_js_update_hack('by-nc-nd', '2.5', 
				  'Attribution-NonCommercial-NoDerivs', 
				  'Share:NC:ND');
	    } else {
		cc_js_update_hack('by-nd', '2.5', 'Attribution-NoDerivs', 
				  'Share:ND');
	    }
	} else {
	    if (cc_js_nc) {
		if (cc_js_sa) {
		    cc_js_update_hack('by-nc-sa', '2.5', 
				      'Attribution-NonCommercial-ShareAlike', 
				      'Remix&Share:NC:SA');
		} else {
		    cc_js_update_hack('by-nc', '2.5', 
				      'Attribution-NonCommercial', 
				      'Remix&Share:NC');
		}
	    } else if (cc_js_sa) {
		cc_js_update_hack('by-sa', '2.5', 'Attribution-ShareAlike', 
				  'Remix&Share:SA');
	    } else {
		cc_js_update_hack('by', '2.5', 'Attribution', 'Remix&Share');
	    }
	}
    }
}

/**
 * This inserts html into an html element with the given insertion_id. 
 */
function cc_js_insert_html (output, insertion_id)
{
    cc_js_$(insertion_id).innerHTML = output;
    return true;
}

function cc_js_get_comment_code (msg)
{
    if ( ! msg )
	msg = "Creative Commonts License";
    
    return "<!-- " + msg + " -->\n";
}

/**
 * This builds our custom html license code using various refactored 
 * functions for handling all the nastiness...
 */
function cc_js_output_license_html ()
{
    var output = cc_js_get_comment_code() + '<a class="cc_js_a" rel="license" href="' + cc_js_license_array['url'] + '"><img alt="Creative Commons License" width="88" height="31" border="0" src="' + cc_js_license_array['img'] + '" class="cc_js_cc-button"/></a><div class="cc_js_cc-info">' + cc_js_license_array['text'] + '</div>';
    
    cc_js_insert_html( cc_js_warning_text + output, 'license_example');
    return output;
}

function cc_js_update_hack(code, version, full_name)
{
    cc_js_license_array = [];
    
    cc_js_license_array['code']       = code;
    cc_js_license_array['version']    = version;
    cc_js_license_array['full_name']  = full_name;
    cc_js_build_jurisdictions();
    
    old_url = cc_js_license_array['url'];

    // build_license_details();
    cc_js_build_license_url();
    new_url = cc_js_license_array['url'];
    if (old_url != new_url) {
	cc_js_build_license_text();
	cc_js_build_license_image();
	
	// our insert_html function also does some modifications on 
	var output = cc_js_output_license_html();
	if ( cc_js_$('result') )
	    cc_js_$('result').value = output;
    }
}

// ]]>
