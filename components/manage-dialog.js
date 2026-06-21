export class ManageDialog {

    async open() {

        const overlay =
            document.createElement(
                "div"
            );

        overlay.className =
            "modal-overlay";

        overlay.innerHTML = `

            <div class="modal large">

                <h2>
                    Manage
                </h2>

                <div
                    id="typesSection">
                </div>

                <div
                    id="locationsSection">
                </div>

                <button
                    id="closeManage">

                    Close

                </button>

            </div>

        `;

        document.body.appendChild(
            overlay
        );

        document
            .getElementById(
                "closeManage"
            )
            .onclick =
            ()=>overlay.remove();

        await this.renderTypes();

        await this.renderLocations();

    }

    async renderTypes() {

        const types =
            await (
                await fetch(
                    "/functions/types"
                )
            ).json();

        document
            .getElementById(
                "typesSection"
            )
            .innerHTML = `

            <h3>
                Types
            </h3>

            ${types.map(type=>`

                <div
                    class="manage-row">

                    <span>
                        ${type.value}
                    </span>

                </div>

            `).join("")}

        `;

    }

    async renderLocations() {

        const locations =
            await (
                await fetch(
                    "/functions/locations"
                )
            ).json();

        document
            .getElementById(
                "locationsSection"
            )
            .innerHTML = `

            <h3>
                Locations
            </h3>

            ${locations.map(loc=>`

                <div
                    class="manage-row">

                    <span>
                        ${loc.value}
                    </span>

                </div>

            `).join("")}

        `;

    }

}
