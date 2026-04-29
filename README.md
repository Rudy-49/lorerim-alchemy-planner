🧪 Rudy's Alchemy Ledger

A Skyrim-inspired alchemy planner built with HTML, CSS, and vanilla JavaScript.
Create potions, discover shared effects, and manage your own alchemical database — all in a clean, immersive UI.

✨ Features
🧬 Potion Builder
  Select up to 3 ingredients
  Dynamic dropdowns with filtering
  Automatically detects shared effects
  Generates potion names:
  Potion of X
  Poison of X
📖 Alchemical Record (Database)
  Save potions locally using localStorage
  View:
  Ingredients
  Effects
  Notes
  Filter by:
  All
  Favorites ⭐
  Potions
  Poisons
  Search across:
  Name
  Ingredients
  Effects
  Notes
⭐ Favorites System
  Toggle favorite potions with a star
  Highlighted UI for quick identification
📤 Export / Import
Export:
  All potions
  OR selected potions (checkbox-based)
  Custom file naming
  Import JSON files
  Duplicate detection (based on ingredient combinations)
🔍 Lookup Tools
  Ingredient Lookup
  Displays effects, magnitude, duration, weight, value
  Effect Lookup
  Shows all ingredients containing a selected effect
🛠 Tech Stack
HTML5
CSS3 (custom styling, no frameworks)
Vanilla JavaScript
localStorage (for persistence)
📂 Project Structure
/data
  ├── ingredients.js
  └── effects.js

/js
  ├── alchemyLogic.js
  └── ui.js

index.html
style.css
🚀 Getting Started
  Clone the repo:
  git clone https://github.com/YOUR_USERNAME/alchemy-ledger.git
  Open the project folder
  Run locally:
  Just open index.html in your browser

No build tools or dependencies required.

💾 Data Storage

All saved potions are stored in:

localStorage → "potionDatabase"

Each potion includes:

{
  "id": 123456,
  "name": "Potion of Restore Health",
  "type": "Potion",
  "ingredients": ["Wheat", "Blue Mountain Flower"],
  "effects": ["Restore Health"],
  "notes": "",
  "favorite": false
}
📦 Export Format
{
  "app": "Rudy's Alchemy Ledger",
  "version": 1,
  "exportedAt": "ISO_DATE",
  "count": 3,
  "potions": [...]
}
⚠️ Notes
Duplicate detection is based on ingredient combinations
Ingredient order does not matter
Data is stored locally — clearing browser storage will erase saved potions
🧠 Future Improvements
Select All / Clear Selection
Edit saved potions
Sorting (A–Z, newest, favorites)
Bulk delete
Cloud sync / backend storage
UI animations & polish

📜 License

This project is for educational and personal use.
Not affiliated with Bethesda.

👤 Author

Rudy
