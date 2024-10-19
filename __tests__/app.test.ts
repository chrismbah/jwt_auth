import request from "supertest";

import { app } from "../src/index";

describe("Test app.ts", () => {
  test("Catch-all route", async () => {
    const res = await request(app).get("/");
    expect(res.body).toEqual({ name: "John Doe" });
  });
});
