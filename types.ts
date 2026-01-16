export interface JobsItem {
  MatchedObjectDescriptor: {
    PositionTitle: string;
    DepartmentName: string;
    PositionLocationDisplay: string;
    JobCategory?: { Name: string }[];
  };
}