# Engineering Decision Log

## DEC-001: Use vanilla browser technologies

- **Status:** Accepted
- **Decision:** Use only HTML, CSS, and vanilla JavaScript.
- **Reason:** The project is small and is intended to strengthen understanding of core web development.
- **Alternatives considered:** React or another framework could provide component structure, but would add setup and concepts that are not needed here.
- **Consequences:** The code is explicit and easy to trace, but rendering and event handling are written directly.
- **Beginner explanation:** The browser already provides everything this small form builder needs.

## DEC-002: Run locally without a backend

- **Status:** Accepted
- **Decision:** Open `index.html` directly in a browser without a server, database, or user accounts.
- **Reason:** The project demonstrates form-building concepts rather than storing real registrations.
- **Alternatives considered:** A backend could save submissions, but would add deployment, privacy, and database concerns.
- **Consequences:** The form definition stays in memory unless exported, and submissions are never sent.
- **Beginner explanation:** Everything happens in this browser tab; no online service receives the data.

## DEC-003: Keep one fields array as the source of truth

- **Status:** Accepted
- **Decision:** Store the form definition in one array named `fields` and render both views from it.
- **Reason:** One source prevents the builder and preview from becoming inconsistent.
- **Alternatives considered:** Separate builder and preview state would duplicate data and require synchronization.
- **Consequences:** Every change updates `fields` and re-renders the affected interface.
- **Beginner explanation:** There is one list describing the form, and both screens read that list.

## DEC-004: Represent fields as plain objects

- **Status:** Accepted
- **Decision:** Represent each field as a plain object with an ID, label, type, required value, and optional select options.
- **Reason:** Plain objects are easy to inspect, edit, and convert to JSON.
- **Alternatives considered:** Classes would add structure without helping these six simple field types.
- **Consequences:** Array methods and ordinary object properties handle all field operations.
- **Beginner explanation:** Each field is a small record of related values.

## DEC-005: Give every field a stable unique ID

- **Status:** Accepted
- **Decision:** Assign each created or imported field a unique safe ID and use it for DOM associations and operations.
- **Reason:** Labels and array positions can change, so neither is a reliable identity.
- **Alternatives considered:** Array indexes are simpler, but change when fields move or are removed.
- **Consequences:** Labels can safely refer to controls, and updates can find the correct object.
- **Beginner explanation:** The ID is a field's name tag; its label and position can change.

## DEC-006: Reorder with up and down buttons

- **Status:** Accepted
- **Decision:** Move fields with explicit Move up and Move down buttons.
- **Reason:** Buttons are accessible, predictable, and easier to explain than drag-and-drop.
- **Alternatives considered:** Drag-and-drop could be faster, but needs more interaction and keyboard handling.
- **Consequences:** Moving a field swaps neighboring items in `fields`.
- **Beginner explanation:** The buttons swap neighboring items in the list.

## DEC-007: Generate the preview from field definitions

- **Status:** Accepted
- **Decision:** Build the student preview dynamically from the current field objects.
- **Reason:** All changes should appear without maintaining duplicate form markup.
- **Alternatives considered:** A fixed preview would not reflect admin changes.
- **Consequences:** Preview rendering explicitly handles all six supported input types.
- **Beginner explanation:** JavaScript reads each object and creates the matching browser control.

## DEC-008: Use JSON for schema import and export

- **Status:** Accepted
- **Decision:** Export and import the form definition as readable JSON.
- **Reason:** JSON is built into browsers and maps naturally to arrays and objects.
- **Alternatives considered:** A custom text format would require more parsing rules and would be less familiar.
- **Consequences:** `JSON.stringify()` creates downloads and `JSON.parse()` reads selected files.
- **Beginner explanation:** JSON is a text version of the JavaScript objects that describe the form.

## DEC-009: Include a schema version

- **Status:** Accepted
- **Decision:** Include `schemaVersion: 1` and accept only supported versions.
- **Reason:** Future formats can change without being silently misread.
- **Alternatives considered:** Omitting the version is shorter, but makes compatibility unclear later.
- **Consequences:** Imports with another version are rejected before state changes.
- **Beginner explanation:** The version tells the importer which JSON shape it understands.

## DEC-010: Validate imports before replacing the current form

- **Status:** Accepted
- **Decision:** Parse and validate the complete schema before changing `fields`.
- **Reason:** An invalid file must not destroy a working form.
- **Alternatives considered:** Assigning parsed data immediately is shorter, but can create broken state.
- **Consequences:** The validator checks IDs, labels, types, required values, and select options.
- **Beginner explanation:** We check the whole file first, then replace the form only if it is valid.

## DEC-011: Use native required-field validation

- **Status:** Accepted
- **Decision:** Set native `required` properties and use the browser's validity check on submit.
- **Reason:** This is the simplest suitable validation for the supported controls.
- **Alternatives considered:** A custom validation engine would add code without helping the initial learning goal.
- **Consequences:** The browser reports missing values and JavaScript displays a local result.
- **Beginner explanation:** The browser checks required controls for us.

## DEC-012: Use safe DOM APIs for admin-provided text

- **Status:** Accepted
- **Decision:** Create elements with DOM methods and assign labels and options with `textContent` or properties.
- **Reason:** Editable text should remain text rather than being interpreted as markup.
- **Alternatives considered:** Large `innerHTML` templates are shorter, but unsafe for editable content.
- **Consequences:** Rendering is more explicit and imported labels remain plain text.
- **Beginner explanation:** We tell the browser that labels are text, not HTML code.

## DEC-013: Keep submissions local and transparent

- **Status:** Accepted
- **Decision:** Prevent navigation and show a local success message; file inputs only select local files.
- **Reason:** There is no backend and the application must not imply storage.
- **Alternatives considered:** Sending data would require a service, privacy decisions, and storage.
- **Consequences:** Refreshing loses in-memory data and selected files are not uploaded.
- **Beginner explanation:** Submit demonstrates validation but does not register anyone anywhere.

## DEC-014: Keep the first version deliberately small

- **Status:** Accepted
- **Decision:** Exclude conditional fields, visual validation rules, undo/redo, autosave, accounts, cloud storage, templates, AI, drag-and-drop, and complex animation.
- **Reason:** These features are outside the core learning goal and would increase complexity.
- **Alternatives considered:** Adding them could make the tool more powerful, but would make the basic data flow harder to understand.
- **Consequences:** The project focuses on field management, live preview, local validation, and JSON portability.
- **Beginner explanation:** We are building one small complete version before considering larger features.
