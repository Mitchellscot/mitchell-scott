import {PortableText} from '@portabletext/react';
import {GetStaticPaths, GetStaticProps, InferGetStaticPropsType} from 'next';
import {NextSeo} from 'next-seo';
import components from '../../components/PortableText/PortableText';
import BlogEntryModel from '../../models/BlogEntryData';
import styles from '../../styles/pages/BlogEntry.module.scss';
import {blogEntryPaths} from '../../utils/blogEntryPaths';
import pageTitle from '../../utils/pageTitle';
import {getBlogEntry} from '../../utils/static-props';

const BlogEntry = (
  blogEntryData: InferGetStaticPropsType<typeof getStaticProps>
) => {
  return (
    <>
      <NextSeo
        title={pageTitle(blogEntryData.pageTitle)}
        description={blogEntryData.metaDescription}
      />
      <div className={styles.container}>
        <div>{blogEntryData.title}</div>
        <div>{blogEntryData.publishDate}</div>
        <PortableText
          value={blogEntryData.text}
          onMissingComponent={false}
          components={components}
        />
      </div>
    </>
  );
};

export default BlogEntry;

export const getStaticProps: GetStaticProps<BlogEntryModel> = async (context) =>
  getBlogEntry(context);

export const getStaticPaths: GetStaticPaths = async () => blogEntryPaths();
