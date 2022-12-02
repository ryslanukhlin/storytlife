import React, { FC, useContext } from 'react';
import NextLink from 'next/link';
import { ThemeContext } from '../../pages/_app';

type LinkProps = React.ComponentProps<typeof NextLink>;

const Link: FC<LinkProps> = ({ href, children }) => {
    const themeContext = useContext(ThemeContext);

    return (
        <NextLink style={{ color: themeContext.theme === 'dark' ? 'white' : 'black' }} href={href}>
            {children}
        </NextLink>
    );
};

export default Link;
