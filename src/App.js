/* eslint-disable no-unused-vars */
import { useSelector } from 'react-redux';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Paper, styled, StyledEngineProvider } from '@mui/material';

// routing
import Routes from 'routes';

// defaultTheme
import themes from 'themes';

// project imports
import NavigationScroll from 'layout/NavigationScroll';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from 'views/pages/authentication/authentication3/AuthProvider';

// ==============================|| APP ||============================== //

const App = () => {
    const customization = useSelector((state) => state.customization);

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={themes(customization)}>

                <CssBaseline />
                <NavigationScroll>
                    <Routes />
                </NavigationScroll>
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default App;
