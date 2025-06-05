import requests
import pprint
from bs4 import BeautifulSoup

def value_of_element_id(soup, id):
    element = soup.find(id=id)    
    value = ""
    if (element):
        value = element['value']
    return value

def extract_params(soup):
    return {
        "__VIEWSTATE": value_of_element_id(soup, "__VIEWSTATE"),
        "__EVENTTARGET":  value_of_element_id(soup, "__EVENTTARGET"),
        "__EVENTARGUMENT":  value_of_element_id(soup, "__EVENTARGUMENT"),
        "__VIEWSTATEGENERATOR":  value_of_element_id(soup, "__VIEWSTATEGENERATOR"),
        "__PREVIOUSPAGE":  value_of_element_id(soup, "__PREVIOUSPAGE"),
        "__EVENTVALIDATION":  value_of_element_id(soup, "__EVENTVALIDATION"),
    }

def get_home_page():
    print(f"GET: {HOME_PAGE_URL}")
    try:
        response = requests.get(HOME_PAGE_URL)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        return extract_params(soup)
        
    except requests.exceptions.RequestException as e:
        print(f"Error fetching home page: {e}")

def get_search_page(search_term,params):
    params["ctl00$search_DSCoverySearch1$ctl00_search_DSCoverySearch1_ctl01$SearchText"]= search_term
    params["ctl00$search_DSCoverySearch1$ctl00_search_DSCoverySearch1_ctl02$discoveryadvancce"]=""
    print(f"POST: {SEARCH_PAGE_URL}")
    try:
        response = requests.post(SEARCH_PAGE_URL, data=params)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        return extract_params(soup)
        
    except requests.exceptions.RequestException as e:
        print(f"Error fetching search page: {e}")

def get_extended_search_page(search_term,params):
    params['__EVENTTARGET']="ctl00$main$TopPager$ctl15"
    params["ctl00$main$TopPager$ctl15"]="100"
    params["ctl00$main$BottomPager$ctl15"]="5"
    params["ctl00$search_DSCoverySearch1$ctl00_search_DSCoverySearch1_ctl01$SearchText"]= search_term
    print(f"POST: {SEARCH_PAGE_URL}")
    try:
        response = requests.post(SEARCH_PAGE_URL, data=params)
        response.raise_for_status()
        print(response.text)
        soup = BeautifulSoup(response.text, 'html.parser')
        return extract_params(soup)
        
    except requests.exceptions.RequestException as e:
        print(f"Error fetching extended page: {e}")

def search(search_term):
    current_params = get_home_page()
    current_params=get_search_page(search_term,current_params)
    current_params=get_extended_search_page(search_term,current_params)

HOME_PAGE_URL = 'https://archivesunlocked.northyorks.gov.uk/CalmView/default.aspx'
SEARCH_PAGE_URL = "https://archivesunlocked.northyorks.gov.uk/CalmView/Overview.aspx"

if __name__ == "__main__":
    search("whitby")