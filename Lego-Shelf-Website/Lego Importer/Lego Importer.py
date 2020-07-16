from objects.Lego import Lego

from PyQt5 import QtCore, QtGui, QtWidgets, uic
import sys, os

class LegoImporter(QtWidgets.QMainWindow):

	def __init__(self):

		file = open("data/id.txt", "r")
		data = int(file.readlines()[0])
		file.close()

		self.id = data
		self.studSize = ""


		super(LegoImporter, self).__init__()
		mainWindow = uic.loadUi("ui/Importer.ui", self)
		mainWindow.idLineEdit.setText(str(self.id))

		self.form = mainWindow.FormComboBox.currentText()
		self.categorie = mainWindow.CategorieComboBox.currentText()
		self.extraText = mainWindow.extraTextLineEdit.text()

		mainWindow.nameLineEdit.setText(str(self.id) + " " + self.studSize + " " + self.form + " " + self.categorie + " " + self.extraText)


		mainWindow.idCheckBox.clicked.connect(lambda: self.enabelLineEdit("id", mainWindow))
		mainWindow.nameCheckBox.clicked.connect(lambda: self.enabelLineEdit("name", mainWindow))
		mainWindow.submitButton.clicked.connect(lambda: self.submit(mainWindow))


		mainWindow.studSizeLineEdit.textChanged.connect(lambda: self.studChange(mainWindow))
		mainWindow.extraTextLineEdit.textChanged.connect(lambda: self.extraTextChange(mainWindow))
		mainWindow.FormComboBox.currentIndexChanged.connect(lambda: self.formChange(mainWindow))
		mainWindow.CategorieComboBox.currentIndexChanged.connect(lambda: self.categorieChange(mainWindow))
		mainWindow.idLineEdit.textChanged.connect(lambda: self.idChange(mainWindow))

	def studChange(self, mw):
		self.studSize = mw.studSizeLineEdit.text()
		mw.nameLineEdit.setText(str(self.id) + " " + self.studSize + " " + self.form + " " + self.categorie + " " + self.extraText)

	def extraTextChange(self, mw):
		self.extraText = mw.extraTextLineEdit.text()
		mw.nameLineEdit.setText(str(self.id) + " " + self.studSize + " " + self.form + " " + self.categorie + " " + self.extraText)

	def formChange(self, mw):
		self.form = mw.FormComboBox.currentText()
		mw.nameLineEdit.setText(str(self.id) + " " + self.studSize + " " + self.form + " " + self.categorie + " " + self.extraText)

	def categorieChange(self, mw):
		self.categorie = mw.CategorieComboBox.currentText()
		mw.nameLineEdit.setText(str(self.id) + " " + self.studSize + " " + self.form + " " + self.categorie + " " + self.extraText)

	def idChange(self, mw):
		self.id = mw.idLineEdit.text()
		file = open("data/id.txt", "w")
		file.write(str(self.id))
		file.close()
		mw.nameLineEdit.setText(str(self.id) + " " + self.studSize + " " + self.form + " " + self.categorie + " " + self.extraText)

	def enabelLineEdit(self, var, mw):
		if(var == "id"):
			if(mw.idLineEdit.isEnabled()):				
				mw.idLineEdit.setEnabled(0)
			else:
				mw.idLineEdit.setEnabled(1)
		if(var == "name"):
			if(mw.nameLineEdit.isEnabled()):				
				mw.nameLineEdit.setEnabled(0)
			else:
				mw.nameLineEdit.setEnabled(1)

	def updateId(self):
		self.id = int(self.id) + 1
		file = open("data/id.txt", "w")
		file.write(str(self.id))
		file.close()

	def submit(self, mw):
		
		self.updateId()
		mw.idLineEdit.setText(str(self.id))
		print(mw.idLineEdit.text())
		table = mw.tableComboBox.currentText()

		if(table == "Klein"):
			table = "table1"
		else:
			table = "table2"

		coords = mw.coordinateLineEdit.text()

		brickLink = mw.brickLinkNumberLineEdit.text()

		lego = Lego(self.id, self.form, self.categorie, self.studSize, self.extraText, table, coords, brickLink)

	

		file = open("data/result.txt", "a")
		file.write('let lego' + str(lego.id) + ' = {name:"' + lego.name + '", form:"' + lego.form + '", categorie:"' + lego.categorie + '", studSize:"' + lego.stud_size + '", extraText: "' + lego.extra_text + '", table:"' + lego.table + '", coords:"' + lego.coords + '", itemNoBrickLink:"' + lego.item_no_brick_link + '", id:"' + lego.id + '"}' + "\n")
		file.close()

		file = open("data/legoArray.txt", "a")
		file.write("lego" + str(lego.id) + ",")
		file.close()
		
app = QtWidgets.QApplication(sys.argv)
window = LegoImporter()
window.show()
sys.exit(app.exec_())
