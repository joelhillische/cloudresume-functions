const admin = require("firebase-admin");

async function getInitialData(executeData) {
  const { userId, jobId } = executeData.initialData;
  console.log(`User ID: ${userId}, Job ID: ${jobId}`);

  try {
    // Fetch user data
    const userData = await fetchUserData(userId);

    // Fetch specific job data
    const jobData = await fetchSpecificJob(jobId);

    executeData.jobs = userData.jobs || [];
    executeData.experiences = userData.experiences || [];
    executeData.activities = userData.activities || [];
    executeData.educations = userData.educations || [];
    executeData.skills = userData.skills || [];
    executeData.certifications = userData.certifications || [];
    executeData.updates = userData.updates || [];
    executeData.jobData = jobData || {};

    return true;
  } catch (error) {
    console.error("Error fetching initial data:", error);
    return false;
  }
}

async function fetchUserData(userId) {
  const [experiences, certifications, educations, skills, activities, updates] =
    await Promise.all([
      fetchExperiences(userId),
      fetchCertifications(userId),
      fetchEducations(userId),
      fetchSkills(userId),
      fetchActivities(userId),
      fetchUpdates(userId),
    ]);

  return {
    experiences,
    certifications,
    educations,
    skills,
    activities,
    updates,
  };
}

async function fetchExperiences(userId) {
  const snapshot = await admin
    .firestore()
    .collection("experiences")
    .where("userId", "==", userId)
    .get();

  const experiences = snapshot.docs
    .map((doc) => {
      const data = doc.data();
      return data.deleted
        ? null
        : { id: doc.id, description: data.description };
    })
    .filter((experience) => experience && experience.description);

  return experiences;
}

async function fetchCertifications(userId) {
  const snapshot = await admin
    .firestore()
    .collection("certs")
    .where("userId", "==", userId)
    .get();

  const certifications = snapshot.docs
    .map((doc) => {
      const { expirationDate, issueDate, issuingOrganization, name, deleted } =
        doc.data();
      if (deleted) {
        return null;
      }
      return {
        id: doc.id,
        expirationDate,
        issueDate,
        issuingOrganization,
        name,
      };
    })
    .filter(
      (cert) =>
        cert !== null &&
        Object.values(cert).every((field) => field !== undefined)
    );

  return certifications;
}

async function fetchEducations(userId) {
  const snapshot = await admin
    .firestore()
    .collection("educations")
    .where("userId", "==", userId)
    .get();

  const educations = snapshot.docs
    .map((doc) => {
      const { degree, graduationYear, institution, deleted } = doc.data();
      return deleted
        ? null
        : { id: doc.id, degree, graduationYear, institution };
    })
    .filter((edu) => edu !== null);

  return educations;
}

async function fetchSkills(userId) {
  const snapshot = await admin
    .firestore()
    .collection("skills")
    .where("userId", "==", userId)
    .get();

  const skills = snapshot.docs
    .map((doc) => {
      const data = doc.data();
      return data.deleted ? null : { id: doc.id, skill: data.skill };
    })
    .filter((data) => data && data.skill);

  return skills;
}

async function fetchActivities(userId) {
  const snapshot = await admin
    .firestore()
    .collection("activities")
    .where("userId", "==", userId)
    .get();

  const activities = snapshot.docs
    .map((doc) => {
      const data = doc.data();
      return data.deleted
        ? null
        : { id: doc.id, description: data.description };
    })
    .filter((data) => data && data.description);

  return activities;
}

async function fetchUpdates(userId) {
  const snapshot = await admin
    .firestore()
    .collection("updates")
    .where("userId", "==", userId)
    .get();

  const updates = snapshot.docs
    .map((doc) => {
      const data = doc.data();
      return data.deleted ? null : { id: doc.id, text: data.text };
    })
    .filter((update) => update && update.text);

  return updates;
}

async function fetchSpecificJob(jobId) {
  const specificJobDoc = await admin
    .firestore()
    .collection("allJobs")
    .doc(jobId)
    .get();

  if (specificJobDoc.exists) {
    const { skills, title, description } = specificJobDoc.data();
    return { id: specificJobDoc.id, skills, title, description };
  }
  return null;
}

exports.getInitialData = getInitialData;
