from objects.TrapCard import TrapCard
from objects.SpellCard import SpellCard
from objects.MonsterCard import MonsterCard

from utils.FileHelper import FileHelper

from PyQt5.QtWidgets import QMessageBox
from PyQt5 import uic, QtWidgets

from selenium import webdriver
from sys import platform

import sys

class Main(QtWidgets.QMainWindow):
	
	def addCard(self):#make add many function eg code,code,code all with quanitity given
		codeList = list()
		quantity = self.quantityEntry.text()
		code = self.codeEntry.text()
		codes = code.split(",")
		for code in codes:
			codeList.append(code)
		if len(code) == 0:
			msg = QMessageBox()
			msg.setText("Fehler: Code darf nicht leer sein.")
			msg.exec()
		else:
			if len(quantity) == 0:
				msg = QMessageBox("test")
				msg.setText("Fehler: Anzahl darf nicht leer sein.")
				msg.exec()
			else:
				if str(quantity).isdigit():
					if self.speedDualEntry.isChecked():
						speedDuel = "Jan"
					else:
						speedDuel = "Nein"
					for code in codeList:
						url = "https://www.db.yugioh-card.com/yugiohdb/card_search.action?ope=1&sess=1&keyword=" + code + "&stype=4&ctype=&starfr=&starto=&pscalefr=&pscaleto=&linkmarkerfr=&linkmarkerto=&link_m=2&atkfr=&atkto=&deffr=&defto=&othercon=2"
						if platform == "darwin":
							driver = webdriver.Chrome("/Users/jangj/Desktop/OneDrive/Desktop/Workspace/Privat/Python/Leonard/CardOrganizer3/chromedriver")		
						elif platform == "win32":
							driver = webdriver.Chrome("B:\Programme\cardsorter3\chromedriver.exe")
						driver.get(url)
						try:
							typeOfCard = driver.find_element_by_class_name("box_card_attribute")
						except:
							msg = QMessageBox()
							msg.setText("Karte wurde nicht Gefunden.")
							msg.exec()
							break
						if typeOfCard.text == "FALLE":
							nameSourced = driver.find_element_by_class_name("card_status")	
							name = nameSourced.text
							name = str(name).replace("\n", "")
							name = str(name).replace(":", "")
							trapType = "Normal"
							try:
								trapTypeSourced = driver.find_element_by_class_name("box_card_effect")
								trapType = trapTypeSourced.text
							except:
								var = None
							textSourced = driver.find_element_by_class_name("box_card_text")
							text = textSourced.text
							text = str(text).replace("\n", "")
							text = str(text).replace(":", "")
							if "\u25cf" in text:
								text = str(text).replace("\u25cf", "-")
							trapCardObject = TrapCard("trap", name, trapType, text, speedDuel, quantity)
							for card in self.cardList:
								if card.name == trapCardObject.name:
									msg = QMessageBox()#TODO:add buttons with add quantity that was given, add card as new uniq, not add
									msg.setText("Hinweis: Fallen Karte mit dem selben Namen exisitert bereits.")
									msg.exec()
							self.cardList.append(trapCardObject)
							FileHelper().saveCard(trapCardObject)
							self.addRow(trapCardObject)
						elif typeOfCard.text == "ZAUBER":
							nameSourced = driver.find_element_by_class_name("card_status")	
							name = nameSourced.text
							name = str(name).replace("\n", "")
							name = str(name).replace(":", "")
							spellType = "Normal"
							try:
								spellTypeSourced = driver.find_element_by_class_name("box_card_effect")
								spellType = spellTypeSourced.text
							except:
								var = None
							textSourced = driver.find_element_by_class_name("box_card_text")
							text = textSourced.text
							text = str(text).replace("\n", "")
							text = str(text).replace(":", "")
							if "\u25cf" in text:
								text = str(text).replace("\u25cf", "-")
							spellCardObject = SpellCard("spell", name, spellType, text, speedDuel, quantity)
							for card in self.cardList:
								if card.name == spellCardObject.name:
									msg = QMessageBox()#TODO:add buttons with add quantity that was given, add card as new uniq, not add
									msg.setText("Hinweis: Zauber Karte mit dem selben Namen exisitert bereits.")
									msg.exec()
							self.cardList.append(spellCardObject)
							FileHelper().saveCard(spellCardObject)
							self.addRow(spellCardObject)	
						else:
							nameSourced = driver.find_element_by_class_name("card_status")	
							name = nameSourced.text
							name = str(name).replace("\n", "")
							name = str(name).replace(":", "")
							attributeSourced = driver.find_element_by_class_name("box_card_attribute")
							attribute = attributeSourced.text
							try:
								levelSourced = driver.find_element_by_css_selector("span.box_card_level_rank.level")
								level = levelSourced.text
							except:
								try:
									levelSourced = driver.find_element_by_class_name("box_card_linkmarker")
									level = levelSourced.text
								except:
									var = None
							infoSourced = driver.find_element_by_class_name("card_info_species_and_other_item")
							info = infoSourced.text
							info = str(info).strip("[")
							info = str(info).strip("]")
							info = str(info).strip()
							info = str(info).split("/")
							if len(info) == 1:
								monsterType = info[0]
								cardType = "Normal"
							elif len(info) == 2:
								monsterType = info[0]
								cardType = str(info[1]).strip()
							else:
								monsterType = info[0]
								cardType = str(info[1]).strip() + "/" + str(info[2]).strip()
							atkPointsSourced = driver.find_element_by_class_name("atk_power")
							atkPoints = atkPointsSourced.text
							atkPoints = str(atkPoints).replace("ATK ", "")
							defPointsSourced = driver.find_element_by_class_name("def_power")
							defPoints = defPointsSourced.text
							defPoints = str(defPoints).replace("DEF ", "")
							textSourced = driver.find_element_by_class_name("box_card_text")
							text = textSourced.text
							text = str(text).replace("\n", "")
							text = str(text).replace(":", "")
							if "\u25cf" in text:
								text = str(text).replace("\u25cf", "-")
							monsterCardObject = MonsterCard("monster", name, attribute, level, monsterType, cardType, atkPoints, defPoints, text, speedDuel, quantity)
							for card in self.cardList:
								if card.name == monsterCardObject.name:
									msg = QMessageBox()#TODO: add buttons with add quantity that was given, add card as new uniq, not add
									msg.setText("Hinweis: Monster Karte mit dem selben Namen exisitert bereits.")
									msg.exec()
							self.cardList.append(monsterCardObject)
							FileHelper().saveCard(monsterCardObject)
							self.addRow(monsterCardObject)
						driver.close()
						FileHelper().backupCards()
						self.codeEntry.setText("")
						self.quantityEntry.setText("")
					driver.close()
					FileHelper().backupCards()
					self.codeEntry.setText("")
					self.quantityEntry.setText("")
				else:
					msg = QMessageBox()
					msg.setText("Fehler: Anzahl muss eine Zahl sein.")
					msg.exec()
	
	def __init__(self):
		
		msg = QMessageBox()
		msg.setText("Hinweis: Nur Codes Deutscher Karten verwenden.")
		msg.exec()

		super(Main, self).__init__()
		self.mainWindow = uic.loadUi("CardOrganizer3.ui", self)
		self.cardList = FileHelper().loadCards()

		self.codeEntry = self.mainWindow.codeEntry
		self.quantityEntry = self.mainWindow.quantityEntry
		self.speedDualEntry = self.mainWindow.speedDualEntry	

		self.mainWindow.addButton.clicked.connect(self.addCard)

app = QtWidgets.QApplication(sys.argv)
window = Main()
window.show()
sys.exit(app.exec_())

Main()