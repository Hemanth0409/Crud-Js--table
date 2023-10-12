// Admin-login
admin_login = () => {
    const admin_email = document.getElementById("adminemail").value;
    const admin_password = document.getElementById("adminpassword").value;
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", `http://localhost:3000/Admin`);
    xhttp.send();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            const objects = JSON.parse(this.responseText);
            var show_user = "";
            for (let object of objects) {
                console.log(admin_email);
                if (
                    object["admin_email"] == admin_email &&
                    object["admin_password"] == admin_password
                ) {
                    console.log(admin_email);
                    window.location.href = "http://127.0.0.1:5502/index.html";
                    show_user +=
                        `<p>${object["admin_email"]}</p>` +
                        `<a class="btn btn-primary ms-2 buttonhide"  type="button"
                            id="signupbutton">Logout</a>`;
                    $("#signupbutton").html(show_user);
                    break;
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Unauthorized Access!',
                    });
                }
            }
        }
    };
};

function loadTable(RestaurantName = '') {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", `http://localhost:3000/Restaurant?RestaurantName_like=${RestaurantName}`);
    xhttp.send();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            var trHTML = "";
            const objects = JSON.parse(this.responseText);
            for (let object of objects) {
                trHTML += "<tr>";
                trHTML += "<td>" + object["id"] + "</td>";
                trHTML += "<td>" + object["RestaurantName"] + "</td>";
                trHTML += "<td>" + object["RestaurantType"] + "</td>";
                trHTML += "<td>" + object["Address"] + "</td>";
                trHTML += "<td>" + object["ContactNo"] + "</td>";
                trHTML += "<td>" + object["EMailId"] + "</td>"
                trHTML +=
                    '<td><img width="50px" src="' +
                    object["Image"] +
                    '" class="Image"></td>';

                trHTML +=
                    '<td><button type="button" class="btn btn-secondary ms-1" onclick="showUserEditBox(' +
                    object["id"] +
                    ')"><i class="fa-sharp fa-solid fa-user-pen"></i></button>';
                trHTML +=
                    '<button type="button" class="btn  btn-danger ms-1" onclick="userDelete(' +
                    object["id"] +
                    ')"><i class="fa-sharp fa-solid fa-trash"></i></button></td>';
                trHTML += "</tr>";
            }
            //document.getElementById("mytable").innerHTML = trHTML;
            $('#mytable').html(trHTML);
        }
    };
}

loadTable();
// searching
function search() {
    const RestaurantName = document.getElementById("searchvalue").value;
    loadTable(RestaurantName);
}

function showLogout() {
    window.location.href = '/login.html';
}

function showLogInBox() {
    Swal.fire({
        title: "Log In Page",
        showCloseButton: true,
        closeOnClickOutside: false,
        html: '<input id="id" type="hidden">' +
            '<input id="Usermail" class="swal2-input" placeholder="User_Mail">' +
            '<input id="Password" type="password" class="swal2-input" placeholder="Password">',
        preConfirm: () => {
            LoginBox();
        },
    });
}

function LoginBox() {
    const username = document.getElementById("Usermail").value;
    const password = document.getElementById("Password").value;
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", `http://localhost:3000/Restaurant`);
    xhttp.send();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            login = false;
            const objects = JSON.parse(this.responseText);
            console.log(objects);
            // Check if objects is an array
            for (let object of objects) {
                if (username == object.EMailId && password == object.RestaurantName) {
                    login = true;
                    console.log("hello");
                    window.location.href = "./ourfeast.html";
                }
            }
            if (!login) {
                swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Unauthorized Access!',
                })
            }

        }

    }
}

function showUserCreateBox() {
    Swal.fire({

        title: "Add Restaurant Details ",
        showCloseButton: true,
        closeOnClickOutside: false,
        html: '<input id="id" type="hidden">' +
            '<input id="RestaurantName" class="swal2-input" placeholder="RestaurantName">' +
            '<select name="country" id="RestaurantType"class="swal2-input" style="width:270px"><option value="" selected disabled>-- select --</option><option value="Veg">Veg</option><option value="Non-Veg">Non Veg</option><option value="Veg/Non-veg">Veg/Non Veg</option></select>' +
            '<input id="Address" class="swal2-input" placeholder="Location">' +
            '<input id="ContactNo" class="swal2-input" placeholder="ContactNo">' +
            '<input id="EMailId" class="swal2-input" placeholder="EMailId">' +
            '<input  id="image" type="file" class="form-control swa4l1-input mt-4">',

        preConfirm: () => {
            userCreate();
        },
    });
}

