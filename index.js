const quotes = [
  {
    text: "The only limit to our realization of tomorrow is our doubts of today.",
    author: "Franklin D. Roosevelt"
  },
  {
    text: "Life is what happens when you're busy making other plans.",
    author: "John Lennon"
  },
  {
    text: "Success is not in what you have, but who you are.",
    author: "Bo Bennett"
  },
  {
    text: "Do not watch the clock. Do what it does. Keep going.",
    author: "Sam Levenson"
  },
  {
    text: "In the middle of every difficulty lies opportunity.",
    author: "Albert Einstein"
  },
  {
    text: "Happiness is not something ready made. It comes from your own actions.",
    author: "Dalai Lama"
  },
  {
    text: "The best way to predict the future is to create it.",
    author: "Peter Drucker"
  },
  {
    text: "You miss 100% of the shots you don't take.",
    author: "Wayne Gretzky"
  },
  {
    text: "Dream big and dare to fail.",
    author: "Norman Vaughan"
  },
  {
    text: "Turn your wounds into wisdom.",
    author: "Oprah Winfrey"
  }
];

let usedIndexes = new Set();
let currentIdx = 0;
let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const newQuoteBtn = document.getElementById('new-quote');
const copyBtn = document.getElementById('copy-quote');
const tweetBtn = document.getElementById('tweet-quote');
const favBtn = document.getElementById('fav-quote');
const copyFeedback = document.getElementById('copy-feedback');
const quoteCount = document.getElementById('quote-count');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const showFavBtn = document.getElementById('show-favorites');
const favModal = document.getElementById('favorites-modal');
const favList = document.getElementById('favorites-list');
const closeModal = document.getElementById('close-modal');
const quoteCard = document.getElementById('quote-card');

function getRandomIndex() {
  if (usedIndexes.size >= quotes.length) usedIndexes.clear();
  let idx;
  do {
    idx = Math.floor(Math.random() * quotes.length);
  } while (usedIndexes.has(idx));
  usedIndexes.add(idx);
  return idx;
}

function displayQuote(idx = null) {
  if (idx === null) idx = getRandomIndex();
  currentIdx = idx;
  const quote = quotes[idx];
  quoteText.textContent = `"${quote.text}"`;
  quoteAuthor.textContent = `— ${quote.author}`;
  quoteCount.textContent = `Quote ${idx + 1} of ${quotes.length}`;
  copyFeedback.style.opacity = 0;
  favBtn.classList.toggle('favorited', isFavorite(quote));
  animateCard();
}

function animateCard() {
  quoteCard.style.animation = 'none';
  // Force reflow
  void quoteCard.offsetWidth;
  quoteCard.style.animation = null;
}

function copyQuote() {
  const text = `${quoteText.textContent} ${quoteAuthor.textContent}`;
  navigator.clipboard.writeText(text).then(() => {
    copyFeedback.textContent = "Copied!";
    copyFeedback.style.opacity = 1;
    setTimeout(() => { copyFeedback.style.opacity = 0; }, 1200);
  });
}

function tweetQuote() {
  const text = `${quoteText.textContent} ${quoteAuthor.textContent}`;
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
}

function isFavorite(quote) {
  return favorites.some(fav => fav.text === quote.text && fav.author === quote.author);
}

function toggleFavorite() {
  const quote = quotes[currentIdx];
  if (isFavorite(quote)) {
    favorites = favorites.filter(fav => !(fav.text === quote.text && fav.author === quote.author));
  } else {
    favorites.push(quote);
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
  favBtn.classList.toggle('favorited', isFavorite(quote));
}

function showFavorites() {
  favList.innerHTML = '';
  if (favorites.length === 0) {
    favList.innerHTML = '<li>No favorites yet.</li>';
  } else {
    favorites.forEach((fav, i) => {
      const li = document.createElement('li');
      li.innerHTML = `<span>"${fav.text}"<br><em>— ${fav.author}</em></span>
        <button class="remove-fav" aria-label="Remove from favorites" title="Remove from favorites" data-idx="${i}">🗑️</button>`;
      favList.appendChild(li);
    });
  }
  favModal.style.display = 'flex';
  favModal.focus();
}

function removeFavorite(idx) {
  favorites.splice(idx, 1);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  showFavorites();
}

function closeFavoritesModal() {
  favModal.style.display = 'none';
}

function toggleTheme() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  themeIcon.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Event Listeners
newQuoteBtn.addEventListener('click', () => displayQuote());
copyBtn.addEventListener('click', copyQuote);
tweetBtn.addEventListener('click', tweetQuote);
favBtn.addEventListener('click', toggleFavorite);
showFavBtn.addEventListener('click', showFavorites);
closeModal.addEventListener('click', closeFavoritesModal);
favList.addEventListener('click', (e) => {
  if (e.target.classList.contains('remove-fav')) {
    removeFavorite(Number(e.target.dataset.idx));
  }
});
themeToggle.addEventListener('click', toggleTheme);

// Modal accessibility
favModal.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeFavoritesModal();
});
closeModal.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') closeFavoritesModal();
});

// Theme on load
(function() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    themeIcon.textContent = '☀️';
  }
})();

// Show a quote on load 
displayQuote();
