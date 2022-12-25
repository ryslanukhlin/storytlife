import Link from 'next/link';
import { FC } from 'react';

type LinkProps = React.ComponentProps<typeof Link>;

const LinkContent: FC<LinkProps> = ({ href, children }) => {
    return (
        <Link style={{ textDecoration: 'none' }} href={href}>
            {children}
        </Link>
    );
};

export default LinkContent;
