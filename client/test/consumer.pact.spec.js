const axios = require("axios");
const { Pact } = require("@pact-foundation/pact");
const path = require("path");

describe("API Pact tests for UserService", () => {
  const mockProvider = new Pact({
    consumer: "UserClient",
    provider: "UserService",
    port: 3001, // Port on which the mock server will run
    log: path.resolve(process.cwd(), "logs", "pact.log"),
    dir: path.resolve(process.cwd(), "pacts"),
    logLevel: "INFO",
  });

  // Setup the Pact interactions before tests
  beforeAll(() => mockProvider.setup());

  // 1. Test for POST /api/users/ - adding a user
  describe("adding a user", () => {
    it("should successfully add user Dexter Mathews", async () => {
      // Arrange
      const requestPayload = {
        name: "Dexter Mathews",
        email: "pupo@mailinator.com",
        age: "70",
        gender: "m",
      };

      const expectedResponse = {
        success: true,
        msg: "Successfully added!",
        result: {
          _id: "66fc4447f489a1cdefb38dc6",
          name: "Dexter Mathews",
          email: "pupo@mailinator.com",
          age: 70,
          gender: "m",
        },
      };

      // Setup the Pact interaction for POST /api/users/
      await mockProvider.addInteraction({
        state: "the user Dexter Mathews can be added",
        uponReceiving: "a request to add a user",
        withRequest: {
          method: "POST",
          path: "/api/users/",
          headers: {
            "Content-Type": "application/json",
          },
          body: requestPayload,
        },
        willRespondWith: {
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: expectedResponse,
        },
      });

      // Act
      const response = await axios.post(
        `${mockProvider.mockService.baseUrl}/api/users/`,
        requestPayload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Assert - did we get the expected response
      expect(response.status).toBe(200);
      expect(response.data).toStrictEqual(expectedResponse);
    });
  });

  // 2. Test for GET /api/users/ - retrieving users
  describe("retrieving users", () => {
    it("should return a list of users", async () => {
      // Arrange
      const expectedResponse = [
        {
          _id: "66fc319741a1a541c92bc2e2",
          name: "Salvador Rowland",
          email: "mydawol@mailinator.com",
          age: 10,
          gender: "f",
          __v: 0,
        },
        {
          _id: "66fc329f41a1a541c92bc2f2",
          name: "Ariana Roach",
          email: "rules@mailinator.com",
          age: 50,
          gender: "m",
          __v: 0,
        },
        {
          _id: "66fc32cb41a1a541c92bc2f6",
          name: "Reece Santos",
          email: "wekuqyjuw@mailinator.com",
          age: 31,
          gender: "f",
          __v: 0,
        },
      ];

      // Setup the Pact interaction for GET /api/users/
      await mockProvider.addInteraction({
        state: "a list of users exists",
        uponReceiving: "a request for retrieving users",
        withRequest: {
          method: "GET",
          path: "/api/users/",
          headers: {
            Accept: "application/json",
          },
        },
        willRespondWith: {
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: expectedResponse,
        },
      });

      // Act
      const response = await axios.get(
        `${mockProvider.mockService.baseUrl}/api/users/`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      // Assert - did we get the expected response
      expect(response.status).toBe(200);
      expect(response.data).toStrictEqual(expectedResponse);
    });
  });

  // 3. Test for DELETE /api/users/:id - deleting a user
  describe("deleting a user", () => {
    it("should successfully delete user Dexter Mathews", async () => {
      // Arrange
      const expectedResponse = {
        success: true,
        msg: "It has been deleted.",
        result: {
          _id: "66fc4447f489a1cdefb38dc6",
          name: "Dexter Mathews",
          email: "pupo@mailinator.com",
          age: 70,
          gender: "m",
        },
      };

      // Setup the Pact interaction for DELETE /api/users/66fc4447f489a1cdefb38dc6
      await mockProvider.addInteraction({
        state: "the user Dexter Mathews exists and can be deleted",
        uponReceiving: "a request to delete a user",
        withRequest: {
          method: "DELETE",
          path: "/api/users/66fc4447f489a1cdefb38dc6",
          headers: {
            Accept: "application/json",
          },
        },
        willRespondWith: {
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: expectedResponse,
        },
      });

      // Act
      const response = await axios.delete(
        `${mockProvider.mockService.baseUrl}/api/users/66fc4447f489a1cdefb38dc6`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      // Assert - did we get the expected response
      expect(response.status).toBe(200);
      expect(response.data).toStrictEqual(expectedResponse);
    });
  });

  // 4. Test for GET /api/users/:id - retrieving user
  describe("retrieving user", () => {
    it("should return a user", async () => {
      // Arrange
      const expectedResponse = {
        _id: "66fc339741a1a541c92bc2fb",
        name: "Anne Bryan",
        email: "morezodoc@mailinator.com",
        age: 78,
        gender: "f",
        __v: 0,
      };

      // Setup the Pact interaction for GET /api/users/:id
      await mockProvider.addInteraction({
        state: "a user exists",
        uponReceiving: "a request for retrieving user",
        withRequest: {
          method: "GET",
          path: "/api/users/66fc339741a1a541c92bc2fb",
          headers: {
            Accept: "application/json",
          },
        },
        willRespondWith: {
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: expectedResponse,
        },
      });

      // Act
      const response = await axios.get(
        `${mockProvider.mockService.baseUrl}/api/users/66fc339741a1a541c92bc2fb`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      // Assert - did we get the expected response
      expect(response.status).toBe(200);
      expect(response.data).toStrictEqual(expectedResponse);
    });
  });

  // 5. Test for PUT /api/user/:id - update a user
  describe("update a user", () => {
    it("should successfully update user Anne Bryann", async () => {
      // Arrange
      const requestPayload = {
        name: "Anne Bryann",
        email: "morezodoc@mailinator.com",
        age: 78,
        gender: "f",
      };

      const expectedResponse = {
        success: true,
        msg: "Successfully updated!",
        result: {
          _id: "66fc339741a1a541c92bc2fb",
          name: "Anne Bryann",
          email: "morezodoc@mailinator.com",
          age: 78,
          gender: "f",
        },
      };

      // Setup the Pact interaction for POST /api/users/
      await mockProvider.addInteraction({
        state: "the user Anne Bryann can be updated",
        uponReceiving: "a request to update a user",
        withRequest: {
          method: "PUT",
          path: "/api/users/66fc339741a1a541c92bc2fb",
          headers: {
            "Content-Type": "application/json",
          },
          body: requestPayload,
        },
        willRespondWith: {
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: expectedResponse,
        },
      });

      // Act
      const response = await axios.put(
        `${mockProvider.mockService.baseUrl}/api/users/66fc339741a1a541c92bc2fb`,
        requestPayload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Assert - did we get the expected response
      expect(response.status).toBe(200);
      expect(response.data).toMatchObject(expectedResponse);
    });
  });

  // Verify interactions and finalize Pact after the tests
  afterEach(() => mockProvider.verify());
  afterAll(() => mockProvider.finalize());
});
