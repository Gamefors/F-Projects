from objects.TrapCard import TrapCard
from objects.SpellCard import SpellCard
from objects.MonsterCard import MonsterCard

from utils.FileHelper import FileHelper

from selenium import webdriver
from PyQt5.QtWidgets import QApplication, QLabel, QPushButton, QCheckBox, QMessageBox, QWidget, QGridLayout, QLineEdit, QTableWidget, QTableWidgetItem
from PyQt5 import QtWidgets
from sys import platform

class Main:
	
	def addCard(self):#make ad many function eg code,code,code all with quanitity given
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
				msg = QMessageBox()
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
							driver = webdriver.Chrome("/Users/jangj/Desktop/OneDrive/Desktop/Workspace/Privat/Python/Leonard/CardOrganizer2/chromedriver")		
						elif platform == "win32":
							driver = webdriver.Chrome("B:\Programme\cardsorter2\chromedriver.exe")
						driver.get(url)
						typeOfCard = driver.find_element_by_class_name("box_card_attribute")
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
									msg = QMessageBox()#TODO:add buttons with add quantity that was given, add card as new uniq, not add
									msg.setText("Hinweis: Monster Karte mit dem selben Namen exisitert bereits.")
									msg.exec()
							self.cardList.append(monsterCardObject)
							FileHelper().saveCard(monsterCardObject)
							self.addRow(monsterCardObject)
						driver.close()
						FileHelper().backupCards()
						self.codeEntry.setText("")
						self.quantityEntry.setText("")
				else:
					msg = QMessageBox()
					msg.setText("Fehler: Anzahl muss eine Zahl sein.")
					msg.exec()

	def addRow(self, card):
		if card.cardObject == "trap":
			rowPosition = self.trapCardsTable.rowCount()
			self.trapCardsTable.insertRow(rowPosition)
			self.trapCardsTable.setItem(rowPosition, 0, QTableWidgetItem(card.name))
			self.trapCardsTable.setItem(rowPosition, 1, QTableWidgetItem(card.trapType))
			self.trapCardsTable.setItem(rowPosition, 2, QTableWidgetItem(card.text))
			self.trapCardsTable.setItem(rowPosition, 3, QTableWidgetItem(card.speedDuel))
			self.trapCardsTable.setItem(rowPosition, 4, QTableWidgetItem(card.quantity))
		elif card.cardObject == "spell":
			rowPosition = self.spellCardsTable.rowCount()
			self.spellCardsTable.insertRow(rowPosition)
			self.spellCardsTable.setItem(rowPosition, 0, QTableWidgetItem(card.name))
			self.spellCardsTable.setItem(rowPosition, 1, QTableWidgetItem(card.spellType))
			self.spellCardsTable.setItem(rowPosition, 2, QTableWidgetItem(card.text))
			self.spellCardsTable.setItem(rowPosition, 3, QTableWidgetItem(card.speedDuel))
			self.spellCardsTable.setItem(rowPosition, 4, QTableWidgetItem(card.quantity))
		else:
			rowPosition = self.monsterCardsTable.rowCount()
			self.monsterCardsTable.insertRow(rowPosition)
			self.monsterCardsTable.setItem(rowPosition, 0, QTableWidgetItem(card.name))
			self.monsterCardsTable.setItem(rowPosition, 1, QTableWidgetItem(card.attribute))
			self.monsterCardsTable.setItem(rowPosition, 2, QTableWidgetItem(card.level))
			self.monsterCardsTable.setItem(rowPosition, 3, QTableWidgetItem(card.monsterType))
			self.monsterCardsTable.setItem(rowPosition, 4, QTableWidgetItem(card.cardType))
			self.monsterCardsTable.setItem(rowPosition, 5, QTableWidgetItem(card.atkPoints))
			self.monsterCardsTable.setItem(rowPosition, 6, QTableWidgetItem(card.defPoints))
			self.monsterCardsTable.setItem(rowPosition, 7, QTableWidgetItem(card.text))
			self.monsterCardsTable.setItem(rowPosition, 8, QTableWidgetItem(card.speedDuel))
			self.monsterCardsTable.setItem(rowPosition, 9, QTableWidgetItem(card.quantity))
		
		
		rowPosition = rowPosition + 1

	def __init__(self):
		self.cardList = FileHelper().loadCards()
		self.app = QApplication([])
		msg = QMessageBox()
		msg.setText("Hinweis: Nur Codes Deutscher Karten verwenden.")
		msg.exec()
		window = QWidget()
		layout = QGridLayout()
		self.codeEntry = QLineEdit()
		self.quantityEntry = QLineEdit()
		self.speedDualEntry = QCheckBox("Speed Dual")
		addButton = QPushButton("Hinzufügen")
		addButton.clicked.connect(self.addCard)
		
		self.trapCardsTable = QTableWidget()
		rows = 0
		for card in self.cardList:
			if card.cardObject == "trap":
				rows = rows + 1
		self.trapCardsTable.setRowCount(rows)
		self.trapCardsTable.setColumnCount(5)
		self.trapCardsTable.setHorizontalHeaderLabels(["Name:", "Typ:", "Text:", "Speed Dual:", "Anzahl:"])
		self.trapCardsTable.setSortingEnabled(True)        
		self.trapCardsTable.resizeColumnsToContents()
		self.trapCardsTable.resizeRowsToContents()
		header = self.trapCardsTable.horizontalHeader()       
		header.setSectionResizeMode(0, QtWidgets.QHeaderView.ResizeToContents)
		header.setSectionResizeMode(1, QtWidgets.QHeaderView.ResizeToContents)
		header.setSectionResizeMode(3, QtWidgets.QHeaderView.ResizeToContents)
		header.setSectionResizeMode(4, QtWidgets.QHeaderView.ResizeToContents)
		count = 0
		for card in self.cardList:
			if card.cardObject == "trap":
				self.trapCardsTable.setItem(count, 0, QTableWidgetItem(card.name))
				self.trapCardsTable.setItem(count, 1, QTableWidgetItem(card.trapType))
				self.trapCardsTable.setItem(count, 2, QTableWidgetItem(card.text))
				self.trapCardsTable.setItem(count, 3, QTableWidgetItem(card.speedDuel))
				self.trapCardsTable.setItem(count, 4, QTableWidgetItem(card.quantity))
				count = count + 1

		self.spellCardsTable = QTableWidget()
		rows = 0
		for card in self.cardList:
			if card.cardObject == "spell":
				rows = rows + 1
		self.spellCardsTable.setRowCount(rows)
		self.spellCardsTable.setColumnCount(5)
		self.spellCardsTable.setHorizontalHeaderLabels(["Name:", "Typ:", "Text:", "Speed Dual:", "Anzahl:"])
		self.spellCardsTable.setSortingEnabled(True)        
		self.spellCardsTable.resizeColumnsToContents()
		self.spellCardsTable.resizeRowsToContents()
		header = self.spellCardsTable.horizontalHeader()       
		header.setSectionResizeMode(0, QtWidgets.QHeaderView.ResizeToContents)
		header.setSectionResizeMode(1, QtWidgets.QHeaderView.ResizeToContents)
		header.setSectionResizeMode(3, QtWidgets.QHeaderView.ResizeToContents)
		header.setSectionResizeMode(4, QtWidgets.QHeaderView.ResizeToContents)
		count = 0
		for card in self.cardList:
			if card.cardObject == "spell":
				self.spellCardsTable.setItem(count, 0, QTableWidgetItem(card.name))
				self.spellCardsTable.setItem(count, 1, QTableWidgetItem(card.spellType))
				self.spellCardsTable.setItem(count, 2, QTableWidgetItem(card.text))
				self.spellCardsTable.setItem(count, 3, QTableWidgetItem(card.speedDuel))
				self.spellCardsTable.setItem(count, 4, QTableWidgetItem(card.quantity))
				count = count + 1

		self.monsterCardsTable = QTableWidget()
		rows = 0
		for card in self.cardList:
			if card.cardObject == "monster":
				rows = rows + 1
		self.monsterCardsTable.setRowCount(rows)
		self.monsterCardsTable.setColumnCount(10)
		self.monsterCardsTable.setHorizontalHeaderLabels(["Name:", "Attribut:", "Level:", "Monstertyp:", "Kartentyp:", "ATK:", "DEF:", "Text:", "Speed Duel:", "Anzahl:"])
		self.monsterCardsTable.setSortingEnabled(True)        
		self.monsterCardsTable.resizeColumnsToContents()
		self.monsterCardsTable.resizeRowsToContents()
		header = self.monsterCardsTable.horizontalHeader()       
		header.setSectionResizeMode(0, QtWidgets.QHeaderView.ResizeToContents)
		header.setSectionResizeMode(1, QtWidgets.QHeaderView.ResizeToContents)
		header.setSectionResizeMode(2, QtWidgets.QHeaderView.ResizeToContents)
		header.setSectionResizeMode(3, QtWidgets.QHeaderView.ResizeToContents)
		header.setSectionResizeMode(4, QtWidgets.QHeaderView.ResizeToContents)
		header.setSectionResizeMode(5, QtWidgets.QHeaderView.ResizeToContents)
		header.setSectionResizeMode(6, QtWidgets.QHeaderView.ResizeToContents)
		header.setSectionResizeMode(8, QtWidgets.QHeaderView.ResizeToContents)
		header.setSectionResizeMode(9, QtWidgets.QHeaderView.ResizeToContents)
		count = 0
		for card in self.cardList:
			if card.cardObject == "monster":
				self.monsterCardsTable.setItem(count, 0, QTableWidgetItem(card.name))
				self.monsterCardsTable.setItem(count, 1, QTableWidgetItem(card.attribute))
				self.monsterCardsTable.setItem(count, 2, QTableWidgetItem(card.level))
				self.monsterCardsTable.setItem(count, 3, QTableWidgetItem(card.monsterType))
				self.monsterCardsTable.setItem(count, 4, QTableWidgetItem(card.cardType))
				self.monsterCardsTable.setItem(count, 5, QTableWidgetItem(card.atkPoints))
				self.monsterCardsTable.setItem(count, 6, QTableWidgetItem(card.defPoints))
				self.monsterCardsTable.setItem(count, 7, QTableWidgetItem(card.text))
				self.monsterCardsTable.setItem(count, 8, QTableWidgetItem(card.speedDuel))
				self.monsterCardsTable.setItem(count, 9, QTableWidgetItem(card.quantity))
				count = count + 1
		layout.addWidget(QLabel('Karten Code:'), 0, 0)
		layout.addWidget(self.codeEntry, 0, 1)
		layout.addWidget(self.speedDualEntry, 2, 0)
		layout.addWidget(QLabel("Anzahl:"), 1, 0)
		layout.addWidget(self.quantityEntry, 1, 1)
		layout.addWidget(addButton, 3, 0)
		trapCardsLabel = QLabel("Fallen Karten:")
		trapCardsLabel.setStyleSheet('color: purple')
		layout.addWidget(trapCardsLabel, 4, 0)
		spellCardsLabel = QLabel("Zauber Karten:")
		spellCardsLabel.setStyleSheet('color: green')
		layout.addWidget(spellCardsLabel, 4, 1)
		layout.addWidget(self.trapCardsTable, 5, 0)
		layout.addWidget(self.spellCardsTable, 5, 1)
		monsterCardsLabel = QLabel("Monster Karten:")
		monsterCardsLabel.setStyleSheet('color: #662907')
		layout.addWidget(monsterCardsLabel, 6, 0)
		layout.addWidget(self.monsterCardsTable, 7, 0, 8, 0)
		window.setLayout(layout)
		window.show()
		self.app.exec_()
		
Main()