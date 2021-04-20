import closeBtn from '../images/Close-Icon.svg';

function PopupWithForm({name, isOpen, title, children, btnTitle, onClose, onSubmit }) {
  return (
    <div className={`popup popup_action_${name}` + (isOpen ? ' popup_opened' : '')}>
      <div className="popup__container">
        <form className={`popup__form popup__form_action_${name}`} name={`name`} onSubmit={onSubmit}>
          <fieldset className="popup__input-text-form">
            <legend className="popup__title">{title}</legend>
            {children}
          </fieldset>
          <button type="submit" className="popup__button-submit">{btnTitle}</button>
        </form>
        <button className="popup__close opacity" type="reset" onClick={onClose}>
          <img src={closeBtn} alt="крестик чтобы закрыть окно редактирования" />
        </button>
      </div>
    </div>
  );
}

export default PopupWithForm;