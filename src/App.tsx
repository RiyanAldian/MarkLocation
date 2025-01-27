/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React from 'react';
import Routes from './Routes';
import {PaperProvider} from 'react-native-paper';
function App(): React.JSX.Element {
  // const isDarkMode = useColorScheme() === 'dark';

  return (
    <PaperProvider>
      <Routes />
    </PaperProvider>
  );
}

export default App;
