// ===== ZED SLANGS DICTIONARY JAVASCRIPT =====

// Global variables
let allSlangs = [];
let filteredSlangs = [];
let favorites = [];
let isShowingAllSlangs = false;
const INITIAL_DISPLAY_COUNT = 6; // Show only 6 slangs initially

// Initialize favorites from localStorage
favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

// Helper function to create unique ID for slang entries
function createSlangId(slang) {
    return `${slang.word}-${slang.language}-${slang.category}`;
}

// Helper function to find slang by unique ID
function findSlangById(slangId) {
    return allSlangs.find(slang => createSlangId(slang) === slangId);
}


// ===== SLANG DATA LOADING =====
async function loadSlangs() {
    try {
        const response = await fetch('data/slangs.json');
        allSlangs = await response.json();
        filteredSlangs = [...allSlangs];
        
        // Initialize page-specific functionality
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        switch (currentPage) {
            case 'index.html':
                initHomePage();
                break;
            case 'dictionary.html':
                initDictionaryPage();
                break;
            case 'submit.html':
                initSubmitPage();
                break;
        }
    } catch (error) {
        console.error('Error loading slangs:', error);
        // Fallback data for demo purposes
        allSlangs = getFallbackSlangs();
        filteredSlangs = [...allSlangs];
        initHomePage();
    }
}

// Fallback data for demo purposes
function getFallbackSlangs() {
    return [
        {
            "word": "Chililo",
            "language": "Bemba",
            "category": "Expression",
            "meaning": "Funeral or mourning ceremony",
            "example_native": "Ba mayo nabaya ku chililo.",
            "example_translation": "My mom has gone for a funeral.",
            "audio": "chililo.mp3"
        },
        {
            "word": "Ni zee",
            "language": "Nyanja",
            "category": "Expression",
            "meaning": "Cool Talk",
            "example_native": "Awe mudala, iyi yeve ni zee maningi che.",
            "example_translation": "No worries, bro its all good.",
            "audio": "ni zee.mp3"
        },
        {
            "word": "Mukwai",
            "language": "Bemba",
            "category": "Greeting",
            "meaning": "Respectful greeting, meaning 'sir' or 'madam'",
            "example_native": "Mukwai, mwaiseni?",
            "example_translation": "Sir/Madam, you are welcome?",
            "audio": "mukwai.mp3"
        },
        {
            "word": "Chibuku",
            "language": "Nyanja",
            "category": "Food",
            "meaning": "Traditional beer made from maize",
            "example_native": "Tikagule chibuku.",
            "example_translation": "Let's go buy traditional beer.",
            "audio": "chibuku.mp3"
        },
        {
            "word": "Boma",
            "language": "Bemba",
            "category": "Expression",
            "meaning": "Government or authority",
            "example_native": "Boma ni boma.",
            "example_translation": "Government is government.",
            "audio": "boma.mp3"
        },
        {
            "word": "Nsima",
            "language": "Nyanja",
            "category": "Food",
            "meaning": "Zambian staple food made from maize meal",
            "example_native": "Nikudya nsima na ndiyo.",
            "example_translation": "I'm eating nshima with relish.",
            "audio": "nshima.mp3"
        },
        
        {
            "word": "Balibe plan",
            "language": "Nyanja",
            "category": "Expression",
            "meaning": "No direction, just messing around",
            "example_native": "Abo balibe plan, bango zunguluka mu town che ai.",
            "example_translation": "Those guys have no direction, they are just moving around town .",
            "audio": "balibeplan.mp3"
        },
        {
            "word": "Paipa pano",
            "language": "Nyanja",
            "category": "Expression",
            "meaning": "its getting serious",
            "example_native": "paipa pano, muzimai akamba sitikudya lelo .",
            "example_translation": "Its getting serious here, mom has said we are not eating today.",
            "audio": "paipapano.mp3"
        },
        {
            "word": "Kaya",
            "language": "Nyanja",
            "category": "Expression",
            "meaning": "i dont know/whatever",
            "example_native": "Kaya, kapena ati nama.",
            "example_translation": "I dont know, maybe he lied to us.",
            "audio": "kaya.mp3"
        },
        {
            "word": "Kwati ni movie",
            "language": "Nyanja",
            "category": "Fun",
            "meaning": "More like a movie",
            "example_native": "Drama yapa facebook kwati ni movie.",
            "example_translation": "That facebook drama was like a movie.",
            "audio": "kwatinimovie.mp3"
        },
    ];
}

