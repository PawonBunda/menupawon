// Mengambil data keranjang dari localStorage saat halaman dimuat
let cart = JSON.parse(localStorage.getItem("cart")) || [];

document.addEventListener("DOMContentLoaded", function() {
    updateCartView();
});

// Fungsi untuk menambah item ke keranjang
function addToCart(itemName, itemPrice) {
    const cartItem = {
        name: itemName,
        price: itemPrice,
        quantity: 1
    };
    cart.push(cartItem);
    saveCartToLocalStorage(); // Menyimpan keranjang ke localStorage
    alert(`${itemName} ditambahkan ke keranjang!`);

    // Memanggil fungsi updateCartView() setelah penambahan item ke keranjang
    updateCartView();
}

// Fungsi untuk menghapus item dari keranjang
function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1);
        saveCartToLocalStorage(); // Menyimpan keranjang ke localStorage
        alert("Item dihapus dari keranjang!");
        updateCartView(); // Memanggil fungsi updateCartView() setelah penghapusan item
    }
}

// Fungsi untuk menambah kuantitas item di keranjang
function increaseQuantity(index) {
    if (index >= 0 && index < cart.length) {
        cart[index].quantity += 1;
        saveCartToLocalStorage(); // Menyimpan keranjang ke localStorage
        alert("Kuantitas item ditingkatkan!");
        updateCartView(); // Memanggil fungsi updateCartView() setelah peningkatan kuantitas
    }
}

// Fungsi untuk mengurangi kuantitas item di keranjang
function decreaseQuantity(index) {
    if (index >= 0 && index < cart.length) {
        if (cart[index].quantity > 1) {
            cart[index].quantity -= 1;
            saveCartToLocalStorage(); // Menyimpan keranjang ke localStorage
            alert("Kuantitas item dikurangi!");
        } else {
            removeFromCart(index); // Panggil removeFromCart jika kuantitas sudah 1
        }

        // Memanggil fungsi updateCartView() setelah perubahan kuantitas
        updateCartView();
    }
}

function updateCartView() {
    const cartItemsContainer = document.getElementById("cart-items");
    const totalContainer = document.getElementById("total");

    // Periksa apakah elemen ditemukan sebelum mengatur innerHTML
    if (cartItemsContainer && totalContainer) {
        cartItemsContainer.innerHTML = "";

        let totalPrice = 0; // Total harga semua item

        for (let i = 0; i < cart.length; i++) {
            const cartItem = document.createElement("div");
            const itemTotal = cart[i].price * cart[i].quantity; // Total harga per item
            cartItem.innerHTML = `
                        <div class="cart-item">
                         <div class="item-info">
                            <span class="item-name">${cart[i].name}</span>
                            <span class="item-price">${formatRupiah(cart[i].price)}</span>
                         </div>
                        <div class="item-actions">
                            <button class="action-btn" onclick="increaseQuantity(${i})">+</button>
                            <span class="quantity">${cart[i].quantity}</span>
                            <button class="action-btn" onclick="decreaseQuantity(${i})">-</button>
                            <button class="action-btn" onclick="removeFromCart(${i})">Hapus</button>
                         </div>
                            <span class="total">Total: ${formatRupiah(itemTotal)}</span>
                        </div>`;

            cartItemsContainer.appendChild(cartItem);

            // Menghitung total harga semua item
            totalPrice += itemTotal;
        }

        // Menambahkan total harga ke dalam elemen HTML dengan format rupiah
        totalContainer.innerText = `Total Belanja ${formatRupiah(totalPrice)}`;
        totalContainer.style.fontWeight = 'bold';
    } else {
        console.error("Elemen dengan ID 'cart-items' atau 'total' tidak ditemukan.");
    }
}


// Fungsi untuk memformat harga menjadi format rupiah
function formatRupiah(angka) {
    let reverse = angka.toString().split("").reverse().join("");
    let ribuan = reverse.match(/\d{1,3}/g);
    let hasil = ribuan.join(".").split("").reverse().join("");
    return `Rp ${hasil}`;
}

