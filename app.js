const express = require("express");
const usersRouter = require("./routes/usersRouter");

const app = express();

const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/", usersRouter);

app.listen(PORT, (error) => {
	if (error) {
		throw error;
	}
	console.log(`Server is running on port ${PORT}`);
});
