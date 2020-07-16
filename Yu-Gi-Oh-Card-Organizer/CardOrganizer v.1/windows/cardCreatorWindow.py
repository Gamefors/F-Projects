from utils.FileHelper import FileHelper
from objects.Card import Card
from tkinter import Tk, Button, messagebox, StringVar, IntVar, Label, Entry, OptionMenu, Checkbutton
class CardCreatorWindow:
    def createEntry(self, labeName, x):
        Label(self.cardCreatorWindow, text=labeName).grid(row = x, column = 0)
        entry = Entry(self.cardCreatorWindow)
        entry.grid(row = x, column= 1)
        return entry
    def createEntrys(self):
        self.nameEntry = self.createEntry("Name:", 0)
        self.nameEntry.focus()
        Label(self.cardCreatorWindow, text="Karte:").grid(row = 1, column = 0)
        OptionMenu(self.cardCreatorWindow, self.cardEntryVariable, "Monster/Normal", "Monster/Effekt", "Monster/Ritual", "Monster/Fusion",  "Monster/Synchro", "Monster/Xyz", "Monster/Link", "Monster/Pendel", "Zauber/Normal", "Zauber/Permanent", "Zauber/Ausruestung", "Zauber/Schnell", "Zauber/Spielfeld", "Zauber/Ritual", "Falle/Normal", "Falle/Permanent", "Falle/Konter").grid(row = 1, column = 1)
        self.rankEntry = self.createEntry("Rang:", 2)
        Label(self.cardCreatorWindow, text="Typ:").grid(row = 4, column = 0)
        OptionMenu(self.cardCreatorWindow, self.typeEntryVariable, "Leer", "Aqua", "Creator God", "Cyberse", "Dinosaurier", "Donner", "Drache", "Fee", "Fels", "Fisch", "Gefluegeltes Ungeheuer", "Goettliches Ungeheuer", "Hexer", "Insekt", "Krieger", "Maschine", "Pflanze", "Psi", "Pyro", "Reptil", "Seeschlange", "Ungeheuer", "Ungeheuer-Krieger", "Unterweltler", "Wyrm", "Zombie").grid(row = 4, column = 1)
        Label(self.cardCreatorWindow, text="Attribut:").grid(row = 3, column = 0)
        OptionMenu(self.cardCreatorWindow, self.attributeEntryVariable, "Leer", "Finsternis", "Erde", "Feuer", "Licht", "Wasser", "Wind", "Goettliches Ungeheuer", "Time", "Laught").grid(row = 3, column = 1)
        self.atkPointsEntry = self.createEntry("ATK Punkte:", 5)
        self.defPointsEntry = self.createEntry("DEF Punkte:", 6)
        self.quantityEntry = self.createEntry("Anzahl:", 7)   
        Checkbutton(self.cardCreatorWindow, variable=self.speedDuelEntryVariable, text="Speed Duel").grid(row = 8, column = 0)
    def defineEntryVariables(self):
        self.attributeEntryVariable = StringVar(self.cardCreatorWindow)
        self.typeEntryVariable = StringVar(self.cardCreatorWindow)
        self.cardEntryVariable = StringVar(self.cardCreatorWindow)
        self.speedDuelEntryVariable = IntVar()
        self.attributeEntryVariable.set("Leer")
        self.cardEntryVariable.set("Leer")   
        self.typeEntryVariable.set("Leer")       
    def verifyEntry(self):
        if ":" in str(self.nameEntry.get()):
            messagebox.showwarning("Warnung", "Die Karte darf kein (:) erhalten")
            self.submitCardBool = False
        if len(self.nameEntry.get()) == 0:
            messagebox.showwarning("Warnung", "Die Karte muss einen namen enthalten.")
            self.creatCardBool = False
        if str(self.rankEntry.get()).isdigit() == False:
            messagebox.showwarning("Warnung", "Rang ist keine Zahl. Rang darf ausschließlich eine Zahl enthalten.")
            self.creatCardBool = False
        try:
            if int(self.rankEntry.get()) > 12:
                messagebox.showwarning("Warnung", "Rang ist größer als 12. Der maximal Rang beträgt 12.")
                self.creatCardBool = False
        except ValueError:
            self.creatCardBool = False
        if str(self.quantityEntry.get()).isdigit() == False:
            messagebox.showwarning("Warnung", "Anzahl ist keine Zahl. Anzahl darf ausschließlich eine Zahl enthalten.")
            self.creatCardBool = False
    def createCard(self):
        self.verifyEntry()
        if self.creatCardBool:
            rank = str(self.rankEntry.get())
            if len(rank) < 2:
                rank = "0" + rank
            quantity = str(self.quantityEntry.get())
            if len(quantity) < 2:
                quantity = "0" + quantity 
            atkPoints = str(self.atkPointsEntry.get())
            if len(atkPoints) == 1:
                atkPoints = "000" + atkPoints 
            elif len(atkPoints) == 2:
                atkPoints = "00" + atkPoints
            elif len(atkPoints) == 3:
                atkPoints = "0" + atkPoints
            defPoints = str(self.defPointsEntry.get())
            if len(defPoints) == 1:
                defPoints = "000" + defPoints 
            elif len(defPoints) == 2:
                defPoints = "00" + defPoints
            elif len(defPoints) == 3:
                defPoints = "0" + defPoints 
            card = Card(str(self.nameEntry.get()), str(self.cardEntryVariable.get()), rank, str(self.typeEntryVariable.get()), str(self.attributeEntryVariable.get()), str(self.speedDuelEntryVariable.get()), atkPoints, defPoints, quantity)
            FileHelper().saveCard(card)
            self.cardList.append(card)
            self.cardCreatorWindow.destroy()
            FileHelper().backupCards()
            try:
                if self.mode.get() == 1:
                    self.createCardCreatorWindow(self.cardList,self.mode)
            except AttributeError:
                var = None
        self.creatCardBool = True
    def createCardCreatorWindow(self, cardList,mode1):
        self.cardCreatorWindow = Tk()
        self.cardCreatorWindow.title("Neue Karte")
        self.cardCreatorWindow.geometry("300x500")
        self.cardCreatorWindow.resizable(width=False,height=False)
        self.cardList = cardList
        self.mode = mode1
        self.creatCardBool = True
        self.defineEntryVariables()
        self.createEntrys()
        Button(self.cardCreatorWindow, text="Erstellen", command=self.createCard).grid(row = 9, column = 1)
        self.cardCreatorWindow.mainloop()