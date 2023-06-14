import './profile.css';
import profileIcon from '../../images/profile-icon-gradient.svg';

export default () => {
  const containerProfile = document.createElement('section');
  containerProfile.classList.add('container-profile');
  const templateProfile = `
    <section class="my-profile">
    <h1>ENTROU NO PERFIL!!</h1>
      <div class="profile-picture">
        <img src="${profileIcon}" alt="profile icon">
        <span>Meu Perfil</span>
      </div>
      <form>
        <input type="text">
        <input type="text">
        <div>
          <button>Salvar</button>
          <button>Editar</button>
        </div>
      </form>
    </section>
    <section class="posts-history">
    </section>
    `;
  containerProfile.innerHTML = templateProfile;
  return containerProfile
};
