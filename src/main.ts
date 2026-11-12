import { App } from './ui/App';
import './ui/theme/tokens.css';

// The game is driven by the App controller (src/ui/App.ts), which composes the full-HD shell,
// the shared ViewModelsProto-derived components, and per-screen adapters.
const app = document.getElementById('app')!;
new App(app);
