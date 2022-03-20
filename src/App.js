import { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import { Bars } from 'react-loader-spinner';
import './App.css';
import Searchbar from 'components/Searchbar/Searchbar';
import ImageGallery from 'components/ImageGallery/ImageGallery';
import Modal from 'components/Modal/Modal';
import Button from 'components/Button/Button';
import galleryAPI from '../src/sevices/gallery-api';
import s from './components/ImageGallery/ImageGallery.module.css';

const per_page = 12;

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [gallery, setGallery] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('idle');
  const [showBtnMore, setShowBtnMore] = useState(false);
  const [error, setError] = useState(null);

  const forSubmitHandler = text => {
    setSearchQuery(text);
    setPage(1);
  };

  const onLoadMore = hits => {
    setPage(s => s + 1);
    setStatus('pendingMore');
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const onClickHandler = index => {
    setActiveImgIdx(index);
    toggleModal();
  };

  useEffect(() => {
    if (searchQuery === '') {
      return;
    }
    setStatus('pending');
    if (page === 1) {
      setGallery([]);
    }
    galleryAPI
      .fetchGallery(searchQuery, page, per_page)
      .then(({ hits, totalHits }) => {
        if (hits.length === 0) {
          toast.error(`No results were found for your query: ${searchQuery}`);
          setStatus('idle');
        } else if (page > totalHits / per_page) {
          toast.error(`No more results for your query: ${searchQuery}`);
          setStatus('resolved');
          setShowBtnMore(false);
        } else {
          setGallery(s => [...s, ...hits]);
          setStatus('resolved');
          setShowBtnMore(true);
        }
      })
      .catch(error => {
        setError(error);
        setStatus('rejected');
      });
  }, [page, searchQuery]);

  useEffect(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  }, [gallery]);

  return (
    <div className="App">
      <Searchbar onSubmit={forSubmitHandler} />
      <ImageGallery images={gallery} onClick={onClickHandler} />
      {status === 'resolved' && showBtnMore && <Button onClick={onLoadMore} />}
      {status === 'pendingMore' && (
        <div className={s.spinnerBottom}>
          <Bars heigth="100" width="100" color="#3f51b5" ariaLabel="loading" />
        </div>
      )}
      {status === 'pending' && (
        <div className={s.spinner}>
          <Bars heigth="100" width="100" color="#3f51b5" ariaLabel="loading" />
        </div>
      )}
      {status === 'rejected' && toast.error(`${error.message}`) && (
        <h1>{error.message}</h1>
      )}
      {showModal && (
        <Modal
          handleModal={toggleModal}
          largeImageURL={gallery[activeImgIdx].largeImageURL}
          tags={gallery[activeImgIdx].tags}
        />
      )}
      <ToastContainer theme={'colored'} autoClose={3000} />
    </div>
  );
}
