
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Register({ handleRegister }) {

  const [userData, setUserData] = useState({
    email: '',
    password: '',
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
    const { email, password } = userData;

    handleRegister(email, password);
  }

  return (
    <div className="popup__container popup__container_theme_dark">
    <form className="popup__form" name="login" onSubmit={handleSubmit}>
      <fieldset className="popup__input-text-form">
        <legend className="popup__title popup__title_theme_dark">Регистрация</legend>
        <div className="popup__input-container">
          <input type="email" onChange={handleChange} name='email' value={userData.email} id="userEmail" placeholder="Email" className="popup__input-text popup__input-text_theme_dark" autoComplete='off' required />
          <span id="name-error" className="popup__input-error"></span>
        </div>
        <div className="popup__input-container">
          <input type="password" onChange={handleChange} name='password' value={userData.password} autoComplete='off' id="password" placeholder="Пароль" className="popup__input-text popup__input-text_theme_dark" required />
          <span id="job-error" className="popup__input-error"></span>
        </div>
      </fieldset>
      <button type="submit" className="popup__button-submit popup__button-submit_theme_dark opacity">Зарегистрироваться</button>
    </form>
    <p className="popup__bottomText">Уже зарегистрированы? <Link className="popup__bottomText-link opacity" to="/sign-in">Войти</Link></p>
    </div>
  )
}

export default Register;
