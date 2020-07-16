from utils.FileHelper import FileHelper
from windows.MainWindow import MainWindow
class Main:
	def __init__(self):
		FileHelper().backupCards()
		MainWindow().createMainWindow()
Main()