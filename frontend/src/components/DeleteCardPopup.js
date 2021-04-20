
import PopupWithForm from './PopupWithForm';

function DeleteCardPopup({isOpen, onClose, card, onSubmitCardDelete}) {
  
  function handleSubmit(e) {
    e.preventDefault();
    
    onSubmitCardDelete(card);
  }

  return (
    <PopupWithForm title='Вы уверены?' name='confirm-delete' btnTitle='Да' isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} />
  )
}

export default DeleteCardPopup;