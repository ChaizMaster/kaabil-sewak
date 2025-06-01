import { registerRootComponent } from 'expo';

// Initialize Firebase BEFORE importing any components that use it
import './src/config/firebase.config';

import App from './App';

// Register the main component
registerRootComponent(App); 