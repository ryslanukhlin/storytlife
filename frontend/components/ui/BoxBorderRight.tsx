import { Box, styled } from '@mui/material';

const BoxBorderRight = styled(Box)(({ theme }) => ({
    borderRight: `1px solid ${theme.palette.divider}`,
}));

export default BoxBorderRight;
