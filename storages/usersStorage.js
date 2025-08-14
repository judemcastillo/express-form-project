class UsersStorage {
	constructor() {
		this.storage = {};
		this.id = 0;
        this.addUser({ firstName: "John", lastName: "Doe" });
	}
	getUsers() {
		return Object.values(this.storage);
	}
	getUser(id) {
		return this.storage[id];
	}
	addUser({ firstName, lastName }) {
		const id = this.id;
		this.id++;
		this.storage[id] = { id, firstName, lastName };
	}
}


module.exports = new UsersStorage();