function viewCart() {
    updateCartView();
    let totalPrice = 0;

    for (let i = 0; i < cart.length; i++) {
        totalPrice += cart[i].price;
    }

    alert(`Pesanan Anda:\n\n${cart.length > 0 ? "Items:\n" : "Keranjang kosong."}\nTotal: Rp ${totalPrice}`);
}

function checkout() {
    // Meminta data si pemesan (nama dan alamat)
    const customerNameInput = document.getElementById("customerName");
    const customerAddressInput = document.getElementById("customerAddress");
    const catatanInput = document.getElementById("catatan"); // Added line for Catatan input

    const customerName = customerNameInput.value.trim();
    const customerAddress = customerAddressInput.value.trim();
    const catatan = catatanInput.value.trim(); // Added line for retrieving Catatan value

    // Pengecekan apakah nama dan alamat sudah diisi
    if (!customerName || !customerAddress) {
        alert("Silakan lengkapi nama dan alamat Anda untuk melakukan pemesanan.");
        return;
    }

    updateCartView();
    let orderMessage = `Pesanan dari ${customerName} (${customerAddress}):\n`;

    for (let i = 0; i < cart.length; i++) {
        const itemTotal = cart[i].price * cart[i].quantity;
        orderMessage += `${cart[i].name} - Rp ${cart[i].price} x ${cart[i].quantity} = Rp ${itemTotal}\n`;
    }

    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    orderMessage += `\nTotal: Rp ${totalPrice}`;

    // Menambahkan catatan ke pesan jika ada
    if (catatan) {
        orderMessage += `\nCatatan: ${catatan}`;
    }

    // Langsung membuka aplikasi WhatsApp dengan pesan dan detail pesanan
    const whatsappNumber = "+6285642670676"; // Ganti dengan nomor WhatsApp restoran
    const whatsappMessage = encodeURIComponent(orderMessage);
    window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, '_blank');


    // Optional: Reset cart after checkout
    cart = [];
    saveCartToLocalStorage(); // Menyimpan keranjang ke localStorage
    updateCartView();
}




// Menyimpan keranjang ke localStorage
function saveCartToLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
}



// Fungsi untuk menampilkan formulir edit
function showEditForm(button) {
    var editForm = button.nextElementSibling;
    editForm.style.display = "block";
}

function hideEditForm(button) {
    var editForm = button.parentElement;
    editForm.style.display = "none";
}

// Fungsi untuk menyimpan perubahan dari formulir edit
// Fungsi untuk menyimpan perubahan dari formulir edit
function saveEditChanges(button) {
    // Dapatkan elemen menu-item terkait
    var menuItem = button.closest('.menu-item');

    // Pastikan menuItem ditemukan sebelum melanjutkan
    if (menuItem) {
        // Dapatkan nilai dari formulir edit
        var newName = menuItem.querySelector('.editName').value;
        var newPrice = menuItem.querySelector('.editPrice').value;
        // Tambahkan logika lainnya sesuai kebutuhan

        // Perbarui elemen menu-item
        var namaMakananElement = menuItem.querySelector('.Nama.Makanan');
        var hargaElement = menuItem.querySelector('.Harga');

        // Pastikan elemen yang diperlukan ditemukan sebelum mengakses properti textContent
        if (namaMakananElement && hargaElement) {
            namaMakananElement.textContent = newName;
            hargaElement.textContent = 'Rp ' + newPrice;

            // Sembunyikan formulir edit
            hideEditForm(button);
        } else {
            console.error("Elemen yang diperlukan tidak ditemukan.");
        }
    } else {
        console.error("Menu item tidak ditemukan.");
    }
}




function sendImageToServer(imageFile) {
    var formData = new FormData();
    formData.append("image", imageFile);

    fetch("/upload-image", {
        method: "POST",
        body: formData,
    })
    .then(response => {
        console.log("Server response:", response);  // <- Log seluruh objek respons
        // Tambahan log atau penanganan lainnya sesuai kebutuhan
    })
    .catch(error => {
        console.error("Error:", error);
        // Handle errors
    });
}

