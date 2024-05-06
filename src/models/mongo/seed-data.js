export const seedData = {
    users: {
        _model: "User",
        testUser: {
            firstName: "test",
            lastName: "user",
            email: "test@user.com",
            password: "secret",
            admin: true,
        },
    },
    spots: {
        _model: "Spot",
        initialSpot1: {
            name: "Initial spot",
            description: "A sample spot",
            category: "Uncategorised",
            latitude: 55,
            longitude: -55,
        },
        initialSpot2: {
            name: "A second initial spot",
            description: "Another sample spot",
            category: "Scenery",
            latitude: 4,
            longitude: -4,
        },
    },
};
