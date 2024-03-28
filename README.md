# cc-license-chooser

This is the Creative Commons JavaScript license selector in the form of a
JavaScript widget.

Web browsers can only be expected to load a single file from us.

## Code of conduct

[`CODE_OF_CONDUCT.md`][org-coc]:
> The Creative Commons team is committed to fostering a welcoming community.
> This project and all other Creative Commons open source projects are governed
> by our [Code of Conduct][code_of_conduct]. Please report unacceptable
> behavior to [conduct@creativecommons.org](mailto:conduct@creativecommons.org)
> per our [reporting guidelines][reporting_guide].

[org-coc]: https://github.com/creativecommons/.github/blob/main/CODE_OF_CONDUCT.md
[code_of_conduct]: https://opensource.creativecommons.org/community/code-of-conduct/
[reporting_guide]: https://opensource.creativecommons.org/community/code-of-conduct/enforcement/


## Contributing

See [`CONTRIBUTING.md`][org-contrib].

[org-contrib]: https://github.com/creativecommons/.github/blob/main/CONTRIBUTING.md

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


## Local Development

To run this project locally, install Python requirements listed in `requirements.txt` using:
`pip install -r requirements.txt`.

[SimpleTAL](https://www.owlfish.com/software/simpleTAL/) is not available on
PyPI and must be installed manually by downloading the latest release and
installing it using `python setup.py install` (make sure to download the Python
2.7 compatible release, not the latest release). Using a virtualenv is
recommended, if you don't install SimpleTAL in a virtualenv, you may have to
add its install location to your environment's `PYTHONPATH`.


## Renamed

This project was previously named `LicenseChooser.js`. The name was updated to
`cc-license-chooser` in 2019 March to follow current JavaScript best
practices.


## Old Version

The old version of the JavaScript license chooser:
- [cc-archive/jswidget](https://github.com/cc-archive/jswidget)


## Credits

- http://www.html2dom.com/html2dom.js gave me `html2dom.js`. The author writes:
> I’m not familiar with the all license options, so I don’t even bother.
> Everything on posted this site is public domain
> (http://www.phpied.com/html2dom/)
