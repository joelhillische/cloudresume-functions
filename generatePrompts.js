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

  console.dir(experiences, { depth: null, colors: true });

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

  // Generate prompts for each jobId
  const generatedPrompts = Object.keys(groupedItems).map((jobId) => {
    const items = groupedItems[jobId].join(". ");
    const jsonOutput = JSON.stringify(
      {
        experiences: {
          "{{jobId}}": ["{{docId1}}", "{{docId2}}", "{{docId3}}"], // Replace {{docId1}}, {{docId2}}, {{docId3}} with actual document IDs
        },
      },
      null,
      2
    );
    return `Job Description:\n${jobDescription}\n\nList of Experiences and Updates for Job ID {{jobId}}:\n"${items}"\n\nRank these experiences and updates from most to least relevant for the job description provided. Return the rankings in paragraph format with reasons for each ranking. The output should look like the following:\n\nRank: 1\nText: <item text>\nReason: <reason>\nOutput this as a json\n\n${jsonOutput}`;
  });

  // Concatenate all generated prompts into a single paragraph and trim
  const prompts = generatedPrompts.join("\n\n").trim();

  return prompts;
}

module.exports = generatePrompts;
