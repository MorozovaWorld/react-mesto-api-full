import editBtn from '../images/edit-btn.svg';
import addPicBtn from '../images/add-btn.svg';
import React from 'react';
import Card from "./Card";
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Main({onEditAvatar, onEditProfile, onAddPlace, onImageClick, cards, onCardLike, onCardDelete }) {
  const user = React.useContext(CurrentUserContext);

  return (
    <main>
      <section className="profile section-width">
        <div className="profile__image-div">
          <img className="profile__image" alt="аватар владельца аккаунта" src={user.avatar} />
          <div className="profile__image-edit-btn-div">
            <button className="profile__image-edit-btn" type="submit" onClick={onEditAvatar}>
              <img src={editBtn} alt="иконка редактирования фотографии профиля" className="profile__image-edit-btn-icon" />
            </button>
          </div>
        </div>
        <div className="profile__info">
          <div className="profile__title-edit">
            <h1 className="profile__info-title">{user.name}</h1>
            <button className="profile__popup-button-open opacity" type="button" onClick={onEditProfile}>
              <img src={editBtn} alt="иконка редактирования профиля" className="profile__popup-button-open-icon" />
            </button>
          </div>
          <p className="profile__info-subtitle">{user.about}</p>
        </div>
        <button className="addpic-popup-button-open opacity" type="button" onClick={onAddPlace}>
          <img src={addPicBtn} alt="кнопка добавить" />
        </button>
      </section>
      <section className="places section-width">
        <ul className="cards">
        {
          cards.map(card => 
            <Card card={card} key={card._id} onImageClick={onImageClick} onCardLike={onCardLike} onCardDelete={onCardDelete} />
          )
        }
        </ul>
      </section>
    </main>
  );
}

export default Main;