# JMS flavor/mw-blog

This flavor of JMS comes with everything preconfigured for a simple blog. 
It consists of two angular projects CMS and Web and has the multiple project structure preconfigured.

## Checklist

Before going live make sure you've marked all of the following:

- [ ] `storage.rules` have rules configured for all of the modules
- [ ] You adjusted the constants in `build/build.js` to fit your projects requirements and added any static or dynamic pages to the `PAGES` array.
- [ ] `client/projects/cms/src/environment/static-config.ts` has been adjusted to your projects requirements.
- [ ] You added `FIREBASE_TOKEN` and `SERVICE_ACCOUNT` to your secrets in github.
- [ ] You adjusted `client/projects/web/scr/app/consts/base-title.const.ts` to your projects title.
- [ ] You changed "jaspero-jms" in `.github/workflows/web.workflow.yml` and `.github/workflows/cms.workflow.yml` to your project id
- [ ] You updated `.firebaserc` with your projects data
- [ ] You changed the meta tags in `client/projects/web/src/index.html`
