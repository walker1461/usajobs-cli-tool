import 'dotenv/config';
import { type Flags, type Job, type JobsItem, type JobSearchResult, mapJobsItemToJobs } from './types';

function parseFlags(args:string[]):Flags {
  const flags:Flags = {};

  console.log(args);

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (!arg?.startsWith('-')) continue;

    const key = arg.replace(/^--?/, '');
    const value = args[i + 1];

    if (!value || value.startsWith('-')) {
      throw new Error(`missing value for ${key}`);
    }

    if (key == 'r') flags.radius = value;
    if (key == 'radius') flags.radius = value;
    if (key == 'k') flags.keyword = value;
    if (key == 'keyword') flags.keyword = value;
    if (key == 'l') flags.location = value;
    if (key == 'location') flags.location = value;

    i++;
  }
  return flags;
}

async function fetchJobs(keyword: string, location: string, radius: string): Promise<Job[]> {
  const params = new URLSearchParams({
    Keyword: keyword,
    LocationName: location,
    ResultsPerPage: '50',
    Radius: radius
  });

  console.log(params.toString());

  const res: Response = await fetch(
    `https://data.usajobs.gov/api/Search?${params.toString()}`,
    {
      headers: {
        'Authorization-Key': process.env.USAJOBS_API_KEY!,
        'User-Agent': process.env.USAJOBS_EMAIL!,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`error: ${res.status}`);
  }
  
  const data : JobSearchResult = await res.json();
  const items : JobsItem[] = data.SearchResult?.SearchResultItems ?? [];
  const jobs : Job[] = items.map(mapJobsItemToJobs);

  return jobs;
}

//* main function rewrite
async function main() : Promise<void> {
  const flags = parseFlags(process.argv.slice(2));

  if (!flags.radius) flags.radius = "50";
  if (!flags.keyword) flags.keyword = "Manager";
  if (!flags.location) flags.location = "Charlotte, NC";
  if (!flags.keyword || !flags.location || !flags.radius) {
    console.error(`Usage: node fetch.js --keyword <keyword> --location "<city, state>" or <ZIP>`);
    process.exit(1);
  }

  try {
    const jobs = await fetchJobs(flags.keyword, flags.location, flags.radius);
    console.log(`found ${jobs.length} job(s)`);
    if (jobs.length > 0) {
      for (const job of jobs) {
        console.log(job.title);
      }
    }
  } catch (err) {
    console.error('error:', err)
  }
}

main();