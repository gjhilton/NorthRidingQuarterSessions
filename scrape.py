import re
import requests
import cssutils
from bs4 import BeautifulSoup
from pprint import pprint

def check_visibility(element):
    if element:

        style = element.get('style')
        
        if style:
            css_parser = cssutils.CSSParser()
            css = css_parser.parseString('div { ' + style + ' }')  
            visibility = None
            for rule in css:
                for property in rule.style:
                    if property.name == 'visibility':
                        visibility = property.value
                        break
            
            if visibility == 'visible':
                return True
            else:
                return False
        else:
            return False
    else:
        print("Element not found.")
        return False

def locate_total(text):
    match = re.search(r'of (\d+)', text)
    if match:
        return int(match.group(1))
    return None

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

def get_num_total_results(soup):
    pager = soup.find(id="ctl00_main_TopPager")
    current = pager.find(class_="Current") # "1 to 100 of 11818"
    return locate_total(current.text)

def process_row(row):
    cells = row.find_all('td')
    if cells: 
        first_cell = cells[0]
        text = first_cell.text.strip()
        if text.startswith("QSB "):
            link = first_cell.find("a")
            return link["href"]
        return None
    return None

def parse_hits(soup):
    table = soup.find(id="overviewlist")
    rows = table.find('tbody').find_all('tr')
    hits = []
    for row in rows:
        result = process_row(row)
        if result:
            hits.append(result)
    return hits

def get_next_page(soup):
    pager  = soup.find(id="ctl00_main_TopPager")
    current = pager.find(class_="Next")
    if (check_visibility(current)):
        return True
    return False

def get_extended_search_page(search_term, params):
    params.update({
        '__EVENTTARGET': "ctl00$main$TopPager$ctl15",
        "ctl00$main$TopPager$ctl15": "100",
        "ctl00$main$BottomPager$ctl15": "5",
        "ctl00$search_DSCoverySearch1$ctl00_search_DSCoverySearch1_ctl01$SearchText": search_term
    })
    response = fetch_page(SEARCH_PAGE_URL, method='POST', data=params)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # find total number of results
    num_results = get_num_total_results(soup)
    print(f"Total matches for search: {num_results}")
    
    # parse this page of results
    hits = parse_hits(soup)
    # pprint(hits)
    
    # is there anpther page after this?
    next_page = get_next_page(soup)
    print(next_page)
    
    
    return soup
    

def search(search_term):
    params = get_home_page_params()
    if not params:
        return  
    
    params = get_search_page_params(search_term, params)
    if not params:
        return 
    
    result = get_extended_search_page(search_term, params)
    if not result:
        return  

HOME_PAGE_URL = 'https://archivesunlocked.northyorks.gov.uk/CalmView/default.aspx'
SEARCH_PAGE_URL = "https://archivesunlocked.northyorks.gov.uk/CalmView/Overview.aspx"

if __name__ == "__main__":
    search("whitby stealing")
