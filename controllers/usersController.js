const usersStorage = require("../storages/usersStorage");
const { body, query, validationResult } = require("express-validator");

const alphaErr = "must only contain letters";
const lengthErr = "must be between 1 to 10 characters";
const emailErr = "must be a valid email address";
const ageErr = "must be 18 years old or above";
const bioErr = "must be between 1 to 200 characters";

const validateUser = [
	body("firstName")
		.trim()
		.isAlpha()
		.withMessage(`First Name ${alphaErr}`)
		.isLength({ min: 1, max: 10 })
		.withMessage(`First Name ${lengthErr}`),
	body("lastName")
		.trim()
		.isAlpha()
		.withMessage(`Last Name ${alphaErr}`)
		.isLength({ min: 1, max: 10 })
		.withMessage(`Last Name ${lengthErr}`),
	body("email")
		.optional({ checkFalsy: true })
		.trim()
		.isEmail()
		.withMessage(`Email ${emailErr}`),
	body("age")
		.optional({ checkFalsy: true })
		.isInt({ min: 18, max: 120 })
		.withMessage(`Age ${ageErr}`),
	body("bio")
		.optional({ checkFalsy: true })
		.isLength({ min: 1, max: 200 })
		.withMessage(`Bio ${bioErr}`),
];

exports.usersListGet = (req, res) => {
	res.render("index", { title: "User List", users: usersStorage.getUsers() });
};

exports.usersCreateGet = (req, res) => {
	res.render("createUser", { title: "Create User" });
};

exports.usersCreatePost = [
	validateUser,
	(req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).render("createUser", {
				title: "Create user",
				errors: errors.array(),
			});
		}
		const { firstName, lastName, email, age, bio } = req.body;
		usersStorage.addUser({ firstName, lastName, email, age, bio });
		res.redirect("/");
	},
];

exports.usersUpdateGet = (req, res) => {
	const user = usersStorage.getUser(req.params.id);
	res.render("updateUser", {
		title: "Update user",
		user: user,
	});
};

exports.usersUpdatePost = [
	validateUser,
	(req, res) => {
		const user = usersStorage.getUser(req.params.id);
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).render("updateUser", {
				title: "Update user",
				user: user,
				errors: errors.array(),
			});
		}
		const { firstName, lastName, email, age, bio } = req.body;
		usersStorage.updateUser(req.params.id, {
			firstName,
			lastName,
			email,
			age,
			bio,
		});
		res.redirect("/");
	},
];

exports.usersDeletePost = (req, res) => {
	usersStorage.deleteUser(req.params.id);
	res.redirect("/");
};

exports.usersSearchGet = [
	query("searchName")
		.optional({ checkFalsy: true })
		.trim()
		.isLength({ max: 50 })
		.escape(),
	query("searchEmail")
		.optional({ checkFalsy: true })
		.trim()
		.isEmail()
		.withMessage("Email must be valid")
		.normalizeEmail(),
	(req, res) => {
		const errors = validationResult(req);

		// start with empty results until user searches
		let filteredUsers = [];

		if (errors.isEmpty()) {
			const { searchName = "", searchEmail = "" } = req.query;
			const allUsers = usersStorage.getUsers();

			filteredUsers = allUsers.filter((u) => {
				// OR logic (either field can match). Default to false when field is empty.
				const nameMatch = searchName
					? `${u.firstName} ${u.lastName}`
							.toLowerCase()
							.includes(searchName.toLowerCase())
					: false;

				const emailMatch = searchEmail
					? String(u.email).toLowerCase().includes(searchEmail.toLowerCase())
					: false;

				// If both fields are empty, return false so we don't show everyone by default.
				return nameMatch || emailMatch;
			});
		}

		return res.render("search", {
			title: "Search User",
			users: filteredUsers,
			errors: errors.array(),
			values: req.query, // to keep what user typed
		});
	},
];
