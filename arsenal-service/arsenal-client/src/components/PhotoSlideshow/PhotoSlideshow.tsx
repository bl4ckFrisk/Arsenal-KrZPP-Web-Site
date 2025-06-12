import React, { useState, useEffect } from 'react';
import styles from './PhotoSlideshow.module.css';

interface PhotoSlideshowProps {
  className?: string;
}

export const PhotoSlideshow: React.FC<PhotoSlideshowProps> = ({ className }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [photos, setPhotos] = useState<string[]>([]);

  // Заглушки для фотографий, пока нет реальных файлов
  const fallbackPhotos = [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop&crop=center&auto=format',
    'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop&crop=center&auto=format',
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&crop=center&auto=format',
    'https://images.unsplash.com/photo-1581092162384-8987c1d64926?w=800&h=600&fit=crop&crop=center&auto=format',
    'https://images.unsplash.com/photo-1581092334651-ddf26d9a09d5?w=800&h=600&fit=crop&crop=center&auto=format'
  ];

  useEffect(() => {
    // Попытка загрузить фотографии из uploads/photos
    const loadPhotos = async () => {
      try {
        // Пытаемся загрузить список фотографий с сервера
        const response = await fetch('/api/photos');
        if (response.ok) {
          const photoList = await response.json();
          if (photoList.length > 0) {
            const photoUrls = photoList.map((filename: string) => `/uploads/photos/${filename}`);
            setPhotos(photoUrls);
          } else {
            // Если фотографии не найдены, используем заглушки
            setPhotos(fallbackPhotos);
          }
        } else {
          // Если API недоступно, используем заглушки
          setPhotos(fallbackPhotos);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Ошибка загрузки фотографий:', error);
        // При ошибке используем заглушки
        setPhotos(fallbackPhotos);
        setIsLoading(false);
      }
    };

    loadPhotos();
  }, []);

  useEffect(() => {
    if (photos.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % photos.length);
    }, 4000); // Смена слайда каждые 4 секунды

    return () => clearInterval(interval);
  }, [photos.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % photos.length);
  };

  if (isLoading) {
    return (
      <div className={`${styles.slideshow} ${className || ''}`}>
        <div className={styles.liquidGlassContainer}>
          <div className={styles.loadingSpinner}></div>
          <p className={styles.loadingText}>Загрузка фотографий...</p>
        </div>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className={`${styles.slideshow} ${className || ''}`}>
        <div className={styles.liquidGlassContainer}>
          <div className={styles.noPhotos}>
            <div className={styles.noPhotosIcon}>📷</div>
            <p>Фотографии не найдены</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.slideshow} ${className || ''}`}>
      <div className={styles.liquidGlassContainer}>
        {/* Main photo display */}
        <div className={styles.photoContainer}>
          {photos.map((photo, index) => (
            <div
              key={index}
              className={`${styles.photo} ${index === currentSlide ? styles.active : ''}`}
              style={{ backgroundImage: `url(${photo})` }}
            >
              <div className={styles.photoOverlay}></div>
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        <button 
          className={`${styles.navButton} ${styles.prevButton}`}
          onClick={goToPrevSlide}
          aria-label="Предыдущее фото"
        >
          <div className={styles.arrowLeft}></div>
        </button>
        
        <button 
          className={`${styles.navButton} ${styles.nextButton}`}
          onClick={goToNextSlide}
          aria-label="Следующее фото"
        >
          <div className={styles.arrowRight}></div>
        </button>

        {/* Slide indicators */}
        <div className={styles.indicators}>
          {photos.map((_, index) => (
            <button
              key={index}
              className={`${styles.indicator} ${index === currentSlide ? styles.active : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Фото ${index + 1}`}
            />
          ))}
        </div>

        {/* Slide counter */}
        <div className={styles.slideCounter}>
          <span className={styles.currentSlide}>{currentSlide + 1}</span>
          <span className={styles.divider}>/</span>
          <span className={styles.totalSlides}>{photos.length}</span>
        </div>

        {/* Progress bar */}
        <div className={styles.progressContainer}>
          <div 
            className={styles.progressBar}
            style={{ 
              width: `${((currentSlide + 1) / photos.length) * 100}%`,
              animationDuration: '4s'
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}; 