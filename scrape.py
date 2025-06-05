import requests
from bs4 import BeautifulSoup

def value_of_element_by_id(soup, element_id):
    element = soup.find(id=element_id)
    return element['value'] if element else ""

def extract_params(soup):
    param_ids = [
        "__VIEWSTATE", "__EVENTTARGET", "__EVENTARGUMENT", 
        "__VIEWSTATEGENERATOR", "__PREVIOUSPAGE", "__EVENTVALIDATION"
    ]
    return {param_id: value_of_element_by_id(soup, param_id) for param_id in param_ids}

def fetch_page_params(url, method='GET', data=None):
    response = fetch_page(url, method, data)
    soup = BeautifulSoup(response.text, 'html.parser')
    return extract_params(soup)

    
def fetch_page(url, method, data):
   try:
        print(f"{method}: {url}")
        response = requests.request(method, url, data=data)
        response.raise_for_status() 
        return response
   except requests.exceptions.RequestException as e:
       print(f"Error fetching page ({url}): {e}")
       return {}

def get_home_page_params():
    return fetch_page_params(HOME_PAGE_URL)

def get_search_page_params(search_term, params):
    params.update({
        "ctl00$search_DSCoverySearch1$ctl00_search_DSCoverySearch1_ctl01$SearchText": search_term,
        "ctl00$search_DSCoverySearch1$ctl00_search_DSCoverySearch1_ctl02$discoveryadvancce": ""
    })
    return fetch_page_params(SEARCH_PAGE_URL, method='POST', data=params)

def get_extended_search_page(search_term, params):
    params.update({
        '__EVENTTARGET': "ctl00$main$TopPager$ctl15",
        "ctl00$main$TopPager$ctl15": "100",
        "ctl00$main$BottomPager$ctl15": "5",
        "ctl00$search_DSCoverySearch1$ctl00_search_DSCoverySearch1_ctl01$SearchText": search_term
    })
    return fetch_page(SEARCH_PAGE_URL, method='POST', data=params)

def search(search_term):
    params = get_home_page_params()
    if not params:
        return  
    
    params = get_search_page_params(search_term, params)
    if not params:
        return 
    
    result = get_extended_search_page(search_term, params)
    print(result.text)
    if not result:
        return  

HOME_PAGE_URL = 'https://archivesunlocked.northyorks.gov.uk/CalmView/default.aspx'
SEARCH_PAGE_URL = "https://archivesunlocked.northyorks.gov.uk/CalmView/Overview.aspx"

if __name__ == "__main__":
    search("whitby")
