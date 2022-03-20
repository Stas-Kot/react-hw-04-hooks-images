import s from './ImageGallery.module.css';
import ImageGalleryItem from '../ImageGalleryItem/ImageGalleryItem';

export default function ImageGallery({ images, onClick }) {
  return (
    <>
      <ul className={s.imageGallery}>
        {images.map(({ webformatURL, tags }, index) => (
          <ImageGalleryItem
            key={index}
            webformatURL={webformatURL}
            tags={tags}
            onClick={() => onClick(index)}
          />
        ))}
      </ul>
    </>
  );
}
