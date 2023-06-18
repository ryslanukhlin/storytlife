import { FC, useState } from 'react';
import Comment from './Comment';
import { Comment as CommentInterface } from '../Post/Posts';
import { useNewCommentSubscription } from '../../../graphql/generated';

type ComponentsProps = {
    comments: CommentInterface[];
    postId: string;
    addComment: () => void;
};

const Comments: FC<ComponentsProps> = ({ comments, postId, addComment }) => {
    const [commentArr, setCommentArr] = useState(comments);

    useNewCommentSubscription({
        variables: {
            postId: postId,
        },
        onData: (option) => {
            const { created_at } = option.data.data!.newComment;
            option.data.data!.newComment.created_at = new Date(created_at).getTime().toString();
            setCommentArr((prev) => [...prev, option.data.data?.newComment!]);
            addComment();
        },
    });

    return (
        <div>
            {commentArr.map((comment) => (
                <Comment key={comment.id} comment={comment} />
            ))}
        </div>
    );
};

export default Comments;
