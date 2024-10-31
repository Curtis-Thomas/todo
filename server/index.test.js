import { expect } from "chai";
import { initializeTestDb } from "./helper/test.js";
import { hash } from "bcrypt";
import { pool } from "./helper/bd.js";
import pkg from "jsonwebtoken";
const { sign } = pkg;

const base_url = "http://localhost:3001/";

const insertTestUser = (email, password) => {
  // Validate input
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  // Hash the password
  hash(password, 10, (error, hashedPassword) => {
    if (error) return next(error); // Hash error

    // Insert into the database
    pool.query(
      "INSERT INTO account (email, password) VALUES ($1, $2) RETURNING *",
      [email, hashedPassword]
    );
  });
};

const getToken = (email) => {
  return sign({ user: email }, process.env.JWT_SECRET_KEY);
};

describe("GET Tasks", () => {
  before(() => {
    initializeTestDb();
  });
  it("should get all tasks", async () => {
    const response = await fetch(base_url);
    const data = await response.json();

    expect(response.status).to.equal(200);
    expect(data).to.be.an("array").that.is.not.empty;
    expect(data[0]).to.include.keys("id", "description");
  });
});

describe("POST task", () => {
  const email = "post@foo.com";
  const password = "post123";
  insertTestUser(email, password);
  const token = getToken(email);
  it("should post a task", async () => {
    const response = await fetch(base_url + "create", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },

      body: JSON.stringify({ description: "task" }),
    });
    const data = await response.json();
    expect(response.status).to.equal(200);
    expect(data).to.be.an("object");
    expect(data).to.include.keys("id");
  });

  it("should not post a task without description", async () => {
    const response = await fetch(base_url + "create", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ description: null }),
    });
    const data = await response.json();
    expect(response.status).to.equal(400);
    expect(data).to.be.an("object");
    expect(data).to.include.keys("error");
  });

  it("should not post a task with zero length description", async () => {
    const response = await fetch(base_url + "create", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ description: "" }),
    });
    const data = await response.json();
    expect(response.status).to.equal(400, data.error);
    expect(data).to.be.an("object");
    expect(data).to.include.keys("error");
  });
});

describe("DELETE task", () => {
  const email = "post@foo.com";
  const password = "post123";
  insertTestUser(email, password);
  const token = getToken(email);

  it("should delete a task", async () => {
    const response = await fetch(base_url + "delete/1", {
      method: "delete",
      headers: {
        Authorization: token,
      },
    });
    const data = await response.json();
    expect(response.status).to.equal(200);
    expect(data).to.be.an("object");
    expect(data).to.include.keys("id");
  });

  it("should not delete a task with SQL injection", async () => {
    const response = await fetch(base_url + "delete/id=0 or id >0", {
      method: "delete",
      headers: {
        Authorization: token,
      },
    });
    const data = await response.json();
    expect(response.status).to.equal(500);
    expect(data).to.be.an("object");
    expect(data).to.include.keys("error");
  });
});

describe("POST register", () => {
  const email = "register123@foo.com";
  const password = "register123";

  it("should register with valid email and password", async () => {
    // console.log("Sending request with payload:", { email, password });

    const response = await fetch(base_url + "user/register", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    // console.log("Response status:", response.status);
    // console.log("Response headers:", response.headers.get("content-type"));

    try {
      const jsonData = await response.json(); // Directly parse as JSON
      // console.log("Parsed JSON data:", jsonData);

      expect(response.status).to.equal(201);
      expect(jsonData).to.be.an("object").that.includes.keys("id", "email");
    } catch (e) {
      console.error(
        "Error parsing JSON. Response was not JSON or an error occurred:",
        await response.text()
      );
      throw e;
    }
  });

  it("should not post a user with less than 8 character password", async () => {
    const email = "register@foo.com";
    const password = "short1";
    const response = await fetch(base_url + "user/register", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    expect(response.status).to.equal(400, data.error);
    expect(data).to.be.an("object");
    expect(data).to.include.keys("error");
  });
});

describe("POST login", () => {
  const email = "login@foo.com";
  const password = "login123";

  insertTestUser(email, password);

  it("should login with valid credentials", async () => {
    const response = await fetch(base_url + "user/login", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });

    const data = await response.json();
    expect(response.status).to.equal(200, data.error);
    expect(data).to.be.an("object");
    expect(data).to.include.keys("id", "email", "token");
  });
});

export { initializeTestDb, insertTestUser, getToken };
