//load and build html for all dishes
renderDishes();
async function renderDishes() {
    const req = await fetch("/dishes")
    const dishArr = await req.json();

    dishList.innerHTML = "";
    dishArr.forEach(dish => {
        const div = document.createElement("div");

        //if image is not valid replace it with placeholder
        if (!dish.image || !dish.image.startsWith("http"))
            dish.image = "https://www.yanaya.co.zw/wp-content/uploads/2020/08/79-798754_hoteles-y-centros-vacacionales-dish-placeholder-hd-png.jpg"

        div.className = "flex row dishView padd border-r";
        div.innerHTML = `<img src="${dish.image}" alt="${dish.name}"/>
        <div class="flex block ">
            <p>${dish.name}</p>
            <div class="rate">
                <span>${dish.rate.avg}/5</span><span style="color:gold">★</span>
            </div>
        </div>
        <div class="adminView block flex">
            <button flex class="red delete">מחק</button>
            <button flex class="green update">עריכה</button>
        </div>
        `;
        dishList.appendChild(div)

        //bind events event
        div.querySelector("div.rate").addEventListener("click", rateDish.bind(this, dish))
        div.querySelector("div.adminView button.delete").addEventListener("click", deleteDish.bind(this, dish))
        div.querySelector("div.adminView button.update").addEventListener("click", editDishDialog.bind(this, dish))

    });
}

//add dish rate
async function rateDish(dish = {}) {
    const data = prompt("דרג את המנה מ0 עד 5 כוכבים:")
    if (!data)
        return;

    const req = await fetch(`/dishes/${dish._id}/vote/${data}`, { method: 'POST' })
    if (req.status != 204) {
        const errorInfo = await req.json();
        alert(errorInfo.error)
        console.error(errorInfo)
    }
    else
        renderDishes()
}

async function deleteDish(dish = {}) {
    const req = await fetch(`/dishes/${dish._id}`, { method: 'DELETE' })
    if (req.status != 204) {
        const errorInfo = await req.json();
        alert(errorInfo.error)
        console.error(errorInfo)
    }
    else
        renderDishes();
}

function editDishDialog(dish = {}) {
    dishDialog.showModal();
    edit_dishID.value = dish._id;
    edit_image.value = dish.image;
    edit_name.value = dish.name;
}

async function addDish(image, name) {
    const req = await fetch(`/dishes`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image, name })
        })
    if (req.status != 201) {
        const errorInfo = await req.json();
        alert(errorInfo.error)
        console.error(errorInfo)
    }
    else {
        renderDishes();
    }
}

async function editDish(image, name, id) {
    const req = await fetch(`/dishes/${id}`,
        {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image, name })
        })
    if (req.status != 204) {
        const errorInfo = await req.json();
        alert(errorInfo.error)
        console.error(errorInfo)
    }
    else {
        renderDishes();
    }
    document.querySelector(".dishDialog form").reset();
}

async function loginBtn() {
    if (isLoggedIn()) {
        //disconnect
        delete localStorage.name;
        await fetch("/clients/logout");
        location.reload();
    }
    else //login
        loginDialog.showModal();
}

function isLoggedIn() {
    //premission cookie indiactes if current user is admin or not (will bes set for ALL logged-in users)
    const permission = getCookie("permission");
    return !!permission;
}

//handle login
async function login() {
    const req = await fetch("/clients/login",
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email.value,
                password: password.value
            })
        })
    const res = await req.json()
    if (req.status == 200) {
        localStorage.name = res.name;
        initializeUserInfo();
    }
    else {
        alert(res.error)
    }

    document.querySelector(".loginDialog form").reset();
}

async function register(name, user_email, password, confirm_password) {
    const req = await fetch("/clients/",
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                email: user_email,
                password,
                confirm_password
            })
        })
    const res = await req.json()
    if (req.status == 201) {
        loginBtn();
        email.value = user_email;
    }
    else {
        alert(res.error)
    }

    regi_name.value = "";
    document.querySelector(".registerDialog form").reset();

}

//handle page load when user is logged-in
function initializeUserInfo() {

    login_out.innerHTML = "התנתק | " + localStorage.name;
    login_out.className = "red";

    if (getCookie("permission") == "true") {
        document.body.classList.add("admin")
    }
}

if (isLoggedIn())
    initializeUserInfo();

//handler to get cookies
function getCookie(name) {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
}