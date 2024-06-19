function generatePrompts(jobDescription, experiences, updates, defaultJobId) {
  const validateJobId = (jobId) => {
    return typeof jobId === "string" && jobId.trim() !== "";
  };

  // Helper function to group items by jobId
  const groupByJobId = (items, jobIdKey) => {
    return items.reduce((acc, item) => {
      const jobId = validateJobId(item[jobIdKey])
        ? item[jobIdKey]
        : defaultJobId;
      if (jobId) {
        // Ensure jobId is valid and not undefined
        if (!acc[jobId]) {
          acc[jobId] = [];
        }
        acc[jobId].push({ docId: item.docId, description: item.description });
      }
      return acc;
    }, {});
  };

  // console.dir(experiences, { depth: null, colors: true });

  // Group experiences and updates by jobId
  const groupedExperiences = groupByJobId(experiences, "jobId");
  const groupedUpdates = groupByJobId(updates, "jobId");

  // Merge experiences and updates by jobId
  const groupedItems = { ...groupedExperiences };

  for (const jobId in groupedUpdates) {
    if (groupedItems[jobId]) {
      groupedItems[jobId] = groupedItems[jobId].concat(groupedUpdates[jobId]);
    } else {
      groupedItems[jobId] = groupedUpdates[jobId];
    }
  }

  console.log(jobDescription);

  // console.dir(groupedItems, { depth: null, colors: true });

  const prompt = `Rank the following experiences based on their relevance to the given job description and return a JSON with the jobId as the key and an array of docIds based on the rank.

  Include all jobIds

  Do not include comments

  Job Description:

  ${jobDescription}

  Jobs Hash:

  ${JSON.stringify(groupedItems, null, 2)}

  Return only the JSON response.`;

  console.log(prompt);

  return prompt;
}

module.exports = generatePrompts;
