function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}
class User {
    static API_URL = "https://raffles-manager-api-production.up.railway.app";
    constructor(username, password, user_type, details) {
        if (!details) this.details = null; else this.details = details
        this.username = username;
        this.password = password;
        this.user_type = user_type;
        this.credentials = null;
        if (user_type === 'entity'){
            this.credentials = {
                name: this.username,
                password: this.password,
                details: this.details
            };

        }
        else if (user_type === 'manager'){
            this.credentials = {
                username: this.username,
                password: this.password
            };

        }
    }

    async signUp(){
        let response = await fetch(`${this.API_URL}/auth/${this.user_type}/register`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(this.credentials)
            }
            );
    }
    async signIn(){
        let formData = new URLSearchParams({
            grant_type: 'password',
            username: this.username,
            password: this.password,
            scope: '',
            client_id: 'string',
            client_secret: ''
        }).toString();

        let response = await fetch(`${User.API_URL}/auth/${this.user_type}/login`,
            {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: formData
            }
        );

            let result = await response.json();
            let json_result = JSON.parse(JSON.stringify(result));
        if (response.ok){
            let access_token = json_result.access_token;
            document.cookie = `token=${access_token};max-age=${30*24*60*60};path=/`;
            return { status: response.status, message:"Successfully signed in!" };
        }
        else{
            //console.log(response)
            return { status: response.status, message:json_result.detail};
        }

    }
}
// Auth, credentials
let ul_permissions = document.querySelector("div#auth-message > ul.user-type-dependent");
let userType = document.querySelector("select#user-type");
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

let selectAuthAction = document.querySelector("select.auth-action");
let h1AuthAction = document.querySelector("h1.auth-action");
function authActionText(){
    if (selectAuthAction.value === 'sign-up') {
        h1AuthAction.textContent="Register";
    }
    else if (selectAuthAction.value === 'sign-in') {
        h1AuthAction.textContent="Sign In";
    }
    
}

function getValue(e, key){
    return e.target.elements[key].value;
}

async function authenticate(e){
    e.preventDefault();
    let username = getValue(e, 'username');
    let password = getValue(e, 'password');
    let user_type = userType.value; // User attempt to authenticate
    //document.cookie = `user-type=${user_type};max-age=${30*24*60*60};path=/`;
    let signed_in_user_type = getCookie('signed-in-user-type'); // Already authenticated user if exists
    if (selectAuthAction.value === 'sign-up'){
        if (user_type === 'manager'){
            if (signed_in_user_type === 'entity'){

            }
            else {
                alert("You have to be logged in as")
            }

        }
    }
    else if (selectAuthAction.value === 'sign-in'){
        new_user = new User(username, password, user_type);
        response = await new_user.signIn();
        console.log(response)
    }
}

document.addEventListener('DOMContentLoaded', () => {
    change_permissions_message();
    authActionText();
}
)