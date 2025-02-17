import {NextRequest} from 'next/server';
import BlogList from '../../components/BlogList/BlogList';
import queries from '../../constants/queries';
import {getBlogPreviewsByTag} from '../../constants/queryHelpers';
import HomePageData from '../../models/HomePageData';
import {fetchSanityData} from '../../utils/sanityClient';
import Layout from '../../components/Layout/Layout';

//Next does not allow running query parameters on the home URL
//SO I had to make a seperate page /blog so that the url parameters work properly
//it's basically a copy of the home page, but you can run queries on it.
//Also, I didn't want the homepage to redirect to /blog - I wanted a clean looking URL - mitchellscott.me

export interface PageParams<
  P = undefined,
  S = Record<string, string | string[] | undefined>,
> {
  params: P;
  searchParams: S;
}

export interface SlugParam {
  slug: string;
}

async function getHomePageData(): Promise<HomePageData | null> {
  const data = await fetchSanityData<HomePageData>(queries.HomePage);
  return data;
}
const getTaggedBlogPreviews = async (
  queryString: string | string[]
): Promise<HomePageData | null> => {
  const queryValue =
    typeof queryString === 'string' ? queryString : queryString[0];
  const acceptableTags = await fetchSanityData<Array<string>>(
    queries.GetAllTags
  );

  //if query parameter isn't valid, just return the default page
  if (acceptableTags && acceptableTags.indexOf(queryValue) === -1) {
    return getHomePageData();
  }

  const data = await fetchSanityData<HomePageData>(
    getBlogPreviewsByTag(queryValue)
  );
  return data;
};

type BlogPageProps = {
  params: Promise<{id: string}>;
  searchParams: Promise<{[key: string]: string | string[] | undefined}>;
};

export default async function Blog({searchParams}: BlogPageProps) {
  const {tag} = await searchParams;
  let data;
  if (tag) data = await getTaggedBlogPreviews(tag);
  else data = await getHomePageData();
  if (!data) return null; //TODO: 404 page

  return (
    <Layout path={'blog'}>
      <BlogList list={data.blogList} totalCount={data.totalCount} />
    </Layout>
  );
}
