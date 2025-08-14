const usersStorage = require("../storages/usersStorage");

exports.usersListGet = (req, res) => {
    res.render("index", { title: "User List", users: usersStorage.getUsers() });
}