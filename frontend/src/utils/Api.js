class Api {
  constructor(config) {
    this._authUrl = config.baseAuthUrl;
    this._singupUrl = config.singupUrl;
    this._singinUrl = config.singinUrl;

    this._url = config.baseUrl;
    this._headers = config.headers;
    this._cardsUrl = config.cardsUrl;
    this._likesUrl = config.likesUrl;
    this._usersUrl = config.usersUrl;
    this._userUrl = config.userUrl;
    this._avatarUrl = config.avatarUrl;
    this._token = localStorage.getItem('jwt');
  }

  register(email, password) {
    return fetch(`${this._authUrl}${this._singupUrl}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
    .then((res) => res.ok ? res.json() : res);
  }

  authorize(email, password) {
    return fetch(`${this._authUrl}${this._singinUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
    .then((res) => res.ok ? res.json() : res);
  }

  getContent(token) {
    return fetch(`${this._authUrl}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    })
    .then(this._resProcess);
  }

  _resProcess(res) {
    return res.ok ? res.json() : Promise.reject(new Error(`Ошибка: ${res.status}, ${res.statusText}`));
  }

  getUserInfo(token) {
    return fetch(`${this._url}${this._usersUrl}${this._userUrl}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
    .then(this._resProcess);
  }

  setUserInfo({name, info}) {
    return fetch(`${this._url}${this._usersUrl}${this._userUrl}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this._token}`,
      },
      body: JSON.stringify({
        name: name,
        about: info
      })
    })
    .then(this._resProcess);
  }

  setUserAvatar(data) {
    return fetch(`${this._url}${this._usersUrl}${this._avatarUrl}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this._token}`,
      },
      body: JSON.stringify({
        avatar: data.link,
      })
    })
    .then(this._resProcess);
  }

  getInitialCards(token) {
    return fetch(`${this._url}${this._cardsUrl}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
    .then(this._resProcess);
  };

  addCard(data) {
    return fetch(`${this._url}${this._cardsUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this._token}`,
      },
      body: JSON.stringify({
        name: data.name,
        link: data.link
      })
    })
    .then(this._resProcess);
  };

  deleteCard(cardId) {
    return fetch(`${this._url}${this._cardsUrl}/${cardId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this._token}`,
      },
    })
    .then(this._resProcess);
  }

  likeCard(card) {
    return fetch(`${this._url}${this._cardsUrl}/likes/${card._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this._token}`,
      },
      body: JSON.stringify({
        likes: card.owner
      })
    })
    .then(this._resProcess);
  }

  dislikeCard(card) {
    return fetch(`${this._url}${this._cardsUrl}/likes/${card._id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this._token}`,
      },
    })
    .then(this._resProcess);
  }

}

const api = new Api({
  baseAuthUrl: `${window.location.protocol}${'//api.mesto-morozova.nomoredomains.icu' || '//localhost:3001'}`,
  singupUrl: '/signup',
  singinUrl: '/signin',

  baseUrl: `${window.location.protocol}${'//api.mesto-morozova.nomoredomains.icu' || '//localhost:3001'}`,
  cardsUrl: '/cards',
  usersUrl: '/users',
  userUrl: '/me',
  avatarUrl: '/me/avatar',
});

export default api;