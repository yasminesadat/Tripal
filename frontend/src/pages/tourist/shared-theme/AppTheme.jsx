import * as React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { inputsCustomizations } from './customizations/inputs';
import { dataDisplayCustomizations } from './customizations/dataDisplay';
import { feedbackCustomizations } from './customizations/feedback';
import { navigationCustomizations } from './customizations/navigation';
import { surfacesCustomizations } from './customizations/surfaces';
import { colorSchemes, typography, shadows, shape } from './themePrimitives';

function AppTheme({ children, disableCustomTheme, themeComponents }) {
  const theme = React.useMemo(() => {
    return disableCustomTheme
      ? {}
      : createTheme({
          // For more details about CSS variables configuration, see https://mui.com/material-ui/customization/css-theme-variables/configuration/
          cssVariables: {
            colorSchemeSelector: 'data-mui-color-scheme',
            cssVarPrefix: 'template',
            colorScheme: 'light', 
          },
         
          colorSchemes: {
            light: {
              palette: {
                mode: 'light',
                primary: { main: '#8f5774' },
              },
            },
          },          
          typography,
          shadows,
          shape,
          components: {
            ...inputsCustomizations,
            ...dataDisplayCustomizations,
            ...feedbackCustomizations,
            ...navigationCustomizations,
            ...surfacesCustomizations,
            ...themeComponents,
            MuiOutlinedInput: {
              styleOverrides: {
                root: {
                  '& fieldset': {
                    borderColor: '#8f5774', 
                  },
                  '&:hover fieldset': {
                    borderColor: '#8f5774', 
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#8f5774', 
                  },
                },
              },
            },
            MuiMenuItem: {
              styleOverrides: {
                root: {
                  '&:hover': {
                    backgroundColor: '#F1E0E0', 
                  },
                  '&.Mui-selected, &.Mui-selected:hover': {
                    backgroundColor: '#8f5774 !important', 
                    color: '#ffffff',
                  },
                },
              },
            },
            
            MuiCheckbox: {
              styleOverrides: {
                root: {
                  color: '#8f5774', 
                  '&.Mui-checked': {
                    color: '#8f5774', 
                  },
                },
              },
            },
            MuiButton: {
              styleOverrides: {
                root: {
                  backgroundColor: "#8f5774", 
                  color: 'white', 
                  '&:hover': {
                    backgroundColor: "#b77c94", 
                    opacity: 0.8, 
                  },
                  '&.Mui-disabled': {
                    backgroundColor: 'rgba(128, 0, 128, 0.5)', 
                    color: 'rgba(255, 255, 255, 0.5)',
                  },
                },
              },
            },
            MuiSelect: {
              styleOverrides: {
                
                select: {
                  '&:focus': {
                    borderColor: '#b77c94',
                  },
                },
                icon: {
                  color: '#b77c94', 
                },
              },
            },
            MuiCardActionArea: {
              styleOverrides: {
                root: {
                  backgroundColor: '#F1E0E0', 
                  padding: '16px', 
                  '&:hover': {
                    backgroundColor: '#FDF2F2', 
                  },
                },
              },
            },
            MuiCard: {
              styleOverrides: {
                root: {
                  backgroundColor: '#F1E0E0', 
                  '&:hover': {
                    backgroundColor: '#F1E0E0', 
                  },
                },
              },
            },
            MuiAlert: {
              styleOverrides: {
                root: {
                  backgroundColor: '#F1E0E0', 
                  color: '#8f5774', 
                  '& .MuiAlert-icon': {
                    color: '#8f5774', 
                  },
                  '& .MuiAlert-action': {
                    color: '#8f5774', 
                  },
                },
              },
            },
            MuiListItemText: {
              styleOverrides: {
                root: {
                  color: '#ffffff', 
                  '& .MuiAlert-icon': {
                    color: '#8f5774', 
                  },
                  '& .MuiAlert-action': {
                    color: '#8f5774', 
                  },
                },
                secondary:{
                  color: '#ffffff', 
                }
              },
            },
            MuiStepper: {
              styleOverrides: {
                root: {
                  '& .MuiStepIcon-root': {
                    '&.Mui-active': {
                      color: '#8f5774', 
                    },  
                  },
                },
              },
            },
            MuiStepConnector: {
              styleOverrides: {
                line: {
                  borderColor: '#8f5774', 
                },
              },
            },   
          },
        });
  }, [disableCustomTheme, themeComponents]);
  if (disableCustomTheme) {
    return <React.Fragment>{children}</React.Fragment>;
  }
  return (
    <ThemeProvider theme={theme} disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}

AppTheme.propTypes = {
  children: PropTypes.node,
  /**
   * This is for the docs site. You can ignore it or remove it.
   */
  disableCustomTheme: PropTypes.bool,
  themeComponents: PropTypes.object,
};

export default AppTheme;
