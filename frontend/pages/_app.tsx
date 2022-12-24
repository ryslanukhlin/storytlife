import { CssBaseline } from '@mui/material';
import {
    ThemeProvider,
    createTheme as createMuiTheme,
    unstable_createMuiStrictModeTheme,
    StyledEngineProvider,
} from '@mui/material/styles';
import type { AppProps } from 'next/app';
import { createContext, useEffect, useState } from 'react';
import ClientApolloProvider from '../graphql/apollo';
import type {} from '@mui/lab/themeAugmentation';

import '../styles/globals.scss';
import '@mui/lab/themeAugmentation';
import AuthProvider from '../components/provider/AuthProvider';
import LayoutProvider from '../components/provider/LayoutProvider';
import React from 'react';
import { useGetCurrentUserChatsQuery } from '../graphql/generated';
import { chatData } from '../graphql/store/chat';

const createTheme =
    process.env.NODE_ENV === 'production' ? createMuiTheme : unstable_createMuiStrictModeTheme;

const whiteTheme = createTheme({
    palette: {
        mode: 'light',
        background: {
            paper: '#e3e4e6',
        },
        primary: {
            main: '#764abc',
            light: '#916ec9',
            dark: '#6a43a9',
        },
    },
    components: {
        MuiTimeline: {
            styleOverrides: {
                root: {
                    backgroundColor: 'red',
                },
            },
        },
    },
});

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            paper: '#222222',
        },
        primary: {
            main: '#ba8fff',
            light: '#7431ca',
            dark: '#b97cfd',
        },
    },
    components: {
        MuiTimeline: {
            styleOverrides: {
                root: {
                    backgroundColor: 'red',
                },
            },
        },
    },
});

type Theme = 'white' | 'dark';

type typeThemeContext = {
    theme: Theme;
    changeTheme: () => void;
};

export const ThemeContext = createContext<typeThemeContext>({} as typeThemeContext);

export default function App({ Component, pageProps }: AppProps) {
    const [theme, setTheme] = useState<Theme>('white');

    const changeTheme = () => {
        localStorage.setItem('theme', theme === 'white' ? 'dark' : 'white');
        setTheme(theme === 'white' ? 'dark' : 'white');
    };

    useEffect(() => {
        if (window && localStorage.getItem('theme'))
            setTheme(localStorage.getItem('theme') as Theme);
    }, []);

    return (
        <React.StrictMode>
            <ClientApolloProvider>
                <ThemeContext.Provider value={{ theme, changeTheme }}>
                    <ThemeProvider theme={theme === 'white' ? whiteTheme : darkTheme}>
                        <CssBaseline />
                        <AuthProvider>
                            <LayoutProvider>
                                <Component {...pageProps} />
                            </LayoutProvider>
                        </AuthProvider>
                    </ThemeProvider>
                </ThemeContext.Provider>
            </ClientApolloProvider>
        </React.StrictMode>
    );
}