// ===== HOME PAGE FUNCTIONALITY =====
function initHomePage() {
    // Load slang of the day
    loadSlangOfTheDay();
    
    // Initialize favorite functionality for slang of the day
    const favoriteBtn = document.getElementById('favoriteSlang');
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', toggleFavorite);
    }
    
    // Initialize audio functionality
    const audioBtn = document.getElementById('playSlangAudio');
    if (audioBtn) {
        audioBtn.addEventListener('click', playSlangAudio);
    }
}

function loadSlangOfTheDay() {
    if (allSlangs.length === 0) return;
    
    // Generate a random slang for each page refresh
    const randomIndex = Math.floor(Math.random() * allSlangs.length);
    const selectedSlang = allSlangs[randomIndex];
    
    // Update DOM elements
    const slangWord = document.getElementById('slangWord');
    const slangLanguage = document.getElementById('slangLanguage');
    const slangMeaning = document.getElementById('slangMeaning');
    const slangExampleNative = document.getElementById('slangExampleNative');
    const slangExampleTranslation = document.getElementById('slangExampleTranslation');
    const favoriteBtn = document.getElementById('favoriteSlang');
    
    if (slangWord) slangWord.textContent = selectedSlang.word;
    if (slangLanguage) slangLanguage.textContent = selectedSlang.language;
    if (slangMeaning) slangMeaning.textContent = selectedSlang.meaning;
    if (slangExampleNative) slangExampleNative.textContent = selectedSlang.example_native;
    if (slangExampleTranslation) slangExampleTranslation.textContent = selectedSlang.example_translation;
    
    // Update favorite button state
    if (favoriteBtn) {
        const selectedSlangId = createSlangId(selectedSlang);
        const isFavorited = favorites.some(fav => createSlangId(fav) === selectedSlangId);
        favoriteBtn.classList.toggle('favorited', isFavorited);
        favoriteBtn.textContent = isFavorited ? '❤️ Remove from Favorites' : '❤️ Add to Favorites';
    }
    
    // Store current slang for audio and favorite functionality
    window.currentSlang = selectedSlang;
}

