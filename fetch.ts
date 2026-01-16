import "dotenv/config";

interface Job {
	title:string;
	location:string;
	department:string;
	category:string;
}

async function fetchJobs(keyword:string, location:string):Promise<Job[]> {

	const params = new SearchParams({Keyword:keyword, Location:location, ResultsPerPage:"50"});

	const res = await fetch(`http://data.usajobs.gov/api/Search?${params.toString()}`, {
		headers: {
		"Authorization-Key": process.env.USAJOBS_API_KEY!,
		"User-Agent": process.env.USAJOBS_EMAIL!
		}
	});
	if (!res.ok) {
	throw new Error(`error: ${res.status}`);
	}
	const data = await res.json();
}
