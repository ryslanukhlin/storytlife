import Head from 'next/head';
import { useRouter } from 'next/router';
import Post from '../../components/element/Post/Post';
import Container from '../../components/ui/Container';
import { useGetPostQuery } from '../../graphql/generated';

const PostPage = () => {
    const router = useRouter();

    const { data, error, loading } = useGetPostQuery({
        variables: {
            postId: router.query.id as string,
        },
        fetchPolicy: 'network-only',
    });

    if (error || loading) return null;

    if (!data?.getPost) router.push('/404');

    return (
        <Container>
            <Head>
                <title>{data?.getPost?.title}</title>
            </Head>
            <Post post={data?.getPost!} />
        </Container>
    );
};

export default PostPage;
