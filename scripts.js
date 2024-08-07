const bodyId = document.body.id;

function showAlert(message, type) {
    const alertDiv = document.getElementById('alert');
    alertDiv.textContent = message;

    alertDiv.className = '';

    if (type === 'success') {
        alertDiv.style.backgroundColor = "#4caf50"
    } else if (type === 'error') {
        alertDiv.style.backgroundColor = "#f44336"
    } else if (type === 'info') {
        alertDiv.style.backgroundColor = "#2196f3"
    }

    alertDiv.classList.add('active');

    setTimeout(() => {
        alertDiv.classList.remove('active');
    }, 3000);
}

function openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

if(location.pathname !== "/"){
    const form = document.querySelector("form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
    
        const formData = new FormData(form);
        let formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
    
        let apiEndpoint;
        if (bodyId === "login") {
            apiEndpoint = "/api/login";
        } else if (bodyId === "register") {
            apiEndpoint = "/api/register";
        }
    
        try {
            const res = await fetch(apiEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formObject)
            });
    
            const data = await res.json();
            if (res.ok) {
                console.log("Success:", data);
                if(bodyId == "register"){
                    location.assign("/login")
                    return;
                }
                location.assign("/")
            } else {
                console.error("Error:", data);
                showAlert(data.message, "error")
            }
        } catch (error) {
            console.error("Fetch error:", error);
            showAlert("An error occurred while processing your request.", "error")
        }
    });
}else{
    const currentUserId = document.querySelector("#home .profile-container").id

    document.getElementById('confirm-delete').addEventListener('click', async() => {
        try{
            const res = await fetch(`api/users/${currentUserId}`, {
                method: "DELETE"
            })
            if (res.ok) {
                showAlert("Student deleted successfully", "success")
                location.replace("/login")
                return;
            }
            showAlert("Error deleting student", "error")
            closeModal('delete-modal');
        }catch(err){
            showAlert("Error deleting student", "error")
            closeModal('delete-modal');
        }
    });

    document.getElementById('edit-form').addEventListener('submit', async(e) => {
        e.preventDefault();
    
        const formData = new FormData(document.getElementById('edit-form'));
        let formObject = {};
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
    
        try{
            const res = await fetch(`api/users/${currentUserId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formObject)
            })
            const data = await res.json()
            if (res.ok) {
                showAlert(data.message, "success")
                location.reload()
                return;
            }
            showAlert(data.message, "error")
            closeModal('edit-modal');
        }catch(err){
            showAlert("Error updating student", "error")
            closeModal('edit-modal');
        }
    });

    document.getElementById('logout-btn').addEventListener('click', () => {
        openModal('logout-modal');
    });
    
    document.getElementById('edit-btn').addEventListener('click', () => {
        openModal('edit-modal');
    });
    
    document.getElementById('delete-btn').addEventListener('click', () => {
        openModal('delete-modal');
    });
    
    document.getElementById('close-logout').addEventListener('click', () => {
        closeModal('logout-modal');
    });
    
    document.getElementById('cancel-logout').addEventListener('click', () => {
        closeModal('logout-modal');
    });
    
    document.getElementById('confirm-logout').addEventListener('click', async() => {
        try{
            const res = await fetch("api/logout")
            if (res.ok) {
                showAlert("Student logged out successfully", "success")
                location.replace("/login")
                return;
            }
            showAlert("Failed to log out", "error")
            closeModal('logout-modal');
        }catch(err){
            showAlert("Failed to log out", "error")
            closeModal('logout-modal');
        }
    });
    
    document.getElementById('close-delete').addEventListener('click', () => {
        closeModal('delete-modal');
    });
    
    document.getElementById('cancel-delete').addEventListener('click', () => {
        closeModal('delete-modal');
    });
    
    document.getElementById('close-edit').addEventListener('click', () => {
        closeModal('edit-modal');
    });
}