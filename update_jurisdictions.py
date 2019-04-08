import BeautifulSoup
import re
import os
import json
import sys
sys.path.insert(0, "./license_xsl/licensexsl_tools")
import convert

def get_contents(soup, attr):
    return str(soup(attr)[0].contents[0])

def license_versions_for_jurisdiction(license_type, soup, in_juri):
    standard = soup("licenseclass", id=license_type)[0]
    license2maxvers = {}
    for lic in standard("license"):
        lic_id = lic["id"]
        for juri in lic("jurisdiction"):
            juri_id = juri["id"]
            if juri_id == in_juri: # right jurisdiction
                for version in juri("version"):
                    version_id = version["id"]
                    if license2maxvers.get(lic_id, "0") < version_id:
                        license2maxvers[lic_id] = version_id

    return license2maxvers

def gen_jurisdiction_info():
    soup = BeautifulSoup.BeautifulStoneSoup(open("license_xsl/licenses.xml"))

    result = {}

    for j_i in soup("jurisdiction-info"):
        this_one = {}
        this_ones_id = str(j_i["id"])
        if this_ones_id:
            if j_i["launched"] != "true":
                continue # next jurisdiction if this one isn"t ready
            #this_one["url"] = get_contents(j_i, "uri")
            available_versions = license_versions_for_jurisdiction(license_type="standard", soup=soup, in_juri=this_ones_id)
            sampling_versions = license_versions_for_jurisdiction(license_type="sampling", soup=soup, in_juri=this_ones_id)
            if available_versions:
                this_one["version"] = str(max(available_versions.values()))
                if sampling_versions:
                    this_one["sampling"] = str(max(sampling_versions.values()))
                if this_ones_id == "-":
                    this_ones_id = "generic"
                    this_one["generic"] = True
                if this_ones_id == "generic":
                    name = "Unported"
                else:
                    name = convert.country_id2name(country_id=this_ones_id, language="en_US").encode("ascii")

                this_one["name"] = name
                result[this_ones_id] = this_one

    ret = json.dumps(result)
    
    # Validate JSON generation
    assert (json.loads(ret) == result) # this includes a type check

    return ret

def main():
    modify_filename = "js/cc-jurisdictions.js"
    modify_me = open(modify_filename + ".in").read()
    poss1 = "/* 8---< CUT HERE >----8 */"
    poss2 = "/* --------------- FOLD HERE ---------------- */"
    combined = "(" + re.escape(poss1) + "|" + re.escape(poss2) + ")"
    parts = re.split(combined, modify_me)
    assert(len(parts) == 5)
    parts[2] = gen_jurisdiction_info()
    result = "\n".join(parts)
    fd = open(modify_filename + ".tmp", "w")
    fd.write(result)
    fd.close()
    os.rename(modify_filename + ".tmp", modify_filename)

if __name__ == "__main__":
    main()
