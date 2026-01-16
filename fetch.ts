import 'dotenv/config';
import type { Job, JobsItem, JobSearchResult } from './types';

async function fetchJobs(keyword: string, location: string): Promise<Job[]> {
  const params = new URLSearchParams({
    Keyword: keyword,
    LocationName: location,
    ResultsPerPage: '50',
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
  console.log(data.SearchResult?.SearchResultCount);

  const items: JobsItem[] = data.SearchResult?.SearchResultItems ?? [];
  const jobs: Job[] = items.map((item) => {
    const job = item.MatchedObjectDescriptor;
    return {
      title: job.PositionTitle,
      location: job.PositionLocationDisplay,
      department: job.DepartmentName,
      category: job.JobCategory?.[0]?.Name ?? 'Unknown',
    };
  });
  return jobs;
}

async function main(): Promise<void> {
  const jobs: Job[] = await fetchJobs('software', 'Charlotte, NC');
  console.log(`found ${jobs.length} job(s)`);
}

main();
