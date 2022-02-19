const makeMarkup = cards =>
  cards
    .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      return (cards = `
            <a class="photo-card" href="${largeImageURL}" class="photo-link">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" class="photo-card__img" width="300"/>
            <div class="info">
              <p class="info-item">
                <b>Likes</b>
                <span>${likes}</span>
              </p>
              <p class="info-item">
                <b>Views</b>
                <span>${views}</span>
              </p>
              <p class="info-item">
                <b>Comments</b>
                <span>${comments}</span>
              </p>
              <p class="info-item">
                <b>Downloads</b>
                <span>${downloads}</span>
              </p>
            </div></a>
          `);
    })
    .join('');

export default makeMarkup;
