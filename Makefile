all: check_depends template.en_US.js cc-translations.js.en_US

check_depends:
	python depends.py

up_to_date:
	svn up > /dev/null

template.en_US.js: template.html gen_template_js.py license_xsl/licenses.xml
	python gen_template_js.py template.html
	python update_jurisdictions.py

cc-translations.js.en_US: template.html license_xsl/licenses.xml
	python gen_translations.py

clean:
	rm -f $(shell ls -1 template.*js*)
	rm -f $(shell ls -1 cc-transla*js*)
	rm -rf $(shell ls -1 js/cc-jurisdictions.js)
	rm -f $(shell ls -1 *.pyc)
