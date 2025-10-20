# data-model.md

## Entities

### Puzzle
- id: string (filename-safe unique id)
- title: string
- author: string (optional)
- categories: array of Category
- clues: array of Clue
- createdAt: iso8601
- updatedAt: iso8601

### Category
- id: string (unique within puzzle)
- name: string
- options: array of Option

### Option
- id: string (unique within category)
- label: string

### Clue
- id: string
- text: string
- type: enum (direct, negative, equivalence, association)  # for future parsing
- references: array of references to options or categories

### GridCell
- puzzleId: string
- categoryA: string
- optionA: string
- categoryB: string
- optionB: string
- state: enum('unknown','confirmed','eliminated')

### PuzzleState
- puzzleId: string
- cells: array of GridCell
- history: array of actions (for undo)
- inconsistencyFlags: array (refs to affected cells or clues)

## Validation rules
- Each Category must have the same number of options as other categories that are intended to pair (for a full square grid)
- Unique option labels within a category
- Clue references must point to existing options/categories

## State transitions
- applyMarking -> propagate -> validate; each action produces a new entry in history
- undo pops the last history entry and restores derived state

## Storage mapping
- Puzzle definitions stored as `data/puzzles/{puzzleId}.json`
- Puzzle state stored as `data/states/{puzzleId}.state.json`

*** End of data-model.md
