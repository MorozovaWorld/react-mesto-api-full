import closeBtn from '../images/Close-Icon.svg';

function ImagePopup({onImageClose, card, isOpen}) {

  return (
    <div className={`popup popup_action_enlarge-picture ${isOpen && 'popup_opened'}`}>
      <div className="popup__container-picture">
        <figure className="popup__figure">
          <img src={card ? card.link : ''} alt={card ? card.name : ''} className="popup__picture-enlarged" />
          <figcaption className="popup__picture-caption">{card ? card.name : ''}</figcaption>
        </figure>
        <button className="popup__close popup__close_position_picture-popup opacity" type="reset" onClick={onImageClose}>
          <img src={closeBtn} alt="крестик чтобы закрыть окно редактирования" />
        </button>
      </div>
    </div>

  )
}

export default ImagePopup;