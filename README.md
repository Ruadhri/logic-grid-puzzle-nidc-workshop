# Logic Grid Puzzle Workshop

An interactive logic grid puzzle solver that helps users solve grid-based logic puzzles through a web interface. The application includes a constraint propagation engine and allows users to mark cells as confirmed or eliminated while automatically applying logical deductions.

## Features

- Import and solve logic grid puzzles
- Interactive grid interface for marking cells
- Automatic constraint propagation
- State management with undo capability
- Persistence of puzzle states
- Support for multiple puzzle categories and options
- Validation of puzzle solutions

## Prerequisites

- Node.js 18+
- Git

## Quick Start

1. Clone the repository:
```bash
git clone https://github.com/Ruadhri/logic-grid-puzzle-nidc-workshop.git
cd logic-grid-puzzle-nidc-workshop
```

2. Install backend dependencies and start the server:
```bash
cd backend
npm install
npm run dev
```

3. The application will be available at:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## Project Structure

```
├── backend/                 # Node.js + Express backend
│   ├── src/
│   │   ├── engine/         # Core puzzle logic and constraint engine
│   │   ├── api/           # REST API endpoints
│   │   └── services/      # Business logic services
│   ├── tests/             # Test suites
│   └── data/              # Puzzle and state storage
│       ├── puzzles/       # Puzzle definition files
│       └── states/        # Saved puzzle states
├── frontend/              # Static SPA frontend
│   ├── src/              # Frontend source code
│   └── public/           # Static assets
└── specs/                # Feature specifications and documentation
```

## Technology Stack

- **Backend**:
  - Node.js 18+ with Express
  - File-based JSON storage
  - Jest for testing

- **Frontend**:
  - Vanilla HTML/CSS/JavaScript
  - Single-page application architecture
  - Served statically by the backend

## Development

### Running Tests

```bash
cd backend
npm test
```

### Available Scripts

In the backend directory:
- `npm run dev` - Start development server
- `npm test` - Run test suite
- `npm run lint` - Run linting

### Adding New Puzzles

Puzzles are stored as JSON files in `backend/data/puzzles/`. Each puzzle file should follow this structure:

```json
{
  "id": "puzzle-name",
  "title": "Puzzle Title",
  "categories": [
    {
      "id": "category1",
      "name": "Category Name",
      "options": [
        {
          "id": "option1",
          "label": "Option Label"
        }
      ]
    }
  ],
  "clues": []
}
```

## State Management

- Puzzle states are automatically saved to `data/states/`
- Each state includes the current grid markings and history for undo
- States are loaded automatically when returning to a puzzle

## Contributing

1. Create a feature branch (`git checkout -b feature-name`)
2. Commit your changes (`git commit -am 'Add feature'`)
3. Push to the branch (`git push origin feature-name`)
4. Create a Pull Request

## License

MIT License - See LICENSE file for details