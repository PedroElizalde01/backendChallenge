import request from "supertest";
import { decodeToken } from "../src/utils/jwt";
import { UserRole } from "../src/models/entities/user.entity";
import { createTestServer } from "../src/utils/test.server";
import http from 'http';

// const casual = require('casual');
let app: http.Server;

beforeAll(() => {
  app = createTestServer();
});

afterAll((done) => {
  app.close(done);
});

const mockUser = {
    email : 'user@gmail.com',
    name : 'User',
    password: "123123"
}

let mockToken:string =''

describe("POST /user/login", () => {
    test("Logs in admin", async () => {
      const res = await request(app)
                          .post("/user/login")
                          .send({ email: mockUser.email, password: mockUser.password })
      
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
});

describe("POST /mail/send", () => {
    test("Send mail from mockUser to another ", async () => {
      const res = await request(app)
                          .post("/mail/send")
                          .set("Authorization", 'Bearer ' + mockToken)
                          .send({
                            to:'e53112643@gmail.com',
                            subject:'TEST Subject4',
                            body:'TEST mail body4'
                          })
      expect(res.status).toEqual(201);
      // expect(res.body).toMatchObject( SHOULD BE AN ARRAY
      //   {
      //       id: expect.any(String),
      //       fromId: expect.any(String),
      //       to: expect.any(String),
      //       subject: expect.any(String),
      //       body: expect.any(String),
      //       createdAt: expect.any(String),
      //       updatedAt: expect.any(String),
      //       deleteAt: null
      //   })
    });
});

describe("GET /mail/received", () => {
    test("Get received mails from mockUser", async () => {
      const res = await request(app)
                          .get("/mail/received")
                          .set("Authorization", 'Bearer ' + mockToken)
      expect(res.status).toEqual(200);
    //   console.log(res.body) SHOULD BE AN ARRAY
    //   expect(res.body).toMatchObject(
    //     {
    //         id: expect.any(String),
    //         fromId: expect.any(String),
    //         to: expect.any(String),
    //         subject: expect.any(String),
    //         body: expect.any(String),
    //         createdAt: expect.any(String),
    //         updatedAt: expect.any(String),
    //         deleteAt: null
    //     })
    });
});

describe("GET /mail/sent", () => {
    test("Get sent mails from mockUser ", async () => {
      const res = await request(app)
                          .get("/mail/sent")
                          .set("Authorization", 'Bearer ' + mockToken)
      expect(res.status).toEqual(200);
    //   console.log(res.body)
      // expect(res.body).toMatchObject([
      //   {
      //       id: expect.any(String),
      //       from: expect.any(Object),
      //       to: expect.any(String),
      //       subject: expect.any(String),
      //       body: expect.any(String)
      //   }
      // ]
    //   expect(res.body).toMatchObject(
    //     {
    //         id: expect.any(String),
    //         fromId: expect.any(String),
    //         to: expect.any(String),
    //         subject: expect.any(String),
    //         body: expect.any(String),
    //         createdAt: expect.any(String),
    //         updatedAt: expect.any(String),
    //         deleteAt: null
    //     })
      // )
    });
});