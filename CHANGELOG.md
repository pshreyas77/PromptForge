# Changelog

All notable changes to the **PromptForge AI** project will be documented in this file.

## [Unreleased]

### Added
- **Dark/Light Mode**: Full theme support with a toggle switch in the header.
- **Background Paths**: Sophisticated animated SVG background lines using `framer-motion`.
- **Spotlight Card**: 3D tilt interaction with dynamic mouse-tracking spotlight gradient for the main input.
- **Magic Button**: High-impact "Generate" button with spinning conic gradient border.
- **Hexagon Logo**: Custom animated logo component.
- **Improve Mode**: New workflow to optimize existing prompts (Critique & Rewrite).
- **Persona Selector**: Ability to select specific personas (Marketer, Lawyer, Developer, etc.) which auto-configures tone.
- **Authentication UI**: Glassmorphic modal for Login/Signup (simulating Google/GitHub providers).
- **Cloud Sync Indicator**: Visual cue for authenticated users.

### Changed
- Refactored entire UI to use a "Slate" color palette compatible with both light and dark modes.
- Replaced manual 3D tilt logic with `framer-motion` physics-based animations.
- Updated `geminiService` to handle `IMPROVE` vs `GENERATE` system instructions.
- Enhanced `HistorySidebar` with better typography and spacing.

## [0.1.0] - Initial MVP

### Added
- Basic React application structure with TypeScript.
- Integration with Google GenAI SDK (`gemini-2.5-flash`).
- Simple text input for user intent.
- Tone and Length configuration.
- Markdown rendering for output.
- History sidebar with local storage persistence.
