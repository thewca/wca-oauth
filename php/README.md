# Sample:

```php
<?php

require 'WcaOauth.php';

$wca = new WcaOauth(array(
    'applicationId' => 'wca-application-id',
    'applicationSecret' => 'wca-application-secret',
    'redirectUri' => 'wca-redirect-uri (Callback Url)',    
));

try {
    $wca->fetchAccessToken($_GET['code']);
    $user = $wca->getUser();
} catch (Exception $e) {
    echo $e->getMessage();
    exit;
}

echo "<pre>";
print $wca->getAccessToken();
print_r($user);
```