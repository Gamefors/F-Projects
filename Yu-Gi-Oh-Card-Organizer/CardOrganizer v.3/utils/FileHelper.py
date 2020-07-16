from objects.TrapCard import TrapCard
from objects.SpellCard import SpellCard
from objects.MonsterCard import MonsterCard
import datetime, os

class FileHelper:

	def createDefaultFiles(self):
		if not os.path.exists("backups/"):
			os.makedirs("backups/")
		if not os.path.isfile("karten.txt"):
			f = open("karten.txt", "a")
			f.close()

	def saveCard(self, card):
		self.createDefaultFiles()
		fileToWrite = open("karten.txt","a")
		if card.cardObject == "trap":
			fileToWrite.write(card.cardObject + ":" + card.name + ":" + card.trapType + ":" + card.text + ":" + card.speedDuel + ":" + card.quantity + "\n")
			fileToWrite.close()
		elif card.cardObject == "spell":
			fileToWrite.write(card.cardObject + ":" + card.name + ":" + card.spellType + ":" + card.text + ":" + card.speedDuel + ":" + card.quantity + "\n")
			fileToWrite.close()
		else:
			fileToWrite.write(card.cardObject + ":" + card.name + ":" + card.attribute + ":" + card.level + ":" + card.monsterType + ":" + card.cardType + ":" + card.atkPoints + ":" + card.defPoints + ":" + card.text + ":" + card.speedDuel + ":" + card.quantity + "\n")
			fileToWrite.close()

	# def deleteCard(self, card):
	# 	self.createDefaultFiles()
	# 	l = list()
	# 	s = self.loadCards()
	# 	w = open("karten.txt", "w")
	# 	for card in s:
	# 		if card.name != cardObject.name:
	# 			  w.write(card.name + ":" + card.card + ":" + card.rank + ":" + card.cardType + ":" + card.attribute + ":" + card.speedDuel + ":" + card.atkPoints + ":" + card.defPoints + ":" + card.quantity + "\n")
	# 	w.close()

	def loadCards(self):
		cardList = list()
		self.createDefaultFiles()
		r = open("karten.txt", "r")
		for card in r.readlines():
			cardAttributes = card.strip("\n").split(":")
			if cardAttributes[0] == "trap":
				card = TrapCard(cardAttributes[0], cardAttributes[1], cardAttributes[2], cardAttributes[3], cardAttributes[4], cardAttributes[5])
				cardList.append(card)
			elif cardAttributes[0] == "spell":
				card = SpellCard(cardAttributes[0], cardAttributes[1], cardAttributes[2], cardAttributes[3], cardAttributes[4], cardAttributes[5])
				cardList.append(card)
			else:
				card = MonsterCard(cardAttributes[0], cardAttributes[1], cardAttributes[2], cardAttributes[3], cardAttributes[4], cardAttributes[5], cardAttributes[6], cardAttributes[7], cardAttributes[8], cardAttributes[9], cardAttributes[10])
				cardList.append(card)
		return cardList

	def backupCards(self):
		self.createDefaultFiles()
		f = open("karten.txt")
		f1 = open("backups/karten_backup_" + datetime.datetime.now().strftime("%Y-%m-%d") + ".txt", "w")
		for line in f:
			f1.write(line)
