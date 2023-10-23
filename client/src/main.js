
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Plugins
import 'bootstrap/dist/css/bootstrap.css';

// Import Bootstrap JavaScript (Popper.js is required for some Bootstrap features)
import 'bootstrap/dist/js/bootstrap.bundle';
import router from './router.js';

const app = createApp(App)


app.use(router);

app.mount('#app')