export class ItemModal {

    constructor() {

        this.item = null;

        this.onSave = null;

    }

    async open(
        item,
        types,
        locations,
        onSave
    ) {

        this.item = item;

        this.onSave = onSave;

        const overlay =
            document.createElement("div");

        overlay.className =
            "modal-overlay";

        overlay.innerHTML = `

            <div class="modal">

                <h2>
                    ${
                        item
                        ? "Edit Item"
                        : "Add Item"
                    }
                </h2>

                <input
                    id="itemName"
                    placeholder="Name"
                    value="${
                        item?.name || ""
                    }">

                <select id="itemType">

                    ${types.map(type=>`

                        <option
                            value="${type.value}"
                            ${
                                item?.type ===
                                type.value
                                ? "selected"
                                : ""
                            }>
                            ${type.value}
                        </option>

                    `).join("")}

                </select>

                <select id="itemLocation">

                    ${locations.map(loc=>`

                        <option
                            value="${loc.value}"
                            ${
                                item?.location ===
                                loc.value
                                ? "selected"
                                : ""
                            }>
                            ${loc.value}
                        </option>

                    `).join("")}

                </select>

                <textarea
                    id="itemDetails"
                    placeholder="Details"
                >${
                    item?.details || ""
                }</textarea>

                <input
                    type="file"
                    id="itemImage">

                <label>

                    <input
                        type="checkbox"
                        id="itemHidden"
                        ${
                            item?.hidden
                            ? "checked"
                            : ""
                        }>

                    Hidden

                </label>

                <label>

                    <input
                        type="checkbox"
                        id="itemInUse"
                        ${
                            item?.in_use
                            ? "checked"
                            : ""
                        }>

                    In Use

                </label>

                <input
                    id="tempLocation"
                    placeholder="Temporary Location"
                    value="${
                        item?.temporary_location
                        || ""
                    }">

                <div class="modal-buttons">

                    <button
                        id="saveItemBtn">

                        Save

                    </button>

                    <button
                        id="cancelItemBtn">

                        Cancel

                    </button>

                </div>

            </div>
        `;

        document.body.appendChild(
            overlay
        );

        document
            .getElementById(
                "cancelItemBtn"
            )
            .onclick = () => {

                overlay.remove();

            };

        document
            .getElementById(
                "saveItemBtn"
            )
            .onclick = async () => {

                let imageKey =
                    item?.image_key || "";

                const file =
                    document
                    .getElementById(
                        "itemImage"
                    )
                    .files[0];

                if(file){

                    const form =
                        new FormData();

                    form.append(
                        "image",
                        file
                    );

                    const upload =
                        await fetch(
                            "/functions/upload",
                            {
                                method:"POST",
                                body:form
                            }
                        );

                    const uploadData =
                        await upload.json();

                    imageKey =
                        uploadData.key;

                }

                await onSave({

                    id:item?.id,

                    name:
                        document
                        .getElementById(
                            "itemName"
                        )
                        .value,

                    type:
                        document
                        .getElementById(
                            "itemType"
                        )
                        .value,

                    location:
                        document
                        .getElementById(
                            "itemLocation"
                        )
                        .value,

                    details:
                        document
                        .getElementById(
                            "itemDetails"
                        )
                        .value,

                    image_key:
                        imageKey,

                    hidden:
                        document
                        .getElementById(
                            "itemHidden"
                        )
                        .checked,

                    in_use:
                        document
                        .getElementById(
                            "itemInUse"
                        )
                        .checked,

                    temporary_location:
                        document
                        .getElementById(
                            "tempLocation"
                        )
                        .value

                });

                overlay.remove();

            };

    }

}
