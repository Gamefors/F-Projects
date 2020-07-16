class Lego:
    def __init__(self, id_, form, categorie, stud_size, extra_text, table, coords, item_no_brick_link):
        self.id = id_
        self.form = form
        self.categorie = categorie
        self.stud_size = stud_size
        self.extra_text = extra_text
        self.table = table
        self.coords = coords
        self.item_no_brick_link = item_no_brick_link
        self.name = self.id + " " + self.stud_size +  " " + self.form +  " " + self.categorie + " " + self.extra_text