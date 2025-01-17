import * as cheerio from "cheerio";
import { WebflowClient } from "webflow-api";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const client = new WebflowClient({ accessToken: process.env.WEBFLOW_API_KEY });

async function scrapeJobs() {
  const response = await fetch("https://zeno-power.breezy.hr/");
  const html = await response.text();

  const $ = cheerio.load(html);

  const jobs = [];

  $(".position").each((index, element) => {
    const title = $(element).find("h2").text().trim();
    const department = $(element).find(".department").text().trim();
    const location = $(element).find(".location").text().trim();
    const link = $(element).find("a").attr("href");
    const comp = $(element).find('[title="Salary"]').text().trim();
    const slug = link?.split("/").pop();

    // need to select inside the .type the span
    const type =
      $(element).find(".type").find("span").text().trim() ===
      "%LABEL_POSITION_TYPE_FULL_TIME%"
        ? "Full-Time"
        : $(element).find(".type").find("span").text().trim() ===
            "%LABEL_POSITION_TYPE_PART_TIME%"
          ? "Part-Time"
          : $(element).find(".type").find("span").text().trim() ===
              "%LABEL_POSITION_TYPE_CONTRACT%"
            ? "Contract"
            : "";

    jobs.push({
      title,
      department,
      location,
      link: link ? `https://zeno-power.breezy.hr${link}` : null,
      comp,
      slug: slug ? slug : null,
      type,
    });
  });

  return jobs;
}

async function getOpenings() {
  const openings = await client.collections.items.listItemsLive(
    "6759f13cf5a3cb939909a780"
  );

  return openings;
}

function matchJobsToOpenings(jobs, openings) {
  // Find jobs from Breezy that aren't in Webflow
  const newJobs = jobs.filter(
    (job) => !openings.some((opening) => opening.fieldData.slug === job.slug)
  );

  // Find jobs in Webflow that aren't in Breezy anymore
  const jobsToRemove = openings.filter(
    (opening) => !jobs.some((job) => job.slug === opening.fieldData.slug)
  );

  return { newJobs, jobsToRemove };
}

function formatJobForWebflow(job) {
  return {
    id: job.slug,
    cmsLocaleId: "6759f13adb2adfac650b7ee0",
    fieldData: {
      name: job.title,
      slug: job.slug,
      location: job.location,
      type: job.type,
      url: job.slug,
      comp: job.comp,
    },
  };
}

async function addJobsToWebflow(jobs) {
  return await client.collections.items.createItemLive(
    "6759f13cf5a3cb939909a780",
    {
      items: jobs.map(formatJobForWebflow),
    }
  );
}

function formatJobForDelete(job) {
  return {
    itemId: job.id,
  };
}

async function removeJobsFromWebflow(jobs) {
  const itemsToDelete = jobs.map(formatJobForDelete);

  const items = itemsToDelete.map((item) => {
    return client.collections.items.deleteItemLive(
      "6759f13cf5a3cb939909a780",
      item.itemId
    );
  });

  try {
    const result = await Promise.all(items);
    console.log("Result:", JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error("Error removing jobs:", error);
    return {
      message: error,
    };
  }
}

// Execute and log results
async function main() {
  try {
    const [jobs, { items: openings }] = await Promise.all([
      scrapeJobs(),
      getOpenings(),
    ]);

    // get new and to remove jobs
    const { newJobs, jobsToRemove } = matchJobsToOpenings(jobs, openings);
    console.log("New jobs:", JSON.stringify(newJobs, null, 2));
    console.log("Jobs to remove:", JSON.stringify(jobsToRemove, null, 2));

    let addedJobs = [];
    let removedJobs = [];

    // *  update openings
    if (newJobs.length > 0) {
      const addedJobs = await addJobsToWebflow(newJobs);
      console.log("Added jobs:", JSON.stringify(addedJobs, null, 2));
      addedJobs = addedJobs.items;
    }

    if (jobsToRemove.length > 0) {
      const removedJobs = await removeJobsFromWebflow(jobsToRemove);
      console.log("Removed jobs:", JSON.stringify(removedJobs, null, 2));
    }

    return {
      status: 200,
      message: "Sync successful",
      body: {
        newJobs,
        jobsToRemove,
        addedJobs,
        removedJobs,
      },
    };
  } catch (error) {
    console.error("Error scraping jobs:", error);
  }
}

export function GET(request) {
  const resp = main();

  return new Response(JSON.stringify(resp), {
    headers: { "Content-Type": "application/json" },
  });
}