function userCreate() {
    const RestaurantName = document.getElementById("RestaurantName").value;
    const RestaurantType = document.getElementById("RestaurantType").value;
    const Address = document.getElementById("Address").value;
    const ContactNo = document.getElementById("ContactNo").value;
    const EMailId = document.getElementById("EMailId").value;
    const imageInput = document.getElementById("image");
    const filename = "assets/images/" + imageInput.files[0].name;

    if (validate() == true) {
        const xhttp = new XMLHttpRequest();
        xhttp.open("POST", "http://localhost:3000/Restaurant/");
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(
            JSON.stringify({
                RestaurantName: RestaurantName,
                RestaurantType: RestaurantType,
                Address: Address,
                ContactNo: ContactNo,
                EMailId: EMailId,
                Image: filename,

            })
        );
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                loadTable();
            }
        };
    }
}

function showUserEditBox(id) {
    console.log(id);
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", `http://localhost:3000/Restaurant/${id}`);
    xhttp.send();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const objects = JSON.parse(this.responseText);

            console.log(objects);
            Swal.fire({
                title: "Edit Restaurant-List",
                showCloseButton: true,
                closeOnClickOutside: false,
                html: '<input id="id" type="hidden" value="' +
                    objects[`${id}`] + '">' +
                    '<input id="RestaurantName" class="swal2-input" placeholder="First" value="' +
                    objects["RestaurantName"] + '">' +
                    '<select name="country" id="RestaurantType"class="swal2-input" style="width:270px"><option value="" selected disabled>-- select --</option><option value="Veg">Veg</option><option value="Non-Veg">Non Veg</option><option value="Veg/Non Veg">Veg/Non Veg</option> value=" ' +
                    objects["RestaurantType"] + '">' +
                    '<input id="Address" class="swal2-input" placeholder="Address" value="' +
                    objects["Address"] + '">' +
                    '<input id="ContactNo" class="swal2-input" placeholder="Contacto" value="' +
                    objects["ContactNo"] + '">' +
                    '<input id="EMailId" class="swal2-input" placeholder="EMailId" value="' +
                    objects["EMailId"] + '">' +
                    '<input style="margin-left:25px;margin-top:20px" id="image" type="file" class="form-control swa4l1-input mt-4" value="' + objects[`image`] + '">',
                preConfirm: () => {
                    userEdit(id);
                    xhttp.onreadystatechange = function() {
                        if (this.readyState == 4 && this.status == 200) {

                        }
                    };
                },
            });

        }
    };
}

function userEdit(id) {
    const RestaurantName = document.getElementById("RestaurantName").value;
    const RestaurantType = document.getElementById("RestaurantType").value;
    const Address = document.getElementById("Address").value;
    const ContactNo = document.getElementById("ContactNo").value;
    const EMailId = document.getElementById("EMailId").value;
    const imageInput = document.getElementById("image");
    const filename = "assets/images/" + imageInput.files[0].name;
    if (validate_edit() == true) {
        const xhttp = new XMLHttpRequest();
        xhttp.open("PUT", `http://localhost:3000/Restaurant/${id}`);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(
            JSON.stringify({

                RestaurantName: RestaurantName,
                RestaurantType: RestaurantType,
                ContactNo: ContactNo,
                Address: Address,
                EMailId: EMailId,
                Image: filename,

            })

        );
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                loadTable();
            }
        };
    }
}


function userDelete(id) {
    console.log(id);
    const xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", `http://localhost:3000/Restaurant/${id}`);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        icon: 'warning',
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: '<i class="fa fa-thumbs-up"></i> Delete!',
        confirmButtonAriaLabel: 'Thumbs up, Delete!',
        cancelButtonText: '<i class="fa fa-thumbs-down"></i>',
        cancelButtonAriaLabel: 'Thumbs down'
    }).then((result) => {
        if (result.value) {
            xhttp.send(
                JSON.stringify({
                    id: id,
                })
            );
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4) {
                    swal.fire({
                        title: "Deleted Successfully",
                        icon: "success",
                        confirmButtonText: "OK"
                    })
                    loadTable();
                }
            };
        }
    });
}

