const text = document.getElementById('results');

const btnGet1 = document.getElementById('btnGet1');
const btnPost = document.getElementById('btnPost');
const btnPut = document.getElementById("btnPut");
const btnDelete = document.getElementById('btnDelete');
const myModal = new bootstrap.Modal(document.getElementById('dataModal'), {
  keyboard: false
})

const url = `https://65451c2c5a0b4b04436da523.mockapi.io/users`;
var usersById = {};

fetch(url)
  .then(response => response.json())
  .then(data => {
    btnGet1.addEventListener('click', () => {
      const userId = document.getElementById('inputGet1Id').value;
      if (!userId) {
        getAll(data);
      } else {
        const user = data.filter((item) => { return Number(item.id) === Number(userId)});

        if (user) {
          text.innerHTML = `
            <li>Nombre: ${user[0].name}</li>
            <li>Apellido: ${user[0].lastname}</li>
            <li>ID: ${user[0].id}</li>
          `;
        } else {
          alert('El ID de usuario no se encontró.');
        }
      }
    });
  })
  .catch(error => console.error('Error:', error));


function getAll(data) {
  text.innerHTML = '';

  for (var i = 0; i < data.length; i++) {
    text.innerHTML += `
      <li>Nombre: ${data[i].name}</li>
      <li>Apellido: ${data[i].lastname}</li>
      <li>ID: ${data[i].id}</li>
    `;
  }
}

btnPost.addEventListener('click', () => {
    const inputName = document.getElementById('inputPostNombre').value;
    const inputLastname = document.getElementById('inputPostApellido').value;

    if (!(inputName && inputLastname)) {
        alert('Ingresa datos en ambos campos.');
    } else {
        var newUser = {
            name: inputName,
            lastname: inputLastname
        };
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Usuario agregado:', data);
            text.innerHTML = `
            <li>Nombre: ${data.name}</li>
            <li>Apellido: ${data.lastname}</li>
            <li>ID: ${data.id}</li>
          `;
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
});

btnPut.addEventListener('click', () => {
  const inputPutId = document.getElementById("inputPutId").value;
  if(!inputPutId){
    return ;
  }
   fetch(url + '/' + inputPutId) 
    .then(response => response.json())
    .then(data => {
      
      const namePut = document.getElementById("inputPutNombre");
      const lastname = document.getElementById("inputPutApellido");
      namePut.value =`${data.name}`;
      lastname.value =`${data.lastname}`;
      document.getElementById("btnSendChanges").removeAttribute('disabled');
      myModal.toggle();
    })
    .catch(error => {
      console.error('Error:', error);
    });

});

document.getElementById("btnSendChanges").addEventListener("click",  () => {
    const namePut = document.getElementById("inputPutNombre");
    const lastname = document.getElementById("inputPutApellido");
    const inputPutId = document.getElementById("inputPutId").value;
    let modifiedUser = {
      name: namePut.value,
      lastname: lastname.value
    }

    fetch(url + '/' + inputPutId, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(modifiedUser)
    })
    .then((resp) => resp.json())
    .then((data) => { 
      text.innerHTML = `
            <li>Nombre: ${data.name}</li>
            <li>Apellido: ${data.lastname}</li>
            <li>ID: ${data.id}</li>
          `;
      myModal.hide();
    })
    .catch(error => {
      console.error('Error:', error);
    });
});

btnDelete.addEventListener('click', ()=> {
  const userToDelete = document.getElementById('inputDelete').value;
  if (!userToDelete){
    return;
  }

  fetch(url + '/' + userToDelete, {
    method: 'DELETE',
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Error al eliminar el usuario: ${response.status} - ${response.statusText}`);
      }
      return response.json(); 
    })
    .then((data) => {
      console.log('Usuario eliminado:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  });
  