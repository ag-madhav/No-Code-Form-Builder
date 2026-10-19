# Club Membership Form Builder

A small no-code form builder for a college club membership form. It uses only HTML, CSS, and vanilla JavaScript, so it can run directly in a browser without Node.js, a backend, or a database.

## Run the project

1. Open the project folder.
2. Open `index.html` in a modern web browser.
3. Use the admin builder on the left to add and arrange fields.
4. Use the student preview on the right to check the resulting form.

No installation or package manager is required.

## Features

- Add Text, Number, Select, Checkbox, Date, and File fields.
- Edit field labels and required status.
- Configure select options with comma-separated text.
- Remove fields or move them up and down.
- See the student preview update from the current field definitions.
- Validate required fields locally in the browser.
- Export the form definition to `form-schema.json`.
- Import and validate a JSON form schema.

## How the code works

The main state is one array named `fields` in `script.js`. Each item is a plain object, for example:

```js
{
  id: "student-name",
  label: "Student name",
  type: "text",
  required: true
}
```

A select field also has an `options` array.

The update flow is:

1. The admin clicks a button or changes a builder control.
2. JavaScript updates the matching object in `fields`.
3. `renderBuilder()` rebuilds the admin controls.
4. `renderPreview()` rebuilds the student-facing controls.
5. Both views therefore display the same current form definition.

For example, clicking Add field creates a new object, adds it to `fields`, and calls `render()`. The builder and preview then read that same new object.

## JSON format

Exported schemas have this shape:

```json
{
  "schemaVersion": 1,
  "fields": [
    {
      "id": "student-name",
      "label": "Student name",
      "type": "text",
      "required": true
    }
  ]
}
```

Select fields include an additional `options` array. The importer checks the schema version, fields array, unique safe IDs, labels, supported types, required values, and select options before replacing the current form.

`example-schema.json` contains a complete example club registration form and can be imported using the Import JSON button.

## Testing checklist

1. Add one field of every supported type.
2. Edit a label and toggle required status.
3. Edit the options of a select field.
4. Move fields up and down, then remove one.
5. Confirm that the preview changes immediately.
6. Submit with a missing required value and check the browser validation.
7. Complete the required values and confirm the local success message.
8. Export the schema and import the downloaded file.
9. Import `example-schema.json`.
10. Try malformed JSON and confirm the current form remains unchanged.
11. Try an unsupported schema version or field type and confirm it is rejected.
12. Refresh the browser and observe that the in-memory form resets.
13. Review `decisions.md` and compare it with the implementation.

## Limitations

- Student submissions are not sent to a server or stored in a database.
- The success message only demonstrates local validation.
- A file input only selects a local browser file; the file is not uploaded or saved.
- The current form definition is kept in memory and is lost when the page is refreshed unless it was exported first.
- The first version does not include conditional fields, undo/redo, autosave, authentication, cloud storage, templates, or drag-and-drop.

