import buildApp from './app';


export default async url => {
  const { router, app } = buildApp();

  // set server-side router's location
  router.push(url);

  await router.isReady();

  const matchedComponents = router.currentRoute.value.matched;
  if (!matchedComponents.length) {
      throw new Error('404');
  }

  return {app, router};
}