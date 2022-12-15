import { Card as CardMui, styled } from '@mui/material';

const Card = styled(CardMui)(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    height: '100%',
}));

export default Card;
