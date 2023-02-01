from flask import Flask, jsonify, request, render_template, Response
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///contacts.sqlite3'

db = SQLAlchemy(app)

class Contact(db.Model):
    id = db.Column('id', db.Integer, primary_key=True, autoincrement=True)
    name = db.Column('name', db.String(70))
    phone = db.Column('phone', db.String(14))

    def __init__(self, name, phone):
       self.name = name
       self.phone = phone

    def as_dict(self):
        return {c.name: getattr(self,c.name) for c in self.__table__.columns}


@app.route('/contactlist',methods=['GET'])
def contactlist():
    return render_template('contactlist.html')


@app.route('/contacts', methods=['GET'])
def get_contacts():
    contatos = Contact.query.all() #db.session.execute(db.select(Contact)).scalars()
    if not contatos:
        return jsonify({'message:':'No contacts found in the server'}), 404
    return jsonify({'contacts':[c.as_dict() for c in contatos]}), 200

with app.app_context():
    db.create_all()

# POST request to add a new contact with data of the new contact on a json file
@app.route('/contacts', methods=['POST'])
def add_contact():
    data = request.get_json()
    if not data or not all(key in data for key in ('name', 'phone')):
        return jsonify({'message': 'Bad request'}), 400
    contact = Contact(name=data['name'], phone=data['phone'])
    db.session.add(contact)
    db.session.commit()
    return jsonify({'contact': contact.as_dict()}), 201

# PUT request to update a contact
@app.route('/contacts/<int:id>', methods=['PUT'])
def update_contact(id):
    data = request.get_json()
    if not data or not all(key in data for key in ('name', 'phone')):
        return jsonify({'message': 'Bad request'}), 400
    contact = Contact.query.get_or_404(id)
    contact.name = data['name']
    contact.phone = data['phone']
    db.session.commit()
    return jsonify({'contact': contact.as_dict()}), 200

# DELETE request to delete a contact
@app.route('/contacts/<int:id>', methods=['DELETE'])
def delete_contact(id):
    contact = Contact.query.get_or_404(id)
    db.session.delete(contact)
    db.session.commit()
    return jsonify({'message': 'Contact has been deleted.'}), 200


app.run(debug=True,port = 5001)
