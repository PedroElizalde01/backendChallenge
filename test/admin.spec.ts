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


const mockAdmin = {
    email : 'admin@gmail.com',
    name : 'Admin',
    password: "123123"
}

let mockAdminToken:string =''


describe("POST /user/login", () => {
    test("Logs in admin", async () => {
      const res = await request(app)
                          .post("/user/login")
                          .send({ email:mockAdmin.email, password:mockAdmin.password })
      
      expect(res.status).toEqual(200);
      mockAdminToken = res.body
      const userToken = await decodeToken(res.body)
      expect(userToken).toMatchObject(
        {
            id: expect.any(String),
            role: UserRole.ADMIN,
            iat: expect.any(Number)
        })
    });
});

describe("GET /admin/stats",() => {
    test('Get stats from users (name, email, mailsSentToday)', async () => {
        const res = await request(app)
                            .get("/admin/stats")
                            .set("Authorization", 'Bearer ' + mockAdminToken)
        expect(res.status).toEqual(200)
        console.log(res.body)
        //{name:expect.any(String), email:expect.any(String), mailsSentToday:expect.any(Number)}
    })
})

describe("GET /admin/all", () => {
    test("Get all users registered as admin ", async () => {
        const res = await request(app)
                          .get("/admin/all")
                          .set("Authorization", 'Bearer ' + mockAdminToken);
        expect(res.status).toEqual(200);
    });
});