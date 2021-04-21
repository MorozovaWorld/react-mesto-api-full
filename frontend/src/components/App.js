import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';

import Header from './Header';
import Footer from './Footer';
import Main from './Main';
import api from '../utils/Api.js';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import DeleteCardPopup from './DeleteCardPopup';
import '../index.css';
import Login from './Login.js';
import Register from './Register.js';
import InfoTooltip from './InfoTooltip.js';
import ProtectedRoute from './ProtectedRoute.js';
import successIcon from '../images/Union-success.svg';
import failIcon from '../images/Union-fail.svg';

import { CurrentUserContext } from '../contexts/CurrentUserContext';

function App() {
  const history = useHistory();
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isInfoPopupOpen, setInfoPopupOpen] = useState(false);
  const [infoData, setInfoData] = useState({
    infoMessage: '',
    infoIcon: ''
  });

  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [isConfirmCardDeletePopupOpen, setConfirmCardDeletePopupOpen] = useState(false);
  const [isImgPopupOpen, setImgPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({
    link: '',
    name: '',
  });
  const [currentUser, setCurrentUser] = useState({name: '', about: '', avatar: ''});
  const [cards, setCards] = useState([]);
  const [cardToDelete, setCardToDelete] = useState(null);

  useEffect(() => {
    if (loggedIn) {
      history.push('/');
    }
    }, [loggedIn, history]);

  const onRegisterSucceed = () => {
    setInfoData({
      infoMessage: 'Вы успешно зарегистрировались!',
      infoIcon: successIcon
    })

    setInfoPopupOpen(true);
  }

  const onLoginAndRegisterFail = () => {
    setInfoData({
      infoMessage: 'Что-то пошло не так! Попробуйте ещё раз.',
      infoIcon: failIcon
    });

    setInfoPopupOpen(true);
  }
  
  const onLogin = (email, password) => {
    api.authorize(email, password)
      .then((res) => {
        if (res.token) {
          localStorage.setItem('jwt', res.token);
          setLoggedIn(true);
          tokenCheck();
        }
        if (res.status === 401) {
          onLoginAndRegisterFail();
          throw new Error('пользователь с email не найден');
        }
        if (res.status === 400) {
          onLoginAndRegisterFail();
          throw new Error('не передано одно из полей');
        }
      })
      .catch(err => console.log(err));
  };

  const onSignOut = () => {
    setLoggedIn(false);
    localStorage.removeItem('jwt');
  };

  const onRegister = (email, password) => {
    api.register(email, password)
      .then((res) => {
        if (res.status === 400) {
          onLoginAndRegisterFail();
          throw new Error('некорректно заполнено одно из полей');
        }
        if (res.status === 409) {
          onLoginAndRegisterFail();
          throw new Error('Пользователь с таким емейлом уже зарегистрирован');
        }
        onRegisterSucceed();
        history.push('/singin')
      })
      .catch(err => console.log(err));
  };

  const tokenCheck = () => {
    const jwt = localStorage.getItem('jwt');
    if (jwt){
      Promise.all([
        api.getContent(jwt),
        api.getInitialCards(jwt),
        api.getUserInfo(jwt)
      ])
      .then(([userContent, initialCardsData, userData]) => {
        setUserEmail(userContent.email);
        setLoggedIn(true);
        setCards(initialCardsData);
        setCurrentUser(userData);
      })
      .catch((err) => console.log(err))
    }
  }

  useEffect(() => {
    tokenCheck();
    }, []
  );

  const onEditProfile = () => {
    setEditProfilePopupOpen(true);
  }

  const onAddPlace = () => {
    setAddPlacePopupOpen(true);
  }

  const onEditAvatar = () => {
    setEditAvatarPopupOpen(true);
  }

  const onCardDeleteSubmit = ({...card}) => {
    setConfirmCardDeletePopupOpen(true);
    setCardToDelete({...card})
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i === currentUser._id);

    !isLiked ?
    api.likeCard(card).then((newCard) => {
      const newCards = cards.map((c) => c._id === card._id ? newCard : c);
      setCards(newCards);
    }).catch((err) => console.log(err)) :
    api.dislikeCard(card).then((newCard) => {
      const newCards = cards.map((c) => c._id === card._id ? newCard : c);
      setCards(newCards);
    }).catch((err) => console.log(err));
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id).then(() => {
      const newCards = cards.filter(c => c._id !== card._id);
      setCards(newCards);
    })
    .then(() => setConfirmCardDeletePopupOpen(false))
    .catch((err) => console.log(err));
  }

  const handleCardClick  = ({...card}) => {
    setSelectedCard({...selectedCard, name: card.name, link: card.link });
    setImgPopupOpen(true);
  }

  const handleUpdateUser  = ({name, info}) => {
    api.setUserInfo({name, info})
    .then((userData) => {
      setCurrentUser({...currentUser, name: userData.name, about: userData.about });
    })
    .then(() => setEditProfilePopupOpen(false))
    .catch((err) => console.log(err));
  }

  const handleUpdateAvatar  = ({link}) => {
    api.setUserAvatar({link})
    .then((userData) => {
      setCurrentUser({...currentUser, avatar: userData.avatar });
    })
    .then(() => setEditAvatarPopupOpen(false))
    .catch((err) => console.log(err));
  }

  const handleAddPlaceSubmit  = ({name, link}) => {
    api.addCard({name, link})
    .then((newCard) => {
      setCards([newCard, ...cards]);
    })
    .then(() => setAddPlacePopupOpen(false))
    .catch((err) => console.log(err));
  }

  const closeAllPopups = () => {
    setInfoPopupOpen(false);
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setImgPopupOpen(false);
    setConfirmCardDeletePopupOpen(false);
    setTimeout(setSelectedCard, 1000, null);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="body">
        <div className="page">
          <Header userEmail={userEmail} handleSingOut={onSignOut} />
          <Switch>
            <ProtectedRoute
              exact path="/"
              loggedIn={loggedIn}
              component={Main}
              onEditProfile={onEditProfile}
              onAddPlace={onAddPlace}
              onEditAvatar={onEditAvatar}
              onImageClick={handleCardClick}
              cards={cards}
              onCardLike={handleCardLike}
              onCardDelete={onCardDeleteSubmit} />
            <Route path="/signin">
              <Login handleLogin={onLogin} />
            </Route>
            <Route path="/signup">
              <Register handleRegister={onRegister} />
            </Route>
            <Route>
              {loggedIn ? <Redirect to='/' /> : <Redirect to='/signin' />}
            </Route>
          </Switch>
          <Footer />
          <InfoTooltip
            isOpen={isInfoPopupOpen}
            onClose={closeAllPopups}
            infoData={infoData} />
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser} />
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar} />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit} />
          <DeleteCardPopup
            isOpen={isConfirmCardDeletePopupOpen}
            onClose={closeAllPopups}
            onSubmitCardDelete={handleCardDelete}
            card={cardToDelete} />
          <ImagePopup
            card={selectedCard}
            onImageClose={closeAllPopups}
            isOpen={isImgPopupOpen} />
        </div>
      </div>
    </CurrentUserContext.Provider>
  )
}

export default App;
