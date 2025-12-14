import FLAG_HINTS from './data/flag-hints.js';
import SIMILAR_FLAGS_INFO from './data/similar-flags.js';

        // --- 1. GAME STATE & DATA ---
        let flagsDB = [];
        let flagsByCode = new Map();
        let studyQueue = [];
        let currentCard = null;
        let sessionTotal = 0;
        let sessionCompleted = 0;

        const DEFAULT_PROGRESS = {
            xp: 0,
            streak: 0,
            lastLoginDate: null,
            sessionLimit: 20,
            cards: {}
        };

        let userProgress = { ...DEFAULT_PROGRESS };

        const FLAG_CACHE_KEY = 'flagMasterFlagsCache';
        const FLAG_CACHE_VERSION = 1;
        const FLAG_CACHE_TTL = 1000 * 60 * 60 * 24 * 7; // 7 days

        // --- LEARNING PHASE CONSTANTS ---
        // Cards must be answered correctly this many times before graduating to SRS
        const GRADUATION_THRESHOLD = 3;
        // Maximum cards in active "learning" state at once
        const MAX_LEARNING_CARDS = 5;
        // Maximum new cards to introduce when there's room
        const MAX_NEW_PER_SESSION = 2;
        // Card states
        const CARD_STATE = {
            NEW: 'new',           // Never seen
            LEARNING: 'learning', // In active drilling (same-session repetitions)
            GRADUATED: 'graduated' // Passed to SRS with longer intervals
        };

        // --- 2. COUNTRY PRIORITY TIERS ---
        // Tier 1: Most recognizable flags - major world powers, tourist hotspots, distinctive flags
        const TIER_1_COUNTRIES = new Set([
            'USA', 'GBR', 'FRA', 'DEU', 'ITA', 'ESP', 'JPN', 'CHN', 'IND', 'BRA',
            'CAN', 'AUS', 'MEX', 'RUS', 'KOR', 'NLD', 'CHE', 'SWE', 'NOR', 'DNK',
            'GRC', 'TUR', 'EGY', 'ZAF', 'ARG', 'PRT', 'IRL', 'POL', 'AUT', 'BEL',
            'NZL', 'SGP', 'ISR', 'SAU', 'ARE', 'THA', 'VNM', 'IDN', 'MYS', 'PHL',
            'PAK', 'NGA', 'KEN', 'MAR', 'COL', 'PER', 'CHL', 'CUB', 'JAM', 'FIN'
        ]);

        // Tier 2: Well-known countries - significant population or cultural presence
        const TIER_2_COUNTRIES = new Set([
            'UKR', 'CZE', 'HUN', 'ROU', 'BGR', 'HRV', 'SRB', 'SVK', 'SVN', 'LTU',
            'LVA', 'EST', 'ISL', 'LUX', 'MCO', 'VAT', 'MLT', 'CYP', 'BGD', 'LKA',
            'NPL', 'MMR', 'KHM', 'LAO', 'TWN', 'HKG', 'MAC', 'MNG', 'PRK', 'IRN',
            'IRQ', 'SYR', 'JOR', 'LBN', 'QAT', 'KWT', 'OMN', 'BHR', 'YEM', 'AFG',
            'ETH', 'TZA', 'UGA', 'GHA', 'CIV', 'CMR', 'SEN', 'AGO', 'MOZ', 'ZWE',
            'TUN', 'DZA', 'LBY', 'SDN', 'VEN', 'ECU', 'BOL', 'PRY', 'URY', 'PAN',
            'CRI', 'GTM', 'HND', 'SLV', 'NIC', 'DOM', 'HTI', 'PRI', 'TTO', 'BHS'
        ]);

        function getCountryTier(country) {
            const code = country.cca3;
            if (TIER_1_COUNTRIES.has(code)) return 1;
            if (TIER_2_COUNTRIES.has(code)) return 2;
            // Tier 3: By population
            if (country.population > 50000000) return 3;
            if (country.population > 10000000) return 4;
            if (country.population > 1000000) return 5;
            return 6; // Small countries/territories
        }

        function sortByPriority(countries) {
            // Group by tier
            const tiers = {};
            countries.forEach(country => {
                const tier = getCountryTier(country);
                if (!tiers[tier]) tiers[tier] = [];
                tiers[tier].push(country);
            });

            // Shuffle within each tier for variety
            Object.values(tiers).forEach(tierCountries => {
                shuffleArray(tierCountries);
            });

            // Combine tiers in order
            const sorted = [];
            for (let i = 1; i <= 6; i++) {
                if (tiers[i]) {
                    sorted.push(...tiers[i]);
                }
            }
            return sorted;
        }

        function getFlagsCacheEntry() {
            try {
                const raw = localStorage.getItem(FLAG_CACHE_KEY);
                if (!raw) return null;
                const parsed = JSON.parse(raw);
                if (parsed.version !== FLAG_CACHE_VERSION || !Array.isArray(parsed.flags)) {
                    return null;
                }
                return parsed;
            } catch (error) {
                console.warn('Failed to parse flag cache:', error);
                return null;
            }
        }

        function isCacheEntryFresh(entry) {
            if (!entry || typeof entry.cachedAt !== 'number') return false;
            return (Date.now() - entry.cachedAt) <= FLAG_CACHE_TTL;
        }

        function saveFlagsCache(flags) {
            try {
                localStorage.setItem(FLAG_CACHE_KEY, JSON.stringify({
                    version: FLAG_CACHE_VERSION,
                    cachedAt: Date.now(),
                    flags
                }));
            } catch (error) {
                console.warn('Failed to save flag cache:', error);
            }
        }

        async function fetchFlagDataset() {
            const res = await fetch('https://restcountries.com/v3.1/all?fields=name,flags,cca3,population,latlng,region,subregion');
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            const filtered = data.filter(d => d.cca3 && d.flags && d.flags.svg && d.name && d.name.common);

            if (filtered.length === 0) {
                throw new Error('No valid flag data received');
            }

            return filtered;
        }

        function setFlagDataset(flagData) {
            flagsDB = flagData;
            flagsByCode = new Map();
            flagData.forEach(flag => {
                if (flag && flag.cca3) {
                    flagsByCode.set(flag.cca3, flag);
                }
            });
        }

        function applyFlagDataset(flagData) {
            if (!Array.isArray(flagData) || flagData.length === 0) {
                throw new Error('Flag dataset is empty');
            }

            setFlagDataset(flagData);
            prepareSession();
        }

        function refreshFlagsInBackground() {
            fetchFlagDataset()
                .then(freshFlags => {
                    saveFlagsCache(freshFlags);
                    setFlagDataset(freshFlags);
                })
                .catch(error => {
                    console.warn('Background flag refresh failed:', error);
                });
        }

        // --- 3. FLAG HINTS & MNEMONICS DATABASE ---
        

        // Similar flags reference for quick lookup
        

        function getFlagHint(cca3) {
            return FLAG_HINTS[cca3] || null;
        }

        function getSimilarFlags(cca3) {
            const hint = FLAG_HINTS[cca3];
            if (!hint || !hint.similar || hint.similar.length === 0) return [];

            return hint.similar.map(similarCode => {
                const similarCountry = flagsByCode.get(similarCode);
                if (!similarCountry) return null;

                // Find the tip for this pair
                const pairKey1 = `${cca3}-${similarCode}`;
                const pairKey2 = `${similarCode}-${cca3}`;
                const tipInfo = SIMILAR_FLAGS_INFO[pairKey1] || SIMILAR_FLAGS_INFO[pairKey2];

                return {
                    cca3: similarCode,
                    name: similarCountry.name.common,
                    flag: similarCountry.flags.svg,
                    tip: tipInfo ? tipInfo.tip : `Often confused with ${similarCountry.name.common}`
                };
            }).filter(Boolean);
        }

        // --- 4. UTILITY FUNCTIONS ---
        function getTodayDateString() {
            return new Date().toISOString().split('T')[0];
        }

        function getTodayTimestamp() {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return today.getTime();
        }

        function formatInterval(days) {
            if (days === 0) return '1m';
            if (days === 1) return '1d';
            if (days < 7) return `${days}d`;
            if (days < 30) return `${Math.round(days / 7)}w`;
            return `${Math.round(days / 30)}mo`;
        }

        // --- 3. INITIALIZATION ---
        async function initGame() {
            loadProgress();
            loadSettings();
            updateHUD();

            const messageArea = document.getElementById('message-area');
            messageArea.innerHTML = '<div class="spinner"></div>Loading flags from around the world...';
            messageArea.style.display = 'block';
            document.getElementById('game-area').style.display = 'none';
            document.getElementById('progress-container').style.display = 'none';

            const cacheEntry = getFlagsCacheEntry();
            const hasFreshCache = isCacheEntryFresh(cacheEntry);

            if (hasFreshCache) {
                try {
                    applyFlagDataset(cacheEntry.flags);
                    refreshFlagsInBackground();
                    return;
                } catch (error) {
                    console.warn('Cached flag data invalid, refetching...', error);
                }
            }

            try {
                const freshFlags = await fetchFlagDataset();
                saveFlagsCache(freshFlags);
                applyFlagDataset(freshFlags);
            } catch (error) {
                console.error('Failed to load flags:', error);
                if (cacheEntry && Array.isArray(cacheEntry.flags) && cacheEntry.flags.length > 0) {
                    applyFlagDataset(cacheEntry.flags);
                } else {
                    messageArea.innerHTML = `
                        <div style="font-size: 2rem; margin-bottom: 10px;">😕</div>
                        <strong>Error loading data</strong><br>
                        <span style="font-size: 0.9rem;">${error.message}</span><br><br>
                        <button onclick="location.reload()" class="show-answer-btn">Try Again</button>
                    `;
                }
            }
        }

        // --- 4. STREAK LOGIC ---
        function updateStreak() {
            const today = getTodayDateString();
            const lastLogin = userProgress.lastLoginDate;

            if (!lastLogin) {
                // First time user
                userProgress.streak = 1;
            } else if (lastLogin === today) {
                // Already logged in today, streak unchanged
                return;
            } else {
                // Check if yesterday
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];

                if (lastLogin === yesterdayStr) {
                    // Consecutive day - increment streak
                    userProgress.streak += 1;
                } else {
                    // Streak broken - reset to 1
                    userProgress.streak = 1;
                }
            }

            userProgress.lastLoginDate = today;
            saveProgress();
        }

        // --- 5. SPACED REPETITION LOGIC ---
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        function prepareSession() {
            const todayTimestamp = getTodayTimestamp();

            // Update streak on session start
            updateStreak();

            // Categorize cards into three groups
            const learningCards = [];  // Cards in active learning (not yet graduated)
            const dueReviews = [];     // Graduated cards due for review
            const newCards = [];       // Never seen before

            flagsDB.forEach(flag => {
                const id = flag.cca3;
                const progress = userProgress.cards[id];

                if (!progress) {
                    // Never seen - new card
                    newCards.push(flag);
                } else if (progress.state === CARD_STATE.LEARNING) {
                    // Still in learning phase - always include
                    learningCards.push(flag);
                } else if (progress.state === CARD_STATE.GRADUATED && progress.nextReview <= todayTimestamp) {
                    // Graduated and due for review
                    dueReviews.push(flag);
                }
            });

            // Build the study queue
            studyQueue = [];

            // 1. Always include cards still being learned (they need drilling)
            shuffleArray(learningCards);
            studyQueue.push(...learningCards);

            // 2. Add graduated cards due for review (to maintain knowledge)
            shuffleArray(dueReviews);
            studyQueue.push(...dueReviews);

            // 3. Only add NEW cards if we have room in the learning queue
            const currentLearningCount = learningCards.length;
            if (currentLearningCount < MAX_LEARNING_CARDS) {
                const slotsAvailable = MAX_LEARNING_CARDS - currentLearningCount;
                const newToAdd = Math.min(slotsAvailable, MAX_NEW_PER_SESSION);
                const prioritizedNewCards = sortByPriority(newCards).slice(0, newToAdd);

                // Initialize these new cards as "learning" state
                prioritizedNewCards.forEach(flag => {
                    userProgress.cards[flag.cca3] = {
                        state: CARD_STATE.LEARNING,
                        correctStreak: 0,
                        interval: 0,
                        nextReview: 0,
                        lastReviewed: Date.now()
                    };
                });

                studyQueue.push(...prioritizedNewCards);
                if (prioritizedNewCards.length > 0) {
                    saveProgress();
                }
            }

            // Track session stats
            sessionTotal = studyQueue.length;
            sessionCompleted = 0;

            updateProgressBar();
            updateHUD();
            renderNextCard();
        }

        function getRemainingNewCards() {
            // Count cards that haven't been studied yet
            return flagsDB.filter(flag => !userProgress.cards[flag.cca3]).length;
        }

        function startNextSession() {
            // Just run prepareSession again - it handles everything
            prepareSession();
        }

        function calculateNextReview(rating) {
            let interval = 1;

            if (rating === 'again') {
                interval = 0;
            } else if (rating === 'hard') {
                interval = 1;
            } else if (rating === 'good') {
                interval = 3;
            } else if (rating === 'easy') {
                interval = 7;
            }

            // Extend intervals for cards already studied
            if (currentCard && userProgress.cards[currentCard.cca3] && rating !== 'again') {
                const currentInterval = userProgress.cards[currentCard.cca3].interval || 1;
                if (rating === 'easy') interval = Math.round(currentInterval * 2.5);
                else if (rating === 'good') interval = Math.round(currentInterval * 1.8);
                else if (rating === 'hard') interval = Math.round(currentInterval * 1.2);

                // Cap at reasonable maximum (6 months)
                interval = Math.min(interval, 180);
            }

            return interval;
        }

        function updateIntervalLabels() {
            if (!currentCard) return;

            const cardData = userProgress.cards[currentCard.cca3];
            const isLearning = !cardData || cardData.state === CARD_STATE.LEARNING;
            const correctStreak = cardData ? cardData.correctStreak : 0;

            if (isLearning) {
                // Learning phase - show progress-based labels
                const againLabel = document.getElementById('interval-again');
                const hardLabel = document.getElementById('interval-hard');
                const goodLabel = document.getElementById('interval-good');
                const easyLabel = document.getElementById('interval-easy');

                againLabel.textContent = 'Reset';

                // Show how close they are to graduating
                const remaining = GRADUATION_THRESHOLD - correctStreak;
                if (remaining <= 1) {
                    hardLabel.textContent = `${remaining} more`;
                    goodLabel.textContent = '🎓 Done!';
                    easyLabel.textContent = '🎓 Done!';
                } else {
                    hardLabel.textContent = `${remaining} more`;
                    goodLabel.textContent = `${remaining} more`;
                    easyLabel.textContent = `${remaining} more`;
                }
            } else {
                // Graduated - show SRS intervals
                const ratings = ['again', 'hard', 'good', 'easy'];
                ratings.forEach(rating => {
                    const interval = calculateNextReview(rating);
                    const label = document.getElementById(`interval-${rating}`);
                    if (label) {
                        label.textContent = formatInterval(interval);
                    }
                });
            }
        }

        // --- 6. UI RENDERING ---
        function renderNextCard() {
            const gameArea = document.getElementById('game-area');
            const msgArea = document.getElementById('message-area');
            const progressContainer = document.getElementById('progress-container');

            if (studyQueue.length === 0) {
                gameArea.style.display = 'none';
                progressContainer.style.display = 'none';
                msgArea.style.display = 'block';

                const graduatedCount = Object.values(userProgress.cards).filter(c => c.state === CARD_STATE.GRADUATED).length;
                const learningCount = Object.values(userProgress.cards).filter(c => c.state === CARD_STATE.LEARNING).length;
                const remainingCards = getRemainingNewCards();

                let continueMessage = '';
                if (learningCount > 0 || remainingCards > 0) {
                    continueMessage = `
                        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--border);">
                            <span style="color: var(--text-muted);">
                                ${learningCount > 0 ? `${learningCount} flags still learning` : ''}
                                ${learningCount > 0 && remainingCards > 0 ? ' · ' : ''}
                                ${remainingCards > 0 ? `${remainingCards} more to discover` : ''}
                            </span><br><br>
                            <button onclick="startNextSession()" class="show-answer-btn">
                                Continue Learning
                            </button>
                        </div>
                    `;
                } else {
                    continueMessage = `<br>Come back tomorrow to review!`;
                }

                msgArea.innerHTML = `
                    <div style="font-size: 3rem; margin-bottom: 15px;">🎉</div>
                    <strong>Session Complete!</strong><br><br>
                    You graduated <strong>${sessionCompleted}</strong> flags this session!<br>
                    <span style="color: var(--primary);">📚 ${graduatedCount} flags learned overall!</span>
                    ${continueMessage}
                `;
                return;
            }

            gameArea.style.display = 'block';
            progressContainer.style.display = 'block';
            msgArea.style.display = 'none';

            currentCard = studyQueue[0];
            const cardData = userProgress.cards[currentCard.cca3];

            // Reset UI state
            const flagImg = document.getElementById('flag-img');
            const placeholder = document.getElementById('flag-placeholder');
            const countryName = document.getElementById('country-name');
            const ratingArea = document.getElementById('rating-area');
            const showBtn = document.getElementById('show-btn');
            const difficultyBadge = document.getElementById('difficulty-badge');
            const cardStateBadge = document.getElementById('card-state-badge');
            const learningProgress = document.getElementById('learning-progress');

            // Update card state badge and flag indicators
            const flagIndicatorIcon = document.getElementById('flag-indicator-icon');
            const flagIndicatorDots = document.getElementById('flag-indicator-dots');

            if (cardData && cardData.state === CARD_STATE.GRADUATED) {
                cardStateBadge.textContent = '📖 Review';
                cardStateBadge.className = 'card-state-badge review';
                learningProgress.classList.add('hidden');
                flagIndicatorIcon.textContent = '📖';
                flagIndicatorDots.classList.add('hidden');
            } else {
                cardStateBadge.textContent = '🎯 Learning';
                cardStateBadge.className = 'card-state-badge learning';
                learningProgress.classList.remove('hidden');
                flagIndicatorIcon.textContent = '🎯';
                flagIndicatorDots.classList.remove('hidden');

                // Update progress dots (both old and new)
                const correctStreak = cardData ? cardData.correctStreak : 0;
                for (let i = 1; i <= GRADUATION_THRESHOLD; i++) {
                    const dot = document.getElementById(`dot-${i}`);
                    const indicatorDot = document.getElementById(`indicator-dot-${i}`);
                    if (dot) {
                        if (i <= correctStreak) {
                            dot.classList.add('filled');
                        } else {
                            dot.classList.remove('filled');
                        }
                    }
                    if (indicatorDot) {
                        if (i <= correctStreak) {
                            indicatorDot.classList.add('filled');
                        } else {
                            indicatorDot.classList.remove('filled');
                        }
                    }
                }
            }

            // Update difficulty badge
            const tier = getCountryTier(currentCard);
            const tierLabels = {
                1: 'Famous',
                2: 'Common',
                3: 'Notable',
                4: 'Moderate',
                5: 'Tricky',
                6: 'Expert'
            };
            difficultyBadge.textContent = tierLabels[tier];
            difficultyBadge.className = `difficulty-badge tier-${tier}`;

            // Show loading state for image
            flagImg.classList.remove('loaded');
            placeholder.classList.remove('hidden');

            // Set image with error handling
            flagImg.onload = () => {
                flagImg.classList.add('loaded');
                placeholder.classList.add('hidden');
            };
            flagImg.onerror = () => {
                placeholder.textContent = '🏳️';
                placeholder.classList.remove('hidden');
                flagImg.classList.remove('loaded');
            };

            flagImg.src = currentCard.flags.svg;
            flagImg.alt = `Flag of ${currentCard.name.common} - try to identify this country`;

            countryName.textContent = '';
            countryName.classList.remove('visible');
            ratingArea.classList.remove('visible');
            showBtn.classList.remove('hidden');

            // Hide hints and map from previous card
            document.getElementById('hint-section').classList.remove('visible');
            document.getElementById('map-section').classList.remove('visible');
            document.getElementById('map-region-label').classList.remove('visible');

            updateIntervalLabels();
            updateHUD();
        }

        function showAnswer() {
            const countryName = document.getElementById('country-name');
            countryName.textContent = currentCard.name.common;
            countryName.classList.add('visible');
            document.getElementById('rating-area').classList.add('visible');
            document.getElementById('show-btn').classList.add('hidden');

            // Display memory hints
            displayHints(currentCard.cca3);

            // Display map location
            displayMapLocation(currentCard);

            // Focus first rating button for keyboard navigation
            document.querySelector('.rate-btn').focus();
        }

        function displayHints(cca3) {
            const hintSection = document.getElementById('hint-section');
            const hintMnemonic = document.getElementById('hint-mnemonic');
            const hintSymbolism = document.getElementById('hint-symbolism');
            const colorMeanings = document.getElementById('color-meanings');
            const similarFlags = document.getElementById('similar-flags');
            const similarFlagsList = document.getElementById('similar-flags-list');

            const hint = getFlagHint(cca3);

            if (!hint) {
                // No hint available for this flag
                hintSection.classList.remove('visible');
                return;
            }

            // Show mnemonic
            if (hint.mnemonic) {
                hintMnemonic.innerHTML = hint.mnemonic;
                hintMnemonic.style.display = 'block';
            } else {
                hintMnemonic.style.display = 'none';
            }

            // Show color meanings
            if (hint.colors && hint.colors.length > 0) {
                colorMeanings.innerHTML = hint.colors.map(c => `
                    <span class="color-tag">
                        <span class="color-dot" style="background-color: ${c.color}"></span>
                        <span>${c.name}: ${c.meaning}</span>
                    </span>
                `).join('');
                hintSymbolism.style.display = 'block';
            } else {
                hintSymbolism.style.display = 'none';
            }

            // Show similar flags
            const similar = getSimilarFlags(cca3);
            if (similar.length > 0) {
                similarFlagsList.innerHTML = similar.map(s => `
                    <div class="similar-flag-item">
                        <img src="${s.flag}" alt="${s.name} flag" class="similar-flag-img">
                        <div>
                            <div class="similar-flag-name">${s.name}</div>
                            <div class="similar-flag-tip">${s.tip}</div>
                        </div>
                    </div>
                `).join('');
                similarFlags.style.display = 'block';
            } else {
                similarFlags.style.display = 'none';
            }

            // Show the hint section with animation
            hintSection.classList.add('visible');
        }

        function displayMapLocation(country) {
            const mapSection = document.getElementById('map-section');
            const mapMarker = document.getElementById('map-marker');
            const mapRegionLabel = document.getElementById('map-region-label');

            if (!country.latlng || country.latlng.length < 2) {
                mapSection.classList.remove('visible');
                mapRegionLabel.classList.remove('visible');
                return;
            }

            const [lat, lng] = country.latlng;

            // Convert lat/lng to percentage coordinates for equirectangular projection
            // Equirectangular projection maps:
            // - Longitude: -180° to +180° maps to 0% to 100% (left to right)
            // - Latitude: +90° to -90° maps to 0% to 100% (top to bottom)
            const xPercent = ((lng + 180) / 360) * 100;
            const yPercent = ((90 - lat) / 180) * 100;

            // Position the marker (transform: translate(-50%, -50%) centers it)
            mapMarker.style.left = `${xPercent}%`;
            mapMarker.style.top = `${yPercent}%`;
            mapMarker.style.display = 'block';

            // Show region info
            const region = country.region || 'Unknown';
            const subregion = country.subregion || '';
            mapRegionLabel.innerHTML = `<strong>${country.name.common}</strong> is located in ${subregion ? subregion + ', ' : ''}${region}`;

            // Show the map section with animation
            mapSection.classList.add('visible');
            mapRegionLabel.classList.add('visible');
        }

        function rateCard(rating) {
            const id = currentCard.cca3;
            let cardData = userProgress.cards[id] || {
                state: CARD_STATE.LEARNING,
                correctStreak: 0,
                interval: 0,
                nextReview: 0,
                lastReviewed: Date.now()
            };

            // Remove card from front of queue
            studyQueue.shift();

            if (rating === 'again') {
                // Wrong answer - reset streak, keep in learning
                cardData.correctStreak = 0;
                cardData.state = CARD_STATE.LEARNING;
                cardData.lastReviewed = Date.now();

                // Put back in queue (a few cards later, not at the very end)
                const insertPos = Math.min(3, studyQueue.length);
                studyQueue.splice(insertPos, 0, currentCard);

            } else {
                // Correct answer
                cardData.correctStreak++;
                cardData.lastReviewed = Date.now();

                if (cardData.state === CARD_STATE.LEARNING) {
                    // Still in learning phase - check if ready to graduate
                    if (cardData.correctStreak >= GRADUATION_THRESHOLD) {
                        // GRADUATE to SRS!
                        cardData.state = CARD_STATE.GRADUATED;
                        const interval = (rating === 'easy') ? 7 : (rating === 'good') ? 3 : 1;
                        cardData.interval = interval;

                        const nextDate = new Date();
                        nextDate.setDate(nextDate.getDate() + interval);
                        nextDate.setHours(0, 0, 0, 0);
                        cardData.nextReview = nextDate.getTime();

                        // XP bonus for graduating a card!
                        userProgress.xp += 25;
                        sessionCompleted++;

                        // Check if we should add a new card to fill the learning queue
                        maybeAddNewCard();

                    } else {
                        // Not graduated yet - keep in session for more drilling
                        // Insert back into queue (not too far, so they see it again soon)
                        const insertPos = Math.min(4 + cardData.correctStreak, studyQueue.length);
                        studyQueue.splice(insertPos, 0, currentCard);

                        // Small XP for correct answer while learning
                        userProgress.xp += 5;
                    }
                } else {
                    // Already graduated - normal SRS logic for review
                    const interval = calculateNextReview(rating);
                    cardData.interval = interval;

                    const nextDate = new Date();
                    nextDate.setDate(nextDate.getDate() + interval);
                    nextDate.setHours(0, 0, 0, 0);
                    cardData.nextReview = nextDate.getTime();

                    // XP for reviewing
                    let xpGain = 10;
                    if (rating === 'easy') xpGain = 20;
                    else if (rating === 'good') xpGain = 15;
                    userProgress.xp += xpGain;
                    sessionCompleted++;
                }
            }

            userProgress.cards[id] = cardData;
            saveProgress();
            updateProgressBar();
            renderNextCard();
        }

        function maybeAddNewCard() {
            // Count how many cards are currently in learning state in the queue
            const learningInQueue = studyQueue.filter(flag => {
                const card = userProgress.cards[flag.cca3];
                return card && card.state === CARD_STATE.LEARNING;
            }).length;

            // If there's room, add a new card
            if (learningInQueue < MAX_LEARNING_CARDS) {
                const newCards = flagsDB.filter(flag => !userProgress.cards[flag.cca3]);
                if (newCards.length > 0) {
                    const prioritizedNew = sortByPriority(newCards);
                    const cardToAdd = prioritizedNew[0];

                    // Initialize as learning
                    userProgress.cards[cardToAdd.cca3] = {
                        state: CARD_STATE.LEARNING,
                        correctStreak: 0,
                        interval: 0,
                        nextReview: 0,
                        lastReviewed: Date.now()
                    };

                    // Add to queue
                    studyQueue.push(cardToAdd);
                    sessionTotal++;
                }
            }
        }

        function updateProgressBar() {
            const fill = document.getElementById('progress-fill');
            const count = document.getElementById('progress-count');
            const label = document.getElementById('progress-label');
            const container = document.getElementById('progress-container');

            if (studyQueue.length === 0 && sessionCompleted === 0) {
                container.style.display = 'none';
                return;
            }

            container.style.display = 'block';

            // Count learning vs review cards in queue
            const learningInQueue = studyQueue.filter(f => {
                const card = userProgress.cards[f.cca3];
                return !card || card.state === CARD_STATE.LEARNING;
            }).length;

            // Show queue status
            count.textContent = `${studyQueue.length} remaining`;
            label.textContent = learningInQueue > 0
                ? `🎯 ${learningInQueue} learning · ${sessionCompleted} graduated this session`
                : `📖 Reviewing · ${sessionCompleted} completed`;

            // Progress based on session completion
            const totalCards = Object.keys(userProgress.cards).length;
            const graduatedCards = Object.values(userProgress.cards).filter(c => c.state === CARD_STATE.GRADUATED).length;
            const percent = totalCards > 0 ? Math.round((graduatedCards / flagsDB.length) * 100) : 0;
            fill.style.width = `${percent}%`;

            // Update aria for accessibility
            fill.parentElement.setAttribute('aria-valuenow', percent);
        }

        // --- 7. PERSISTENCE ---
        function saveProgress() {
            localStorage.setItem('flagMasterProgress', JSON.stringify(userProgress));
            updateHUD();
        }

        function loadProgress() {
            const saved = localStorage.getItem('flagMasterProgress');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    userProgress = { ...DEFAULT_PROGRESS, ...parsed };

                    // Migrate old card data to new format
                    Object.keys(userProgress.cards).forEach(cardId => {
                        const card = userProgress.cards[cardId];
                        if (!card.state) {
                            // Old format - migrate to new format
                            // Cards with interval >= 1 are considered graduated
                            if (card.interval >= 1) {
                                card.state = CARD_STATE.GRADUATED;
                                card.correctStreak = GRADUATION_THRESHOLD; // Assume they knew it
                            } else {
                                card.state = CARD_STATE.LEARNING;
                                card.correctStreak = 0;
                            }
                        }
                    });
                } catch (e) {
                    console.error('Failed to parse saved progress:', e);
                    userProgress = { ...DEFAULT_PROGRESS };
                }
            }
        }

        function resetProgress() {
            if (confirm('Are you sure you want to reset all your progress? This cannot be undone!')) {
                userProgress = { ...DEFAULT_PROGRESS };
                localStorage.removeItem('flagMasterProgress');
                closeModal();
                prepareSession();
            }
        }

        // --- IMPORT/EXPORT FUNCTIONS ---
        function exportData() {
            const exportData = {
                version: 1,
                exportDate: new Date().toISOString(),
                theme: localStorage.getItem('flagMasterTheme') || 'light',
                progress: userProgress
            };

            const dataStr = JSON.stringify(exportData, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `flagmaster-backup-${getTodayDateString()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        function importData(file) {
            const statusEl = document.getElementById('import-status');

            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);

                    // Validate the data structure
                    if (!data.progress || typeof data.progress !== 'object') {
                        throw new Error('Invalid data format: missing progress data');
                    }

                    // Validate required fields in progress
                    const requiredFields = ['xp', 'streak', 'cards'];
                    for (const field of requiredFields) {
                        if (!(field in data.progress)) {
                            throw new Error(`Invalid data format: missing ${field} field`);
                        }
                    }

                    // Validate cards structure
                    if (typeof data.progress.cards !== 'object') {
                        throw new Error('Invalid data format: cards must be an object');
                    }

                    // Confirm import
                    const cardCount = Object.keys(data.progress.cards).length;
                    const confirmMsg = `This will replace your current progress with:\n• ${data.progress.xp.toLocaleString()} XP\n• ${data.progress.streak} day streak\n• ${cardCount} studied cards\n\nContinue?`;

                    if (!confirm(confirmMsg)) {
                        statusEl.className = 'import-status';
                        statusEl.textContent = '';
                        return;
                    }

                    // Import progress
                    userProgress = { ...DEFAULT_PROGRESS, ...data.progress };
                    saveProgress();

                    // Import theme if present
                    if (data.theme) {
                        localStorage.setItem('flagMasterTheme', data.theme);
                        if (data.theme === 'dark') {
                            document.documentElement.setAttribute('data-theme', 'dark');
                            document.getElementById('theme-toggle').textContent = '☀️';
                        } else {
                            document.documentElement.removeAttribute('data-theme');
                            document.getElementById('theme-toggle').textContent = '🌙';
                        }
                    }

                    // Update UI
                    statusEl.className = 'import-status success';
                    statusEl.textContent = `✓ Successfully imported ${cardCount} cards, ${data.progress.xp.toLocaleString()} XP`;

                    // Update settings display
                    const cards = Object.values(userProgress.cards);
                    const graduated = cards.filter(c => c.state === CARD_STATE.GRADUATED).length;
                    const learning = cards.filter(c => c.state === CARD_STATE.LEARNING).length;
                    document.getElementById('stat-graduated').textContent = graduated;
                    document.getElementById('stat-learning').textContent = learning;
                    document.getElementById('session-limit').value = userProgress.sessionLimit || 20;

                    updateHUD();

                    // Refresh session with new data
                    prepareSession();

                } catch (error) {
                    console.error('Import error:', error);
                    statusEl.className = 'import-status error';
                    statusEl.textContent = `✗ Import failed: ${error.message}`;
                }
            };

            reader.onerror = function() {
                statusEl.className = 'import-status error';
                statusEl.textContent = '✗ Failed to read file';
            };

            reader.readAsText(file);
        }

        function updateHUD() {
            document.getElementById('xp').textContent = userProgress.xp.toLocaleString();
            document.getElementById('streak').textContent = userProgress.streak;

            // Count graduated and learning cards
            const cards = Object.values(userProgress.cards);
            const graduatedCount = cards.filter(c => c.state === CARD_STATE.GRADUATED).length;
            const learningCount = cards.filter(c => c.state === CARD_STATE.LEARNING).length;

            document.getElementById('graduated-count').textContent = graduatedCount;
            document.getElementById('learning-count').textContent = learningCount;
        }

        // --- 8. SETTINGS & THEME ---
        function loadSettings() {
            // Load theme
            const savedTheme = localStorage.getItem('flagMasterTheme');
            if (savedTheme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'dark');
                document.getElementById('theme-toggle').textContent = '☀️';
            }

            // Load session limit
            document.getElementById('session-limit').value = userProgress.sessionLimit || 20;
        }

        function toggleTheme() {
            const html = document.documentElement;
            const themeBtn = document.getElementById('theme-toggle');

            if (html.getAttribute('data-theme') === 'dark') {
                html.removeAttribute('data-theme');
                themeBtn.textContent = '🌙';
                localStorage.setItem('flagMasterTheme', 'light');
            } else {
                html.setAttribute('data-theme', 'dark');
                themeBtn.textContent = '☀️';
                localStorage.setItem('flagMasterTheme', 'dark');
            }
        }

        function openModal() {
            const modal = document.getElementById('settings-modal');
            modal.classList.add('visible');

            // Update stats
            const cards = Object.values(userProgress.cards);
            const graduated = cards.filter(c => c.state === CARD_STATE.GRADUATED).length;
            const learning = cards.filter(c => c.state === CARD_STATE.LEARNING).length;

            document.getElementById('stat-graduated').textContent = graduated;
            document.getElementById('stat-learning').textContent = learning;
            document.getElementById('session-limit').value = userProgress.sessionLimit || 20;

            // Trap focus in modal
            document.getElementById('close-modal').focus();
        }

        function closeModal() {
            document.getElementById('settings-modal').classList.remove('visible');
            // Clear import status message
            const statusEl = document.getElementById('import-status');
            statusEl.className = 'import-status';
            statusEl.textContent = '';
        }

        function saveSessionLimit() {
            const input = document.getElementById('session-limit');
            const value = parseInt(input.value, 10);

            if (!isNaN(value) && value >= 0) {
                userProgress.sessionLimit = value;
                saveProgress();
            }
        }

        // --- 9. EVENT LISTENERS ---
        document.getElementById('show-btn').addEventListener('click', showAnswer);
        document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
        document.getElementById('settings-btn').addEventListener('click', openModal);
        document.getElementById('close-modal').addEventListener('click', closeModal);
        document.getElementById('reset-btn').addEventListener('click', resetProgress);
        document.getElementById('session-limit').addEventListener('change', saveSessionLimit);

        // Import/Export listeners
        document.getElementById('export-btn').addEventListener('click', exportData);
        document.getElementById('import-btn').addEventListener('click', () => {
            document.getElementById('import-file').click();
        });
        document.getElementById('import-file').addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                importData(e.target.files[0]);
                e.target.value = ''; // Reset so same file can be selected again
            }
        });

        // Rating button event delegation
        document.getElementById('rating-area').addEventListener('click', (e) => {
            const btn = e.target.closest('.rate-btn');
            if (btn) {
                rateCard(btn.dataset.rating);
            }
        });

        // Modal close on overlay click
        document.getElementById('settings-modal').addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                closeModal();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ignore if typing in input
            if (e.target.tagName === 'INPUT') return;

            const modal = document.getElementById('settings-modal');

            // Close modal with Escape
            if (e.key === 'Escape' && modal.classList.contains('visible')) {
                closeModal();
                return;
            }

            // Don't process game shortcuts if modal is open
            if (modal.classList.contains('visible')) return;

            const showBtn = document.getElementById('show-btn');
            const ratingArea = document.getElementById('rating-area');

            // Show answer with Space
            if (e.key === ' ' && !showBtn.classList.contains('hidden')) {
                e.preventDefault();
                showAnswer();
                return;
            }

            // Rate with number keys
            if (ratingArea.classList.contains('visible')) {
                const ratingMap = { '1': 'again', '2': 'hard', '3': 'good', '4': 'easy' };
                if (ratingMap[e.key]) {
                    e.preventDefault();
                    rateCard(ratingMap[e.key]);
                    return;
                }
            }

            // Theme toggle with T
            if (e.key.toLowerCase() === 't') {
                toggleTheme();
                return;
            }

            // Settings with S
            if (e.key.toLowerCase() === 's') {
                openModal();
                return;
            }
        });

        // Start the game
        initGame();
    
