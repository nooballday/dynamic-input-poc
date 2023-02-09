const INPUT_TYPES = {
    TEXT: "extra_field_input_text",
    SELECT: "extra_field_input_select",
    DATE: "extra_field_input_date"
}

const extraFields = {}

function validateExtraFieldDialog(payload) {
    const labelValidation = payload.label != null && payload.label != '' && payload.label != undefined;
    const isInputTypeSelect = payload.inputType == INPUT_TYPES.SELECT;
    const isSelectValueNotNull = payload.inputListValue != null;
    const inputSelectValidation = isInputTypeSelect ? isSelectValueNotNull : true;

    return labelValidation && inputSelectValidation;
}

function updateUI() {
    const extraFieldArea = $("#extra-fields-area");
    extraFieldArea.empty();

    for (let extraFieldsKey in extraFields) {
        const fieldOption = extraFields[extraFieldsKey];
        switch (fieldOption.inputType) {
            case INPUT_TYPES.TEXT:
                extraFieldArea.append(addExtraInputText(fieldOption));
                break;
            case INPUT_TYPES.SELECT:
                extraFieldArea.append(addExtraInputSelect(fieldOption));
                break;
            default:
                break;
        }
    }
}

function addExtraInputText(inputOption) {
    const textArea = `<div class="mb-3">
        <label for="${inputOption.id}" class="form-label">${inputOption.label}</label>
        <input type="text" class="form-control" id="${inputOption.id}" placeholder="${inputOption.label}">
    </div>`;
    return textArea;
}

function addExtraInputSelect(inputOption) {
    const inputList = `<div class="mb-3">
        <label for="${inputOption.id}" class="form-label">${inputOption.label}</label>
        <select id="${inputOption.id}" class="form-select" aria-label="Default select example">
            ${getInputListOptionUI(inputOption)}
        </select>
    </div>`;
    return inputList;
}

function getInputListOptionUI(inputOption) {
    if (!inputOption.inputListValue) {
        return null;
    }
    let optionsUI = "";
    optionsUI += `<option selected disabled>Pilih ${inputOption.label}</option>`
    inputOption.inputListValue.forEach(v => {
        optionsUI += `<option value="${v}">${v}</option>`
    });
    return optionsUI;
}

function addExtraInputDate() {

}

function saveExtraFieldDialog() {
    const payload = {
        label: $("#extra-field-input-label").val(),
        inputType: $("#select-input-type").val(),
        inputListValue: $("#select-input-type").val() == INPUT_TYPES.SELECT ? $("#extra-field-list-input").val() : null,
        isMandatory: $("#select-input-mandatory").val() == 'extra_field_mandatory_yes' ? true : false
    }

    const validateInputResule = validateExtraFieldDialog(payload);

    if (validateInputResule) {

        payload["id"] = getExtraFieldId(payload.label);
        payload.inputListValue = payload.inputListValue ? payload.inputListValue.split(",").map(e => e ? e.trim() : null) : payload.inputListValue;
        extraFields[payload.id] = payload;

        $("#extra-field-modal").modal("hide");
        resetModal();

        updateUI();
    }
}

function resetModal() {
    $("#extra-field-input-label").val("");
    $("#select-input-type").prop("selectedIndex", 0);
    $("#select-input-mandatory").prop("selectedIndex", 0);
}

function getExtraFieldId(label) {
    if (!label) {
        return null;
    }
    return label.toLowerCase().replace(/[^a-zA-Z\d]/g, "_")
}

function setElementVisibility(elementId, isVisible) {
    const element = $(`#${elementId}`)
    if (!element) {
        return null;
    }
    if (isVisible) {
        element.addClass("d-block").removeClass("d-none");
    } else {
        element.addClass("d-none").removeClass("d-block");
    }
}

function collectResult() {
    const result = [];
    for (ek in extraFields) {
        const field = extraFields[ek];
        const userInput = $(`#${field.id}`).val();
        const userInputObject = extraFields[ek];
        userInputObject["data"] = userInput;
        result.push(userInputObject);
    }

    $("#preview-result-data").text(JSON.stringify(result, null, 4));
}

function resgiterInputs() {
    $("#select-input-type").on("change", function (e) {
        const inputType = e.target.value;
        if (inputType == INPUT_TYPES.SELECT) {
            setElementVisibility("extra-field-list-value", true)
        } else {
            setElementVisibility("extra-field-list-value", false)
        }
    });

    $("#save-extra-field").on("click", function (e) {
        saveExtraFieldDialog();
    });

    $("#preview-result-button").on("click", function (e) {
        collectResult();
    });
}

resgiterInputs();