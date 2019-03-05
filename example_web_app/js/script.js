/**
 * This was written by CC as a demonstration of how to interoperate
 * with the Creative Commons JsWidget.  No rights reserved.
 *
 * See README for a little more detail.
 */
document.addEventListener("DOMContentLoaded", function() {
  var resultUriSrc = document.getElementById("cc_js_result_uri");
  var licenseNameSrc = document.getElementById("cc_js_result_name");
  var resultImgSrc = document.getElementById("cc_js_result_img");

  var jsWidgetContainer = document.getElementById("cc_js_widget_container");

  var resultUriDest = document.getElementById("resultUriDest");
  var licenseNameDest = document.getElementById("licenseNameDest");
  var resultImgDest = document.getElementById("resultImgDest");

  jsWidgetContainer.addEventListener("change", updateValues);

  /**
   * Updates the values of license details list when a new license is selected.
   */
  function updateValues() {
    resultUriDest.innerText = resultUriSrc.value;
    resultUriDest.href = resultUriSrc.value;
    licenseNameDest.innerText = licenseNameSrc.value;
    resultImgDest.innerText = resultImgSrc.value;
    resultImgDest.href = resultImgSrc.value;
  }
});
