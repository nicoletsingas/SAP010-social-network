import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signInWithPopup, GoogleAuthProvider, GithubAuthProvider, signOut, onAuthStateChanged,
} from 'firebase/auth';

import {
  setDoc, doc, collection, serverTimestamp, getDocs, orderBy,
  query, updateDoc, deleteDoc, where, getDoc,
} from 'firebase/firestore';

import {
  app, db,
} from './firebase.config';

const auth = getAuth(app);

const isUserLoggedIn = () => new Promise((resolve) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
});

const logIn = async (email, password) => {
  await signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      console.log('logou o usuario');
    }).then(() => onAuthStateChanged())
    .catch((error) => {
      console.log('Erro ao logar usuário', error.message);
      throw error;
    });
};

const logOut = async () => {
  await signOut(auth);
};

const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
};

const signInWithGitHub = async () => {
  const provider = new GithubAuthProvider();
  await signInWithPopup(auth, provider);
};

const registerUserWithAnotherProvider = async (id, name, username, email, photoURL) => {
  try {
    const userData = {
      id,
      name,
      username,
      email,
      photoURL,
    };
    await setDoc(doc(db, 'users', `${email}`), userData);
    console.log('Usuário cadastrado com sucesso');
  } catch (error) {
    console.log('Erro ao cadastrar usuário:', error.message);
    throw error;
  }
};

const registerUser = async (name, username, email, password) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    const userData = {
      id: auth.currentUser.uid,
      name,
      username,
      email,
      photoURL: 'https://firebasestorage.googleapis.com/v0/b/social-network-237a8.appspot.com/o/profilePicture%2Fprofile-icon.svg?alt=media&token=d028bb21-8bcd-4272-b02f-a0a057e3c2e9',
    };
    await setDoc(doc(db, 'users', `${email}`), userData);
  } catch (error) {
    console.log('Erro ao cadastrar usuário:', error.message);
  }
};

const createPost = async (textPost) => {
  const uid = auth.currentUser.uid;
  let photo = '';
  let nameUser = '';
  const docRefUser = collection(db, 'users');
  const q = query(docRefUser, where('id', '==', uid));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((document) => {
    nameUser = document.data().username;
    photo = document.data().photoURL;
  });
  const post = {
    id: uid,
    user: nameUser,
    photoURL: photo,
    content: textPost,
    likes: 0,
    likeBy: [],
    dateTime: serverTimestamp(),
  };
  const docRef = doc(collection(db, 'posts'));
  await setDoc(docRef, post);
  updateDoc(docRef, { docRef: docRef.id });
};

const listAllPosts = async () => {
  const posts = [];
  const ref = collection(db, 'posts');
  const q = query(ref, orderBy('dateTime', 'desc'));
  const snapshot = await getDocs(q);
  snapshot.forEach((document) => {
    posts.push({ ...document.data(), docRef: document.id });
  });
  return posts;
};

const editPost = async (id, textPost) => {
  const refDoc = doc(db, 'posts', `${id}`);
  await updateDoc(refDoc, {
    content: textPost,
  });
};

const deletePost = async (id) => {
  await deleteDoc(doc(db, 'posts', `${id}`));
};

const likePost = async (postId, userId) => {
  const postRef = doc(db, 'posts', postId);
  const postSnapshot = await getDoc(postRef);
  const post = postSnapshot.data();

  if (post.likeBy && post.likeBy.includes(userId)) {
    return;
  }

  const likes = post.likes + 1;
  const likeBy = post.likeBy ? [...post.likeBy, userId] : [userId];

  await updateDoc(postRef, {
    likes,
    likeBy,
  });
  console.log('like no post');
};

const dislikePost = async (postId, userId) => {
  const postRef = doc(db, 'posts', postId);
  const postSnapshot = await getDoc(postRef);
  const post = postSnapshot.data();

  if (!post.likeBy || !post.likeBy.includes(userId)) {
    return;
  }

  const likes = post.likes - 1;
  const likeBy = post.likeBy.filter((id) => id !== userId);

  await updateDoc(postRef, {
    likes,
    likeBy,
  });
  console.log('dislike no post');
};

const checkLikedPosts = async (postId, userId) => {
  const postRef = doc(db, 'posts', postId);
  const postSnapshot = await getDoc(postRef);
  const post = postSnapshot.data();

  if (post.likeBy && post.likeBy.includes(userId)) {
    return true;
  }
  return false;
};

export {
  registerUserWithAnotherProvider, registerUser, logIn, signInWithGoogle, signInWithGitHub,
  isUserLoggedIn, logOut, auth, signInWithPopup, createPost, listAllPosts, editPost,
  deletePost, onAuthStateChanged, likePost, dislikePost, checkLikedPosts,
};
