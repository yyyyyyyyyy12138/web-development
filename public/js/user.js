import apiRequest, { HTTPError } from "./apirequest.js";

/* A data model representing a user of the app. */
export default class User {
  /* Returns an array of user IDs. */
  static async listUsers() {
    let data = await apiRequest("GET", "/users");
    // console.log("here");
    return data.users;
  }

  /* Returns a User instance, creating the user if necessary. */
  static async loadOrCreate(id) {
    try {
      let data = await apiRequest("GET", `/users/${id}`);
      return new User(data);
    } catch (e) {
      if (e instanceof HTTPError && e.status === 404) {
        let newUser = await apiRequest("POST", "/users", { id });
        return new User(newUser);
      }
    }
  }

  /* data is the user object from the API. */
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.age = data.age;
    this.gender = data.gender;
    this.records = data.records;
  }

  /* The string representation of a User is their display name. */
  toString() {
    return this.name;
  }

  /* Returns an Object containing only the instances variables we want to send back to the API when we save() the user. */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      age: this.age,
      gender: this.gender,
      records: this.records,
    };
  }

  /* Save the current state (name and avatar URL) of the user to the server. */
  async save() {
    await apiRequest("PATCH", `/users/${this.id}`, this.toJSON());
  }

  async getRecords(date) {
    if (this.records && this.records[date]) {
      return this.records[date];
    }
    return undefined;

  }

}
