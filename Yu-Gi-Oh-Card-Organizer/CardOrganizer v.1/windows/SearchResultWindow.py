from PyQt5.QtWidgets import QApplication, QLabel,QWidget, QTableWidget, QTableWidgetItem,QAbstractItemView, QMessageBox, QPushButton#pylint: disable=E0611
from PyQt5 import QtWidgets, QtCore
from utils.FileHelper import FileHelper
from objects.Card import Card
from tkinter import messagebox
class SearchResultWindow:#TODO:update window when card got deleted,make all into one window
    def itemChange(self, item):
        value = item.text()
        if str(value).isdigit():
            if len(value) < 2:
                value = "0" + value
                item.setText(value)
                row = item.row()
                count = 0
                for card in self.cardList:
                    if count == row:
                        FileHelper().deleteCard(card)
                        newCard = Card(card.name,card.card,card.rank,card.cardType,card.attribute,card.speedDuel,card.atkPoints,card.defPoints,value)
                        FileHelper().saveCard(newCard)
                    count = count + 1
            elif len(value) == 2:
                item.setText(value)
                row = item.row()
                count = 0
                for card in self.cardList:
                    if count == row:
                        FileHelper().deleteCard(card)
                        newCard = Card(card.name,card.card,card.rank,card.cardType,card.attribute,card.speedDuel,card.atkPoints,card.defPoints,value)
                        FileHelper().saveCard(newCard)
                    count = count + 1
        else:
            QMessageBox.about(self.tableWidget,"Error", "Anzahl darf nur Zahlen enthalten. Wert wurde nicht gespeicher.")
    
    def deleteRow(self):
        for row in self.tableWidget.selectedIndexes():
            rowCount = row.row()
        count = 0
        for card in self.cardList:
            if count == rowCount:
                FileHelper().deleteCard(card)
            count = count + 1
        messagebox.showinfo("Info", "Zum Hauptmenu zurückkehren um aktualisierte tabelle zu erhalten.")
    
    def createSearchResultWindow(self, cardList, dontShowCardsWithQuantityZero):
        self.itemsPerPage = len(cardList)
        app = QApplication([])
        self.cardList = cardList
        self.tableWidget = QTableWidget()
        self.tableWidget.resize(800,500)
        self.tableWidget.setWindowTitle("Tabellen Ansicht")
        self.tableWidget.setRowCount(self.itemsPerPage)
        self.tableWidget.setColumnCount(9)
        self.tableWidget.setHorizontalHeaderLabels(["Name:", "Karte:", "Rang:", "Typ:", "Attribut:", "Speed Duel:", "ATK Punkte:", "DEF Punkte:", "Anzahl:"])
        self.tableWidget.setSortingEnabled(True)        
        self.tableWidget.resizeColumnsToContents()
        self.tableWidget.resizeRowsToContents()
        self.deleteRowButton = QPushButton("Lösche ausgewählte Reihe")
        self.deleteRowButton.setToolTip("Löscht die ausgewählte Reihe")
        self.deleteRowButton.clicked.connect(self.deleteRow)
        self.deleteRowButton.move(100,80)
        self.deleteRowButton.show()
        header = self.tableWidget.horizontalHeader()       
        header.setSectionResizeMode(0, QtWidgets.QHeaderView.ResizeToContents)
        header.setSectionResizeMode(1, QtWidgets.QHeaderView.ResizeToContents)
        header.setSectionResizeMode(2, QtWidgets.QHeaderView.ResizeToContents)
        header.setSectionResizeMode(3, QtWidgets.QHeaderView.ResizeToContents)
        header.setSectionResizeMode(4, QtWidgets.QHeaderView.ResizeToContents)
        header.setSectionResizeMode(5, QtWidgets.QHeaderView.ResizeToContents)
        header.setSectionResizeMode(6, QtWidgets.QHeaderView.ResizeToContents)
        header.setSectionResizeMode(7, QtWidgets.QHeaderView.ResizeToContents)
        header.setSectionResizeMode(8, QtWidgets.QHeaderView.ResizeToContents)
        count = 0
        for card in self.cardList:
            if count == self.itemsPerPage:
                        break
            if dontShowCardsWithQuantityZero == 1:
                if int(card.quantity) != 0:
                    speedDuel = "Nein"  
                    if card.speedDuel == 1:
                        speedDuel = "Ja"
                    name = QTableWidgetItem(card.name)
                    name.setFlags(QtCore.Qt.ItemIsEditable)
                    self.tableWidget.setItem(count, 0, name)
                    cardCard = QTableWidgetItem(card.card)
                    cardCard.setFlags(QtCore.Qt.ItemIsEditable)
                    self.tableWidget.setItem(count, 1, cardCard)
                    rank = QTableWidgetItem(card.rank)
                    rank.setFlags(QtCore.Qt.ItemIsEditable)
                    self.tableWidget.setItem(count, 2, rank)
                    cardType = QTableWidgetItem(card.cardType)
                    cardType.setFlags(QtCore.Qt.ItemIsEditable)  
                    self.tableWidget.setItem(count, 3, cardType)
                    attribute = QTableWidgetItem(card.attribute)
                    attribute.setFlags(QtCore.Qt.ItemIsEditable)
                    self.tableWidget.setItem(count, 4, attribute)
                    speedDuel = QTableWidgetItem(speedDuel)
                    speedDuel.setFlags(QtCore.Qt.ItemIsEditable)
                    self.tableWidget.setItem(count, 5, speedDuel)
                    atkPoints = QTableWidgetItem(card.atkPoints)
                    atkPoints.setFlags(QtCore.Qt.ItemIsEditable)
                    self.tableWidget.setItem(count, 6, atkPoints)
                    defPoints = QTableWidgetItem(card.defPoints)
                    defPoints.setFlags(QtCore.Qt.ItemIsEditable)
                    self.tableWidget.setItem(count, 7, defPoints)
                    quantity = QTableWidgetItem(card.quantity)
                    self.tableWidget.setItem(count, 8, quantity)
                    count = count + 1
            else:
                speedDuel = "Nein"
                if card.speedDuel == 1:
                    speedDuel = "Ja"
                name = QTableWidgetItem(card.name)
                name.setFlags(QtCore.Qt.ItemIsEditable)
                self.tableWidget.setItem(count, 0, name)
                cardCard = QTableWidgetItem(card.card)
                cardCard.setFlags(QtCore.Qt.ItemIsEditable)
                self.tableWidget.setItem(count, 1, cardCard)
                rank = QTableWidgetItem(card.rank)
                rank.setFlags(QtCore.Qt.ItemIsEditable)
                self.tableWidget.setItem(count, 2, rank)
                cardType = QTableWidgetItem(card.cardType)
                cardType.setFlags(QtCore.Qt.ItemIsEditable)  
                self.tableWidget.setItem(count, 3, cardType)
                attribute = QTableWidgetItem(card.attribute)
                attribute.setFlags(QtCore.Qt.ItemIsEditable)
                self.tableWidget.setItem(count, 4, attribute)
                speedDuel = QTableWidgetItem(speedDuel)
                speedDuel.setFlags(QtCore.Qt.ItemIsEditable)
                self.tableWidget.setItem(count, 5, speedDuel)
                atkPoints = QTableWidgetItem(card.atkPoints)
                atkPoints.setFlags(QtCore.Qt.ItemIsEditable)
                self.tableWidget.setItem(count, 6, atkPoints)
                defPoints = QTableWidgetItem(card.defPoints)
                defPoints.setFlags(QtCore.Qt.ItemIsEditable)
                self.tableWidget.setItem(count, 7, defPoints)
                quantity = QTableWidgetItem(card.quantity)
                self.tableWidget.setItem(count, 8, quantity)
                count = count + 1
        self.tableWidget.itemChanged.connect(self.itemChange)
        self.tableWidget.show()
        app.exec_()