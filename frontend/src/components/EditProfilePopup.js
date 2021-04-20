import PopupWithForm from './PopupWithForm';
import React, { useState } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function EditProfilePopup({isOpen, onClose, onUpdateUser}) {
  const user = React.useContext(CurrentUserContext);

  const [name, setName] = useState('');
  const [description , setDescription ] = useState('');

  React.useEffect(() => {
    setName(user.name);
    setDescription(user.about);
  }, [user]); 

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleDescriptionChange(e) {
    setDescription(e.target.value);
  }
  
  function handleSubmit(e) {
    e.preventDefault();
    
    onUpdateUser({
      name: name,
      info: description,
    });
  }

  return (
    <PopupWithForm title='Редактировать профиль' name='edit-profile' btnTitle='Сохранить' isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit}>
      <div className="popup__input-container">
        <input type="text" value={name} onChange={handleNameChange} name='name' id="name" placeholder="Имя" className="popup__input-text" required />
        <span id="name-error" className="popup__input-error"></span>
      </div>
      <div className="popup__input-container">
        <input type="text" value={description} onChange={handleDescriptionChange} name='info' id="job" placeholder="Профессия" className="popup__input-text" required />
        <span id="job-error" className="popup__input-error"></span>
      </div>
    </PopupWithForm>);
}

export default EditProfilePopup;