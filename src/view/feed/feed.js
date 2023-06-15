import {
  createPost,
  listAllPosts,
  editPost,
  deletePost,
} from '../../firebase/firebase';
import './feed.css';
import header from '../header/header.js';

export default (user) => {
  const container = document.createElement('div');
  container.appendChild(header());

  const containerFeed = document.createElement('section');
  containerFeed.classList.add('container-feed');
  const templateFeed = `
    <main class="main">
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
  container.appendChild(containerFeed);

  const feedMain = containerFeed.querySelector('.feed');
  const btnPublish = containerFeed.querySelector('.btn-publish');
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

  return container;
};
