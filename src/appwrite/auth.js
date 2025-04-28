import conf from "../conf/conf.js";
import { Client, Account, ID } from "appwrite";

export class AuthService {
  client = new Client();
  account;
  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.account = new Account(this.client);
  }

  //now gonna create a method or wrapper act which takes the arg and the use the appwrite service in this way we can use this outer method to relocate our backend service just ut code in this wrapper no matter what service you are yusing for your backend
  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );
      if (userAccount) {
        //call other method like login
        return this.login({ email, password });
      } else {
        return userAccount;
      }
    } catch (err) {
      throw err;
    }
  }

  async login({ email, password }) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (err) {
      throw err;
    }
  }

  //noe gotta check if login or not when home opens
  //create a method to get user current
  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (err) {
      console.log("appwrite current user err", err);
    }
    return null;
  }

  //now create logout using delete current session

  async logout() {
    try {
      await this.account.deleteSessions();
    } catch (err) {
      console.log("appwrite logout user err", err);
    }
  }
  //  this is just a dummy method created and no such function or feature exist in appwrite, since it does not provite client side user deletion
  async deleteAccount() {}
}

// create an obj and export
const authService = new AuthService();
export default authService;
