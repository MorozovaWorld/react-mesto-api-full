import PopupWithForm from './PopupWithForm';
import React, { useRef } from 'react';

function AddPlacePopup({ isOpen, onClose, onAddPlace }) {
  const newCardNameRef = useRef('');
  const newCardLinkRef = useRef('');

  function handleSubmit(e) {
    e.preventDefault();

    onAddPlace({
      name: newCardNameRef.current.value,
      link: newCardLinkRef.current.value,
    });

    handleClear();
  }

  function handleClear() {
    newCardNameRef.current.value = '';
    newCardLinkRef.current.value = '';
  }

  return (
    <PopupWithForm
      title="Новое место"
      name="add-picture"
      btnTitle="Создать"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <div className="popup__input-container">
        <input
          type="text"
          name="name"
          ref={newCardNameRef}
          id="picName"
          placeholder="Название"
          className="popup__input-text popup__input-text_action_add-picture"
          required
        />
        <span id="picName-error" className="popup__input-error"></span>
      </div>
      <div className="popup__input-container">
        <input
          type="url"
          name="link"
          id="picLink"
          ref={newCardLinkRef}
          placeholder="Ссылка на картинку"
          className="popup__input-text popup__input-text_action_add-picture"
          required
        />
        <span id="picLink-error" className="popup__input-error"></span>
      </div>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
