from objects.Card import Card

import datetime, os

class FileHelper:

	def createDefaultFiles(self):
		if not os.path.exists("backups/"):
			os.makedirs("backups/")
		if not os.path.isfile("karten.txt"):
			f = open("karten.txt", "a")
			f.close()

	def saveCard(self, cardObject):
		self.createDefaultFiles()
		fileToWrite = open("karten.txt","a")
		fileToWrite.write(cardObject.name + ":" + cardObject.card + ":" + cardObject.rank + ":" + cardObject.cardType + ":" + cardObject.attribute + ":" + cardObject.speedDuel + ":" + cardObject.atkPoints + ":" + cardObject.defPoints + ":" + cardObject.quantity + "\n")
		fileToWrite.close()

	def deleteCard(self, cardObject):
		self.createDefaultFiles()
		l = list()
		s = self.loadCards()
		w = open("karten.txt", "w")
		for card in s:
			if card.name != cardObject.name:
				  w.write(card.name + ":" + card.card + ":" + card.rank + ":" + card.cardType + ":" + card.attribute + ":" + card.speedDuel + ":" + card.atkPoints + ":" + card.defPoints + ":" + card.quantity + "\n")
		w.close()

	def loadCards(self):
		cardList = list()
		self.createDefaultFiles()
		r = open("karten.txt", "r")	
		for card in r.readlines():
			cardAttributes = card.strip("\n").split(":")
			card = Card(cardAttributes[0], cardAttributes[1], cardAttributes[2],cardAttributes[3],cardAttributes[4],cardAttributes[5],cardAttributes[6],cardAttributes[7],cardAttributes[8])
			cardList.append(card)
		return cardList

	def backupCards(self):
		self.createDefaultFiles()
		f = open("karten.txt")
		f1 = open("backups/karten_backup_" + datetime.datetime.now().strftime("%Y-%m-%d") + ".txt", "w")
		for line in f:
			f1.write(line)
