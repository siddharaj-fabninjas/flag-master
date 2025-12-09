# FlagMaster SRS 🏴

A spaced repetition flashcard app for learning world flags. Built with vanilla HTML, CSS, and JavaScript.

## Features

- **Spaced Repetition System (SRS)**: Uses a simplified SM-2 algorithm to schedule reviews at optimal intervals
- **Gamification**: XP rewards, streak tracking, and progress statistics
- **Dark Mode**: Toggle between light and dark themes
- **Session Management**: Configurable daily card limits to prevent burnout
- **Progress Persistence**: All progress saved to localStorage
- **Keyboard Shortcuts**: Full keyboard navigation support
- **Accessibility**: ARIA labels, semantic HTML, and screen reader support
- **Responsive Design**: Works on desktop, tablet, and mobile

## How to Use

1. Open `index.html` in any modern web browser
2. A flag will be shown - try to identify the country
3. Click "Show Answer" (or press `Space`) to reveal the country name
4. Rate your recall:
   - **Again (1)**: Didn't know it - review again this session
   - **Hard (2)**: Struggled to remember
   - **Good (3)**: Remembered correctly
   - **Easy (4)**: Instantly recognized

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
- **Statistics**: Cards studied and mastered counts
- **Session Limit**: Set maximum cards per session (0 = unlimited)
- **Reset Progress**: Clear all learning data

## Technical Details

- Fetches flag data from [REST Countries API](https://restcountries.com)
- No dependencies or build process required
- Progress stored in browser's localStorage
- Intervals calculated dynamically based on card history

## Learning Priority System

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

The app uses a simplified SM-2 algorithm:
- **New cards**: Start with base intervals (1 day for Hard, 3 days for Good, 7 days for Easy)
- **Review cards**: Intervals multiply based on rating:
  - Easy: 2.5x current interval
  - Good: 1.8x current interval  
  - Hard: 1.2x current interval
  - Again: Reset to same session
- **Maximum interval**: 180 days (6 months)

## License

MIT