function validate() {
    const RestaurantName = document.getElementById("RestaurantName").value;
    const RestaurantType = document.getElementById("RestaurantType").value;
    const Address = document.getElementById("Address").value;
    const ContactNo = document.getElementById("ContactNo").value;
    const EMailId = document.getElementById("EMailId").value;
    //regular expression
    const numCheck = /^[0-9]{10}$/;
    const EMailIdCheck = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;


    if (RestaurantName == "" || RestaurantType == "" || Address == "" || ContactNo == "" || EMailId == "") {
        Swal.fire({
            title: "Fields should not be empty",
            showConfirmButton: true,
            icon: "error"
        })
        return false;
    }

    if (!ContactNo.match(numCheck)) {

        Swal.fire({
            title: "Invalid Input",
            text: "Contact Number should contain 10 digits",
            icon: "error",
            showConfirmButton: true,

        })
        return false;

    }
    if (!EMailId.match(EMailIdCheck)) {

        Swal.fire({
            title: "Invalid Input",
            text: "Enter a valid email",
            icon: "error",
            showConfirmButton: true,

        })
        return false;

    }
    if (ContactNo.match(numCheck) && EMailId.match(EMailIdCheck)) {
        Swal.fire({
            title: "Successfully Created",
            icon: "success",
            showConfirmButton: true


        })
        return true;
    }
}

function validate_edit() {
    const RestaurantName = document.getElementById("RestaurantName").value;
    const RestaurantType = document.getElementById("RestaurantType").value;
    const Address = document.getElementById("Address").value;
    const ContactNo = document.getElementById("ContactNo").value;
    const EMailId = document.getElementById("EMailId").value;
    //regular expression
    const numCheck = /^[0-9]{10}$/;
    const EMailIdCheck = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;


    if (RestaurantName == "" || RestaurantType == "" || Address == "" || ContactNo == "" || EMailId == "") {
        Swal.fire({
            title: "Fields should not be empty",
            showConfirmButton: true,
            icon: "error"
        })
        return false;
    }

    if (!ContactNo.match(numCheck)) {

        Swal.fire({
            title: "Invalid Input",
            text: "Contact Number should contain 10 digits",
            icon: "error",
            showConfirmButton: true,

        })
        return false;

    }
    if (!EMailId.match(EMailIdCheck)) {

        Swal.fire({
            title: "Invalid Input",
            text: "Enter a valid email",
            icon: "error",
            showConfirmButton: true,

        })
        return false;

    }
    if (ContactNo.match(numCheck) && EMailId.match(EMailIdCheck)) {
        Swal.fire({
            title: "Successfully Edited",
            icon: "success",
            showConfirmButton: true


        })
        return true;
    }
}
//Food-list
function loadcard_food(Food_name = "") {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", `http://localhost:3000/Food?Food_name_like=${Food_name}`);
    xhttp.send();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            var cardHTML = "";
            const objects = JSON.parse(this.responseText);
            for (let object of objects) {
                cardHTML += '<div class="card text-white bg-dark col-3 mt-5">';
                cardHTML += '<img src="' + object["Image"] + '"id="img" height="200vh"">';
                cardHTML += '<p class="card-subtitle ">' + object["Food_name"] + "</p>";
                cardHTML += '<a href="#" class="card-text text-white link-dark text-decoration-none">' +
                    "Price: " +
                    object["Price"] +
                    "</a>";
                cardHTML += '<button type="button" class="btn btn-secondary ms-1" onclick="showUserEdit_foodBox(' +
                    object["id"] +
                    ')"><i class="fa-sharp fa-solid fa-user-pen"></i></button>';
                cardHTML += '<button type="button" class="btn  btn-danger ms-1" onclick="userDelete_food(' +
                    object["id"] +
                    ')"><i class="fa-sharp fa-solid fa-trash"></i></button>';
                cardHTML += "</div>";
            }
            document.getElementById("mycards").innerHTML = cardHTML;

        }
    };
}

