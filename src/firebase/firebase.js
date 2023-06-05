import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signInWithPopup, GoogleAuthProvider, GithubAuthProvider, signOut,
} from 'firebase/auth';

import {
  query, where, getDoc, getDocs, setDoc, doc,
} from 'firebase/firestore';

import {
  app, db, collection,
} from './firebase.config';

const auth = getAuth(app);

const isUserLoggedIn = new Promise((resolve, reject) => {
  auth.onAuthStateChanged((user) => {
    if (user) {
      const displayName = user.displayName;
      const email = user.email;
      const uid = user.uid;
      console.log(`Nome do usuário ${displayName}`);
      console.log(`O e-mail do usuário é ${email}`);
      console.log(`O id do usuário é ${uid}`);
      resolve(user);
    } else {
      reject('Nenhum usuário logado!')
    }
  })
});

const logIn = async (email, password) => {
  await signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      console.log('logou o usuario');
    }).then(() => isUserLoggedIn)
    .catch((error) => console.log(error.message));
};

const logOut = async () => {
  await signOut(auth);
};

const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      console.log(`credential ${credential}`);
    }).catch((error) => {
      console.log(error.message);
    });
};

const signInWithGitHub = async () => {
  const provider = new GithubAuthProvider();
  await signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GithubAuthProvider.credentialFromResult(result);
      console.log(`credential ${credential}`);
    }).catch((error) => {
      console.log(error.code);
      console.log(error.message);
    });
};

const registerUser = async (uid, name, username, email) => {
  try {
    const userData = {
      uid,
      name,
      username,
      email,
    };
    await setDoc(doc(db, 'users', `${email}`), userData);
    console.log('Usuário cadastrado com sucesso');
  } catch (error) {
    console.log('Erro ao cadastrar usuário:', error.message);
  }
};

const authUser = async (email, password) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.log(error.message);
    throw Error('Erro ao autenticar o usuário');
  }
}

const emailAlreadyRegistered = async (email) => {

  const docRef = doc(db, 'users', `${email}`);
  const docSnap = await getDoc(docRef);

  return new Promise((resolve, reject) => {
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      resolve('Usuário já cadastrado no Banco');
    } else {
      console.log("No such document!");
      reject('Usuário precisa ser cadastrado');
    }
  })
};

export {
  registerUser, logIn, signInWithGoogle, signInWithGitHub,
  isUserLoggedIn, logOut, emailAlreadyRegistered, authUser
};
