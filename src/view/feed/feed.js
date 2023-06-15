import {
  logOut,
  createPost,
  listAllPosts,
  editPost,
  deletePost,
} from '../../firebase/firebase';
import './feed.css';
import profileIcon from '../../images/profile-icon.svg';
import signoutIcon from '../../images/signout-icon.svg';
import feedIcon from '../../images/feed-icon.svg';

export default (user) => {
  const containerFeed = document.createElement('section');
  containerFeed.classList.add('container-feed');
  const templateFeed = `
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
    <main class="main">
      <nav class="menu-nav">
        <ul>
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
        <ul>
          <li class="li-sidebar-menu"> 
            <a href="#profile" class="my-profile itens-menu">
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
      <div class="feed">
        <div class="container-input-post">
          <textarea name="" id="user-text-area" placeholder="O que está jogando?"></textarea>
          <div class="div-btn-publish">
            <button class="btn-publish">Publicar</button>
          </div>
        </div>
      </div>
    </main>
    `;
  containerFeed.innerHTML = templateFeed;

  const feedMain = containerFeed.querySelector('.feed');
  const btnLogOut = containerFeed.querySelectorAll('.btn-logout');
  const myProfile = containerFeed.querySelectorAll('.my-profile');
  const imgHamburgerMenu = containerFeed.querySelector('.hamburger-menu');
  const btnPublish = containerFeed.querySelector('.btn-publish');
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

  myProfile.forEach((btnProfile) => {
    btnProfile.addEventListener('click', () =>{
      window.location.href = '#profile';
    });
  });

  imgHamburgerMenu.addEventListener('click', () => {
    const itensMenu = containerFeed.querySelector('.menu-nav');
    if (itensMenu.style.display === 'none') {
      itensMenu.style.display = 'block';
    } else if (widthScreen >= '992px') {
      itensMenu.style.display = 'none';
    } else {
      itensMenu.style.display = 'none';
    }
  });

  const postsList = document.createElement('section');
  postsList.classList.add('section-posts');
  postsList.classList.add('section-posts');
  const showPosts = (post) => {
    const feed = `
    <div class="post-container">
      <div class="post-header">Publicado por ${post.user}</div>
      <textarea id="${post.docRef}" class="post-content" disabled>${post.content}</textarea>
      <div class="post-info">
        <div class="post-likes">
         <img src="images/like-icon.svg" alt="Like">
        ${post.likes}
        </div>
        <div class="post-date">${post.dateTime.toDate().toLocaleDateString()}</div>
      </div>
      <div class="post-actions">
        <div class="edit-btn p${post.id}" style="display: none;">
          <img src="images/edit-icon.svg" alt="Editar" class="edit">
        </div>
        <div class="delete-btn p${post.id}" style="display: none;">
          <img id="${post.docRef}" src="images/delete-icon.svg" alt="Excluir" class="delete">
        </div>
      </div>
    </div>
    `;
    postsList.innerHTML += feed;
    feedMain.appendChild(postsList);

    const btns = postsList.querySelectorAll(`.p${post.id}`);
    const btnsDelete = postsList.querySelectorAll('.delete');
    const btnsEdit = postsList.querySelectorAll('.edit');

    if (user.uid === post.id) {
      btns.forEach((btn) => {
        btn.style.display = 'block';
      });
    }

    btnsDelete.forEach((btn) => {
      btn.addEventListener('click', async (event) => {
        const isItToDelete = window.confirm('Deseja mesmo excluir o post?');
        if (isItToDelete) {
          const id = event.target.id;
          await deletePost(id);
          listAllPosts().then((posts) => {
            postsList.innerHTML = '';
            posts.forEach((publish) => {
              showPosts(publish);
            });
          });
        }
      });
    });

    btnsEdit.forEach((btn) => {
      btn.addEventListener('click', () => {
        const divBtn = btn.parentNode;
        const postActions = divBtn.parentNode;
        const postContainer = postActions.parentNode;
        const postContent = postContainer.querySelector('.post-content');
        postContent.removeAttribute('disabled');
        postContent.tabindex = '0';
        postContent.focus();
        const btnSave = document.createElement('button');
        btnSave.classList.add('save-btn');
        const salvar = document.createTextNode('Salvar');
        btnSave.appendChild(salvar);
        btnSave.textContent = 'Salvar';
        const btnCancel = document.createElement('button');
        btnCancel.classList.add('cancel-btn');
        const cancelar = document.createTextNode('Cancelar');
        btnCancel.appendChild(cancelar);
        postActions.appendChild(btnSave);
        postActions.appendChild(btnCancel);
        const del = postActions.querySelector('.delete-btn');
        const edt = postActions.querySelector('.edit-btn');
        edt.style.display = 'none';
        del.style.display = 'none';
        const snapshot = postContent.value;
        console.log(snapshot);
        btnSave.addEventListener('click', async () => {
          await editPost(postContent.id, postContent.value);
          postContent.setAttribute('disabled', true);
          postActions.removeChild(btnSave);
          postActions.removeChild(btnCancel);
          edt.style.display = 'block';
          del.style.display = 'block';
        });
        btnCancel.addEventListener('click', async () => {
          postContent.value = snapshot;
          postContent.setAttribute('disabled', true);
          postActions.removeChild(btnSave);
          postActions.removeChild(btnCancel);
          edt.style.display = 'block';
          del.style.display = 'block';
        });
      });
    });
  };

  btnPublish.addEventListener('click', async () => {
    const post = containerFeed.querySelector('#user-text-area');
    const postInput = post.value;
    if (postInput.length > 0) {
      await createPost(postInput);
      post.value = '';
      listAllPosts().then((posts) => {
        postsList.innerHTML = '';
        posts.forEach((publish) => {
          showPosts(publish);
        });
      });
    } else {
      alert('Não pode publicar um post vazio!');
    }
  });

  listAllPosts().then((posts) => {
    posts.forEach((post) => {
      showPosts(post);
    });
  });

  return containerFeed;
};
