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

  let userId;

  beforeAll(() => mockProvider.setup());

  describe("User API flow", () => {
    it("should successfully add user Dexter Mathews", async () => {
      // Arrange
      const requestPayload = {
        name: "Dexter Mathews",
        email: "pupo@mailinator.com",
        age: "70",
        gender: "m",
      };

      const expectedResponse = {
        msg: "Successfully added!",
        result: {
          _id: expect.any(String),
          age: 70,
          email: "pupo@mailinator.com",
          gender: "m",
          name: "Dexter Mathews",
        },
        success: true,
      };

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

      const response = await axios.post(
        `${mockProvider.mockService.baseUrl}/api/users/`,
        requestPayload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      userId = response.data.result._id;

      expect(response.status).toBe(200);
      expect(response.data).toStrictEqual(expectedResponse);
    });

    it("should return a list of users", async () => {
      // Arrange
      const expectedResponse = [
        {
          _id: "66fc319741a1a541c92bc2e2",
          name: "Salvador Rowland",
          email: "mydawol@mailinator.com",
          age: 10,
          gender: "f",
        },
        {
          _id: "66fc329f41a1a541c92bc2f2",
          name: "Ariana Roach",
          email: "rules@mailinator.com",
          age: 50,
          gender: "m",
        },
        {
          _id: "66fc32cb41a1a541c92bc2f6",
          name: "Reece Santos",
          email: "wekuqyjuw@mailinator.com",
          age: 31,
          gender: "f",
        },
      ];

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

      const response = await axios.get(
        `${mockProvider.mockService.baseUrl}/api/users/`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      expect(response.status).toBe(200);
      expect(response.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            _id: expect.any(String),
            name: expect.any(String),
            email: expect.any(String),
            age: expect.any(Number),
            gender: expect.any(String),
          }),
        ])
      );
    });

    it("should successfully update user Dexter Mathews", async () => {
      const requestPayload = {
        name: "Dexter Mathews",
        age: 80,
        gender: "m",
      };

      const expectedResponse = {
        success: true,
        msg: "Successfully updated!",
        result: {
          _id: userId,
          ...requestPayload,
        },
      };

      await mockProvider.addInteraction({
        state: "the user Dexter Mathews can be updated",
        uponReceiving: "a request to update a user",
        withRequest: {
          method: "PUT",
          path: `/api/users/${userId}`,
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

      const response = await axios.put(
        `${mockProvider.mockService.baseUrl}/api/users/${userId}`,
        requestPayload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      expect(response.status).toBe(200);
      expect(response.data).toMatchObject(expectedResponse);
    });

    it("should return the updated user", async () => {
      const expectedResponse = {
        msg: "Successfully updated!",
        result: {
          _id: userId,
          age: 80,
          email: "pupo@mailinator.com",
          gender: "m",
          name: "Dexter Mathews",
        },
        success: true,
      };

      await mockProvider.addInteraction({
        state: "a user exists",
        uponReceiving: "a request for retrieving user",
        withRequest: {
          method: "GET",
          path: `/api/users/${userId}`,
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

      const response = await axios.get(
        `${mockProvider.mockService.baseUrl}/api/users/${userId}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      expect(response.status).toBe(200);
      expect(response.data).toStrictEqual(expectedResponse);
    });
    it("should successfully delete user Dexter Mathews", async () => {
      const expectedResponse = {
        success: true,
        msg: "It has been deleted.",
        result: {
          _id: userId,
          name: "Dexter Mathews",
          email: "pupo@mailinator.com",
          age: 80,
          gender: "m",
        },
      };

      await mockProvider.addInteraction({
        state: "the user Dexter Mathews exists and can be deleted",
        uponReceiving: "a request to delete a user",
        withRequest: {
          method: "DELETE",
          path: `/api/users/${userId}`,
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

      const response = await axios.delete(
        `${mockProvider.mockService.baseUrl}/api/users/${userId}`,
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      expect(response.status).toBe(200);
      expect(response.data).toStrictEqual(expectedResponse);
    });
  });

  afterEach(() => mockProvider.verify());
  afterAll(() => mockProvider.finalize());
});
