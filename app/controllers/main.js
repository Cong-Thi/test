getAccounts()

// Viết function getAccounts
function getAccounts(searchTerm){
    apiGetAccounts(searchTerm)
    .then((response) => {
        //console.log(response.data);
        let accounts = response.data.map((account) => {
            return new Account(account.id, account.user, account.name, account.password, account.email ,account.image, account.type, account.language, account.describe)
        })
        display(accounts);
        
    })
    .catch((error) => {
        console.log(error);
    });
}

// addAccount request API để thêm account
function addAccount(account){
    apiAddAccount(account)
    .then(() => {
        getAccounts();
    })
    .catch((error) => {
        console.log(error);
    })
    
}


// deleteAccount request API để xóa tài khoản
function deleteAccount(accountID){
    apiDeleteAccount(accountID)
    .then(() => {
        getAccounts();
    })
    .catch((error) => {
        console.log(error);
    })
}

// updateAccount request API để cập nhật tài khoản
function updateAccount(accountID, account){
    apiUpdateAccount(accountID, account)
    .then(() => {
        getAccounts();
    })
    .catch ((error) => {
        console.log(error);
    })
    
}

function display(accounts){
    let output = accounts.reduce((result, account, index)=> {
        return result + `
            <tr>
                <td>${index +1}</td>
                <td>${account.user}</td>
                <td>${account.password}</td>
                <td>${account.name}</td>
                <td>${account.email}</td>
                <td>${account.language}</td>
                <td>${account.type}</td>
                <td>
                    <button class="btn btn-success"
                    data-target="#myModal"
                    data-toggle="modal"
                    data-id="${account.id}" 
                    data-type="edit">Sửa</button>

                    <button class="btn btn-danger"
                    data-id="${account.id}" 
                    data-type="delete">Xóa</button>
                </td>
            </tr>
        `
    },"")
    
    dom('#tblDanhSachNguoiDung').innerHTML = output
}

function dom(selector){
    return document.querySelector(selector);
}

function resetForm(){
    dom("#ID").value ="";
    dom("#TaiKhoan").value ="";
    dom("#HoTen").value ="";
    dom("#MatKhau").value ="";
    dom("#Email").value ="";
    dom("#HinhAnh").value ="";
    dom("#loaiNguoiDung").value ="";
    dom("#loaiNgonNgu").value ="";
    dom("#MoTa").value ="";
    dom("#TaiKhoan").disabled = false;
}



// =============DOM================

// Lắng nghe sự kiện click của button Thêm Mới và gọi tới calback function
dom("#btnThemNguoiDung").addEventListener("click", ()=>{
    
    
    // 1. Thay đổi heading  và hiển thị footer
    dom(".modal-title").innerHTML = "Thêm Người Dùng";
    dom(".modal-footer").innerHTML = `
        <button class="btn btn-secondary" data-dismiss="modal">Hủy</button>
        <button class="btn btn-primary" data-type="add">Thêm</button>
    `; 
    resetForm()
});

dom(".modal-footer").addEventListener("click", (evt) => {
    let elementType = evt.target.getAttribute("data-type")

    // DOM các inputs để lấy data
    let id = dom("#ID").value;
    let user = dom("#TaiKhoan").value;
    let name = dom("#HoTen").value;
    let password = dom("#MatKhau").value;
    let email = dom("#Email").value;
    let image = dom("#HinhAnh").value;
    let type = dom("#loaiNguoiDung").value;
    let language= dom("#loaiNgonNgu").value;
    let describe = dom("#MoTa").value;
    
    let isValid = validateForm();
    // Kiểm tra nếu form không hợp lệ => Kết thúc hàm
    if (!isValid) {
        return;
    }
    
    // Tạo object từ lớp đối tượng Account
    let account = new Account(null, user, name, password, email, image, type, language, describe)

    if(elementType === "add"){
        addAccount(account);
    } else if(elementType ==="update"){
        updateAccount(id, account)
    }
    resetForm();
});

dom("#tblNguoiDung").addEventListener("click", (evt) => {
    let id = evt.target.getAttribute("data-id");
    let elType = evt.target.getAttribute("data-type");

    if(elType === "delete"){
        deleteAccount(id);
    } else if(elType === "edit"){
        // Thay đổi heading và hiển thị footer
        dom(".modal-title").innerHTML = "Cập nhật Người Dùng";
        dom(".modal-footer").innerHTML = `
        <button class="btn btn-secondary" data-dismiss="modal">Hủy</button>
        <button class="btn btn-primary" data-type="update">Cập nhật</button>
    `;
        
    // Call API lấy chi tiết của 1 người dùng bằng ID
    apiGetAccountById(id)
    .then((response) =>{
        let account = response.data;
        // Fill thông tin lên các inputs
    dom("#ID").value = account.id;
    dom("#TaiKhoan").value = account.user;
    dom("#HoTen").value = account.name;
    dom("#MatKhau").value = account.password;
    dom("#Email").value = account.email;
    dom("#HinhAnh").value = account.image;
    dom("#loaiNguoiDung").value = account.type;
    dom("#loaiNgonNgu").value = account.language;
    dom("#MoTa").value = account.describe;
    dom("#TaiKhoan").disabled = true;

    let isValid = validateFormByUser();
    // Kiểm tra nếu form không hợp lệ => Kết thúc hàm
    if (!isValid) {
        return;
    }
    // resetForm()
    })
    
    .catch((error) => {
        console.log(error);
    });

    
    }
  
});

// Lắng nghe sự kiện keydown của input search
dom("#search").addEventListener("keydown", (evt) => {
    //console.log(evt.key);
    // Kiểm tra không phải ký tự Enter => Kết thúc hàm
    if(evt.key !== "Enter") return;
    getAccounts(evt.target.value);
});

