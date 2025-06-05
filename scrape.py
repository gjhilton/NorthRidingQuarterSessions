import requests
from bs4 import BeautifulSoup

def value_of_element_id(soup, id):
    element = soup.find(id=id)    
    value = ""
    if (element):
        value = element['value']
    return value

def get_iniital_params(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        return {
            "__VIEWSTATE": value_of_element_id(soup, "__VIEWSTATE"),
            "__EVENTTARGET":  value_of_element_id(soup, "__EVENTTARGET"),
            "__EVENTARGUMENT":  value_of_element_id(soup, "__EVENTARGUMENT"),
            "__VIEWSTATEGENERATOR":  value_of_element_id(soup, "__VIEWSTATEGENERATOR"),
            "__PREVIOUSPAGE":  value_of_element_id(soup, "__PREVIOUSPAGE"),
            "__EVENTVALIDATION":  value_of_element_id(soup, "__EVENTVALIDATION"),
        }
        
    except requests.exceptions.RequestException as e:
        print(f"Error fetching initial page: {e}")

def preliminary_search(search_term,params,url):
    params["ctl00$search_DSCoverySearch1$ctl00_search_DSCoverySearch1_ctl01$SearchText"]= search_term
    params["ctl00$search_DSCoverySearch1$ctl00_search_DSCoverySearch1_ctl02$discoveryadvancce"]=""
    response = requests.post(url, data=params)
    if response.status_code == 200:
        print('Request was successful')
        print(response.text) 
    else:
        print(f'Failed to send request. Status code: {response.status_code}')

if __name__ == "__main__":
    initial_params = get_iniital_params('https://archivesunlocked.northyorks.gov.uk/CalmView/default.aspx')
    preliminary_search("whitby",initial_params,"https://archivesunlocked.northyorks.gov.uk/CalmView/Overview.aspx")