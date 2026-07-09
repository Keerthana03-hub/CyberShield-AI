const { getKnowledgeBase } = require("./services/ragService");

async function test() {

    const knowledge = await getKnowledgeBase();

    console.log("Knowledge Base Loaded Successfully ✅");

    console.log("Total Characters:", knowledge.length);

}

test();