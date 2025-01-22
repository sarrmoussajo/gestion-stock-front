import { useEffect, useState } from 'react';

// material-ui
import { Grid, Paper, styled } from '@mui/material';

// project imports
import EarningCard from './EarningCard';
import PopularCard from './PopularCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import TotalIncomeDarkCard from './TotalIncomeDarkCard';
import TotalIncomeLightCard from './TotalIncomeLightCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import { gridSpacing } from 'store/constant';
import AuthUser from 'views/pages/authentication/authentication3/AuthUser';

// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
    const [isLoading, setLoading] = useState(true);
    const { user } = AuthUser();
    useEffect(() => {
        setLoading(false);
    }, []);

    const Item = styled(Paper)(({ theme }) => ({
        ...theme.typography.h2,
        textAlign: 'left',
        height: 60,
        lineHeight: '60px',
        marginBottom: 20,
        paddingLeft: 15
    }));

    return (
        <>
            <Grid item xs={8}>
                <Item elevation={0}>Tableau de Bord</Item>
            </Grid>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <EarningCard isLoading={isLoading} />
                        </Grid>
                        {user.profil !== 'Gerant' && (
                            <Grid item lg={4} md={6} sm={6} xs={12}>
                                <TotalOrderLineChartCard isLoading={isLoading} />
                            </Grid>
                        )}

                        <Grid item lg={4} md={12} sm={12} xs={12}>
                            <Grid container spacing={gridSpacing}>
                                {user.profil !== 'Gerant' && (
                                    <Grid item sm={6} xs={12} md={6} lg={12}>
                                        <TotalIncomeDarkCard isLoading={isLoading} />
                                    </Grid>
                                )}
                                <Grid item sm={6} xs={12} md={6} lg={12}>
                                    <TotalIncomeLightCard isLoading={isLoading} />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12} md={8}>
                            <TotalGrowthBarChart isLoading={isLoading} />
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <PopularCard isLoading={isLoading} />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

export default Dashboard;

{
    /* <Grid item xs={12} md={8}>
    <TotalGrowthBarChart isLoading={isLoading} />
</Grid>; */
}
