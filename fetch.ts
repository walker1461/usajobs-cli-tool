import 'dotenv/config';
import { type Job, type JobsItem, type JobSearchResult, mapJobsItemToJobs } from './types';

const args = process.argv.slice(2);
if (!args[0] || !args[1]) {
  console.error('incorrect usage');
  process.exit(1);
}

let key:string;
let value:string;

if (args[0].startsWith('--')) {
  key = args[0].slice(2);
  value = args[1];
    
  if (!value) {
    throw new Error(`missing argument for ${key}`);
  }

} else {
  key = args[0];
  value = args[1];
}

let keyword = '';
if (key == 'keyword' || key == 'k') {
  keyword = value;
}

if (!args[2] || !args[3]) {
  console.error('incorrect usage');
  process.exit(1);
}

if (args[2].startsWith('--')) {
  key = args[2].slice(2);
  value = args[3];
    
  if (!value) {
    throw new Error(`missing argument for ${key}`);
  }

} else {
  key = args[2];
  value = args[3];
}

let location = '';
if (key == 'location' || key == 'l') {
  location = value;
}

async function fetchJobs(keyword: string, location: string): Promise<Job[]> {
  const params = new URLSearchParams({
    Keyword: keyword,
    LocationName: location,
    ResultsPerPage: '50',
    Radius: '100'
  });

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
  
  const data: JobSearchResult = await res.json();
  const items: JobsItem[] = data.SearchResult?.SearchResultItems ?? [];
  const jobs: Job[] = items.map(mapJobsItemToJobs)
  return jobs;
}

async function main(): Promise<void> {
  const jobs: Job[] = await fetchJobs(keyword, location);
  console.log(`found ${jobs.length} job(s)`);
/*   if (jobs.length > 0) {
    jobs.forEach((job) => {
      console.log(job.title);
    });
  } */
  console.log(args);
}

main();
