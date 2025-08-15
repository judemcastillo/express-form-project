class UsersStorage {
	constructor() {
		this.storage = {};
		this.id = 0;
        this.addUser({ firstName: "John", lastName: "Doe", email: "test@sample.com", age:18, bio:"This is a bio field" });
	}
	getUsers() {
		return Object.values(this.storage);
	}
	getUser(id) {
		return this.storage[id];
	}
	addUser({ firstName, lastName, email, age, bio }) {
		const id = this.id;
		this.id++;
		this.storage[id] = { id, firstName, lastName, email, age, bio };
	}
	updateUser(id,{firstName,lastName,email,age,bio}){
		this.storage[id] = {firstName,lastName,email,age,bio};
	}
	deleteUser(id) {
		delete this.storage[id];
	}
}


module.exports = new UsersStorage();