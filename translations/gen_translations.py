#!/usr/bin/python
import glob
import re
import os
import sys
import json
sys.path.insert(0, "./license_xsl/licensexsl_tools")
import convert
import gen_template_js

# Look with a cheesy regex for cc_js_t('something') calls
def findall(s):
    utf8_single_quote = re.findall(r'''cc_js_t[(]'(.*?)'[)]''', s)  # Left single quotes to avoid messing with RegExes
    utf8_single_quote = [k.replace(r"""\'""", "'") for k in utf8_single_quote]
    utf8_double_quote = re.findall(r'''cc_js_t[(]"(.*?)"[)]''', s)
    utf8_double_quote = [k.replace(r'''\"''', '"') for k in utf8_double_quote]
    utf8 = set(utf8_single_quote + utf8_double_quote)
    return utf8

def translation_table_to_js_function_body(table):
    ## NOTE WEIRD CHARSET ASSUMPTIONS
    ## This does input and output in pure Unicode strings, even though
    ## there's no such thing in JavaScript.  Just encode() the output of
    ## me to utf-8.

    ret = u""
    template = u" if (s == %s) { return %s; } \n"
    for orig_key in table:
        try:
            key = unicode(orig_key)
        except:
            key = unicode(orig_key, 'utf-8')
        ret += template % (json.dumps(key), json.dumps(table[orig_key]))
    ret += 'alert("Falling off the end.");\n'
    ret += 'return s;'
    return ret

def main():
    languages = sorted([ s.split(os.path.sep)[-2] for s in glob.glob('license_xsl/i18n/i18n_po/*/cc_org.po')])

    translate_all_of_me = findall(open('template.html').read())
    translate_all_of_me.update(findall(open('js/cc-license.js').read()))
    translate_all_of_me = list(translate_all_of_me)
    # Plus, translate all the jurisdiction names
    translate_all_of_me.append("Unported")
    translate_all_of_me.extend([convert.country_id2name(k, 'en') for k in gen_template_js.grab_license_ids()])

    print 'This is what we will translate:', translate_all_of_me

    for lang in languages:
        translation_table = {}
        for english in translate_all_of_me:
            translation_table[english] = convert.extremely_slow_translation_function(english, lang)
        fn_body = translation_table_to_js_function_body(translation_table)
        fn = '''function cc_js_t(s) {
        %s
        }''' % fn_body
        fd = open('cc-translations.js.%s' % lang, 'w')
        fd.write(fn.encode('utf-8'))
        fd.close()
    # Whew.  Generated some JS files.  Now should also make some .var
    # file for those who can't use these.
    gen_template_js.create_var_file(my_variants = None, languages=languages, base_filename='cc-translations.js')


if __name__ == '__main__':
    main()