//======== Validation ========

// Hàm kiểm tra user
function validateUser(){
    apiGetUsers()
    .then((response) => {
        let taiKhoan = dom("#TaiKhoan").value;
        let spanEl = dom("#tbTaiKhoan");
        let checkUser = response.data.filter((account) => {
            return account.user === taiKhoan;  
         });
         if (!taiKhoan) {
                       spanEl.style.display = "Block"
                       spanEl.innerHTML = "Tài khoản không được để trống!";
                       return false;
                    }
                
         if(checkUser.length>0){
            spanEl.style.display = "Block"
           spanEl.innerHTML = "Tài khoản đã tồn tại!";
           return false;
         }
         spanEl.style.display = "none";
         spanEl.innerHTML = "";
         return true;
        })
        .catch((error) => {
            console.log(error);
           
         });
}

// Hàm kiểm tra họ tên
function validateName() {
    let name = dom("#HoTen").value;
    let spanEl = dom("#tbHoTen");
    // Kiểm tra rỗng
    if (!name) {
        spanEl.style.display = "Block"
        spanEl.innerHTML = " Họ tên không được để trống"
        return false;
    }
    // Kiểm tra kiểu chữ
    let regex = /^[A-Za-z]*$/
    if (!regex.test(name)) {
        spanEl.style.display = "Block"
        spanEl.innerHTML = "Họ tên không chứa số và ký tự đặc biệt"
        return false
    }
    spanEl.style.display = "none";
    spanEl.innerHTML = ""
    return true;
}

// Hàm kiểm tra email
function validateEmail() {
    let email = dom("#Email").value;
    let spanEl = dom("#tbEmail");
    // Kiểm tra rỗng
    if (!email) {
        spanEl.style.display = "Block"
        spanEl.innerHTML = " Email không được để trống"
        return false;
    }
    // Kiểm tra email
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if (!regex.test(email)) {
        spanEl.style.display = "Block"
        spanEl.innerHTML = "Email không đúng định dạng"
        return false
    }
    spanEl.style.display = "none";
    spanEl.innerHTML = ""
    return true;
}

// Hàm kiểm tra mật khẩu
function validatePassword() {
    let password = dom("#MatKhau").value;
    let spanEl = dom("#tbMatKhau");
    // Kiểm tra rỗng
    if (!password) {
        spanEl.style.display = "Block"
        spanEl.innerHTML = " Mật khẩu không được để trống"
        return false;
    }
    // Kiểm tra mật khẩu
    let regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,8}$)/
    
    if (!regex.test(password)) {
        spanEl.style.display = "Block"
        spanEl.innerHTML = "Mật Khẩu từ 6-8 ký tự (chứa ít nhất 1 ký tự số, 1 ký tự in hoa, 1 ký tự đặc biệt)"
        return false
    }
    spanEl.style.display = "none";
    spanEl.innerHTML = ""
    return true;
}

// Hàm kiểm tra Hình Ảnh
function validateImage() {
    let image = dom("#HinhAnh").value;
    let spanEl = dom("#tbHinhAnh");
    // Kiểm tra rỗng
    if (!image) {
        spanEl.style.display = "Block"
        spanEl.innerHTML = " Hình ảnh không được để trống"
        return false;
    }
    
    spanEl.style.display = "none";
    spanEl.innerHTML = ""
    return true;
}

// Hàm kiểm tra loại người dùng
function validateType() {
    let type = dom("#loaiNguoiDung").value;
    let spanEl = dom("#tbLoaiNguoiDung");
    // Kiểm tra người dùng
    if (!type) {
        spanEl.style.display = "Block"
        spanEl.innerHTML = " Loại người dùng phải chọn hợp lệ, không được để trống"
        return false;
    }
    spanEl.style.display = "none";
    spanEl.innerHTML = ""
    return true;
}

// Hàm kiểm tra ngôn ngữ
function validateLanguage() {
    let language = dom("#loaiNgonNgu").value;
    let spanEl = dom("#tbLoaiNgonNgu");
    // Kiểm tra ngôn ngữ
    if (!language) {
        spanEl.style.display = "Block"
        spanEl.innerHTML = " Ngôn ngữ phải chọn hợp lệ, không được để trống"
        return false;
    }
    spanEl.style.display = "none";
    spanEl.innerHTML = ""
    return true;
}

// Hàm kiểm tra User
function validateDescribe() {
    let describe = dom("#MoTa").value;
    let spanEl = dom("#tbMoTa");
    // Kiểm tra rỗng
    if (!describe) {
        spanEl.style.display = "Block"
        spanEl.innerHTML = "Mô tả không được để trống"
        return false;
    }
    // Kiểm tra ký tự
    if (describe.length >= 60) {
        spanEl.style.display = "Block"
        spanEl.innerHTML = "Tên tài khoản không vượt quá 60 ký tự"
        return false;
    }
    spanEl.style.display = "none";
    spanEl.innerHTML = ""
    return true;
}

function validateForm() {
    // Kĩ thuật Đặt cờ hiệu, mặc định ban đầu xem như form hợp lệ
    let isValid = true;
    isValid = validateUser() & validateName() & validateEmail() & validatePassword() & validateImage() & validateType() & validateLanguage() & validateDescribe();

    if (!isValid) {
       // alert("Form không hợp lệ");
        return false;
    }
    return true;
}
function validateFormByUser() {
    // Kĩ thuật Đặt cờ hiệu, mặc định ban đầu xem như form hợp lệ
    let isValid = true;
    isValid =  validateName() & validateEmail() & validatePassword() & validateImage() & validateType() & validateLanguage() & validateDescribe();

    if (!isValid) {
       // alert("Form không hợp lệ");
        return false;
    }
    return true;
}

