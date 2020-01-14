import urllib.request, webbrowser, platform, zipfile, os 
from selenium import webdriver
system = platform.system()
mainPath = str(os.path.dirname(os.path.realpath(__file__))).replace("\\", "/") + "/"
urlList = ["https://moodle.bkt-luedenscheid.de/course/view.php?id=1535", "https://moodle.bkt-luedenscheid.de/course/view.php?id=1532", "https://moodle.bkt-luedenscheid.de/course/view.php?id=1519", "https://moodle.bkt-luedenscheid.de/course/view.php?id=1499", "https://moodle.bkt-luedenscheid.de/course/view.php?id=1494", "https://moodle.bkt-luedenscheid.de/course/view.php?id=1507", "https://moodle.bkt-luedenscheid.de/course/view.php?id=1485"]
if not os.path.isfile(mainPath + "chromedriver.exe"):
    if system == "Linux":
        print("[INFO] System is Linux.")
        url = "https://chromedriver.storage.googleapis.com/79.0.3945.36/chromedriver_linux64.zip"
    elif system == "Windows":
        print("[INFO] System is Windows.")
        url = "https://chromedriver.storage.googleapis.com/78.0.3904.105/chromedriver_win32.zip"
    else:
        print("[ERROR] unrecognized system exiting...")
        exit()
    output = (urllib.request.urlretrieve(url, mainPath + "chromeDriver.zip"))
    for var in output:
        path = var
        break
    zipObj = zipfile.ZipFile(path, "r")
    zipObj.extractall()
    zipObj.close()
    os.remove(path)
driver = webdriver.Chrome()
driver.get(urlList[0])
nameEntry = driver.find_element_by_id("username")
passwordEntry = driver.find_element_by_id("password")
nameEntry.send_keys("jan.grosse")
file = open(mainPath + "password.txt")
data = file.readlines()
file.close()
passwordEntry.send_keys(data[0])
button = driver.find_element_by_id("loginbtn")
button.click()
for url in urlList:
    driver.get(url)
driver.close()