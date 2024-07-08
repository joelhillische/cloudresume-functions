const { executeSteps } = require("../executeSteps");

describe("executeSteps", () => {
  test("should execute all steps successfully with real Firestore data", async () => {
    // Arrange: Prepare your test data
    const userId = "Rs6X53VQEL8JjRLCaxcy";
    const jobId = "2KY1wbFT6DlAO0iWBnY5";
    const docId = "Ap7i8fyM8QPt5N4Pff9N";

    const mockData = {
      numberOfPages: 5,
      obfuscateId: "obfuscateId1",
      documentTypes: ["docx"],
      jobId: jobId,
      userId: userId,
      docId: docId,
      templateId: "lijXG0Q0dIrWvzlGqbZI",
      outputLocation: `docs/generated/${docId}`,
    };

    // Act: Call the function under test
    const result = await executeSteps(mockData);

    // Assert: Verify the function behaves as expected
    expect(result.status).toBe("All steps complete");
  });
});
