import { Request, ResponseToolkit } from "@hapi/hapi";

export const aboutController = {
  index: {
    handler: function (rrequest: Request, h: ResponseToolkit) {
      const viewData = {
        title: "About SpotHop",
      };
      return h.view("about-view", viewData);
    },
  },
};
