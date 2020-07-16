from tkinter import Tk, Label
class StatWindow:
    def createStatWindow(self, cardList):#show how much cards of each type eg. monster trap spell
        self.statWindow = Tk()
        self.statWindow.title("Statistik Fenster")
        self.statWindow.resizable(width=False, height=False)
        totalCards = 0
        totalRanks = 0
        totalAtkPoints = 0
        for card in cardList:
            totalCards  = totalCards + int(card.quantity)
            totalRanks = totalRanks + int(card.rank)
            if str(card.atkPoints).isdigit():
                totalAtkPoints = totalAtkPoints + int(card.atkPoints)
            else:
                totalAtkPoints = totalAtkPoints
        Label(self.statWindow, text="Einzigartige Karten: " + str(len(cardList))).pack()
        Label(self.statWindow, text="Karten insgesamt: " + str(totalCards)).pack()
        Label(self.statWindow, text="Rang aller Karten: " + str(totalRanks)).pack()
        Label(self.statWindow, text="ATK aller Karten: " + str(totalAtkPoints)).pack()
        self.statWindow.mainloop()