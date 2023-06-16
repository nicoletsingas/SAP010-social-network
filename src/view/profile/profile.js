import './profile.css';
import profileIcon from '../../images/profile-icon-gradient.svg';
import header from '../header/header.js';

export default () => {
  const headerTag = document.getElementById('header-content');
  headerTag.appendChild(header());

  const containerProfile = document.createElement('section');
  containerProfile.classList.add('container-profile');
  const templateProfile = `
    <section class="my-profile display-flex-column">
      <div class="profile-picture display-flex-column">
        <img src="${profileIcon}" alt="profile icon">
        <span>Meu Perfil</span>
      </div>
      <form class="display-flex-column">
        <input class="input-profile" type="text" placeholder="Nome">
        <input class="input-profile" type="text" placeholder="User">
        <div class="btns">
          <button>Salvar</button>
          <button>Editar</button>
        </div>
      </form>
    </section>
    <section class="posts-history"></section>
    `;
  containerProfile.innerHTML = templateProfile;

  return containerProfile;
};
