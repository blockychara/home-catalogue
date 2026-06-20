async function loadCatalogs(){

    const response =
        await fetch(
            "/api/catalogs"
        );

    const catalogs =
        await response.json();

    const container =
        document.getElementById(
            "catalogList"
        );

    container.innerHTML = "";

    catalogs.forEach(catalog=>{

        const div =
            document.createElement(
                "div"
            );

        div.className =
            "catalog-card";

        div.innerHTML = `
            <h3>
                ${catalog.catalog_name}
            </h3>

            <p>
                ${catalog.description || ""}
            </p>

            <a href="
                catalog.html?public=
                ${catalog.username}
            ">
                View
            </a>
        `;

        container.appendChild(
            div
        );

    });

}

document
.getElementById("loginBtn")
.onclick =
async()=>{

    const username =
        document
        .getElementById(
            "username"
        )
        .value;

    const password =
        document
        .getElementById(
            "password"
        )
        .value;

    const response =
        await fetch(
            "/api/login",
            {
                method:"POST",
                headers:{
                    "Content-Type":
                    "application/json"
                },
                body:JSON.stringify({
                    username,
                    password
                })
            }
        );

    if(response.ok){

        location.href =
            "/catalog.html";

    }else{

        alert(
            "Invalid login"
        );

    }

};

loadCatalogs();
