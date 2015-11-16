<?php
function list_languages() {
  $my_path = dirname(__FILE__);
  
  // Internal-ish lame fact: template.js.* is what defines our languages
  $base_path = $my_path . '/template.js.';
  $all = glob($base_path . '*');
  
  // Strip off filename part
  $just_languages = array();
  foreach ($all as $filename) {
    $first = substr($filename, 0, strlen($base_path));
    $rest  = substr($filename, strlen($base_path));
    assert ($first == $base_path);
    $just_languages[] = $rest;
  }
  // And we're done.
  return $just_languages;
  }