loadcard_food();

// searching
function searchFood() {
    const Foodname = document.getElementById("searchvalue1").value;
    loadcard_food(Foodname);
}
//jquery for search 
$(document).ready(function() {
    // Get the search bar element
    var searchBar = $("#searchvalue1");

    // Get the content to hide
    var contentToHide = $("#content");

    // When the user clicks on the search bar, hide the content
    searchBar.on("click", function() {
        contentToHide.hide();
    });

    // When the user clicks anywhere outside the search bar, show the content
    $(document).on("click", function(event) {
        if (!searchBar.is(event.target)) {
            contentToHide.show();
        }
    });
});


function showUserCreateBox_Card() {
    Swal.fire({
        title: "Add New Food",
        showCloseButton: true,
        closeOnClickOutside: false,
        html: '<input id="id" type="hidden">' +
            '<input id="Food_name" class="swal2-input" placeholder="Food_name">' +
            '<input id="Price" class="swal2-input" placeholder="Price">' +
            '<input id="Image" class="form-control swa4l1-input mt-4" type="file">',
        preConfirm: () => {
            userCreate_card();
        },
    });
}

function userCreate_card() {

    const Food_name = document.getElementById("Food_name").value;
    const Price = document.getElementById("Price").value;
    const Image = document.getElementById("Image");
    const file = "assets/images/" + Image.files[0].name;
    console.log("file")
    const xhttp = new XMLHttpRequest();

    xhttp.open("POST", "http://localhost:3000/Food");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    console.log(Food_name)
    xhttp.send(
        JSON.stringify({
            Image: file,
            Food_name: Food_name,
            Price: Price,
        })
    );
    console.log(xhttp)
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            loadcard_food();
        }
    };
}

function showUserEdit_foodBox(id) {
    console.log(id);
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", `http://localhost:3000/Food/${id}`);
    xhttp.send();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const objects = JSON.parse(this.responseText);

            console.log(objects);
            Swal.fire({
                title: "Edit Food-Details",
                showCloseButton: true,
                closeOnClickOutside: false,
                html: '<input id="id" type="hidden" value="' +
                    objects[`${id}`] + '">' +
                    '<input id="Food_name" class="swal2-input" placeholder="Food_name" value="' +
                    objects["Food_name"] + '">' +
                    '<input id="Price" class="swal2-input" placeholder="Price" value="' +
                    objects["Price"] + '">' +
                    '<input style="margin-left:25px;margin-top:20px" id="Image" type="file" class="form-control swa4l1-input mt-4" value="' + objects[`Image`] + '">',
                preConfirm: () => {
                    UserEdit_food(id);
                    xhttp.onreadystatechange = function() {
                        if (this.readyState == 4 && this.status == 200) {

                        }
                    };
                },
            });

        }
    };
}

function UserEdit_food(id) {
    const Food_name = document.getElementById("Food_name").value;
    const Price = document.getElementById("Price").value;
    const Image = document.getElementById("Image");
    const file = "assets/images/" + Image.files[0].name;


    const xhttp = new XMLHttpRequest();
    xhttp.open("PUT", `http://localhost:3000/Food/${id}`);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(
        JSON.stringify({

            Image: file,
            Food_name: Food_name,
            Price: Price,

        })

    );
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            loadcard_food();
        }
    };
}



function userDelete_food(id) {
    console.log(id);
    const xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", `http://localhost:3000/Food/${id}`);
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        icon: 'warning',
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: '<i class="fa fa-thumbs-up"></i> Delete!',
        confirmButtonAriaLabel: 'Thumbs up, Delete!',
        cancelButtonText: '<i class="fa fa-thumbs-down"></i>',
        cancelButtonAriaLabel: 'Thumbs down'
    }).then((result) => {
        if (result.value) {
            xhttp.send(
                JSON.stringify({
                    id: id,
                })
            );
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4) {
                    swal.fire({
                        title: "Deleted Successfully",
                        icon: "success",
                        confirmButtonText: "OK"
                    })
                    loadcard_food();
                }
            };
        }
    });
}