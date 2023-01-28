var url = "http://127.0.0.1:5001/contacts"
var editMode = false

window.onload = getContacts()

document.getElementById('formAdd').onsubmit = (e) => {
e.preventDefault()
postContact()
}

// Função para remover o form de edição, caso ele exista, do dom.
function removeEditFields() { 
    editMode = false // Desative o modo edição
    let popEdit = document.getElementById('popEdit')
    popEdit ? document.body.removeChild(popEdit) : null
}

// Requisição GET para recuperar todos os contatos
function getContacts(){
    fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(json => {
        console.log("json", json)
        document.getElementById('contacts').innerHTML = ""
        if (json.contacts) {
            json.contacts.forEach(contact => {
                document.getElementById('contacts').innerHTML += `<p>Nome: ${contact['name']}  Phone: ${contact['phone']}  <button onclick='showUpdateFields(${contact['id']})'>Editar </button><button onclick='deleteContact(${contact['id']})'>Deletar </button></p>`
            });
        } else {
            document.getElementById('contacts').innerHTML = "Não há nenhum contato na lista!"
        }
        
    })
    .catch(error => console.error(error))
    removeEditFields()
}

// Requisição POST para adicionar um contato na lista no servidor
function postContact(){
    const name = document.getElementById('name');
    const phone = document.getElementById('phone');

    const data = {"name":name.value,"phone":phone.value}

    // Usando o framework axios
    // axios.post(url,{'name':name.value,"phone":phone.value})
    // .then(response => {
    //     console.log(response)
    // })
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(json => {
        console.log("Contato adicionado: ", json)
        getContacts()
    })
    .catch(error => console.error(error));
    name.value = ""
    phone.value = ""
}

// Função chamada ao clicar no botão para editar um contato, cria e exibe os campos para editar o contato.
function showUpdateFields(id){
    if(!editMode) { // Se ele não estiver em modo de edição
        editMode = true // Ative o modo edição
        
        let popEdit = document.createElement('div')
        popEdit.setAttribute('id', 'popEdit')

        let container = document.createElement('div')
        container.setAttribute('id', 'containerPop')

        let title = document.createElement('p')
        title.setAttribute('id', 'title')
        title.innerText = "Atualize seu contato"

        let inputName = document.createElement('input')
        inputName.type = "text";
        inputName.setAttribute('name', 'updateName')
        inputName.setAttribute('id', 'updateName')
        inputName.setAttribute('placeholder', 'Insira o novo nome')
        
        let inputPhone = document.createElement('input')
        inputPhone.type = "text";
        inputPhone.setAttribute('name', 'updatePhone')
        inputPhone.setAttribute('id', 'updatePhone')
        inputPhone.setAttribute('placeholder', 'Insira o novo número')

        let confirmEditButton = document.createElement("button") 
        confirmEditButton.setAttribute("id", "confirmEditButton")
        confirmEditButton.innerText = "Confirmar"

        let formEdit = document.createElement('form')
        formEdit.setAttribute('id', 'formEdit')
        formEdit.append(title, inputName, inputPhone, confirmEditButton)
        formEdit.onsubmit = (e) => {
            e.preventDefault();
            updateContact(id,inputName.value,inputPhone.value);
        }

        container.append(formEdit)
        popEdit.append(container)
        
        document.body.appendChild(popEdit); 
    }
}

// Função chamada após clicar no botão "Confirmar" ao editar um contato.
// Requisição PUT para atualizar o contato em questão (que está salvo na lista no servidor) com os campos alterados pelo usuário
function updateContact(id, name, phone) {
    let urlUpdate = url + `/${parseInt(id)}`
    const data = {"name":name, "phone":phone}
    fetch(urlUpdate, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(json => {
        console.log("Contado editado: ", json)
        getContacts()
    })
    .catch(error => console.error(error));

}

// Requisição DELETE para remover o contato da lista de contatos presente no servidor.
function deleteContact(id){
    let urlDelete = url + `/${parseInt(id)}`
    fetch(urlDelete, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(json => {
        console.log(json)
        getContacts()
    })
    .catch(error => console.error(error));
}