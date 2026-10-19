const fields = [];
let nextFieldNumber = 1;

const fieldList = document.querySelector("#field-list");
const previewFields = document.querySelector("#preview-fields");
const fieldTypeSelect = document.querySelector("#field-type");
const addFieldButton = document.querySelector("#add-field-button");
const previewForm = document.querySelector("#preview-form");
const submissionMessage = document.querySelector("#submission-message");
const exportButton = document.querySelector("#export-button");
const importButton = document.querySelector("#import-button");
const importFile = document.querySelector("#import-file");
const builderMessage = document.querySelector("#builder-message");

const supportedFieldTypes = ["text", "number", "select", "checkbox", "date", "file"];
const supportedSchemaVersion = 1;

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function createEmptyState(message) {
  const emptyState = document.createElement("p");
  emptyState.className = "empty-state";
  emptyState.textContent = message;
  return emptyState;
}

function createField() {
  while (fields.some((field) => field.id === `field-${nextFieldNumber}`)) {
    nextFieldNumber += 1;
  }

  const field = {
    id: `field-${nextFieldNumber}`,
    label: "Untitled field",
    type: fieldTypeSelect.value,
    required: false
  };

  if (field.type === "select") {
    field.options = ["Option 1", "Option 2"];
  }

  nextFieldNumber += 1;
  return field;
}

function addField() {
  fields.push(createField());
  render();
}

function removeField(fieldId) {
  const fieldIndex = fields.findIndex((field) => field.id === fieldId);

  if (fieldIndex !== -1) {
    fields.splice(fieldIndex, 1);
    render();
  }
}

function moveField(fieldId, direction) {
  const fieldIndex = fields.findIndex((field) => field.id === fieldId);
  const newIndex = fieldIndex + direction;

  if (fieldIndex !== -1 && newIndex >= 0 && newIndex < fields.length) {
    const fieldToMove = fields[fieldIndex];
    fields[fieldIndex] = fields[newIndex];
    fields[newIndex] = fieldToMove;
    render();
  }
}

function updateField(fieldId, property, value) {
  const field = fields.find((currentField) => currentField.id === fieldId);

  if (field) {
    field[property] = value;
    renderPreview();
  }
}

function createFieldEditor(field) {
  const card = document.createElement("article");
  card.className = "field-card";

  const label = document.createElement("label");
  label.textContent = "Field label";
  const labelInput = document.createElement("input");
  labelInput.type = "text";
  labelInput.value = field.label;
  labelInput.addEventListener("change", () => {
    updateField(field.id, "label", labelInput.value.trim() || "Untitled field");
    renderBuilder();
  });
  label.appendChild(labelInput);
  card.appendChild(label);

  const typeText = document.createElement("small");
  typeText.textContent = `Type: ${field.type}`;
  card.appendChild(typeText);

  const requiredLabel = document.createElement("label");
  requiredLabel.className = "checkbox-row";
  const requiredInput = document.createElement("input");
  requiredInput.type = "checkbox";
  requiredInput.checked = field.required;
  requiredInput.addEventListener("change", () => {
    updateField(field.id, "required", requiredInput.checked);
  });
  requiredLabel.append(requiredInput, document.createTextNode("Required field"));
  card.appendChild(requiredLabel);

  if (field.type === "select") {
    const optionsLabel = document.createElement("label");
    optionsLabel.textContent = "Options (comma-separated)";
    const optionsInput = document.createElement("input");
    optionsInput.type = "text";
    optionsInput.value = field.options.join(", ");
    optionsInput.addEventListener("change", () => {
      field.options = optionsInput.value
        .split(",")
        .map((option) => option.trim())
        .filter((option) => option.length > 0);
      renderPreview();
    });
    optionsLabel.appendChild(optionsInput);
    card.appendChild(optionsLabel);
  }

  const actions = document.createElement("div");
  actions.className = "field-actions";

  const moveUpButton = document.createElement("button");
  moveUpButton.type = "button";
  moveUpButton.textContent = "Move up";
  moveUpButton.addEventListener("click", () => moveField(field.id, -1));

  const moveDownButton = document.createElement("button");
  moveDownButton.type = "button";
  moveDownButton.textContent = "Move down";
  moveDownButton.addEventListener("click", () => moveField(field.id, 1));

  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.className = "remove-button";
  removeButton.textContent = "Remove";
  removeButton.addEventListener("click", () => removeField(field.id));

  actions.append(moveUpButton, moveDownButton, removeButton);
  card.appendChild(actions);
  return card;
}

function renderBuilder() {
  clearElement(fieldList);

  if (fields.length === 0) {
    fieldList.appendChild(createEmptyState("No fields yet. Add a field to begin building the form."));
    return;
  }

  fields.forEach((field) => {
    fieldList.appendChild(createFieldEditor(field));
  });
}

function createPreviewControl(field) {
  let control;

  if (field.type === "select") {
    control = document.createElement("select");

    field.options.forEach((optionText) => {
      const option = document.createElement("option");
      option.value = optionText;
      option.textContent = optionText;
      control.appendChild(option);
    });
  } else {
    control = document.createElement("input");
    control.type = field.type;
  }

  control.id = field.id;
  control.name = field.id;
  control.required = field.required;
  return control;
}

