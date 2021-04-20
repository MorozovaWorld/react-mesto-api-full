import React from 'react';
import likeBtn from '../images/like.svg';
import deleteCardBtn from '../images/delete-btn.svg';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Card({card, onImageClick, onCardLike, onCardDelete}) {
  const user = React.useContext(CurrentUserContext);

  const isOwn = card.owner === user._id;
  const cardDeleteButtonClassName = (
    `card__delete opacity ${isOwn ? 'card__delete_visible' : ''}`
  );

  const isLiked = card.likes.some(i => i === user._id);
  const cardLikeButtonClassName = (
    `card__like-icon opacity ${isLiked ? 'card__like-icon_status_clicked' : ''}`
  );

  const handleCardClick = () => {
    onImageClick({...card});
  };

  const handleLikeClick = () => {
    onCardLike({...card});
  };

  const handleCardDelete = () => {
    onCardDelete({...card});
  };

  return (
    <li className="card">
      <img src={card.link} alt="фотография" className="card__img opacity" onClick={() => {handleCardClick({...card})}}/>
      <div className="card__caption">
        <h2 className="card__caption-text">{card.name}</h2>
        <div className="card__likes">
          <button type="button" className="card__like" onClick={() => {handleLikeClick({...card})}}>
            <img src={likeBtn} alt="иконка сердечка" className={cardLikeButtonClassName} />
          </button>
          <p className="card__like-counter">{card.likes.length}</p>
        </div>
        <button type="button" className={cardDeleteButtonClassName} onClick={() => {handleCardDelete({...card})}}>
          <img src={deleteCardBtn} alt="иконка мусорной корзины" />
        </button>
      </div>
    </li>
  )
}

export default Card;