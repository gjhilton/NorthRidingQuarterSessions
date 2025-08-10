import requests
import cssutils
from bs4 import BeautifulSoup
import json

session = requests.Session()

def check_visibility(element):
    return element and element.get('style') and any(
        property.name == 'visibility' and property.value == 'visible'
        for rule in cssutils.CSSParser().parseString(f'div {{ {element["style"]} }}')
        for property in rule.style
    )

def value_of_element_by_id(soup, element_id):
    element = soup.find(id=element_id)
    return element.get('value', '') if element else ''

def extract_params(soup, param_ids):
    return {param_id: value_of_element_by_id(soup, param_id) for param_id in param_ids}

def fetch_page(url, method='GET', data=None):
    try:
        print(f"{method}: {url}")
        response = session.request(method, url, data=data)
        response.raise_for_status()
        return response
    except requests.exceptions.RequestException as e:
        print(f"Error fetching page ({url}): {e}")

def get_page_params(url, method='GET', data=None):
    response = fetch_page(url, method, data)
    return extract_params(BeautifulSoup(response.text, 'html.parser'), [
        "__VIEWSTATE", "__EVENTTARGET", "__EVENTARGUMENT", 
        "__VIEWSTATEGENERATOR", "__PREVIOUSPAGE", "__EVENTVALIDATION"
    ]) if response else {}

def get_home_page_params():
    return get_page_params(HOME_PAGE_URL)

def get_search_page_params(search_term, params):
    params.update({
        "ctl00$search_DSCoverySearch1$ctl00_search_DSCoverySearch1_ctl01$SearchText": search_term,
        "ctl00$search_DSCoverySearch1$ctl00_search_DSCoverySearch1_ctl02$discoveryadvancce": ""
    })
    return get_page_params(SEARCH_PAGE_URL, method='POST', data=params)

def process_row(row):
    cells = row.find_all('td')
    if cells and cells[0].text.strip().startswith("QSB "):
        link = cells[0].find("a")
        return {"record_id": cells[0].text.strip(), "link": link["href"]}
    return None

def parse_hits(soup):
    return [processed_row for row in soup.select('#overviewlist tbody tr') 
            if (processed_row := process_row(row))]

def get_next_page(soup):
    next_wrapper = soup.find(id="ctl00_main_TopPager").find(class_="Next") if soup else None
    return check_visibility(next_wrapper)

def fetch_next(params):
    params.update({
        "__EVENTTARGET": "ctl00$main$TopPager$ctl22",
        "ctl00$main$TopPager$ctl15": "100",
        "ctl00$main$BottomPager$ctl15": "100"
    })
    response = fetch_page(SEARCH_PAGE_URL, "POST", params)
    if not response:
        return {}

    soup = BeautifulSoup(response.text, 'html.parser')
    return {
        "next_page": get_next_page(soup),
        "params": extract_params(soup, [
            "__VIEWSTATE", "__EVENTTARGET", "__EVENTARGUMENT", 
            "__VIEWSTATEGENERATOR", "__PREVIOUSPAGE", "__EVENTVALIDATION"
        ]) if get_next_page(soup) else None,
        "hits": parse_hits(soup)
    }

def fetch_extended_search_page(search_term, params):
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
    return {
        "next_page": get_next_page(soup),
        "params": extract_params(soup, [
            "__VIEWSTATE", "__EVENTTARGET", "__EVENTARGUMENT", 
            "__VIEWSTATEGENERATOR", "__PREVIOUSPAGE", "__EVENTVALIDATION"
        ]) if get_next_page(soup) else None,
        "hits": parse_hits(soup)
    }

def search(search_term):
    params = get_home_page_params()
    if not params:
        return []

    params = get_search_page_params(search_term, params)
    if not params:
        return []

    result = fetch_extended_search_page(search_term, params)
    if not result:
        return []
    
    resources = result["hits"]
    while result["next_page"]:
        result = fetch_next(result["params"])
        resources.extend(result['hits'])

    return resources

HOME_PAGE_URL = 'https://archivesunlocked.northyorks.gov.uk/CalmView/default.aspx'
SEARCH_PAGE_URL = "https://archivesunlocked.northyorks.gov.uk/CalmView/Overview.aspx"

def load_blacklist(file_path):
    with open(file_path, 'r') as file:
        return set(line.strip() for line in file)

def filter_records(data, blacklist):
    return [record for record in data if record['record_id'] not in blacklist]

if __name__ == "__main__":
    SEARCH_STR = "whitby stealing"
    resources = search(SEARCH_STR)
    print("Total matching resources:", len(resources))
    
    blacklist = load_blacklist('data/id_blacklist.txt')
    filtered_resources = filter_records(resources, blacklist)
    print("Resources remaining after cleaning:", len(filtered_resources))
    
    with open("data/" + SEARCH_STR + '.json', 'w') as f:
        json.dump(filtered_resources, f, indent=4)