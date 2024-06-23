const admin = require("firebase-admin");

async function getInitialData(executeData) {
  const { userId, jobId } = executeData.initialData;
  console.log(`User ID: ${userId}, Job ID: ${jobId}`);

  try {
    // Fetch user data
    const userData = await fetchUserData(userId);

    // Fetch specific job data
    const jobData = await fetchSpecificJob(jobId);

    executeData.experiences = userData.experiences;
    executeData.jobs = userData.jobs;
    executeData.activities = userData.activities;
    executeData.educations = userData.educations;
    executeData.skills = userData.skills;
    executeData.certifications = userData.certifications;
    executeData.updates = userData.updates;
    executeData.jobData = jobData;

    return true;
  } catch (error) {
    console.error("Error fetching initial data:", error);
    return false;
  }
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
  const [
    experiences,
    jobs,
    certifications,
    educations,
    skills,
    activities,
    updates,
  ] = await Promise.all([
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
    certifications,
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
