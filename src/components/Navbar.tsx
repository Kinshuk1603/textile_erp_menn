import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItemText, Card, CardContent, ListItemButton, Popover } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';

const Navbar = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleProfileClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setProfileAnchorEl(event.currentTarget);
    };

    const handleCloseProfilePopover = () => {
        setProfileAnchorEl(null);
    };

    const openProfilePopover = Boolean(profileAnchorEl);

    const links = [
        'client', 'roleinfo', 'color', 'mill', 'size', 'stage', 'yarn',
        'fabric', 'product', 'intermediate product', 'product group', 'access./ dye'
    ];

    return (
        <div className="relative w-[90%] mx-auto">
            <AppBar position="static" className="flex items-center justify-center bg-blue-300 mt-3 rounded-full h-12 hover:bg-blue-400">
                <Toolbar className="container flex items-center justify-between px-5 py-3">
                    <div className="text-xl font-bold text-gray-800">
                        Concept Creations
                    </div>

                    <div className="hidden xl:flex space-x-5 text-gray-800 capitalize">
                        {links.map((link, index) => (
                            <Link href={`#${link}`} key={index} className='text-[12px] px-3 py-2 hover:bg-white hover:rounded-full hover:text-blue-400'>
                                {link}
                            </Link>
                        ))}
                    </div>

                    <div className="hidden xl:flex">
                        <IconButton onClick={handleProfileClick}>
                            <Image
                                src="https://i.pravatar.cc/300" // Replace with the correct image path
                                alt="Profile"
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                        </IconButton>
                    </div>

                    <IconButton
                        edge="end"
                        color="inherit"
                        aria-label="menu"
                        onClick={toggleDrawer}
                        className="xl:hidden"
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer}
                className="z-50"
                classes={{ paper: clsx('md:w-[80%] md:p-1') }}
            >
               
                <div className="flex items-center bg-blue-300 rounded-lg justify-between mb-1 px-2">

                    {/* Profile Circle at the Top */}
                    <IconButton onClick={handleProfileClick}>
                        <Image
                            src="https://i.pravatar.cc/300" // Replace with the correct image path
                            alt="Profile"
                            width={60}
                            height={60}
                            className="rounded-full"
                        />
                    </IconButton>
                    <div className="text-lg text-center font-bold text-gray-800">
                    Concept Creations
                </div>
                    <IconButton
                        edge="end"
                        color="inherit"
                        aria-label="close"
                        onClick={toggleDrawer}
                    >
                        <CloseIcon />
                    </IconButton>
                </div>

                <List className="space-y-2">
                    {links.map((link, index) => (
                        <ListItemButton component="a" href={`#${link}`} key={index} className='hover:bg-blue-300 rounded-lg mx-4'>
                            <ListItemText primary={link} className="text-sm md:text-base" />
                        </ListItemButton>
                    ))}
                </List>


            </Drawer>

            {drawerOpen && <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-lg  z-40" onClick={toggleDrawer}></div>}

            <Popover
                open={openProfilePopover}
                anchorEl={profileAnchorEl}
                onClose={handleCloseProfilePopover}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <Card className="p-2">
                    <CardContent>
                        <Link href="/" className="block text-sm md:text-base">
                            Home
                        </Link>
                        <Link href="#logout" className="block text-red-600 text-sm md:text-base">
                            Logout
                        </Link>
                    </CardContent>
                </Card>
            </Popover>
        </div>
    );
};

export default Navbar;
