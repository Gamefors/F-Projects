from windows.SearchResultWindow import SearchResultWindow
from tkinter import Tk, Entry, Label, Button, Checkbutton, OptionMenu, StringVar
import threading
class SearchWindow:

	def search(self):#improve function with methods that return true or false for every search criteria attribute,type, etc
		newCardList = list()
		name = self.nameSearchEntry.get()
		name = str(name).replace("ä","ae").replace("Ä","Ae").replace("ö","oe").replace("Ö","Oe").replace("ü","ue").replace("U","Ue")
		print(name)
		cardCard = self.cardEntryVariable.get()
		cardType = self.typeEntryVariable.get()
		attribute = self.attributeEntryVariable.get()
		atkGreaterOrLess = self.atkGreaterOrLess.get()
		atkPoints = self.atkEntry.get()
		defGreaterOrLess = self.defGreaterOrLess.get()
		defPoints = self.defEntry.get()
		if len(atkPoints) == 1:
			atkPoints = "000" + atkPoints 
		elif len(atkPoints) == 2:
			atkPoints = "00" + atkPoints
		elif len(atkPoints) == 3:
			atkPoints = "0" + atkPoints
		if len(defPoints) == 1:
			defPoints = "000" + defPoints 
		elif len(defPoints) == 2:
			defPoints = "00" + defPoints
		elif len(defPoints) == 3:
			defPoints = "0" + defPoints 
		
		
		for card in self.cardList:
			if cardCard == "Leer":
				if cardType == "Leer":
					if attribute == "Leer":
						if atkGreaterOrLess == "Leer":
							if defGreaterOrLess == "Leer":
								if str(name).lower() in str(card.name).lower():
									newCardList.append(card)
							else:
								if defGreaterOrLess == "Groesser":
									if card.defPoints > defPoints:
										if str(name).lower() in str(card.name).lower():
											newCardList.append(card)
								elif defGreaterOrLess =="Kleiner":
									if card.defPoints < defPoints:
										if str(name).lower() in str(card.name).lower():
											newCardList.append(card)
						else:
							if defGreaterOrLess == "Leer":
								if str(name).lower() in str(card.name).lower():
									newCardList.append(card)
							else:		
								if defGreaterOrLess == "Groesser":
									if card.defPoints > defPoints:
										if atkGreaterOrLess == "Groesser":
											if card.atkPoints > atkPoints:
												if str(name).lower() in str(card.name).lower():
													newCardList.append(card)
										elif atkGreaterOrLess =="Kleiner":
											if card.atkPoints < atkPoints:
												if str(name).lower() in str(card.name).lower():
													newCardList.append(card)		
								elif defGreaterOrLess =="Kleiner":
									if card.defPoints < defPoints:
										if atkGreaterOrLess == "Groesser":
											if card.atkPoints > atkPoints:
												if str(name).lower() in str(card.name).lower():
													newCardList.append(card)
										elif atkGreaterOrLess =="Kleiner":
											if card.atkPoints < atkPoints:
												if str(name).lower() in str(card.name).lower():
													newCardList.append(card)
					else:						
						if attribute == card.attribute:
							if atkGreaterOrLess == "Leer":
								if defGreaterOrLess == "Leer":
									if str(name).lower() in str(card.name).lower():
										newCardList.append(card)
								else:
									if defGreaterOrLess == "Groesser":
										if card.defPoints > defPoints:
											if str(name).lower() in str(card.name).lower():
												newCardList.append(card)
									elif defGreaterOrLess =="Kleiner":
										if card.defPoints < defPoints:
											if str(name).lower() in str(card.name).lower():
												newCardList.append(card)
							else:
								if defGreaterOrLess == "Leer":
									if str(name).lower() in str(card.name).lower():
										newCardList.append(card)
								else:		
									if defGreaterOrLess == "Groesser":
										if card.defPoints > defPoints:
											if atkGreaterOrLess == "Groesser":
												if card.atkPoints > atkPoints:
													if str(name).lower() in str(card.name).lower():
														newCardList.append(card)
											elif atkGreaterOrLess =="Kleiner":
												if card.atkPoints < atkPoints:
													if str(name).lower() in str(card.name).lower():
														newCardList.append(card)		
									elif defGreaterOrLess =="Kleiner":
										if card.defPoints < defPoints:
											if atkGreaterOrLess == "Groesser":
												if card.atkPoints > atkPoints:
													if str(name).lower() in str(card.name).lower():
														newCardList.append(card)
											elif atkGreaterOrLess =="Kleiner":
												if card.atkPoints < atkPoints:
													if str(name).lower() in str(card.name).lower():
														newCardList.append(card)
				else:
					if cardType == card.cardType:
						if attribute == "Leer":
							if atkGreaterOrLess == "Leer":
								if defGreaterOrLess == "Leer":
									if str(name).lower() in str(card.name).lower():
										newCardList.append(card)
								else:
									if defGreaterOrLess == "Groesser":
										if card.defPoints > defPoints:
											if str(name).lower() in str(card.name).lower():
												newCardList.append(card)
									elif defGreaterOrLess =="Kleiner":
										if card.defPoints < defPoints:
											if str(name).lower() in str(card.name).lower():
												newCardList.append(card)
							else:
								if atkGreaterOrLess == "Groesser":
									if card.atkPoints > atkPoints:
										if str(name).lower() in str(card.name).lower():
											newCardList.append(card)
								elif atkGreaterOrLess =="Kleiner":
									if card.atkPoints < atkPoints:
										if str(name).lower() in str(card.name).lower():
											newCardList.append(card)
						else:
							if attribute == card.attribute:
								if str(name).lower() in str(card.name).lower():
									newCardList.append(card)
			else:
				if cardCard == card.card:
					if cardType == "Leer":
						if attribute == "Leer":
							if atkGreaterOrLess == "Leer":
								if defGreaterOrLess == "Leer":
									if str(name).lower() in str(card.name).lower():
										newCardList.append(card)
								else:
									if defGreaterOrLess == "Groesser":
										if card.defPoints > defPoints:
											if str(name).lower() in str(card.name).lower():
												newCardList.append(card)
									elif defGreaterOrLess =="Kleiner":
										if card.defPoints < defPoints:
											if str(name).lower() in str(card.name).lower():
												newCardList.append(card)
							else:
								if atkGreaterOrLess == "Groesser":
									if card.atkPoints > atkPoints:
										if str(name).lower() in str(card.name).lower():
											newCardList.append(card)
								elif atkGreaterOrLess =="Kleiner":
									if card.atkPoints < atkPoints:
										if str(name).lower() in str(card.name).lower():
											newCardList.append(card)
						else:
							if attribute == card.attribute:
								if str(name).lower() in str(card.name).lower():
									newCardList.append(card)
					else:
						if cardType == card.cardType:
							if attribute == "Leer":
								if atkGreaterOrLess == "Leer":
									if defGreaterOrLess == "Leer":
										if str(name).lower() in str(card.name).lower():
											newCardList.append(card)
									else:
										if defGreaterOrLess == "Groesser":
											if card.defPoints > defPoints:
												if str(name).lower() in str(card.name).lower():
													newCardList.append(card)
										elif defGreaterOrLess =="Kleiner":
											if card.defPoints < defPoints:
												if str(name).lower() in str(card.name).lower():
													newCardList.append(card)
								else:
									if atkGreaterOrLess == "Groesser":
										if card.atkPoints > atkPoints:
											if str(name).lower() in str(card.name).lower():
												newCardList.append(card)
									elif atkGreaterOrLess =="Kleiner":
										if card.atkPoints < atkPoints:
											if str(name).lower() in str(card.name).lower():
												newCardList.append(card)
							else:
								if attribute == card.attribute:
									if atkGreaterOrLess == "Leer":
										if defGreaterOrLess == "Leer":
											if str(name).lower() in str(card.name).lower():
												newCardList.append(card)
									else:
										if defGreaterOrLess == "Groesser":
											if card.defPoints > defPoints:
												if str(name).lower() in str(card.name).lower():
													newCardList.append(card)
										elif defGreaterOrLess =="Kleiner":
											if card.defPoints < defPoints:
												if str(name).lower() in str(card.name).lower():
													newCardList.append(card)
				else:
					if attribute == card.attribute:
						if str(name).lower() in str(card.name).lower():
							newCardList.append(card)

		searchResultThread = threading.Thread(target=SearchResultWindow().createSearchResultWindow(newCardList, self.dontShowCardsWithQuantityZero))
		searchResultThread.daemon = True
		searchResultThread.start()
	def createSearchWindow(self, cardList, dontShowCardsWithQuantityZero):
		self.cardList = cardList
		self.dontShowCardsWithQuantityZero = dontShowCardsWithQuantityZero	
		self.searchWindow = Tk()
		self.searchWindow.title("Karte suchen")
		self.cardEntryVariable = StringVar(self.searchWindow)
		self.cardEntryVariable.set("Leer")   
		self.typeEntryVariable = StringVar(self.searchWindow)
		self.typeEntryVariable.set("Leer") 
		self.attributeEntryVariable = StringVar(self.searchWindow)
		self.attributeEntryVariable.set("Leer") 
		self.atkGreaterOrLess = StringVar(self.searchWindow)
		self.atkGreaterOrLess.set("Leer") 
		self.defGreaterOrLess = StringVar(self.searchWindow)
		self.defGreaterOrLess.set("Leer") 
		Label(self.searchWindow, text="Name:").grid(row = 0, column = 0)
		self.nameSearchEntry = Entry(self.searchWindow)
		self.nameSearchEntry.grid(row = 0, column = 1)
		Label(self.searchWindow, text="Karte:").grid(row = 1, column = 0)
		OptionMenu(self.searchWindow, self.cardEntryVariable, "Leer","Monster/Normal", "Monster/Effekt", "Monster/Ritual", "Monster/Fusion",  "Monster/Synchro", "Monster/Xyz", "Monster/Link", "Monster/Pendel", "Zauber/Normal", "Zauber/Permanent", "Zauber/Ausruestung", "Zauber/Schnell", "Zauber/Spielfeld", "Zauber/Ritual", "Falle/Normal", "Falle/Permanent", "Falle/Konter").grid(row = 1, column = 1)
		Label(self.searchWindow, text="Typ:").grid(row = 3, column = 0)
		OptionMenu(self.searchWindow, self.typeEntryVariable, "Leer", "Aqua", "Creator God", "Cyberse", "Dinosaurier", "Donner", "Drache", "Fee", "Fels", "Fisch", "Gefluegeltes Ungeheuer", "Goettliches Ungeheuer", "Hexer", "Insekt", "Krieger", "Maschine", "Pflanze", "Psi", "Pyro", "Reptil", "Seeschlange", "Ungeheuer", "Ungeheuer-Krieger", "Unterweltler", "Wyrm", "Zombie").grid(row = 3, column = 1)
		Label(self.searchWindow, text="Attribut:").grid(row = 4, column = 0)
		OptionMenu(self.searchWindow, self.attributeEntryVariable, "Leer", "Finsternis", "Erde", "Feuer", "Licht", "Wasser", "Wind", "Goettliches Ungeheuer", "Time", "Laught").grid(row = 4, column = 1)
		Label(self.searchWindow, text="ATK:").grid(row = 5, column = 0)
		OptionMenu(self.searchWindow, self.atkGreaterOrLess, "Leer", "Kleiner", "Groesser").grid(row = 5, column = 1)
		self.atkEntry = Entry(self.searchWindow)
		self.atkEntry.grid(row = 5, column = 2)
		Label(self.searchWindow, text="DEF:").grid(row = 6, column = 0)
		OptionMenu(self.searchWindow, self.defGreaterOrLess, "Leer", "Kleiner", "Groesser").grid(row = 6, column = 1)
		self.defEntry = Entry(self.searchWindow)
		self.defEntry.grid(row = 6, column = 2)	
		Button(self.searchWindow, text="Suchen", command=self.search).grid(row = 9, column = 0)
		self.searchWindow.mainloop()