import { async } from "regenerator-runtime";
import { logOut, createPost, listAllPosts, editPost, deletePost } from "../../firebase/firebase";
import "./feed.css";

export default () => {
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
      <div class="feed">
        <div class="container-input-post">
          <textarea name="" id="user-text-area" cols="5" rows="10" placeholder="O que está jogando?"></textarea>
          <div class="div-btn-publish">
            <button class="btn-publish">Publicar</button>
          </div>
        </div>
      </div>
    </main>
    `;
  containerFeed.innerHTML = templateFeed;

  const feedMain = containerFeed.querySelector('.feed');
  const btnLogOut = containerFeed.querySelector('.btn-logout');
  const imgHamburgerMenu = containerFeed.querySelector('.hamburger-menu');
  const btnPublish = containerFeed.querySelector('.btn-publish');
  const widthScreen = window.screen.width;
  const MenuNav = containerFeed.querySelector('.menu-nav');

  btnLogOut.addEventListener('click', async () => {
    try {
      await logOut();
      window.location.href = '#home';
    } catch (error) {
      console.log(error.message);
    }
  });

  imgHamburgerMenu.addEventListener('click', () => {
    const itensMenu = containerFeed.querySelector('.menu-nav');
    if (itensMenu.style.display === 'none') {
      itensMenu.style.display = 'block';
    } else if (widthScreen >= '992px') {
      MenuNav.style.display = 'block';
    } else {
      itensMenu.style.display = 'none';
    }
  });


  // criar função showPosts e ela recebe o conteudo de allPosts
  const postsList = document.createElement('section');
  postsList.classList.add('section-posts')
  const showPosts = (post) => {
    console.log(post)
    const feed = `
    <div class="post-container">
      <div class="post-header">Publicado por ${post.user}</div>
      <div class="post-content">${post.content}</div>
      <div class="post-info">
        <div class="post-likes">
         <img src="images/like-icon.svg" alt="Like">
        ${post.likes}
        </div>
        <div class="post-date">${post.dateTime.toDate().toLocaleDateString()}</div>
      </div>
      <div class="post-actions">
        <div class="edit-btn">
          <img id="${post.docRef}" src="images/edit-icon.svg" alt="Editar">
        </div>
        <div class="delete-btn">
          <img id="${post.docRef}" src="images/delete-icon.svg" alt="Excluir">
        </div>
      </div>
    </div>
    `;
    postsList.innerHTML += feed;
    feedMain.appendChild(postsList);

    const btnEdit = postsList.querySelector('.edit-btn');

    btnEdit.addEventListener('click', async (event) => {
      const post = containerFeed.querySelector("#user-text-area");
      const postInput = post.value;
      const id = event.target.id;
      await editPost(id, postInput);
    })

    const btnDelete = postsList.querySelector('.delete-btn');

    btnDelete.addEventListener('click', async (event) => {
      const isItToDelete = confirm('Deseja mesmo excluir o post?');
      if(isItToDelete){
        const id = event.target.id;
        await deletePost(id);
        listAllPosts().then((posts) => {
          postsList.innerHTML = "";
          posts.forEach((publish) => {
            showPosts(publish);
          });
        });
      }
    })

  };


  btnPublish.addEventListener("click", async () => {
    console.log("chamei o click");
    const post = containerFeed.querySelector("#user-text-area");
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
