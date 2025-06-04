import requests
from bs4 import BeautifulSoup
import pprint 

def value_of_element_id(soup, id):
    element = soup.find(id=id)    
    value = ""
    if (element):
        value = element['value']
    return value

def get_first_page(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        post_params = {
            "__VIEWSTATE": value_of_element_id(soup, "__VIEWSTATE"),
            "__EVENTTARGET":  value_of_element_id(soup, "__EVENTTARGET"),
            "__EVENTARGUMENT":  value_of_element_id(soup, "__EVENTARGUMENT"),
            "__VIEWSTATEGENERATOR":  value_of_element_id(soup, "__VIEWSTATEGENERATOR"),
            "__PREVIOUSPAGE":  value_of_element_id(soup, "__PREVIOUSPAGE"),
            "__EVENTVALIDATION":  value_of_element_id(soup, "__EVENTVALIDATION")
        }
        pp = pprint.PrettyPrinter(indent=4)
        pp.pprint(post_params)
        
    except requests.exceptions.RequestException as e:
        print(f"Error fetching initial page: {e}")

if __name__ == "__main__":
    get_first_page('https://archivesunlocked.northyorks.gov.uk/CalmView/default.aspx')