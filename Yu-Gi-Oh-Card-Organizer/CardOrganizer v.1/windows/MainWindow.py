from windows.cardCreatorWindow import CardCreatorWindow
from windows.TableViewWindow import TableViewWindow
from windows.StatWindow import StatWindow
from windows.SearchWindow import SearchWindow

from utils.FileHelper import FileHelper
from tkinter import Tk, Button, messagebox, Checkbutton, IntVar, Label
import threading
class MainWindow:
	def createCardWindowButton(self):
		cardCreatorThread = threading.Thread(target=CardCreatorWindow().createCardCreatorWindow(FileHelper().loadCards(),self.addCardsMode))
		cardCreatorThread.daemon = True
		cardCreatorThread.start()
	def createTableViewButton(self):
		tableViewThread = threading.Thread(target=TableViewWindow().createTableViewWindow(FileHelper().loadCards(), self.dontShowCardsWithQuantityZero.get()))
		tableViewThread.daemon = True
		tableViewThread.start()	
	def createStatWindowButton(self):
		tableViewThread = threading.Thread(target=StatWindow().createStatWindow(FileHelper().loadCards()))
		tableViewThread.daemon = True
		tableViewThread.start()
	def createSearchWindowButton(self):
		searchEditThread = threading.Thread(target=SearchWindow().createSearchWindow(FileHelper().loadCards(), self.dontShowCardsWithQuantityZero.get()))
		searchEditThread.daemon = True
		searchEditThread.start()
	def backupCardFileDataButton(self):
		FileHelper().backupCards()
		messagebox.showinfo("Info", "Backup wurde erstellt.")
	def createMainWindow(self):
		self.mW = Tk()
		self.mW.title("Hauptmenü")
		#self.mW.resizable(width=False,height=False)
		self.dontShowCardsWithQuantityZero = IntVar()
		self.addCardsMode = IntVar()
		Checkbutton(self.mW,variable=self.dontShowCardsWithQuantityZero, text="Verstecke Karten mit Anzahl 0.").grid(row = 5, column = 0)
		Checkbutton(self.mW,variable=self.addCardsMode, text="Karten hinzufüge Modus").grid(row = 6, column = 0)
		Button(self.mW, text="Erstelle eine neue Karte", command=self.createCardWindowButton).grid(row = 0, column = 0)
		Button(self.mW, text="Zeige Karten Tabelle", command=self.createTableViewButton).grid(row = 4, column = 0)
		Button(self.mW, text="Zeige Statistik Fenster", command=self.createStatWindowButton).grid(row = 1, column = 0)
		Button(self.mW, text="Backup der Karten Textdatei erstellen", command=self.backupCardFileDataButton).grid(row = 2, column = 0)
		Button(self.mW, text="Karten suchen", command=self.createSearchWindowButton).grid(row = 3, column = 0)
		self.mW.mainloop()