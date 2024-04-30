export const aboutController = {
  index: {
    handler: function (request, h) {
      const viewData = {
        title: "About SpotHop",
      };
      return h.view("about-view", viewData);
    },
  },
};
