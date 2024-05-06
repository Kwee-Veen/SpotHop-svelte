export const aboutController = {
    index: {
        handler: function (rrequest, h) {
            const viewData = {
                title: "About SpotHop",
            };
            return h.view("about-view", viewData);
        },
    },
};
