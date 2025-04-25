import * as cheerio from "cheerio";
import { WebflowClient } from "webflow-api";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Configuration
const COLLECTION_ID = process.env.WEBFLOW_COLLECTION_ID || "6759f13cf5a3cb939909a780";
const CMS_LOCALE_ID = process.env.WEBFLOW_CMS_LOCALE_ID || "6759f13adb2adfac650b7ee0";

// Log environment setup for debugging
console.log(`Using Collection ID: ${COLLECTION_ID}`);
console.log(`Using CMS Locale ID: ${CMS_LOCALE_ID}`);
console.log(`API Key present: ${!!process.env.WEBFLOW_API_KEY}`);

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

/**
 * Fetch all published/live jobs from Webflow
 * @returns {Promise<Object>} The response containing live items
 */
async function getLiveOpenings() {
  return await client.collections.items.listItemsLive(COLLECTION_ID);
}

/**
 * Fetch ALL jobs from Webflow including drafts and archived
 * Fetches ALL jobs, even the ones not published/live
 * @returns {Promise<Array>} All items in the collection
 */
async function getAllOpenings() {
  try {
    // For webflow-api v3+, we need to use listItems which gets all items (draft, archived, etc.)
    const allItems = await client.collections.items.listItems({
      collectionId: COLLECTION_ID
    });
    return allItems;
  } catch (error) {
    console.error("Error fetching all openings:", error);
    // If the above fails (older API version or other issues), fallback to listItemsLive
    console.log("Falling back to listItemsLive");
    return await getLiveOpenings();
  }
}

/**
 * Match jobs from Breezy to Webflow items, handle existing slugs
 * @param {Array} jobs - Jobs scraped from Breezy
 * @param {Array} liveOpenings - Live openings from Webflow
 * @param {Array} allOpenings - All openings from Webflow (including archived/draft)
 * @returns {Object} Object containing new jobs, jobs to update, and jobs to remove
 */
function matchJobsToOpenings(jobs, liveOpenings, allOpenings) {
  const liveItems = liveOpenings?.items || [];
  const allItems = allOpenings?.items || [];

  // Log what we're working with for debugging
  console.log(`Matching ${jobs.length} Breezy jobs with ${allItems.length} Webflow items (${liveItems.length} live)`);
  
  // For each job from Breezy, determine if it's new or needs to be updated
  const newJobs = [];
  const jobsToUpdate = [];
  const existingSlugs = new Set(allItems.map(item => item.fieldData?.slug).filter(Boolean));

  // Debug: Print all existing slugs
  console.log("Existing slugs in Webflow:", [...existingSlugs]);

  jobs.forEach(job => {
    if (!job.slug) {
      console.log(`Warning: Job "${job.title}" has no slug, skipping`);
      return;
    }

    // Check if this job exists in any form (live, draft, archived) by slug
    const existingItem = allItems.find(item => 
      item.fieldData?.slug === job.slug || 
      item.fieldData?.name === job.title // Fallback to matching by name
    );
    
    if (existingItem || existingSlugs.has(job.slug)) {
      // Job exists in some form, needs update
      console.log(`Job "${job.title}" (${job.slug}) exists, will update`);
      jobsToUpdate.push({
        job,
        existingItem: existingItem || allItems.find(item => item.fieldData?.name === job.title) // Fallback to finding by name
      });
    } else {
      // Truly new job, doesn't exist at all
      console.log(`Job "${job.title}" (${job.slug}) is new, will create`);
      newJobs.push(job);
    }
  });

  // Find jobs in live Webflow that aren't in Breezy anymore (to be removed)
  const jobsToRemove = liveItems.filter(
    (opening) => !jobs.some((job) => job.slug === opening.fieldData?.slug)
  );

  console.log(`Results: ${newJobs.length} new jobs, ${jobsToUpdate.length} updates, ${jobsToRemove.length} removals`);
  return { newJobs, jobsToUpdate, jobsToRemove };
}

/**
 * Format job for Webflow creation
 * @param {Object} job - Job from Breezy
 * @returns {Object} Formatted job for Webflow creation
 */
