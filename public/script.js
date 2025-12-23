const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:3000/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Save token in browser
            localStorage.setItem("token", data.token);
            message.innerText = "Login successful!";
        } else {
            message.innerText = data.message;
        }
    } catch (error) {
        message.innerText = "Server error";
    }
});

const loadUsersBtn = document.getElementById("loadUsers");
const userList = document.getElementById("userList");

loadUsersBtn.addEventListener("click", async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/users/all", {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const users = await response.json();
        userList.innerHTML = "";

        users.forEach(user => {
            const li = document.createElement("li");
            li.innerText = `${user.id} - ${user.name} (${user.email}) `;

            const delBtn = document.createElement("button");
            delBtn.innerText = "Delete";

            delBtn.onclick = async () => {
              const token = localStorage.getItem("token");

    await fetch(`http://localhost:3000/api/users/delete/${user.id}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    alert("User deleted");
};

li.appendChild(delBtn);
userList.appendChild(li);

        });

    } catch (error) {
        alert("Error loading users");
    }
});

const createUserForm = document.getElementById("createUserForm");

createUserForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please login first");
        return;
    }

    const name = document.getElementById("newName").value;
    const email = document.getElementById("newEmail").value;
    const password = document.getElementById("newPassword").value;

    const response = await fetch("http://localhost:3000/api/users/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();
    alert(data.message);
});
