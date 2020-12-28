import buildApp from './app';
import "./registerServiceWorker";

const { app, router } = buildApp();

(async (r, a) => {
   await r.isReady();

   a.mount('#app', true);
})(router, app);