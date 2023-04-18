import request from "supertest";
import { comparePassword } from "../src/utils/bcrypt";
import { decodeToken } from "../src/utils/jwt";
import { UserRole } from "../src/models/entities/user.entity";
import { createTestServer } from "../src/utils/test.server";
import http from 'http';

let app: http.Server;

beforeAll(() => {
  app = createTestServer();
});

afterAll((done) => {
  app.close(done);
});

const casual = require('casual');

const mockUser = {
    email : casual.email,
    name : casual.name,
    password: "123123"
}

let mockToken:string = '';

describe("POST /user/register", () => {
    test("Register mockUser with random data", async () => {
      const res = await request(app)
                          .post("/user/register")
                          .send({email:mockUser.email, name:mockUser.name, password:mockUser.password})
      
      expect(res.status).toEqual(201);
      expect(res.body.email).toEqual(mockUser.email);
      expect(res.body.name).toEqual(mockUser.name);
      expect(await comparePassword(res.body.password, mockUser.password)).toEqual(true);    
    });

    test("Trying to register an user with no fields", async () => {
        const res = await request(app)
                            .post("/user/register")
        
        expect(res.status).toEqual(400);
        expect(res.body.message).toEqual("Missing fields");
    });

    test("Trying to register an user without name", async () => {
        const res = await request(app)
                            .post("/user/register")
                            .send({email:mockUser.email, password:mockUser.password})
        
        expect(res.status).toEqual(400);
        expect(res.body.message).toEqual("Missing fields");
    });

    test("Trying to register an user with registered email", async () => {
        const res = await request(app)
                            .post("/user/register")
                            .send({email:mockUser.email, name:mockUser.name, password:mockUser.password})
        
        expect(res.status).toEqual(400);
        expect(res.body.message).toEqual("Email already in use");
    });

});

describe("POST /user/login", () => {
    test("Logs in mockUser", async () => {
      const res = await request(app)
                          .post("/user/login")
                          .send({email:mockUser.email, password:mockUser.password})
      
      expect(res.status).toEqual(200);
      mockToken = res.body
      const userToken = await decodeToken(res.body)
      expect(userToken).toMatchObject(
        {
            id: expect.any(String),
            role: UserRole.USER,
            iat: expect.any(Number)
        })
    });

    test("Tries to log in mockUser with unregistered email", async () => {
        const res = await request(app)
                            .post("/user/login")
                            .send({email:'unregistered@gmail.com', password:"321321"})
        
        expect(res.status).toEqual(404);
        expect(res.body.message).toEqual("User not found");
    });

    test("Tries to log in mockUser with invalid email", async () => {
        const res = await request(app)
                            .post("/user/login")
                            .send({email:'siriusgmailcom', password:"123123"})
        
        expect(res.status).toEqual(404);
        expect(res.body.message).toEqual("User not found");
    });

    test("Tries to log in mockUser with missing password", async () => {
        const res = await request(app)
                            .post("/user/login")
                            .send({email:mockUser.email})
        
        expect(res.status).toEqual(400);
        expect(res.body.message).toEqual("Missing fields");
    });

    test("Tries to log in mockUser with wrong password", async () => {
        const res = await request(app)
                            .post("/user/login")
                            .send({email:mockUser.email, password:"321321"})
        
        expect(res.status).toEqual(403);
        expect(res.body.message).toEqual("Incorrect password");
    });

    test("Trying to log in an unregistered user", async () => {
        const res = await request(app)
                            .post("/user/login")
                            .send({email:'unregistered@gmail.com', password:'123123'})
        
        expect(res.status).toEqual(404);
        expect(res.body.message).toEqual("User not found");
      });
});

describe("GET /user/me", () => {
    test("Gets data from logged in mockUser", async () => {
        const res = await request(app)
                            .get("/user/me")
                            .set("Authorization", 'Bearer ' + mockToken);
        expect(res.status).toEqual(200);

        expect(res.body).toMatchObject(
          {
              id: expect.any(String),
              email: mockUser.email,
              name: mockUser.name,
              password: expect.any(String),
              role: UserRole.USER,
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
              deleteAt: null,
          }
        );
    });

    // test("Get me from unlogged in mockUser", async () => {
    //     const res = await request(app)
    //                         .get("/user/me")
    //                         .set("Authorization", 'Bearer ');

    //     expect(res.status).toEqual(403);
    // });
});

const editedMockUser = {
    name: casual.name,
    password: "321321"
}

describe("PUT /user/edit", () => {
    test("Edit data from loged in mockUser", async () => {
        const res = await request(app)
                            .put("/user/edit")
                            .set("Authorization", 'Bearer ' + mockToken)
                            .send({name: editedMockUser.name, password: editedMockUser.password});
        expect(res.status).toEqual(200);        
        expect(res.body.name).toBe(editedMockUser.name)
        expect(await comparePassword(res.body.password, editedMockUser.password)).toEqual(true);
    });
});