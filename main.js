function setCookie(name, value, exdays) {
  const date = new Date();
  date.setTime(date.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}



bar = document.querySelector('#easy-access>ul');
bar_urls = [
    "buyers.html",
    "projects.html",
    "rafflesets.html",
    "raffles.html",
    "profile.html"]

isAuthenticated = false;

// Main Menu
function enable_bar(bool){
    let i = 0
    for (let child of bar.children) {
        a = child.children[0];
        if (bool){
            bar.parentElement.classList.remove("no-auth");
            a.href = bar_urls[i];
        }
        else{
            bar.parentElement.classList.add("no-auth")
            a.removeAttribute("href");
        }
        i++
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (!bar.parentElement.classList.contains("no-auth")){
        enable_bar(true);
    }

}
)



