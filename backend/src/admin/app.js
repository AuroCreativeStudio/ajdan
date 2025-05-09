import logo from "./extensions/auro.png";

const config = {
  auth: {
    logo,
  },
  head: {
    favicon: logo,
  },
  menu: {
    logo,
  },
  translations: {
    en: {
      "app.components.LeftMenu.navbrand.title": "Store Dashboard",
      "app.components.LeftMenu.navbrand.workplace": "Testing",
      "Auth.form.welcome.title": "Welcome to Auro Innovations",
      "Auth.form.welcome.subtitle": "Login to your account",
      "Settings.profile.form.section.experience.interfaceLanguageHelp":
        "Preference changes will apply only to you.",
    },
  },
  tutorials: false,
  notifications: { releases: false },
};

const bootstrap = async (app) => {
  console.log("Bootstrap loaded");

  // Fetch the current user's role using strapi.currentUser
  const userRole = strapi.currentUser?.role?.name;

  // Inject custom CSS only for the Editor role
  if (userRole === "Editor") {
    const style = document.createElement("style");
    style.innerHTML = `
      ul.sc-Qotzb.kxnySz.sc-fYsHOw.llyzNv.sc-frwMSq.VrkRx > li:nth-child(5),
      ul.sc-Qotzb.kxnySz.sc-fYsHOw.llyzNv.sc-frwMSq.VrkRx > li:nth-child(7) {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }
};

export default {
  config,
  bootstrap,
};