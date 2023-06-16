import './profile.css';
import profileIcon from '../../images/profile-icon-gradient.svg';
import header from '../header/header.js';
import { getUser, editProfile } from '../../firebase/firebase';

export default (user) => {
  const container = document.createElement('div');
  container.classList.add('container-pai-profile')
  container.appendChild(header());

  const containerProfile = document.createElement('section');
  containerProfile.classList.add('container-profile');
  const templateProfile = `
    <section class="my-profile display-flex-column">
      <div class="profile-picture display-flex-column">
        <img src="${profileIcon}" alt="profile icon">
        <span>Meu Perfil</span>
      </div>
      <form class="display-flex-column">
        <div class="input-label">
          <label for="input-name-profile">Nome</label>
          <input id="input-name-profile" class="input-profile input-name" type="text" disabled>
          <label for="input-nickname-profile">Nickname</label>
          <input id="input-nickname-profile" class="input-profile input-user-name" type="text" disabled>
        </div>
        <div class="btns">
          <button id="${user.email}" class="save-profile-button ocult">Salvar</button>
          <button class="cancel-profile-button ocult">Cancelar</button>
          <button class="edit-profile-button">Editar</button>
        </div>
      </form>
    </section>
    <section class="posts-history"></section>
    `;
  containerProfile.innerHTML = templateProfile;
  container.appendChild(containerProfile);

  const name = containerProfile.querySelector('.input-name');
  const inputUserName = containerProfile.querySelector('.input-user-name');
  const editProfileButton = containerProfile.querySelector('.edit-profile-button');
  const saveProfileButton = containerProfile.querySelector('.save-profile-button');
  const cancelProfileButton = containerProfile.querySelector('.cancel-profile-button');
  const inputs = containerProfile.querySelectorAll('.input-profile');
  
  getUser().then((user) => {
    name.value = user.name;
    inputUserName.value = user.username;
  });

  editProfileButton.addEventListener('click', () => { 
    inputs.forEach((input) => {
      input.removeAttribute('disabled');
    });
    editProfileButton.style.display = 'none';
    saveProfileButton.style.display = 'block';
    cancelProfileButton.style.display = 'block';
  });

  cancelProfileButton.addEventListener('click', () => {
    inputs.forEach((input) => {
      input.setAttribute('disabled', true);
    });
    editProfileButton.style.display = 'block';
    saveProfileButton.style.display = 'none';
    cancelProfileButton.style.display = 'none';
    getUser().then((user) => {
      name.value = user.name;
      inputUserName.value = user.username;
    });
  });

  saveProfileButton.addEventListener('click', (collection) => {
    const updatedName = name.value;
    const updatedNickName = inputUserName.value;
    editProfile(collection.target.id, updatedName, updatedNickName)
  });

  return container;

};