// Fungsi untuk menyimpan data ke localStorage
function saveDataToLocalStorage(dataKey, data) {
    localStorage.setItem(dataKey, JSON.stringify(data));
}

// Fungsi untuk memuat data dari localStorage
function loadDataFromLocalStorage(dataKey) {
    const storedData = localStorage.getItem(dataKey);
    return storedData ? JSON.parse(storedData) : null;
}

// Contoh penggunaan
document.addEventListener("DOMContentLoaded", function() {
    // Memuat data dari localStorage saat halaman dimuat
    const storedData = loadDataFromLocalStorage("storedData") || [];

    // Lakukan sesuatu dengan storedData (misalnya, tampilkan di halaman)
    console.log("Data yang dimuat dari localStorage:", storedData);

    // ...

    // Contoh penyimpanan data saat terjadi perubahan
    const newData = [/* Data baru yang akan disimpan */];
    saveDataToLocalStorage("storedData", newData);

    // Jangan lupa memuat ulang tampilan setelah perubahan data
    // updateView(newData);
});

// Fungsi untuk menyimpan data ke localStorage
function saveDataToLocalStorage(dataKey, data) {
    localStorage.setItem(dataKey, JSON.stringify(data));
}

// Fungsi untuk memuat data dari localStorage
function loadDataFromLocalStorage(dataKey) {
    const storedData = localStorage.getItem(dataKey);
    return storedData ? JSON.parse(storedData) : null;
}

// Contoh penggunaan
document.addEventListener("DOMContentLoaded", function() {
    // Memuat data dari localStorage saat halaman dimuat
    const storedData = loadDataFromLocalStorage("cart") || [];

    // Mengganti variabel 'cart' dengan data yang dimuat dari localStorage
    cart = storedData;

    // Menjalankan fungsi updateCartView untuk menampilkan data yang dimuat
    updateCartView();
});

// ... (code lainnya)

// Fungsi untuk menyimpan keranjang ke localStorage
function saveCartToLocalStorage() {
    saveDataToLocalStorage("cart", cart);
}


document.addEventListener("DOMContentLoaded", function() {
    hideEditButtons();
    updateCartView();
});

// Variabel untuk menyimpan status admin (false jika belum login)
let isAdminLoggedIn = false;

// Fungsi untuk menampilkan formulir admin
function showAdminForm() {
    const adminForm = document.getElementById("adminForm");
    adminForm.style.display = "block";
}

// Fungsi untuk memeriksa password admin
function checkAdminPassword() {
    const passwordInput = document.getElementById("adminPassword");
    const password = passwordInput.value;

    // Gantilah "admin123" dengan password yang Anda inginkan
    if (password === "0000") {
        isAdminLoggedIn = true;
        showEditButtons(); // Tampilkan tombol edit jika password benar
    } else {
        alert("Password salah!");
    }

    // Sembunyikan formulir admin setelah pengecekan
    const adminForm = document.getElementById("adminForm");
    adminForm.style.display = "none";
}

// Fungsi untuk menampilkan tombol edit jika admin sudah login
function showEditButtons() {
    // Tampilkan tombol edit hanya jika admin sudah login
    if (isAdminLoggedIn) {
        const editButtons = document.querySelectorAll(".edit-button");
        editButtons.forEach(button => {
            button.style.display = "inline-block";
        });
    }
}

// Fungsi untuk menyembunyikan tombol edit
function hideEditButtons() {
    const editButtons = document.querySelectorAll(".edit-button");
    editButtons.forEach(button => {
        button.style.display = "none";
    });
}

// ... (fungsi-fungsi lainnya)
document.addEventListener("DOMContentLoaded", function() {
    // Memuat data dari localStorage saat halaman dimuat
    const storedData = loadDataFromLocalStorage("cart") || [];

    // Mengganti variabel 'cart' dengan data yang dimuat dari localStorage
    cart = storedData;

    // Menjalankan fungsi updateCartView untuk menampilkan data yang dimuat
    updateCartView();

    // Sembunyikan tombol edit pada saat halaman dimuat
    hideEditButtons();
});







