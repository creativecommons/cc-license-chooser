import sys
try:
    import gen_template_js
    import update_jurisdictions
except ImportError, e:
    print "------STOP!------"
    print "Install something so that you have this module:"
    print e
    print ""
    print "Okay?"
    sys.exit(101) # 101 == num2leet('lol')
