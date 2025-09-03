function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}
class User {
    static API_URL = "https://raffles-manager-api-production.up.railway.app";
    static AUTH_HEADERS = {
        'Access-Control-Allow-Origin': `raffles-manager-api-production.up.railway.app, ${User.API_URL}, localhost`,
        'accept': 'application/json'
    }
    constructor(username, password, user_type, details) {
        if (!details) this.details = null; else this.details = details
        this.username = username;
        this.password = password;
        this.user_type = user_type;
    }

    async signUp(){
        User.AUTH_HEADERS['Content-Type'] = 'application/json'
        let formData = {
            username: this.username,
            password: this.password,
            description: this.details,
        };
        let formJSON = JSON.stringify(formData);

        let response = (await fetch(`${User.API_URL}/auth/${this.user_type}/register`,
            {
                method: 'POST',
                headers: User.AUTH_HEADERS,
                body: formJSON
            }
        ));

        let result = await response.json();
        let json_result = JSON.parse(JSON.stringify(result));
        if (response.ok){
            console.log(response);
            console.log(json_result);
            return { status: response.status, message:json_result.message};
        }
        else{
            //console.log(json_result)
            return { status: response.status, message:json_result.detail[0].msg};
        }
    }
    async signIn(){
        User.AUTH_HEADERS['Content-Type'] = 'application/x-www-form-urlencoded'
        let formData = new URLSearchParams({
            grant_type: 'password',
            username: this.username,
            password: this.password,
            scope: '',
            client_id: 'string',
            client_secret: ''
        }).toString();
        let formJSON = JSON.stringify(formData);

        let response = await fetch(`${User.API_URL}/auth/${this.user_type}/login`,
            {
                method: 'POST',
                headers: User.AUTH_HEADERS,
                body: formJSON
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
let validationSpan = document.querySelector("span.validation");
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
    new_user = new User(username, password, user_type);
    let signed_in_user_type = getCookie('signed-in-user-type'); // Already authenticated user if exists
    if (selectAuthAction.value === 'sign-up'){
        if (user_type === 'manager'){
            if (signed_in_user_type === 'entity'){

            }
            else {
                alert("You have to be logged in as entity")
            }

        }
        else {
            response = await new_user.signUp()
            console.log(response)
            validationSpan.textContent = response.message
            if (response.status !== 200){
                validationSpan.style = "color: red;";
            }
            else {
                validationSpan.style = "color: green;";
            }
        }
    }
    else if (selectAuthAction.value === 'sign-in'){

        response = await new_user.signIn();
        console.log(response)
        validationSpan.textContent = response.message
        if (response.status !== 200){
            validationSpan.style = "color: red;";
        }
        else {
            validationSpan.style = "color: green;";
        }

    }
}

document.addEventListener('DOMContentLoaded', () => {
    change_permissions_message();
    authActionText();
}
)