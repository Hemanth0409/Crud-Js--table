function loadTable() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:3000/Restaurant");
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
                    object["avatar"] +
                    '" class="avatar"></td>';
                trHTML +=
                    '<td><button type="button" class="btn btn-outline-secondary ms-2" onclick="showUserEditBox(' +
                    object["id"] +
                    ')">Edit</button>';
                trHTML +=
                    '<button type="button" class="btn btn-outline-danger ms-2" onclick="userDelete(' +
                    object["id"] +
                    ')">Del</button></td>';
                trHTML += "</tr>";
            }
            document.getElementById("mytable").innerHTML = trHTML;
        }
    };
}

loadTable();

function showUserCreateBox() {
    Swal.fire({
        title: "Restaurant Details ",
        html: '<input id="id" type="hidden">' +
            '<input id="RestaurantName" class="swal2-input" placeholder="RestaurantName">' +
            '<input id="RestaurantType" class="swal2-input" placeholder="RestaurantType">' +
            '<input id="Address" class="swal2-input" placeholder="Address">' +
            '<input id="ContactNo" class="swal2-input" placeholder="ContactNo">' +
            '<input id="EMailId" class="swal2-input" placeholder="EMailId">',
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
                avatar: "http://res.cloudinary.com/simpleview/image/upload/v1438123960/clients/grandrapids/file_bcf11a47-7451-464f-8c4d-c9d3e85e9146.png",
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
            //const user = objects["objects"];
            console.log(objects);
            Swal.fire({
                title: "Edit Restaurant-List",
                html: '<input id="id" type="hidden" value="' +
                    objects[`${id}`] + '">' +
                    '<input id="RestaurantName" class="swal2-input" placeholder="First" value="' +
                    objects["RestaurantName"] + '">' +
                    '<input id="RestaurantType" class="swal2-input" placeholder="Last" value="' +
                    objects["RestaurantType"] + '">' +
                    '<input id="Address" class="swal2-input" placeholder="Address" value="' +
                    objects["Address"] + '">' +
                    '<input id="ContactNo" class="swal2-input" placeholder="Contacto" value="' +
                    objects["ContactNo"] + '">' +
                    '<input id="EMailId" class="swal2-input" placeholder="EMailId" value="' +
                    objects["EMailId"] + '">',
                preConfirm: () => {
                    userEdit(id);
                },
            });
        }
    };
}

function userEdit(id) {
    //const id = document.getElementById("id").value;
    const RestaurantName = document.getElementById("RestaurantName").value;
    const RestaurantType = document.getElementById("RestaurantType").value;
    const Address = document.getElementById("Address").value;
    const ContactNo = document.getElementById("ContactNo").value;
    const EMailId = document.getElementById("EMailId").value;
    if (validate() == true) {
        const xhttp = new XMLHttpRequest();
        xhttp.open("PUT", `http://localhost:3000/Restaurant/${id}`);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(
            JSON.stringify({
                // id: id,
                RestaurantName: RestaurantName,
                RestaurantType: RestaurantType,
                ContactNo: ContactNo,
                Address: Address,
                EMailId: EMailId,
                avatar: "http://res.cloudinary.com/simpleview/image/upload/v1438123960/clients/grandrapids/file_bcf11a47-7451-464f-8c4d-c9d3e85e9146.png",
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
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
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
    const nameCheck = /^[a-zA-Z\s]{2,20}$/;
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

    if (!RestaurantName.match(nameCheck)) {

        Swal.fire({
            title: "Invalid Input",
            text: "Restaurant Name can either be letter or number",
            icon: "error",
            showConfirmButton: true,

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
    if (RestaurantName.match(nameCheck) && ContactNo.match(numCheck) && EMailId.match(EMailIdCheck)) {
        Swal.fire({
            title: "Successfully Created",
            icon: "success",
            showConfirmButton: true


        })
        return true;
    }
}