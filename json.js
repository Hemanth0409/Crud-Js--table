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
                trHTML += "<td>" + object["EMailId"] + "</td>";
                trHTML +=
                    '<td><img width="50px" src="' +
                    object["Image"] +
                    '" class="Image"></td>';
                trHTML +=
                    '<td><button type="button" class="btn btn-secondary ms-2" onclick="showUserEditBox(' +
                    object["id"] +
                    ')"><i class="fa-sharp fa-solid fa-user-pen"></i></button>';
                trHTML +=
                    '<button type="button" class="btn  btn-danger ms-2" onclick="userDelete(' +
                    object["id"] +
                    ')"><i class="fa-sharp fa-solid fa-trash"></i></button></td>';
                trHTML += "</tr>";
            }
            document.getElementById("mytable").innerHTML = trHTML;
        }
    };
}

loadTable();
// searching
function search() {
    const RestaurantName = document.getElementById("searchvalue").value;
    loadTable(RestaurantName);
}

function showUserCreateBox() {
    Swal.fire({
        title: "Add Restaurant Details ",
        html: '<input id="id" type="hidden">' +
            '<input id="RestaurantName" class="swal2-input" placeholder="RestaurantName">' +
            '<select name="country" id="RestaurantType"class="swal2-input" style="width:270px"><option value="" selected disabled>-- select --</option><option value="Veg">Veg</option><option value="Non-Veg">Non Veg</option><option value="Veg/Non-veg">Veg/Non Veg</option></select>' +
            '<input id="Address" class="swal2-input" placeholder="Location">' +
            '<input id="ContactNo" class="swal2-input" placeholder="ContactNo">' +
            '<input id="EMailId" class="swal2-input" placeholder="EMailId">' +
            '<input  id="image" type="file" class="swal2-input ">',
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
                const objects = JSON.parse(this.responseText);
                Swal.fire(objects["message"]);
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
                    '<input style="margin-left:50px;margin-top:20px" id="image" type="file" class="swal2-input" value="' + objects[`image`] + '">',
                preConfirm: () => {
                    userEdit(id);
                    xhttp.onreadystatechange = function() {
                        if (this.readyState == 4 && this.status == 200) {
                            const objects = JSON.parse(this.responseText);
                            Swal.fire(objects["message"]);
                            loadTable();
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
    if (validate() == true) {
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
                const objects = JSON.parse(this.responseText);
                Swal.fire(objects["message"]);
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
        showCloseButton: true,
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