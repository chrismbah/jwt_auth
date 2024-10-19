import { app } from "..";
import supertest from "supertest";

test("GET /", (done) => {
  supertest(app).get("/").expect(200).end(done);
}, 10000); // Set the timeout to 10 seconds
