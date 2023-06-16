import './header.css';
import { logOut } from '../../firebase/firebase';

import profileIcon from '../../images/profile-icon.svg';
import signoutIcon from '../../images/signout-icon.svg';
import feedIcon from '../../images/feed-icon.svg';

export default () => {
  const containerHeaderMenu = document.createElement('section');
  containerHeaderMenu.classList.add('containerHeaderMenu');
  const templateHeaderMenu = `
    <header>
        <div class="header">
          <picture class="hamburger-menu">
              <img class="icon-menu" src="images/menu-hamburger.svg" alt="menu hamburguer">
          </picture>
          <div class="title-menu">
              <h1>&lt;GAMEE&gt;</h1>
          </div>
        </div>
    </header>
    <section class="menu">
      <nav class="menu-nav">
        <ul class="all-itens-menu-mobile">
          <li class="li-sidebar-menu"> 
            <a href="#profile" class="itens-menu">
                <img class="icons" src=${profileIcon} alt="profile icon">
                <span>Meu perfil</span>
            </a>
          </li>
          <li class="li-sidebar-menu"> 
            <a href="#feed" class="itens-menu">
              <img class="icons" src=${feedIcon} alt="feed icon">
              <span>Feed</span>
            </a> 
          </li>
          <li class="li-sidebar-menu"> 
            <a href="" class="btn-logout" class="itens-menu">
              <img class="icons" src=${signoutIcon} alt="signout icon">
              <span>Sair</span>
            </a> 
          </li>
        </ul>
      </nav>
      <nav class="menu-nav-desktop">
        <ul class"ul-menu-desktop">
          <li class="li-sidebar-menu"> 
            <a href="#profile" class="itens-menu">
              <img class="icons profile-icon" src=${profileIcon} alt="profile icon">
              <span>Meu perfil</span>
            </a>
          </li>
          <li class="li-sidebar-menu"> 
            <a href="#feed" class="itens-menu">
              <img class="icons" src=${feedIcon} alt="feed icon">
              <span>Feed</span>
            </a> 
          </li>
          <li class="li-sidebar-menu"> 
            <a href="" class="btn-logout" class="itens-menu">
              <img class="icons" src=${signoutIcon} alt="signout icon">
              <span>Sair</span>
            </a> 
          </li>
        </ul>
      </nav>
    </section>
    `;
  containerHeaderMenu.innerHTML = templateHeaderMenu;

  const btnLogOut = containerHeaderMenu.querySelectorAll('.btn-logout');
  const imgHamburgerMenu = containerHeaderMenu.querySelector('.hamburger-menu');
  const widthScreen = window.screen.width;

  btnLogOut.forEach((btn) => {
    btn.addEventListener('click', async () => {
      try {
        await logOut();
        window.location.href = '#home';
      } catch (error) {
        console.log(error.message);
      }
    });
  });

  imgHamburgerMenu.addEventListener('click', () => {
    const itensMenu = containerHeaderMenu.querySelector('.menu-nav');
    if (itensMenu.style.display === 'none') {
      itensMenu.style.display = 'block';
    } else if (widthScreen >= '992px') {
      itensMenu.style.display = 'none';
    } else {
      itensMenu.style.display = 'none';
    }
  });

  return containerHeaderMenu;
}; 

