import PopupWithForm from './PopupWithForm';
import React, { useRef } from 'react';

function EditAvatarPopup({isOpen, onClose, onUpdateAvatar}) {
  const avatarRef = useRef(''); 

  function handleSubmit(e) {
    e.preventDefault();
    
    onUpdateAvatar({
      link: avatarRef.current.value,
    });

    handleClear();
  }

  function handleClear() {
    avatarRef.current.value = '';
  }

  return (
    <PopupWithForm title='Обновить аватар' name='add-profile-picture' btnTitle='Сохранить' isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit}>
    <div className="popup__input-container">
      <input type="url" name='link' ref={avatarRef} id="avatarLink" placeholder="Ссылка на картинку" className="popup__input-text popup__input-text_action_add-profile-picture" required />
      <span id="picLink-error" className="popup__input-error"></span>
    </div>
    </PopupWithForm>
  )
}

export default EditAvatarPopup;