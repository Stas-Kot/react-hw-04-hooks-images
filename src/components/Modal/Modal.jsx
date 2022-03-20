import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { IoCloseOutline } from 'react-icons/io5';
import s from './Modal.module.css';

const modalRoot = document.querySelector('#modal-root');

export default function Modal({ largeImageURL, handleModal, tags }) {
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.code === 'Escape') {
        handleModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleModal]);

  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) {
      handleModal();
    }
  };

  return createPortal(
    <div className={s.overlay} onClick={handleBackdropClick}>
      <div className={s.modal}>
        <img src={largeImageURL} alt={tags} />
        <button type="button" className={s.iconBtn} onClick={handleModal}>
          <IoCloseOutline />
        </button>
      </div>
    </div>,
    modalRoot,
  );
}
