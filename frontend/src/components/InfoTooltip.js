import closeBtn from '../images/Close-Icon.svg';

function InfoTooltip({ isOpen, onClose, infoData }) {
  return (
    <div className={`popup popup_action_info` + (isOpen ? ' popup_opened' : '')}>
      <div className="popup__container">
        <img src={infoData.infoIcon} alt="иконка-сообщение" className="popup__infoIcon" />
        <p className="popup__title popup__title_action_info">{infoData.infoMessage}</p>
        <button className="popup__close opacity" type="reset" onClick={onClose}>
          <img src={closeBtn} alt="крестик чтобы закрыть окно редактирования" />
        </button>
      </div>
    </div>
  )
}

export default InfoTooltip;