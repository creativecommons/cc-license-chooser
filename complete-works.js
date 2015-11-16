<?php
ob_start("ob_gzhandler");
/**
 * NOTE: Don't be fooled by the extension.  This gets intepreted by the PHP
 * interpreter.  That way I can dispatch based on the query string.
 *
 * See .htaccess for how to configure it for php5.
 */
require_once('accept-to-gettext.inc.php');
require_once("phphelpers.php");

$supported_gettext_languages = list_languages();

/* Prepare for internationalization. */
$mime = 'text/javascript'; // real MIME type of this document
$lang = 'en-US'; // default language
$gettextlang = 'en_US'; // default language, gettext style
$charset = 'UTF-8'; // default charset for this document

/* Did the user request a language? */
/* First check if we were called with ?locale=XX and dispatch accordingly */
if (array_key_exists('locale', $_GET) &&
    // valid locales are lower or upper case alphas plus _ or -
    preg_match('/^([a-zA-Z-_]+)$/', $_GET['locale']) &&
    in_array($_GET['locale'], $supported_gettext_languages))
  {
    $gettextlang = $_GET['locale'];
    $lang = str_replace('-', '_', $gettextlang);
  }
 else {
   $values = al2gt($supported_gettext_languages);
   if ($values['gettextlang'] != '') {
     $gettextlang = $values['gettextlang'];
     $lang = $values['lang'];
     $charset = $values['charset'];
   }
 }

/*  No matter what, emit headers to the browser indicating what we will be sending. */
emit_language_and_type_header($lang, $charset, $mime);

/******** i18n preparation done. ************
 * time to send out the actual JS. */

/* Load the prerequisite JS files */
$pre_reqs = array('js/cc-prereq.js', 'js/safari-label-fix.js', 'js/cc-tooltip.js', 'js/cc-jurisdictions.js', 'js/cc-license.js');
foreach ($pre_reqs as $pre_req) {
    echo file_get_contents($pre_req);
}

/* Send out the translations, too. */
echo file_get_contents('cc-translations.js.' . $gettextlang);

/* NOTE: I do not include the CSS stylesheet
   and instead I let others style our boxes the way they want. */

/* Determine which template file the user wanted */

$extras = array();

if ((array_key_exists('jurisdictions', $_GET)) && ($_GET['jurisdictions'] == 'disabled')) {
    $extras[] = 'nojuri';
}
if (array_key_exists('want_a_license', $_GET)) {
    if ($_GET['want_a_license'] == 'definitely') {
	$extras[] = 'definitely_want_license';
    } elseif ($_GET['want_a_license'] == 'no_license_by_default') {
	$extras[] = 'no_license_by_default';
    } elseif ($_GET['want_a_license'] == 'at_start') {
	$extras[] = 'wrong_argument';
	// No extras
	// the license box chooser will be in by default
    }
}

/* Now, send out the appropriate template. */
/* First, calculate the base filename (without language) */

sort($extras);
$extras_string = implode('.', $extras);
if ($extras_string) {
    $template_dot_js = 'template.' . $extras_string . '.js';
} else {
    $template_dot_js = 'template.js';
}

/* Then tack on the gettext language. */
$template_filename = $template_dot_js . '.' . $gettextlang;

/* Slurp them in and send them. */
echo file_get_contents($template_filename);

/* Finally, initialize the JS. */
echo file_get_contents('js/init.js');
