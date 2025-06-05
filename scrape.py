import re
import requests
import cssutils
from bs4 import BeautifulSoup
from pprint import pprint

session = requests.Session()

def current_page_numnber(soup):
    pager = soup.find(id="ctl00_main_TopPager")
    current = pager.find(class_="Current")
    return current.text if current else None

def check_visibility(element):
    if not element:
        return False
    style = element.get('style')
    if not style:
        return False
    css_parser = cssutils.CSSParser()
    css = css_parser.parseString(f'div {{ {style} }}')
    for rule in css:
        for property in rule.style:
            if property.name == 'visibility' and property.value == 'visible':
                return True
    return False

def locate_total(text):
    match = re.search(r'of (\d+)', text)
    return int(match.group(1)) if match else None

def value_of_element_by_id(soup, element_id):
    element = soup.find(id=element_id)
    return element['value'] if element else ""

def extract_params(soup):
    param_ids = [
        "__VIEWSTATE", "__EVENTTARGET", "__EVENTARGUMENT", 
        "__VIEWSTATEGENERATOR", "__PREVIOUSPAGE", "__EVENTVALIDATION"
    ]
    return {param_id: value_of_element_by_id(soup, param_id) for param_id in param_ids}

def fetch_page(url, method='GET', data=None):
    try:
        print(f"{method}: {url}")
        response = session.request(method, url, data=data)
        response.raise_for_status()
        #cookies = session.cookies
        #print(cookies)
        return response
    except requests.exceptions.RequestException as e:
        print(f"Error fetching page ({url}): {e}")
        return None

def fetch_page_params(url, method='GET', data=None):
    response = fetch_page(url, method, data)
    return extract_params(BeautifulSoup(response.text, 'html.parser')) if response else {}

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
    current = pager.find(class_="Current")
    return locate_total(current.text) if current else None

def process_row(row):
    cells = row.find_all('td')
    if cells:
        first_cell = cells[0]
        text = first_cell.text.strip()
        if text.startswith("QSB "):
            link = first_cell.find("a")
            return {"record_id":text,"link":link["href"]}
    return None

def parse_hits(soup):
    table = soup.find(id="overviewlist")
    rows = table.find('tbody').find_all('tr')
    return [process_row(row) for row in rows if process_row(row)]

def get_next_page(soup):
    print(current_page_numnber(soup))
    pager = soup.find(id="ctl00_main_TopPager")
    next_wrapper = pager.find(class_="Next")
    if check_visibility(next_wrapper):
        anchor = next_wrapper.find("a")
        link = "https://archivesunlocked.northyorks.gov.uk" + anchor['href']
        #print(link)
        return link
    return False

def fetch_next(search_term,next_page,params):
    params.update({
        "__EVENTTARGET": "ctl00$main$TopPager$ctl22",
        "ctl00$main$TopPager$ctl15": "100",
        "ctl00$main$BottomPager$ctl15": "100"
    })
    response = fetch_page("https://archivesunlocked.northyorks.gov.uk/CalmView/Overview.aspx", "POST", params)
    if not response:
        return {}

    soup = BeautifulSoup(response.text, 'html.parser')
    hits = parse_hits(soup)
    next_page = get_next_page(soup)
    params = extract_params(soup) if next_page else None

    return {
        "next_page": next_page,
        "params": params,
        "hits": hits
    }

def get_extended_search_page(search_term, params):
    params.update({
        '__EVENTTARGET': "ctl00$main$TopPager$ctl15",
        "ctl00$main$TopPager$ctl15": "100",
        "ctl00$main$BottomPager$ctl15": "5",
        "ctl00$search_DSCoverySearch1$ctl00_search_DSCoverySearch1_ctl01$SearchText": search_term
    })
    response = fetch_page(SEARCH_PAGE_URL, method='POST', data=params)
    if not response:
        return {}

    soup = BeautifulSoup(response.text, 'html.parser')
    hits = parse_hits(soup)
    next_page = get_next_page(soup)
    params = extract_params(soup) if next_page else None

    return {
        "next_page": next_page,
        "params": params,
        "hits": hits
    }

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
    
    resources, next_page, params = result ["hits"], result ["next_page"], result["params"]
    
    if (next_page):
        while True:
            result = fetch_next(search_term,next_page,params)
            resources.extend(result['hits'])
            if result['next_page'] is False:
                break
            params = result['params']
            next_page = result['next_page']
    return(resources)

HOME_PAGE_URL = 'https://archivesunlocked.northyorks.gov.uk/CalmView/default.aspx'
SEARCH_PAGE_URL = "https://archivesunlocked.northyorks.gov.uk/CalmView/Overview.aspx"


if __name__ == "__main__":
    resources = search("whitby stealing")
    print("Resources found:", len(resources))