function renderPreview() {
  clearElement(previewFields);

  if (fields.length === 0) {
    previewFields.appendChild(createEmptyState("Your form preview will appear here."));
    return;
  }

  fields.forEach((field) => {
    const fieldContainer = document.createElement("div");
    fieldContainer.className = "preview-field";

    const label = document.createElement("label");
    label.htmlFor = field.id;
    label.textContent = field.label;

    if (field.required) {
      const requiredMarker = document.createElement("span");
      requiredMarker.textContent = " *";
      requiredMarker.setAttribute("aria-hidden", "true");
      label.appendChild(requiredMarker);
    }

    fieldContainer.append(label, createPreviewControl(field));
    previewFields.appendChild(fieldContainer);
  });
}

function render() {
  renderBuilder();
  renderPreview();
}

function createExportSchema() {
  return {
    schemaVersion: supportedSchemaVersion,
    fields: fields.map((field) => {
      const exportedField = {
        id: field.id,
        label: field.label,
        type: field.type,
        required: field.required
      };

      if (field.type === "select") {
        exportedField.options = [...field.options];
      }

      return exportedField;
    })
  };
}

function exportSchema() {
  const schemaText = JSON.stringify(createExportSchema(), null, 2);
  const schemaBlob = new Blob([schemaText], { type: "application/json" });
  const downloadUrl = URL.createObjectURL(schemaBlob);
  const downloadLink = document.createElement("a");

  downloadLink.href = downloadUrl;
  downloadLink.download = "form-schema.json";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  URL.revokeObjectURL(downloadUrl);
  builderMessage.textContent = "Schema exported as form-schema.json.";
}

function validateSchema(schema) {
  if (!schema || typeof schema !== "object") {
    return { valid: false, message: "The schema must be a JSON object." };
  }

  if (schema.schemaVersion !== supportedSchemaVersion) {
    return { valid: false, message: "This schema version is not supported." };
  }

  if (!Array.isArray(schema.fields)) {
    return { valid: false, message: "The schema fields property must be an array." };
  }

  const importedIds = new Set();
  const importedFields = [];

  for (const field of schema.fields) {
    if (!field || typeof field !== "object") {
      return { valid: false, message: "Each field must be an object." };
    }

    if (typeof field.id !== "string" || !/^[A-Za-z][A-Za-z0-9_-]*$/.test(field.id)) {
      return { valid: false, message: "Each field needs a safe, unique ID." };
    }

    if (importedIds.has(field.id)) {
      return { valid: false, message: `The field ID \"${field.id}\" is duplicated.` };
    }

    if (typeof field.label !== "string" || field.label.trim() === "") {
      return { valid: false, message: "Each field needs a non-empty label." };
    }

    if (!supportedFieldTypes.includes(field.type)) {
      return { valid: false, message: `The field type \"${field.type}\" is not supported.` };
    }

    if (typeof field.required !== "boolean") {
      return { valid: false, message: `The required value for \"${field.id}\" must be true or false.` };
    }

    const importedField = {
      id: field.id,
      label: field.label,
      type: field.type,
      required: field.required
    };

    if (field.type === "select") {
      if (!Array.isArray(field.options) || field.options.length === 0) {
        return { valid: false, message: `The select field \"${field.id}\" needs options.` };
      }

      if (field.options.some((option) => typeof option !== "string" || option.trim() === "")) {
        return { valid: false, message: `The options for \"${field.id}\" must be non-empty text.` };
      }

      importedField.options = field.options.map((option) => option.trim());
    }

    importedIds.add(field.id);
    importedFields.push(importedField);
  }

  return { valid: true, fields: importedFields };
}

async function importSchema(event) {
  const selectedFile = event.target.files[0];

  if (!selectedFile) {
    return;
  }

  try {
    const schema = JSON.parse(await selectedFile.text());
    const validationResult = validateSchema(schema);

    if (!validationResult.valid) {
      builderMessage.textContent = validationResult.message;
      return;
    }

    fields.splice(0, fields.length, ...validationResult.fields);
    render();
    builderMessage.textContent = "Schema imported successfully.";
  } catch (error) {
    builderMessage.textContent = "The selected file is not valid JSON.";
  } finally {
    importFile.value = "";
  }
}

function handlePreviewSubmit(event) {
  event.preventDefault();
  submissionMessage.textContent = "";

  if (!previewForm.checkValidity()) {
    submissionMessage.textContent = "Please complete all required fields.";
    previewForm.reportValidity();
    return;
  }

  submissionMessage.textContent = "Form is valid. No submission was sent or stored.";
}

addFieldButton.addEventListener("click", addField);
previewForm.addEventListener("submit", handlePreviewSubmit);
exportButton.addEventListener("click", exportSchema);
importButton.addEventListener("click", () => importFile.click());
importFile.addEventListener("change", importSchema);

render();
