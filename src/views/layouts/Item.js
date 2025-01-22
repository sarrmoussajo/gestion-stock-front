import { Paper, styled } from '@mui/material';

export const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.h2,
    textAlign: 'left',
    height: 60,
    lineHeight: '60px',
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'white'
}));

export const BoxH4 = styled(Paper)(({ theme }) => ({
    ...theme.typography.h2,
    textAlign: 'left',
    height: 60,
    lineHeight: '60px',
    marginBottom: 20,
    paddingLeft: 15,
    backgroundColor: 'white'
}));
