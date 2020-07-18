import json

class LegoImporter():

	def checkValues(self):
		valid = False
		if(self.box == 'k' or self.box == 'g'):
			valid = True
		else:
			print("Box muss 'k' oder 'g' sein.")
			valid = False
		try:
			self.x = int(self.x)
		except ValueError as error:
			print("X Koordinate war keine Nummer.")
			valid = False
		try:
			self.y = int(self.y)
		except ValueError as error:
			print("Y Koordinate war keine Nummer.")
			valid = False
		return valid

	def saveJsonFile(self):
		outfile = open(self.savePath, 'w')
		json.dump(self.data, outfile)

	def appendToJsonFile(self):
		doubleEntry = False
		for lego in self.data:
			if(lego["x"] == self.x and lego["y"] == self.y and self.box == lego["box"]):
				print("Es besteht bereits ein eintrag an position x: " + str(self.x) + " y: " + str(self.y) + " der Legostein wurde nicht zur datenbank hinzugefügt.")
				doubleEntry = True
				break
		if(doubleEntry != True):
			self.data.append({
				'box' : self.box,
    			'pictureName': self.pictureName,
				'text' : self.text,
    			'x': self.x,
    			'y': self.y
			})
			self.saveJsonFile()

	def __init__(self):
		self.savePath = "export/data.json"
		self.data = open(self.savePath)
		self.data = json.load(self.data)
		print("#########################################")
		print("#INFO: Fotodatei Name ohne .png angeben.#")
		print("#########################################")
		while(True):
			self.box = input("Kleine oder große box?(k,g): ")
			self.pictureName = input("Fotodatei Name: ") + ".png"
			self.text = input("Text: ")
			self.x = input("X Koordinate: ")
			self.y = input("Y Koordinate: ")
			if(self.checkValues()):
				self.appendToJsonFile()

LegoImporter()