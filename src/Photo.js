import React, { useState, useEffect } from 'react';
import './photo.css';

const PhotoSearch = () => {
  const [query, setQuery] = useState('');
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const accessKey = 'PV9PiliiEskdrH8ltDYOslL73Z1_OmB5MjkJWqeBtDc';

  const [reachedBottom, setReachedBottom] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (reachedBottom && !loading) {
      loadMorePhotos();
    }
  }, [reachedBottom, loading]);

  const handleScroll = () => {
    const scrollPosition = window.innerHeight + window.scrollY;
    const pageHeight = document.documentElement.scrollHeight;

    const threshold = 0.9;

    // loading over 90% of the page height
    if (scrollPosition / pageHeight > threshold) {
      setReachedBottom(true);
    } else {
      setReachedBottom(false);
    }
  };

  const loadMorePhotos = () => {
    if (query === '' || loading) return;

    setLoading(true);

    fetch(`https://api.unsplash.com/search/photos?query=${query}&page=${page + 1}&client_id=${accessKey}`)
      .then((response) => response.json())
      .then((data) => {
        setPhotos((prevPhotos) => [...prevPhotos, ...data.results]);
        setPage(page + 1);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSearch = () => {
    setPage(1);
    setReachedBottom(false);
    setPhotos([]);
    loadMorePhotos();
  };

  return (
    <div className="photo-search-container">
      <div className="search-box">
        <input type="text" placeholder="Search for photos" value={query} onChange={(e) => setQuery(e.target.value)} />
        <button className="search-button" onClick={handleSearch}>
          Search
        </button>
      </div>
      <div className="photo-list">
        {photos.map((photo) => (
          <img key={photo.id} src={photo.urls.regular} alt={photo.alt_description} />
        ))}
      </div>
      {loading && <p className="loading-indicator">Loading...</p>}
    </div>
  );
};

export default PhotoSearch;
