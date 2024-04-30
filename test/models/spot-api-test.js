import { EventEmitter } from "events";
import { assert } from "chai";
import { testSpot, spotsGroup, maggie, maggieCredentials } from "../fixtures.js";
import { spothopService } from "./spothop-service.js";
import { assertSubset } from "../test-utils.js";

EventEmitter.setMaxListeners(25);

suite("Spot API tests", () => {

  let user = null;

  setup(async () => {
    spothopService.clearAuth();
    user = await spothopService.createUser(maggie);
    await spothopService.authenticate(maggieCredentials);
    await spothopService.deleteAllSpots();
    await spothopService.deleteAllUsers();
    user = await spothopService.createUser(maggie);
    await spothopService.authenticate(maggieCredentials);
    testSpot.userid = user._id;
  });

  teardown(async () => {});

  test("create spot", async () => {
    const returnedSpot = await spothopService.createSpot(testSpot);
    assert.isNotNull(returnedSpot);
    assertSubset(testSpot, returnedSpot);
  });

  test("delete a spot", async () => {
    const spot = await spothopService.createSpot(testSpot);
    const response = await spothopService.deleteSpot(spot._id);
    assert.equal(response.status, 204);
    try {
      const returnedSpot = await spothopService.getSpot(spot.id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No Spot with this id", "Incorrect Response Message");
    }
  });

  test("create multiple spots", async () => {
    for (let i = 0; i < spotsGroup.length; i += 1) {
      spotsGroup[i].userid = user._id;
      await spothopService.createSpot(spotsGroup[i]);
    }
    let returnedLists = await spothopService.getAllSpots();
    assert.equal(returnedLists.length, spotsGroup.length);
    await spothopService.deleteAllSpots();
    returnedLists = await spothopService.getAllSpots();
    assert.equal(returnedLists.length, 0);
  });

  test("remove non-existant spot", async () => {
    try {
      await spothopService.deleteSpot("not an id");
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No Spot with this id", "Incorrect Response Message");
    }
  });
});