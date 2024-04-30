import { assert } from "chai";
import { spothopService } from "./spothop-service.js";
import { decodeToken } from "../../src/api/jwt-utils.js";
import { maggie, maggieCredentials } from "../fixtures.js";

suite("Authentication API tests", async () => {
  setup(async () => {
    spothopService.clearAuth();
    await spothopService.createUser(maggie);
    await spothopService.authenticate(maggieCredentials);
    await spothopService.deleteAllUsers();
  });

  test("authenticate", async () => {
    await spothopService.createUser(maggie);
    const response = await spothopService.authenticate(maggieCredentials);
    assert(response.success);
    assert.isDefined(response.token);
  });

  test("verify Token", async () => {
    const returnedUser = await spothopService.createUser(maggie);
    const response = await spothopService.authenticate(maggieCredentials);
    const userInfo = decodeToken(response.token);
    assert.equal(userInfo.email, returnedUser.email);
    assert.equal(userInfo.userId, returnedUser._id);
  });

  test("check Unauthorized", async () => {
    spothopService.clearAuth();
    try {
      await spothopService.deleteAllUsers();
      assert.fail("Route not protected");
    } catch (error) {
      assert.equal(error.response.data.statusCode, 401);
    }
  });
});