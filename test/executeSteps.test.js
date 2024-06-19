const { executeSteps } = require("../executeSteps");

const { db } = require("./firestoreSetup");

describe("executeSteps", () => {
  test("should execute all steps successfully with real Firestore data", async () => {
    // Arrange: Prepare your test data
    const mockData = {
      numberOfPages: 5,
      obfuscateId: "obfuscateId1",
      documentTypes: ["pdf", "docx", "txt"],
      jobId: "2KY1wbFT6DlAO0iWBnY5",
      userId: "Rs6X53VQEL8JjRLCaxcy",
      docId: "Ap7i8fyM8QPt5N4Pff9N",
    };

    // Act: Call the function under test
    const result = await executeSteps(mockData);

    const docRef = await db
      .collection("generateResumes")
      .doc("Ap7i8fyM8QPt5N4Pff9N")
      .get();

    const data = docRef.data();

    expect(data.pdfUrl).toBeDefined();
    expect(data.txtUrl).toBeDefined();
    expect(data.docxUrl).toBeDefined();

    // Assert: Verify the function behaves as expected
    expect(result.status).toBe("All steps complete");
  });
});
