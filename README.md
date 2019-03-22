# cc-license-chooser

This is the Creative Commons JavaScript license selector in the form of a
JavaScript widget.

Web browsers can only be expected to load a single file from us.


## Updates

This is an updated version of the JavaScript license chooser.
- It only shows 4.0 licenses
- It can show CC0 as well
- Only in en_US right now

If you're already using the code, you might find this hosted version useful:
- http://api.creativecommons.org/jswidget/tags/mattl/complete.js?locale=en_US


## Overview

The code is structured as follows:
- An HTML page includes `complete.js`, which PHP renders
  - they can pass a variable on the query string to set the language, which is
    why we involve PHP
  - an alternate design would be to include different static files:
    `complete.en.js`, etc.
- `complete.js` loads the CSS and static JS files that hardly change
- `complete.js` loads `template.js.var` (for Apache Content Negotiation to pick
  a language) or `template.js.LANG_ID` if a language was specified

All of our JS and HTML and CSS is prefixed with `cc_js_` to avoid namespace
collisions with others' applications.

Every night, if you run `make -s` here, it'll update the translations and
jurisdiction info.


## Renamed

This project was previously named `LicenseChooser.js`.


## Old Version

The old version of the JavaScript license chooser:
- [cc-archive/jswidget](https://github.com/cc-archive/jswidget)


## Credits

- http://www.html2dom.com/html2dom.js gave me `html2dom.js`. The author writes:
> I’m not familiar with the all license options, so I don’t even bother.
> Everything on posted this site is public domain
> (http://www.phpied.com/html2dom/)
