import { AppBar, Drawer, IconButton, Toolbar, Typography } from '@mui/material';
import React, { useState } from 'react';

import MenuIcon from '@mui/icons-material/Menu';
import Nav from '../nav/Nav';
import NavMobile from '../nav/NavMobile';

const Header = () => {
    const [drawerShow, setDrawerShow] = useState(false);

    const showDrawer = () => setDrawerShow(true);
    const closeDrawer = () => setDrawerShow(false);

    const chanheDrawerShow = () => setDrawerShow((prev) => !prev);

    return (
        <AppBar position="fixed">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={showDrawer}
                    sx={{ mr: 2 }}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    StoryLife
                </Typography>
            </Toolbar>
            <Drawer anchor="left" open={drawerShow} onClose={chanheDrawerShow}>
                <NavMobile onDrawer={closeDrawer} />
            </Drawer>
        </AppBar>
    );
};

export default Header;
