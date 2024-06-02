const { executeSteps } = require("../executeSteps");

describe("executeSteps", () => {
  test("should execute all steps successfully with real Firestore data", async () => {
    // Arrange: Prepare your test data
    const mockData = {
      numberOfPages: 5,
      obfuscateId: "obfuscateId1",
      documentTypes: ["pdf", "doc"],
      jobId: "jobId1",
      userId: "userId1",
    };

    // Act: Call the function under test
    const result = await executeSteps(mockData);

    // Assert: Verify the function behaves as expected
    expect(result.status).toBe("All steps complete");
    expect(result.result).toBeDefined();
  });
});
