import './profile.css';
import profileIcon from '../../images/profile-icon-gradient.svg';
import header from '../header/header.js';

export default () => {
  const container = document.createElement('section');
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
        <input type="text" placeholder="Nome">
        <input type="text" placeholder="User">
        <div class="btns">
          <button>Salvar</button>
          <button>Editar</button>
        </div>
      </form>
    </section>
    <section class="posts-history"></section>
    `;
  containerProfile.innerHTML = templateProfile;
  container.appendChild(containerProfile);
  return container;
};
