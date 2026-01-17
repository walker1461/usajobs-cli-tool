//* API types
export interface JobsItem {
  MatchedObjectDescriptor: {
    PositionTitle: string;
    DepartmentName: string;
    PositionLocationDisplay: string;
    JobCategory?: { Name: string }[];
  };
}

export interface SearchResult {
  SearchResultItems: JobsItem[];
  SearchResultCount: number;
}

export interface JobSearchResult {
  SearchResult?: SearchResult;
}

//* internal types
export interface Job {
    title: string;
    location: string;
    department: string;
    category: string;
}

export function mapJobsItemToJobs(item: JobsItem): Job {
  const job = item.MatchedObjectDescriptor;
  return {
    title: job.PositionTitle,
    location: job.PositionLocationDisplay,
    department: job.DepartmentName,
    category: job.JobCategory?.[0]?.Name ?? 'Unknown'
  }
}

export interface Flags {
  keyword?: string,
  location?: string
}