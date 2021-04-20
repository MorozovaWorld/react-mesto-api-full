import React, { useState } from 'react';

function Login({ handleLogin }) {
  const [userData, setUserData] = useState({
  email: '',
  password: ''
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setUserData({
      ...userData,
      [name]: value
    })
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!userData.email || !userData.password){
      return;
    }

    handleLogin(userData.email, userData.password);
  }

  return (
    <div className="popup__container popup__container_theme_dark">
    <form className="popup__form" name="login" onSubmit={handleSubmit}>
      <fieldset className="popup__input-text-form">
        <legend className="popup__title popup__title_theme_dark">Вход</legend>
        <div className="popup__input-container">
          <input type="email" autoComplete='off' onChange={handleChange} name='email' value={userData.email} id="userEmail" placeholder="Email" className="popup__input-text popup__input-text_theme_dark" required />
          <span id="name-error" className="popup__input-error"></span>
        </div>
        <div className="popup__input-container">
          <input type="password" autoComplete='off' onChange={handleChange} name='password' value={userData.password} id="password" placeholder="Пароль" className="popup__input-text popup__input-text_theme_dark" required />
          <span id="job-error" className="popup__input-error"></span>
        </div>
      </fieldset>
      <button type="submit" className="popup__button-submit popup__button-submit_theme_dark opacity">Войти</button>
    </form>
    </div>
  )
}

export default Login;