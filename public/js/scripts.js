document.addEventListener("DOMContentLoaded", () => {
	const token = localStorage.getItem("token");

	if (!token && !window.location.href.includes("login.html")) {
		window.location.href = "login.html";
		return;
	}
	const loginForm = document.getElementById("loginForm");

	const propertyForm = document.getElementById("propertyForm");
	const propertiesList = document.getElementById("propertiesList");
	const logoutBtn = document.getElementById("logoutBtn");

	if (loginForm) {
		loginForm.addEventListener("submit", async (e) => {
			e.preventDefault();
			const email = loginForm.email.value;
			const password = loginForm.password.value;

			const res = await fetch("/api/auth/login", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			const data = await res.json();
			if (data.token) {
				localStorage.setItem("token", data.token);
				const role = JSON.parse(atob(data.token.split(".")[1])).role;
				window.location.href =
					role === "seller" ? "seller-dashboard.html" : "buyer-dashboard.html";
			} else {
				alert(data.message);
			}
		});
	}

	if (propertyForm) {
		propertyForm.addEventListener("submit", async (e) => {
			e.preventDefault();
			const property = {
				title: propertyForm.title.value,
				description: propertyForm.description.value,
				place: propertyForm.place.value,
				address: propertyForm.address.value,
				area: propertyForm.area.value,
				bedrooms: propertyForm.bedrooms.value,
				bathrooms: propertyForm.bathrooms.value,
				price: propertyForm.price.value,
				type: propertyForm.type.value,
				yearBuilt: propertyForm.yearBuilt.value,
				amenities: propertyForm.amenities.value.split(","),
				nearbyFacilities: propertyForm.nearbyFacilities.value.split(","),
			};

			const token = localStorage.getItem("token");
			const res = await fetch("/api/properties", {
				method: "POST",
				headers: { "Content-Type": "application/json", Authorization: token },
				body: JSON.stringify(property),
			});

			const data = await res.json();
			if (data._id) {
				fetchUserProperties();
			} else {
				alert(data.message);
			}
		});

		const fetchUserProperties = async () => {
			const token = localStorage.getItem("token");
			const res = await fetch("/api/properties/user", {
				method: "GET",
				headers: { Authorization: token },
			});

			const properties = await res.json();
			const propertyCard = document.createElement("div");
			propertyCard.className = "property-card";
			propertiesList.innerHTML = "";
			properties.forEach((property) => {
				const propertyCard = document.createElement("div");
				propertyCard.className = "property-card";
				propertyCard.innerHTML = `
                    <div class="property-card-content">
                        <h3>${property.title}</h3>
                        <p>${property.description}</p>
                        <button onclick="deleteProperty('${property._id}')">Delete</button>
                    </div>
                `;
				propertiesList.appendChild(propertyCard);
			});
		};

		fetchUserProperties();
	}

	if (propertiesList && !propertyForm) {
		const fetchProperties = async () => {
			const res = await fetch("/api/properties");
			const properties = await res.json();
			propertiesList.innerHTML = "";
			properties.forEach((property) => {
				const propertyCard = document.createElement("div");
				propertyCard.className = "property-card";
				propertyCard.innerHTML = `
					<div class="property-card-content">
					<button class="like-button" onclick="toggleLike('${property._id}')"></button>
						<h3>${property.title}</h3>
						<p>${property.description}</p>
						<p>${property.address}</p>
						<p>${property.price}</p>
						<button>I'm Interested</button>
						<div class="like-buttons">
					</div>
				`;
				propertiesList.appendChild(propertyCard);
			});
		};

		fetchProperties();
	}

	if (logoutBtn) {
		logoutBtn.addEventListener("click", () => {
			localStorage.removeItem("token");
			window.location.href = "index.html";
		});
	}
});

const deleteProperty = async (id) => {
	const token = localStorage.getItem("token");
	const res = await fetch(`/api/properties/${id}`, {
		method: "DELETE",
		headers: { Authorization: token },
	});

	const data = await res.json();
	if (data.message) {
		window.location.reload();
	} else {
		alert(data.message);
	}
};

const interested = async (userId) => {
	const token = localStorage.getItem("token");
	const res = await fetch(`/api/users/${userId}`, {
		method: "GET",
		headers: { Authorization: token },
	});

	const user = await res.json();
	alert(`Contact Seller:\n\nEmail: ${user.email}\nPhone: ${user.phoneNumber}`);
};
