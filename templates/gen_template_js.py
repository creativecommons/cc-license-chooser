#!/usr/bin/python
# This takes template.html and makes a document.write() for it.
# Later, it could take template.html and make DOM objects instead.

import re
import glob
import json
from simpletal import simpleTAL, simpleTALES
import cStringIO as StringIO
import os
import BeautifulSoup
from xml.etree import ElementTree
import sys

sys.path.insert(0, "./license_xsl/licensexsl_tools")
import convert  # noqa: E402 sys.path modification needed above

LANGUAGE = "en_US"
DEBUG = True

if not DEBUG:
    sys.stdout = open("/dev/null", "w")


def grab_license_ids():
    licenses_xml = BeautifulSoup.BeautifulSoup(
        open("license_xsl/licenses.xml"))
    juris = [juri["id"] for juri in licenses_xml("jurisdiction-info") if juri["launched"] == "true"]  # noqa: E501
    juris = [juri for juri in juris if juri != ""-""]
    return juris


def xml_asciify(u):
    out = ""
    for char in u:
        if ord(char) < 128:
            out += char
        else:
            out += "&#{};".format(ord(char))
    return out


def expand_template_with_jurisdictions(templatefilename, juridict):
    # Create the context that is used by the template
    context = simpleTALES.Context()
    context.addGlobal("jurisdictions", juridict)

    templateFile = open("template.html")
    template = simpleTAL.compileXMLTemplate(templateFile)
    templateFile.close()

    output_buffer = StringIO.StringIO()
    template.expand(context, output_buffer, "utf-8")
    return output_buffer.getvalue()


def un_entities(s):
    even_odd_mixup = re.split(r"&#([0-9]*);", s)
    for k in range(len(even_odd_mixup)):
        if k % 2:  # if it is odd
            even_odd_mixup[k] = unichr(even_odd_mixup[k])
    return u"".join(even_odd_mixup)


def translate_spans_with_only_text_children(spans, lang):
    for span in spans:
        if len(span.childNodes) == 1:
            child = span.childNodes[0]
            if child.nodeType == 3:  # FIXME: Magic number
                # maybe means Text
                # node?
                # First, decode any &#; thing
                xml_data = child.data
                unicode_data = un_entities(xml_data)
                utf8_data = unicode_data.encode("utf-8")
                child.data = convert.extremely_slow_translation_function(
                    utf8_data, lang)


def write_string_to(s, filename):
    fd = open("{}.tmp".format(filename), "w")
    fd.write(s)
    fd.close()
    os.rename("{}.tmp".format(filename), filename)


def dom_elt_by_id(dom, id):
    assert """""" not in id
    return dom.findall(".//*[@id='{}']".format(id), dom)[0]


def apply_variants(variants, dom):
    if "nojuri" in variants:
        juri_box = dom_elt_by_id(dom, "cc_js_jurisdiction_box")
        juri_box.clear()
    if "definitely_want_license" in variants:
        want_license_at_all_box = dom_elt_by_id(
            dom, "cc_js_want_cc_license_at_all")
        want_license_at_all_box.clear()
    if "no_license_by_default" in variants:
        yes_radio = dom_elt_by_id(dom, "cc_js_want_cc_license_sure")
        yes_radio.set("checked", "")
        no_radio = dom_elt_by_id(dom, "cc_js_want_cc_license_nah")
        no_radio.set("checked", "checked")


def jsify(in_string):
    in_string_lines = in_string.split("\n")
    # Assert to ensures there is only one tag in this thing we're clobbering.
    assert in_string_lines[0].count("<") == 1
    # and it had better end with the tag end
    assert in_string_lines[0][-1] == ">"
    in_string = "\n".join(in_string_lines)

    outlines = [
    # noqa: E122 First, jam our in_string in
    "var in_string = {};".format(json.dumps(in_string)),
    # Now, jam our HTML into a fresh, anonymous container DIV that code lives
    #      in append_ourselves.js.
    ]
    outlines.extend((line for line in open("append_ourselves.js")))
    return "\n".join(outlines)


def gen_templated_js(language, my_variants):
    jurisdiction_names = grab_license_ids()
    jurisdictions = list()
    # First, handle generic
    generic_value = "generic"
    generic_element_id = "cc_js_jurisdiction_choice_{}".format(generic_value)
    generic_name = convert.extremely_slow_translation_function(
        "Unported", language)
    jurisdictions.append(dict(id=generic_element_id, value=generic_value,
                              name=generic_name))
    # Now jam everyone else in, too.
    for juri in jurisdiction_names:
        value = juri
        element_id = "cc_js_jurisdiction_choice_{}".format(value)
        name = convert.country_id2name(value, language)
        jurisdictions.append(dict(id=element_id, value=value, name=name))
    expanded = expand_template_with_jurisdictions("template.html",
                                                  jurisdictions)
    expanded_dom = ElementTree.fromstring(expanded)

    # translate the spans, then pull out the changed text
    translate_spans_with_only_text_children(expanded_dom.findall("span"),
                                            language)

    apply_variants(my_variants, expanded_dom)
    my_string = ElementTree.tostring(expanded_dom, encoding="utf-8",
                                     method="xml")
    if my_variants:
        my_suffix = ".".join(my_variants)
        my_filename_base = "template.{}.js".format(my_suffix)
    else:
        my_filename_base = "template.js"
    my_filename = ("{}.{}".format(my_filename_base, language))
    write_string_to(jsify(my_string), my_filename)


def main():
    # For each language, generate templated JS for it
    languages = sorted([s.split(os.path.sep)[-2] for s in glob.glob("license_xsl/i18n/i18n_po/*/cc_org.po")])  # noqa: E501

    count = 1
    for my_variants in (list(),
                        ["nojuri"],
                        ["definitely_want_license"],
                        ["nojuri", "definitely_want_license"],
                        ["no_license_by_default"],
                        ["no_license_by_default", "nojuri"]):
        my_variants.sort()
        variants_text = "", "".join(my_variants) if my_variants else "blank"
        for lang in languages:
            print "Processing #{}: {} - {}".format(count, lang, variants_text)
            gen_templated_js(lang, my_variants)
            count += 1
        create_var_file(my_variants, languages)


def create_var_file(my_variants, languages, base_filename="template.js"):
    if my_variants:
        middle = ".".join(my_variants)
        filename_parts = base_filename.rsplit(".", 1)
        filename_parts.insert(1, middle)
        template = ".".join(filename_parts)
    else:
        template = base_filename

    # And for our final trick, we will generate the .var file with
    # languages that controls dispatch of requests to the untranslated
    # JavaScript file.
    default_lang = "en"
    var_lines = ["URI: {}".format(template)]
    for lang in languages:
        var_lines.append(gen_var_lang_line(uri_base=template, lang=lang,
                         default_lang=default_lang))
    htaccess_fd = open("{}.var.tmp".format(template), "w")
    htaccess_fd.write("\n\n".join(var_lines) + "\n")
    htaccess_fd.close()
    os.rename("{}.var.tmp".format(template), "{}.var".format(template))


def gen_var_lang_line(uri_base, lang, default_lang,
                      content_type="text/javascript"):
    if lang == default_lang:
        quality = "1.0"
    else:
        quality = "0.8"

    out = ("URI: {}.{}\nContent-Language: {}\nContent-Type: {}; qs = {}"
           .format(uri_base, lang, lang, content_type, quality))
    return out


if __name__ == "__main__":
    main()
