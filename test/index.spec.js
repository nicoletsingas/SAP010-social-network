import {
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  auth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from 'firebase/auth';

import {
  setDoc, doc, deleteDoc, updateDoc, collection, getDocs, orderBy, query, serverTimestamp,
  getDoc, db, where,
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
  likePost,
  deslikePost,
  checkLikedPosts,
  changeNickNameAllPosts,
  editProfile,
} from '../src/firebase/firebase.js';

const mockAuth = {
  currentUser: {
    displayName: 'Spock',
    email: 'spock@gmail.com',
    uid: '3141592',
    password: 'Senha@123',
    data: () => ({
      name: 'maria',
      photoURL: '',
      username: 'maria',
    }),
  },
};

jest.mock('firebase/auth');
jest.mock('firebase/firestore');

afterEach(() => {
  jest.clearAllMocks();
});

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
    expect(signInWithPopup).toHaveBeenCalledTimes(1);
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
    expect(onAuthStateChanged).toHaveBeenCalled();
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
    const u = mockAuth.currentUser;
    getAuth.mockReturnValueOnce(mockAuth);
    setDoc.mockResolvedValueOnce();
    await registerUser(u.displayName, u.displayName, u.email, u.password);
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(mockAuth, u.email, u.password);
    expect(setDoc).toHaveBeenCalledTimes(1);
    expect(doc).toHaveBeenCalled();
  });
});

describe('createPost', () => {
  it('Deveria criar um post do usuario e add na collection', async () => {
    const querySnapshot = getDocs.mockResolvedValueOnce([mockAuth.currentUser]);
    const user = {
      uid: '123',
    };
    const docRef = { id: '123456' };
    doc.mockReturnValueOnce(docRef);
    const textPost = 'abc';
    const likes = 0;
    const likeBy = [];
    const post = {
      id: '123',
      nameUser: 'maria',
      user: 'maria',
      photoURL: '',
      content: textPost,
      likes,
      likeBy,
      dateTime: serverTimestamp(),
    };
    await createPost(textPost, user);
    expect(querySnapshot).toHaveBeenCalled();
    expect(setDoc).toHaveBeenCalledWith(docRef, post);
    expect(setDoc).toHaveBeenCalledTimes(1);
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

describe('likePost', () => {
  it('deve adicionar um like ao post corretamente', async () => {
    const postId = 'post123';
    const userId = 'user456';
    const postSnapshot = { data: jest.fn(() => ({ likes: 0, likeBy: [] })) };
    const updateDocMock = jest.fn();
    const postRef = jest.fn().mockReturnThis();
    doc.mockReturnValue(postRef);
    getDoc.mockResolvedValue(postSnapshot);
    updateDoc.mockImplementation(updateDocMock);

    postSnapshot.data.mockReturnValueOnce({ likes: 0, likeBy: [userId] });
    await likePost(postId, userId);
    expect(updateDoc).not.toHaveBeenCalled();

    await likePost(postId, userId);
    expect(doc).toHaveBeenCalledWith(db, 'posts', postId);
    expect(getDoc).toHaveBeenCalledWith(postRef);
    expect(postSnapshot.data).toHaveBeenCalled();
    expect(updateDoc).toHaveBeenCalledWith(postRef, {
      likes: 1,
      likeBy: [userId],
    });
  });
});

describe('deslikePost', () => {
  it('deve remover um like ao post corretamente', async () => {
    const postId = 'post123';
    const userId = 'user456';
    const postSnapshot = { data: jest.fn(() => ({ likes: 1, likeBy: [userId] })) };
    const updateDocMock = jest.fn();
    const postRef = jest.fn().mockReturnThis();
    doc.mockReturnValue(postRef);
    getDoc.mockResolvedValue(postSnapshot);
    updateDoc.mockImplementation(updateDocMock);

    postSnapshot.data.mockReturnValueOnce({ likes: 1, likeBy: [] });
    await deslikePost(postId, userId);
    expect(updateDoc).not.toHaveBeenCalled();

    await deslikePost(postId, userId);
    expect(doc).toHaveBeenCalledWith(db, 'posts', postId);
    expect(getDoc).toHaveBeenCalledWith(postRef);
    expect(postSnapshot.data).toHaveBeenCalled();
    expect(updateDoc).toHaveBeenCalledWith(postRef, {
      likes: 0,
      likeBy: [],
    });
  });
});

describe('checkLikedPosts', () => {
  it('deve verificar se o post ja foi curtido pelo usuário', async () => {
    const postId = 'post123';
    const userId = 'user456';
    const postSnapshot = { data: jest.fn(() => ({ likeBy: [userId] })) };
    const postRef = jest.fn().mockReturnThis();
    doc.mockReturnValue(postRef);
    getDoc.mockResolvedValue(postSnapshot);
    const result = await checkLikedPosts(postId, userId);
    expect(doc).toHaveBeenCalledWith(db, 'posts', postId);
    expect(getDoc).toHaveBeenCalledWith(postRef);
    expect(postSnapshot.data).toHaveBeenCalled();
    expect(result).toBe(true);
  });
  it('deve verificar se o post não foi curtido pelo usuário', async () => {
    const postId = 'post123';
    const userId = 'user456';
    const postSnapshot = { data: jest.fn(() => ({ likeBy: [] })) };
    const postRef = jest.fn().mockReturnThis();
    doc.mockReturnValue(postRef);
    getDoc.mockResolvedValue(postSnapshot);
    const result = await checkLikedPosts(postId, userId);
    expect(doc).toHaveBeenCalledWith(db, 'posts', postId);
    expect(getDoc).toHaveBeenCalledWith(postRef);
    expect(postSnapshot.data).toHaveBeenCalled();
    expect(result).toBe(false);
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

describe('changeNickNameAllPosts', () => {
  it('Deveria alterar o nickname do usuario e de todos os post deste', async () => {
    const mockNickname = 'mariazinha';
    const mockUid = '123456789';
    const mockSnapshot = {
      forEach: jest.fn((callback) => {
        const mockDocument = { data: jest.fn(() => ({ docRef: 'teste' })) };
        callback(mockDocument);
      }),
    };
    getDocs.mockResolvedValue(mockSnapshot);
    updateDoc.mockResolvedValue();
    await changeNickNameAllPosts(mockNickname, mockUid);
    expect(query).toHaveBeenCalledWith(collection(db, 'posts'), where('id', '==', mockUid));
    expect(getDocs).toHaveBeenCalledWith(query());
    expect(updateDoc).toHaveBeenCalledWith(doc(db, 'posts', 'teste'), { user: mockNickname });
  });
});

describe('editProfile', () => {
  it('Deveria editar o perfil do usuario', async () => {
    const mockAuth3 = {
      name: '',
      username: '',
      displayName: '',
    };
    const auth4 = getAuth();
    const mockName = 'elza';
    const mockUserName = 'elzinha';
    const mockId = '123456789';
    getAuth.mockReturnValueOnce(mockAuth3);
    await editProfile(mockId, mockName, mockUserName);
    expect(updateDoc).toHaveBeenCalledWith(doc(db, 'users', mockId), {
      name: mockName,
      username: mockUserName,
    });
    expect(updateProfile).toHaveBeenCalledWith(auth4, { displayName: mockUserName });
  });
});
