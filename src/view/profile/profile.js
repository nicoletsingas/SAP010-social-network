import './profile.css';

export default () => {
  const containerProfile = document.createElement('section');
  containerProfile.classList.add('container-profile');
  const templateProfile = `
    <section class="my-profile">
      <div class="profile-picture">
        <img src="" alt="">
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
};
