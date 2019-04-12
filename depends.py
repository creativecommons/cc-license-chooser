import sys
try:
    import gen_template_js  # noqa: F401, import is needed for depends test
    import update_jurisdictions  # noqa: F401, import is needed for depends test
except ImportError, e:
    print "------STOP!------"
    print "Install something so that you have this module:"
    print e
    print ""
    print "Okay?"
    sys.exit(101)  # 101 == num2leet('lol')
