<?php

$line = urlencode($_POST['text']);

$tflUrl = "https://api.tfl.gov.uk/Line/$line/Status?detail=False";

$data = fetchUrl($tflUrl);

$json = json_decode($data, true);

try {
  if (is_array($json)) {
    print ($json[0]['lineStatuses'][0]['statusSeverityDescription']);
  } else {
    print $data;
  }
} catch (Exception $e) {
    error_log('Fetch URL failed: ' . $e->getMessage() . ' for ' . $url);
}



function fetchUrl($uri) {
    $handle = curl_init();

    curl_setopt($handle, CURLOPT_URL, $uri);
    curl_setopt($handle, CURLOPT_POST, false);
    curl_setopt($handle, CURLOPT_BINARYTRANSFER, false);
    curl_setopt($handle, CURLOPT_HEADER, true);
    curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($handle, CURLOPT_CONNECTTIMEOUT, 10);

    $response = curl_exec($handle);
    $hlength  = curl_getinfo($handle, CURLINFO_HEADER_SIZE);
    $httpCode = curl_getinfo($handle, CURLINFO_HTTP_CODE);
    $body     = substr($response, $hlength);

    // If HTTP response is not 200, throw exception
    if ($httpCode != 200 && $httpCode != 404) {
        $body = "Problem with the service";
    }

    return $body;
}