function toggleFavorite() {
    const currentSlang = window.currentSlang;
    if (!currentSlang) return;
    
    const favoriteBtn = document.getElementById('favoriteSlang');
    const currentSlangId = createSlangId(currentSlang);
    const isFavorited = favorites.some(fav => createSlangId(fav) === currentSlangId);
    
    if (isFavorited) {
        // Remove from favorites
        favorites = favorites.filter(fav => createSlangId(fav) !== currentSlangId);
        favoriteBtn.classList.remove('favorited');
        favoriteBtn.textContent = '❤️ Add to Favorites';
    } else {
        // Check if already exists to prevent duplicates
        const exists = favorites.some(fav => createSlangId(fav) === currentSlangId);
        if (!exists) {
            favorites.push(currentSlang);
        }
        favoriteBtn.classList.add('favorited');
        favoriteBtn.textContent = '❤️ Remove from Favorites';
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function playSlangAudio() {
    const currentSlang = window.currentSlang;
    if (!currentSlang) return;
    
    // Simulate audio playback (in a real app, you'd load actual audio files)
    const audioBtn = document.getElementById('playSlangAudio');
    const originalText = audioBtn.textContent;
    
    audioBtn.textContent = '🔊 Playing...';
    audioBtn.disabled = true;
    
    // Simulate audio duration
    setTimeout(() => {
        audioBtn.textContent = originalText;
        audioBtn.disabled = false;
        
        // Show success message
        showNotification(`Playing audio for "${currentSlang.word}"`);
    }, 2000);
}

// ===== DICTIONARY PAGE FUNCTIONALITY =====
function initDictionaryPage() {
    // Initialize search and filters
    const searchInput = document.getElementById('searchInput');
    const languageFilter = document.getElementById('languageFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const favoritesFilter = document.getElementById('favoritesFilter');
    
    if (searchInput) searchInput.addEventListener('input', filterSlangs);
    if (languageFilter) languageFilter.addEventListener('change', filterSlangs);
    if (categoryFilter) categoryFilter.addEventListener('change', filterSlangs);
    if (favoritesFilter) {
        favoritesFilter.addEventListener('change', filterSlangs);
    }
    
    // View All Slangs button event listeners
    const viewAllBtn = document.getElementById('viewAllBtn');
    const showLimitedBtn = document.getElementById('showLimitedBtn');
    
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', toggleViewAllSlangs);
    }
    
    if (showLimitedBtn) {
        showLimitedBtn.addEventListener('click', toggleViewAllSlangs);
    }
    
    // Initial render
    renderSlangs();
    
    // Check URL parameters for language filter
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    if (langParam && languageFilter) {
        languageFilter.value = langParam.charAt(0).toUpperCase() + langParam.slice(1);
        filterSlangs();
    }
}

function filterSlangs() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const languageFilter = document.getElementById('languageFilter')?.value || '';
    const categoryFilter = document.getElementById('categoryFilter')?.value || '';
    const favoritesFilter = document.getElementById('favoritesFilter')?.value || 'all';
    
    filteredSlangs = allSlangs.filter(slang => {
        const matchesSearch = slang.word.toLowerCase().includes(searchTerm) ||
                            slang.meaning.toLowerCase().includes(searchTerm) ||
                            slang.example_native.toLowerCase().includes(searchTerm);
        
        const matchesLanguage = !languageFilter || slang.language === languageFilter;
        const matchesCategory = !categoryFilter || slang.category === categoryFilter;
        const matchesFavorites = favoritesFilter === 'all' || 
                               (favoritesFilter === 'favorites' && 
                                favorites.some(fav => createSlangId(fav) === createSlangId(slang)));
        
        return matchesSearch && matchesLanguage && matchesCategory && matchesFavorites;
    });
    
    // Reset view state when filters change
    isShowingAllSlangs = false;
    const viewAllBtn = document.getElementById('viewAllBtn');
    const showLimitedBtn = document.getElementById('showLimitedBtn');
    
    if (viewAllBtn && showLimitedBtn) {
        viewAllBtn.style.display = 'inline-block';
        showLimitedBtn.style.display = 'none';
    }
    
    renderSlangs();
}

function renderSlangs() {
    const slangsGrid = document.getElementById('slangsGrid');
    const resultsCount = document.getElementById('resultsCount');
    const noResults = document.getElementById('noResults');
    
    if (!slangsGrid) return;
    
    // Determine how many slangs to show
    const slangsToShow = isShowingAllSlangs ? filteredSlangs : filteredSlangs.slice(0, INITIAL_DISPLAY_COUNT);
    
    // Update results count
    if (resultsCount) {
        const totalCount = filteredSlangs.length;
        const shownCount = slangsToShow.length;
        if (isShowingAllSlangs || totalCount <= INITIAL_DISPLAY_COUNT) {
            resultsCount.textContent = `Showing ${totalCount} slang${totalCount !== 1 ? 's' : ''}`;
        } else {
            resultsCount.textContent = `Showing ${shownCount} of ${totalCount} slangs`;
        }
    }
    
    // Show/hide no results message
    if (noResults) {
        noResults.style.display = filteredSlangs.length === 0 ? 'block' : 'none';
    }
    
    // Clear existing content
    slangsGrid.innerHTML = '';
    
    // Render slang cards
    slangsToShow.forEach(slang => {
        const slangCard = createSlangCard(slang);
        slangsGrid.appendChild(slangCard);
    });
}

function createSlangCard(slang) {
    const card = document.createElement('div');
    card.className = 'slang-card';
    
    const slangId = createSlangId(slang);
    const isFavorited = favorites.some(fav => createSlangId(fav) === slangId);
    
    card.innerHTML = `
        <div class="slang-content">
            <div class="slang-header">
                <h3 class="slang-word">${slang.word}</h3>
                <span class="language-badge">${slang.language}</span>
            </div>
            <p class="slang-meaning">${slang.meaning}</p>
            <div class="slang-example">
                <p class="example-native">${slang.example_native}</p>
                <p class="example-translation">${slang.example_translation}</p>
            </div>
            <div class="slang-actions">
                <button class="btn btn-audio" onclick="playSlangAudioFromCard('${slang.word}')">
                    🔊 Play Audio
                </button>
                <button class="btn btn-favorite ${isFavorited ? 'favorited' : ''}" 
                        onclick="toggleFavoriteFromCard('${slangId}')">
                    ${isFavorited ? '❤️ Remove from Favorites' : '❤️ Add to Favorites'}
                </button>
            </div>
        </div>
    `;
    
    return card;
}

function playSlangAudioFromCard(word) {
    const slang = allSlangs.find(s => s.word === word);
    if (!slang) return;
    
    // Simulate audio playback
    showNotification(`Playing audio for "${word}"`);
}

function toggleFavoriteFromCard(slangId) {
    const slang = findSlangById(slangId);
    if (!slang) return;
    
    const isFavorited = favorites.some(fav => createSlangId(fav) === slangId);
    
    if (isFavorited) {
        // Remove from favorites
        favorites = favorites.filter(fav => createSlangId(fav) !== slangId);
    } else {
        // Check if already exists to prevent duplicates
        const exists = favorites.some(fav => createSlangId(fav) === slangId);
        if (!exists) {
            favorites.push(slang);
        }
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // Re-render to update button states immediately
    renderSlangs();
}

// View All Slangs functionality
function toggleViewAllSlangs() {
    isShowingAllSlangs = !isShowingAllSlangs;
    
    const viewAllBtn = document.getElementById('viewAllBtn');
    const showLimitedBtn = document.getElementById('showLimitedBtn');
    
    if (viewAllBtn && showLimitedBtn) {
        if (isShowingAllSlangs) {
            viewAllBtn.style.display = 'none';
            showLimitedBtn.style.display = 'inline-block';
        } else {
            viewAllBtn.style.display = 'inline-block';
            showLimitedBtn.style.display = 'none';
        }
    }
    
    renderSlangs();
}

// ===== SUBMIT PAGE FUNCTIONALITY =====
function initSubmitPage() {
    const submitForm = document.getElementById('submitForm');
    if (submitForm) {
        submitForm.addEventListener('submit', handleSubmit);
    }
}

function handleSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const submission = {
        word: formData.get('slangWord'),
        language: formData.get('slangLanguage'),
        category: formData.get('slangCategory'),
        meaning: formData.get('slangMeaning'),
        example_native: formData.get('slangExampleNative'),
        example_translation: formData.get('slangExampleTranslation'),
        submitter: formData.get('submitterName') || 'Anonymous',
        email: formData.get('submitterEmail') || '',
        notes: formData.get('additionalNotes') || '',
        audio_file: formData.get('slangAudio') ? formData.get('slangAudio').name : null,
        submitted_at: new Date().toISOString()
    };
    
    // In a real app, this is suppose to be sent to a server
    console.log('Slang submission:', submission);
    
    // Show success message
    showNotification('Thank you! Your slang submission has been received. We\'ll review it and add it to the dictionary soon.');
    
    // Reset form
    event.target.reset();
}

// ===== UTILITY FUNCTIONS =====
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--primary-green);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dark mode
    initDarkMode();
    
    // Load slangs data
    loadSlangs();
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// ===== EXPORT FUNCTIONS FOR GLOBAL ACCESS =====
window.playSlangAudioFromCard = playSlangAudioFromCard;
window.toggleFavoriteFromCard = toggleFavoriteFromCard; 