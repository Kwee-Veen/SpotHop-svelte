import { assert } from "chai";
import { spothopService } from "./spothop-service.js";
import { assertSubset } from "../test-utils.js";
import { maggie, testUsers, homerCredentials } from "../fixtures.js";

const users = new Array(testUsers.length);

suite("User API tests", () => {
  setup(async () => {
    spothopService.clearAuth();
    await spothopService.createUser(testUsers[0]);
    await spothopService.authenticate(homerCredentials);
    await spothopService.deleteAllUsers();
    for (let i = 0; i < testUsers.length; i += 1) {
      users[i] = await spothopService.createUser(testUsers[i]);
    }
    await spothopService.authenticate(homerCredentials);
  });
  teardown(async () => {
  });

  
  test("create a user", async () => {
    const newUser = await spothopService.createUser(maggie);
    assertSubset(maggie, newUser);
    assert.isDefined(newUser._id);
  });

  test("delete all users", async () => {
    let returnedUsers = await spothopService.getAllUsers();
    assert.equal(returnedUsers.length, 3);
    await spothopService.deleteAllUsers();
    await spothopService.createUser(testUsers[0]);
    await spothopService.authenticate(homerCredentials);
    returnedUsers = await spothopService.getAllUsers();
    assert.equal(returnedUsers.length, 1);
  });

  test("get a user - success", async () => {
    const returnedUser = await spothopService.getUser(users[0]._id);
    assert.deepEqual(users[0], returnedUser);
  });

  test("get a user - fail", async () => {
    try{
      const returnedUser = await spothopService.getUser("1234");
      assert.fail("Should not return a response"); 
    } catch (error) {
      assert(error.response.data.message === "No User with this id"); 
      assert.equal(error.response.data.statusCode, 404);
    }
  });

  test("get a user - deleted user", async () => {
    await spothopService.deleteAllUsers();
    await spothopService.createUser(testUsers[0]);
    await spothopService.authenticate(homerCredentials);
    try {
      await spothopService.getUser(testUsers[0]._id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No User with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });
});