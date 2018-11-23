#!/usr/bin/env python

'''
    This is an python3 implementation of the 'implicit flow' (response_type "password") of WCA Oauth which is necessary to access the WCA API without using any browser based authorization. If possible, please use response_type "code"!
'''

import requests, json, getpass

access_token_url = 'https://staging.worldcubeassociation.org/oauth/token'
competition_url = 'https://staging.worldcubeassociation.org/api/v0/competitions/MunichOpen2018/wcif'

def get_access_token():
    # e.g. 8@worldcubeassociation.org - your registered mail address if not on staging
    wca_mail = input('Enter mail address: ')
    # 'wca' for staging
    wca_password = getpass.getpass('Enter WCA password: ')
    
    headers = {'grant_type':'password', 'username':wca_mail, 'password':wca_password, 'scope':'public manage_competitions'}
    
    # get access token
    request1 = requests.post(access_token_url, data=headers)
    
    return json.loads(request1.text)['access_token']    

def fetch_information():
    access_token = get_access_token()
    authorization = 'Bearer ' + access_token
    headers2 = {'Authorization': authorization}
    
    # use access token to get competition information
    request2 = requests.get(competition_url, headers=headers2)
    
    return json.loads(request2.text)

def main():
    competition_information = fetch_information()
    
    # save result
    with open('competition_information.json', 'w') as file:
        print(competition_information, file=file)
    print('Information about {} successfully saved.'.format(competition_information['name']))

if __name__ == "__main__":
    main()
