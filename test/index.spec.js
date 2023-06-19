import {
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  auth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from 'firebase/auth';

import {
  setDoc, doc, deleteDoc, updateDoc, collection, getDocs, orderBy, query, serverTimestamp,
} from 'firebase/firestore';

import {
  signInWithGoogle,
  signInWithGitHub,
  logIn,
  logOut,
  registerUserWithAnotherProvider,
  registerUser,
  isUserLoggedIn,
  deletePost,
  editPost,
  calculateTimeAgo,
  createPost,
  listAllPosts,
} from '../src/firebase/firebase.js';

const mockAuth = {
  currentUser: {
    displayName: 'Spock',
    email: 'spock@gmail.com',
    uid: '3141592',
    password: 'Senha@123',
    data: () => ({ name: 'maria' }),
  },
};

jest.mock('firebase/auth');
jest.mock('firebase/firestore');

describe('signInWithGoogle', () => {
  it('deveria ser uma função', () => {
    expect(typeof signInWithGoogle).toBe('function');
  });

  it('Deveria logar o usuário com a conta do google', async () => {
    signInWithPopup.mockResolvedValueOnce();
    await signInWithGoogle();
    expect(signInWithPopup).toHaveBeenCalledTimes(1);
  });
});

describe('signInWithGitHub', () => {
  it('deveria ser uma função', () => {
    expect(typeof signInWithGitHub).toBe('function');
  });

  it('Deveria logar o usuário com a conta do GitHub', async () => {
    signInWithPopup.mockResolvedValueOnce();
    await signInWithGitHub();
    expect(signInWithPopup).toHaveBeenCalledTimes(2);
  });
});

describe('isUserLoggedIn', () => {
  it('deve verificar se o usuário logado está autenticado', () => {
    isUserLoggedIn();
    expect(onAuthStateChanged).toHaveBeenCalledTimes(1);
  });
});

describe('logIn', () => {
  it('Deveria logar com email e senha corretos', async () => {
    const email = 'spock@gmail.com';
    const password = '3141592';
    signInWithEmailAndPassword.mockResolvedValueOnce();
    await logIn(email, password);
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(auth, email, password);
  });

  it('Deveria mostrar um erro e falhar ao logar o usuario', async () => {
    signInWithEmailAndPassword.mockRejectedValueOnce(new Error('Erro ao logar usuário'));
    try {
      await logIn();
    } catch (e) {
      expect(e.message).toEqual('Erro ao logar usuário');
    }
  });
});

describe('logOut', () => {
  it('Deveria deslogar', async () => {
    await logOut();
    expect(signOut).toHaveBeenCalled();
  });
});

describe('registerUserWithAnotherProvider', () => {
  it('Deveria cadastrar um usuário com provedor do Google ou Github', async () => {
    await registerUserWithAnotherProvider();
    expect(setDoc).toHaveBeenCalled();
    expect(doc).toHaveBeenCalled();
  });
  it('Deveria capturar um erro e falhar ao cadastrar um usuário com provedor do Google ou Github', async () => {
    setDoc.mockRejectedValueOnce(new Error('Erro ao cadastrar usuário'));
    try {
      await registerUserWithAnotherProvider();
    } catch (e) {
      expect(e.message).toEqual('Erro ao cadastrar usuário');
    }
  });
});

describe('registerUser', () => {
  it('Deveria cadastrar um usuário com o formulário', async () => {
    const user = mockAuth.currentUser;
    setDoc.mockResolvedValueOnce();
    await registerUser(user.displayName, user.displayName, user.email, user.password);
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(auth, user.email, user.password);
    expect(setDoc).toHaveBeenCalledTimes(2);
    expect(doc).toHaveBeenCalled();
  });
});

describe('createPost', () => {
  it('Deveria criar um post do usuario e add na collection', async () => {
    const dateTime = serverTimestamp.mockResolvedValueOnce('01/01/2023');
    const querySnapshot = getDocs.mockResolvedValueOnce([mockAuth.currentUser]);
    const auth2 = {
      currentUser: {},
    };
    auth2.currentUser = jest.fn().mockReturnValueOnce({ uid: '123' });
    const docRef = doc.mockResolvedValueOnce('1234567');
    // jest.fn().mockReturnValueOnce({ id: '123456' });
    const uidUser = auth2.currentUser;
    const name = 'maria';
    const nameUser = 'maria';
    const photo = '';
    const textPost = 'abc';
    const likes = 0;
    const likeBy = [];
    const date = dateTime;
    const post = {
      id: uidUser,
      nameUser: name,
      user: nameUser,
      photoURL: photo,
      content: textPost,
      likes,
      likeBy,
      dateTime: date,
    };
    await createPost(textPost, uidUser);
    expect(querySnapshot).toHaveBeenCalled();
    expect(setDoc).toHaveBeenCalledTimes(3);
    expect(setDoc).toHaveBeenCalledWith(undefined, post);
    expect(updateDoc).toHaveBeenCalledWith(docRef, { docRef: docRef.id });
  });
});

describe('deletePost', () => {
  it('Deveria deletar o post do usuario', () => {
    deletePost();
    expect(deleteDoc).toHaveBeenCalled();
    expect(doc).toHaveBeenCalled();
  });
});

describe('editPost', () => {
  it('Deveria atualizar o post do usuario', () => {
    editPost();
    expect(updateDoc).toHaveBeenCalled();
    expect(doc).toHaveBeenCalled();
  });
});

describe('listAllPosts', () => {
  it('Deveria listar todos os posts no feed', async () => {
    const snapshot = getDocs.mockResolvedValueOnce([mockAuth.currentUser]);
    await listAllPosts();
    expect(collection).toHaveBeenCalled();
    expect(orderBy).toHaveBeenCalled();
    expect(query).toHaveBeenCalled();
    expect(snapshot).toHaveBeenCalled();
  });
});

describe('calculateTimeAgo', () => {
  it('retorna o tempo da postagem', () => {
    const currentDate = new Date();
    const testDate = [
      { value: 1000, expected: '1 segundo atrás' },
      { value: 60000, expected: '1 minuto atrás' },
      { value: 3600000, expected: '1 hora atrás' },
      { value: 86400000, expected: '1 dia atrás' },
      { value: 172800000, expected: '2 dias atrás' },
    ];
    testDate.forEach((data) => {
      const dateTime = new Date(currentDate.getTime() - data.value);
      const result = calculateTimeAgo(dateTime);
      expect(result).toBe(data.expected);
    });
  });
});
