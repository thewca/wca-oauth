<?php

class WcaOauth
{
    CONST ACCESS_TOKEN_URI = "https://www.worldcubeassociation.org/oauth/token";
    CONST USER_URI = "https://www.worldcubeassociation.org/api/v0/me";

    protected $applicationId;
    protected $redirectUri;
    protected $applicationSecret;

    protected static $requiredOptions = array(
        'applicationId',
        'applicationSecret',
        'redirectUri'
    );

    protected $accessToken;

    public function __construct($options)
    {
        foreach (self::$requiredOptions AS $value) {
            if (!isset($options[$value])) {
                throw new Exception("$value is a required option!");
            }

            $this->$value = $options[$value];
        }
    }

    /**
     * Send request to WCA and return JSON.
     * @param  string $url        URL to send request
     * @param  array $postParams POST data to include in the request (optional)
     * @param  array $headers    Headers to set in the request (optional)
     * @return array             JSON decoded array
     */
    public function curlJson($url, $postParams = null, $headers = null)
    {
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

        if ($postParams) {
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $postParams);
        }

        if ($headers) {
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        }

        $result = curl_exec($ch);

        curl_close($ch);

        return json_decode($result);
    }

    /**
     * Convert the code GET param to an OAuth Access Token and store it
     * @param  [type] $code [description]
     * @return [type]       [description]
     */
    public function fetchAccessToken($code)
    {
        $postParams = array(
            'code' => $code,
            'grant_type' => 'authorization_code',
            'client_id' => $this->applicationId,
            'client_secret' => $this->applicationSecret,
            'redirect_uri' => $this->redirectUri,
        );

        $jsonResult = $this->curlJson(self::ACCESS_TOKEN_URI, $postParams);

        if(isset($jsonResult->error)) {
            throw new Exception("$jsonResult->error_description ($jsonResult->error)");
        }

        $this->accessToken = $jsonResult->access_token;

        return $this;
    }

    public function getAccessToken()
    {
        return $this->accessToken;
    }

    public function getUser()
    {
        if (!$this->accessToken) {
            throw new Exception("You must call fetchAccessToken first.");
        }

        $headers = array(
          "Authorization: Bearer $this->accessToken",
        );

        return $this->curlJson(self::USER_URI, null, $headers)->me;
    }
}