const admin = require("firebase-admin");

async function getInitialData(executeData) {
  const { userId, jobId } = executeData.initialData;
  console.log(`User ID: ${userId}, Job ID: ${jobId}`);

  // Fetch user data
  const userData = await fetchUserData(userId);

  // Fetch specific job data
  const jobData = await fetchSpecificJob(jobId);

  // Combine the results
  const combinedResults = {
    jobId,
    userId,
    jobData,
    userData,
  };

  return combinedResults;
}

async function fetchUserData(userId) {
  const fetchCollectionByUserId = async (collectionName, userId) => {
    const snapshot = await admin
      .firestore()
      .collection(collectionName)
      .where("userId", "==", userId)
      .get();

    const filteredDocs = snapshot.docs
      .map((doc) => {
        const data = doc.data();
        return { docId: doc.id, ...data };
      })
      .filter((data) => !data.deleted);

    return filteredDocs;
  };

  // Fetch data from multiple collections
  const [experiences, jobs, certs, educations, skills, activities, updates] =
    await Promise.all([
      fetchCollectionByUserId("experiences", userId),
      fetchCollectionByUserId("jobs", userId),
      fetchCollectionByUserId("certs", userId),
      fetchCollectionByUserId("educations", userId),
      fetchCollectionByUserId("skills", userId),
      fetchCollectionByUserId("activities", userId),
      fetchCollectionByUserId("updates", userId),
    ]);

  return {
    experiences,
    jobs,
    certs,
    educations,
    skills,
    activities,
    updates,
  };
}

async function fetchSpecificJob(jobId) {
  const specificJobDoc = await admin
    .firestore()
    .collection("allJobs")
    .doc(jobId)
    .get();

  return specificJobDoc.exists ? specificJobDoc.data() : null;
}

exports.getInitialData = getInitialData;
