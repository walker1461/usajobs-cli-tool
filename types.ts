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
  SearchResult: SearchResult;
}

//* internal types
export interface Job {
    title: string;
    location: string;
    department: string;
    category: string;
}