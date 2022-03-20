const api_KEY = '21750958-271f4873848cc9d3a2fe2c382';

function fetchGallery(name, page, per_page) {
  return fetch(
    `https://pixabay.com/api/?q=${name}&page=${page}&key=${api_KEY}&image_type=photo&orientation=horizontal&per_page=${per_page}`,
  ).then(res => {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(
      new Error(`We're sorry, there are no more results for: "${name}"`),
    );
  });
}

const api = {
  fetchGallery,
};

export default api;
