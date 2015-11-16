function cc_js_pageInit() {
    if (cc_js_$('want_cc_license_nah') && cc_js_$('want_cc_license_nah').checked) {
        // then do not init
        cc_js_disable_widget();
    } else {
        cc_js_init();
    }
    cc_js_init_tip();
}

if (window.onload) {
    old_onload = window.onload;
    window.onload = function () {
	old_onload();
	cc_js_pageInit();
    }
}
else {
    window.onload = cc_js_pageInit;
}

