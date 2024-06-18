const { executeSteps } = require("../executeSteps");

describe("executeSteps", () => {
  test("should execute all steps successfully with real Firestore data", async () => {
    // Arrange: Prepare your test data
    const mockData = {
      numberOfPages: 5,
      obfuscateId: "obfuscateId1",
      documentTypes: ["pdf", "doc"],
      jobId: "2KY1wbFT6DlAO0iWBnY5",
      userId: "Rs6X53VQEL8JjRLCaxcy",
    };

    // Act: Call the function under test
    const result = await executeSteps(mockData);

    // Assert: Verify the function behaves as expected
    expect(result.status).toBe("All steps complete");
  });
});
