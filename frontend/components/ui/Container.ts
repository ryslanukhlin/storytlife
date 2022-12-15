import { styled } from '@mui/material';
import { Container as ContainerMui } from '@mui/system';

const Container = styled(ContainerMui)(() => ({
    paddingRight: '0px !important',
    paddingLeft: '0px !important',
}));

export default Container;
