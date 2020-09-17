#########################################################################

KennzeichenBuchstaben = "ul"
KennzeichenNummern = "2311"

myName = "NACHNAME"

mySirName = "NAME"

myStreetAndHouseNumber = "Staße Nummer"

myPlz = "58599"

myCity = "Lüdenscheid"

#########################################################################












































































import time
from selenium import webdriver
from selenium.webdriver.support.ui import Select
from selenium.webdriver.common.keys import Keys

driver = webdriver.Chrome()

driver.get("https://wunschkennzeichen.maerkischer-kreis.de")

dsgvoCheckBox = driver.find_element_by_id("INPUT-CHK_DATENSCHUTZ1")
dsgvoEnterButton = driver.find_element_by_name("BTN_WEITER")

dsgvoCheckBox.click()
dsgvoEnterButton.click()

NPLetters = driver.find_element_by_id("INPUT-TXT_KENNZEICHENSUCHE_ERKENNUNGSZEICHEN")
NPNumbers = driver.find_element_by_id("INPUT-TXT_KENNZEICHENSUCHE_ZIFFERN")

NPSearchButton = driver.find_element_by_name("BTN_WKZSUCHE")

NPLetters.send_keys(KennzeichenBuchstaben)
NPNumbers.send_keys(KennzeichenNummern)

#NPResult2 = driver.find_element_by_id("INPUT-OPT_KENNZEICHENSUCHE_TREFFER2")

#Options
normalNPCheckBox = driver.find_element_by_id("INPUT-CHK_KENNZEICHENSUCHE_KENNZEICHENART1")
shortNPCheckBox = driver.find_element_by_id("INPUT-CHK_KENNZEICHENSUCHE_KENNZEICHENART2")

normalNPCheckBox.click()
shortNPCheckBox.click()

#NPLetersOptionAll = driver.find_element_by_id("INPUT-OPT_KENNZEICHENSUCHE_BESONDERHEIT1")

NPSearchButton.click()

NPResult1 = driver.find_element_by_id("INPUT-OPT_KENNZEICHENSUCHE_TREFFER1")
NPResult1.click()

NPResultContinueButton = driver.find_element_by_name("BTN_WEITER")
NPResultContinueButton.click()

salutationSelect = Select(driver.find_element_by_id("INPUT-OPT_HALTER_ANREDE"))
salutationSelect.select_by_index(2)

name = driver.find_element_by_id("INPUT-TXT_HALTER_NAME")
sirName = driver.find_element_by_id("INPUT-TXT_HALTER_VORNAME")
streetAndHouseNumber = driver.find_element_by_id("INPUT-TXT_HALTER_STRASSE_HAUSNUMMER")
plz = driver.find_element_by_id("INPUT-TXT_HALTER_POSTLEITZAHL")
city = driver.find_element_by_id("INPUT-TXT_HALTER_ORT")

name.send_keys(myName)
sirName.send_keys(mySirName)
streetAndHouseNumber.send_keys(myStreetAndHouseNumber)
plz.send_keys(myPlz)
city.send_keys(myCity)

time.sleep(5000)

driver.close()