function formatJobForWebflow(job) {
  return {
    id: job.slug,
    cmsLocaleId: CMS_LOCALE_ID,
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

/**
 * Add new jobs to Webflow
 * @param {Array} jobs - New jobs to add
 * @returns {Promise<Object>} Result of the creation operation
 */
async function addJobsToWebflow(jobs) {
  if (jobs.length === 0) return { items: [] };
  
  // Handle each job creation individually to prevent batch failures
  const results = [];
  const failed = [];
  
  // Process each job creation attempt one at a time
  for (const job of jobs) {
    try {
      console.log(`Attempting to create job: ${job.title} (${job.slug})`);
      
      // Make sure the slug is unique by appending a timestamp if needed
      const formattedJob = formatJobForWebflow(job);
      
      const result = await client.collections.items.createItemLive(
        COLLECTION_ID,
        {
          items: [formattedJob],
        }
      );
      
      console.log(`Successfully created job: ${job.title}`);
      results.push(...(result.items || []));
    } catch (error) {
      console.error(`Failed to create job ${job.title} (${job.slug}):`, error.message || error);
      
      // Check if it's a duplicate slug error
      if (error.statusCode === 400 && error.body?.details?.some(d => d.param === 'slug')) {
        console.log(`Slug already exists for ${job.title}, will skip this job`);
        // Add to failed jobs
        failed.push({
          job,
          error: error.message || String(error)
        });
      } else {
        // Rethrow other errors
        throw error;
      }
    }
  }
  
  return { 
    items: results,
    failed: failed
  };
}

/**
 * Format job for deletion
 * @param {Object} job - Job to delete
 * @returns {Object} Formatted job for deletion
 */
function formatJobForDelete(job) {
  return {
    itemId: job.id,
  };
}

/**
 * Remove jobs from Webflow
 * @param {Array} jobs - Jobs to remove
 * @returns {Promise<Array>} Results of the deletion operations
 */
async function removeJobsFromWebflow(jobs) {
  const itemsToDelete = jobs.map(formatJobForDelete);
  console.log("Items to delete:", itemsToDelete);

  if (itemsToDelete.length === 0) return { items: [] };

  try {
    const items = itemsToDelete.map((item) => {
      return client.collections.items.deleteItemLive(
        COLLECTION_ID,
        item.itemId
      );
    });

    console.log("Items:", items);

    const result = await Promise.all(items);
    console.log("Result:", result);
    return result;
  } catch (error) {
    console.error("Error removing jobs:", error);
    return error;
  }
}

/**
 * Update existing jobs in Webflow
 * @param {Array} jobsToUpdate - Jobs that need updating
 * @returns {Promise<Array>} Results of the update operations
 */
async function updateJobsInWebflow(jobsToUpdate) {
  if (jobsToUpdate.length === 0) return { items: [] };

  try {
    const updatePromises = jobsToUpdate.map(({ job, existingItem }) => {
      // Format job data for update
      const jobData = formatJobForWebflow(job);
      
      // Use the appropriate endpoint based on API capabilities
      // First try updateItemLive, fall back to patchItem if that fails
      return client.collections.items.updateItemLive(
        COLLECTION_ID,
        existingItem.id,
        {
          cmsLocaleId: CMS_LOCALE_ID,
          fieldData: jobData.fieldData
        }
      ).catch(error => {
        console.log(`Error with updateItemLive for ${existingItem.id}, trying patchItem:`, error);
        // Try patch as a fallback (some API versions use this instead)
        return client.collections.items.patchItem({
          collectionId: COLLECTION_ID,
          itemId: existingItem.id,
          fieldData: jobData.fieldData
        });
      });
    });

    const results = await Promise.all(updatePromises);
    console.log("Update results:", results);
    return { items: results };
  } catch (error) {
    console.error("Error updating jobs:", error);
    return { items: [] };
  }
}

/**
 * Execute and log results
 * @returns {Promise<Object>} Result of the sync operation
 */
async function main() {
  try {
    // Fetch both jobs from Breezy and all openings from Webflow (including archived/draft)
    const [jobs, liveOpenings, allOpenings] = await Promise.all([
      scrapeJobs(),
      getLiveOpenings(),
      getAllOpenings()
    ]);

    // Get jobs to add, update, and remove
    const { newJobs, jobsToUpdate, jobsToRemove } = matchJobsToOpenings(
      jobs, 
      liveOpenings, 
      allOpenings
    );
    
    console.log("New jobs:", newJobs);
    console.log("Jobs to update:", jobsToUpdate.map(j => j.job.title));
    console.log("Jobs to remove:", jobsToRemove);

    let addedJobsOutput = [];
    let updatedJobsOutput = [];
    let removedJobsOutput = [];

    // Add new jobs
    if (newJobs.length > 0) {
      const addedJobs = await addJobsToWebflow(newJobs);
      console.log("Added jobs:", addedJobs);
      console.log("Failed to add jobs:", addedJobs.failed || []);
      addedJobsOutput = addedJobs.items || [];
    }

    // Update existing jobs
    if (jobsToUpdate.length > 0) {
      const updatedJobs = await updateJobsInWebflow(jobsToUpdate);
      console.log("Updated jobs:", updatedJobs);
      updatedJobsOutput = updatedJobs.items || [];
    }

    // Remove jobs that no longer exist
    if (jobsToRemove.length > 0) {
      const removedJobs = await removeJobsFromWebflow(jobsToRemove);
      console.log("Removed jobs:", removedJobs);
      removedJobsOutput = removedJobs.items || [];
    }

    return {
      status: 200,
      message: "Sync successful",
      body: {
        newJobs,
        jobsToUpdate: jobsToUpdate.map(j => j.job),
        jobsToRemove,
        addedJobsOutput,
        updatedJobsOutput,
        removedJobsOutput,
      },
    };
  } catch (error) {
    console.error("Error scraping jobs:", error);
    return {
      status: 500,
      message: "Sync failed",
      error: error.message || String(error),
      stack: error.stack,
    };
  }
}

/**
 * API route handler for Next.js
 * @param {Request} request - Incoming request
 * @returns {Response} API response
 */
export async function GET(request) {
  const resp = await main();

  console.log("Response:", resp);

  const response = new Response(JSON.stringify(resp), {
    headers: { "Content-Type": "application/json" },
  });

  response.headers.set("Cache-Control", "public, s-maxage=600");
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");

  return response;
}

/**
 * API route handler for Next.js
 * @param {Request} request - Incoming request
 * @returns {Response} API response
 */
export async function GET(request) {
  const resp = await main();

  console.log("Response:", resp);

  const response = new Response(JSON.stringify(resp), {
    headers: { "Content-Type": "application/json" },
  });

  response.headers.set("Cache-Control", "public, s-maxage=600");
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");

  return response;
}
