// Auth, credentials
let ul_permissions = document.querySelector("div#auth-message > ul.user-type-dependent");
let userType = document.querySelector("div#credentials > select#user-type");
function change_permissions_message() {
    if (ul_permissions.firstChild){
        while(ul_permissions.firstChild){
            ul_permissions.removeChild(ul_permissions.lastChild);
        }
    }

    let permissions_entity = ["Create manager accounts", "Create projects and rafflesets",
        "See all buyers, raffles and all mentioned earlier"]
    let permissions_manager = ["Sell raffles", "Create buyers",
        "See all YOUR buyers",  "See all raffles and rafflesets of YOUR PROJECT"]

    if (userType.value === "entity") {

        for (let permission of permissions_entity){
            let li = document.createElement("li");
            li.textContent = permission;
            ul_permissions.appendChild(li);
        }
    }

    if (userType.value === "manager") {
        for (let permission_ of permissions_manager){
            let li = document.createElement("li");
            li.textContent = permission_;
            ul_permissions.appendChild(li);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    change_permissions_message();
    }
)