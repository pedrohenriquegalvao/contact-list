import sqlite3

connection = sqlite3.connect('database.db')


with open('PhoneList/db/schema.sql') as f:
    connection.executescript(f.read())

cur = connection.cursor()

cur.execute("INSERT INTO contacts (nome, phone) VALUES (?, ?)",
            ('Pedro', '(42)99999-9999')
            )

connection.commit()
connection.close()