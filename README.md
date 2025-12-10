# FlagMaster SRS 🏴

A spaced repetition flashcard app for learning world flags. Built with vanilla HTML, CSS, and JavaScript.

## Features

- **Spaced Repetition System (SRS)**: Uses a modified SM-2 algorithm with a learning phase before cards graduate to long-term review
- **Memory Hints & Mnemonics**: Visual learning aids with color meanings, flag symbolism, and similar flag warnings
- **World Map Location**: See where each country is located on an interactive map after revealing the answer
- **Gamification**: XP rewards, streak tracking, and progress statistics
- **Learning Priority System**: Smart introduction of new flags starting with well-known countries
- **Dark Mode**: Toggle between light and dark themes
- **Session Management**: Configurable daily card limits to prevent burnout
- **Progress Persistence**: All progress saved to localStorage with export/import support
- **Keyboard Shortcuts**: Full keyboard navigation support
- **Accessibility**: ARIA labels, semantic HTML, and screen reader support
- **Responsive Design**: Works on desktop, tablet, and mobile

## How to Use

1. Open `index.html` in any modern web browser
2. A flag will be shown - try to identify the country
3. Click "Show Answer" (or press `Space`) to reveal the country name
4. Rate your recall:
   - **Again (1)**: Didn't know it - resets learning progress, reviews again soon
   - **Hard (2)**: Struggled to remember - slower progress
   - **Good (3)**: Remembered correctly - normal progress
   - **Easy (4)**: Instantly recognized - faster progress

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Show answer |
| `1` | Rate: Again |
| `2` | Rate: Hard |
| `3` | Rate: Good |
| `4` | Rate: Easy |
| `T` | Toggle theme |
| `S` | Open settings |
| `Escape` | Close modal |

## Settings

Click the ⚙️ icon to access:
- **Statistics**: View flags learned and currently in progress
- **Session Limit**: Set maximum cards per session (0 = unlimited)
- **Reset Progress**: Clear all learning data
- **Export/Import**: Backup and restore your progress as JSON

## Learning System

### Two-Phase Learning

FlagMaster uses a two-phase approach to ensure you truly learn each flag:

**Phase 1: Learning**
- New cards enter a "learning" phase where you must answer correctly **3 times** before graduating
- Maximum of **5 cards** in active learning at once
- Up to **2 new cards** introduced per session
- Wrong answers reset the streak counter

**Phase 2: Graduated (SRS)**
- Once graduated, cards use spaced repetition intervals
- Review intervals grow based on your recall quality
- Cards due for review are prioritized over new cards

### Learning Priority System

New cards are introduced using a smart priority system that starts with well-known countries:

| Tier | Label | Description |
|------|-------|-------------|
| 1 | Famous | Major world powers, top tourist destinations (USA, UK, Japan, etc.) |
| 2 | Common | Culturally significant countries (Ukraine, Czech Republic, Taiwan, etc.) |
| 3 | Notable | High population (50M+) countries |
| 4 | Moderate | Medium population (10-50M) countries |
| 5 | Tricky | Smaller countries (1-10M population) |
| 6 | Expert | Micro-nations and territories |

This ensures beginners start with recognizable flags and gradually progress to more challenging ones.

## Spaced Repetition Algorithm

The app uses a modified SM-2 algorithm:

**For Learning Cards (not yet graduated):**
- Must answer correctly 3 times to graduate
- "Again" resets progress to 0
- Card stays in active learning queue

**For Graduated Cards (SRS phase):**
- **Easy**: 2.5× current interval
- **Good**: 1.8× current interval
- **Hard**: 1.2× current interval
- **Again**: Reset to learning phase
- **Maximum interval**: 180 days (6 months)

**Base Intervals (first review after graduation):**
- Hard: 1 day
- Good: 3 days
- Easy: 7 days

## Memory Hints

When you reveal an answer, you'll see helpful memory aids including:
- **Mnemonics**: Creative associations to help remember flags
- **Color Meanings**: What each color represents on the flag
- **Similar Flags**: Warnings about commonly confused flags with tips to distinguish them

## Technical Details

- Fetches flag data from [REST Countries API](https://restcountries.com)
- No dependencies or build process required
- Progress stored in browser's localStorage
- Single HTML file with embedded CSS and JavaScript

## License

MIT
