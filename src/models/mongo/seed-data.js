export const seedData = {
    users: {
        _model: "User",
        testUser: {
            firstName: "Admin",
            lastName: "Dude",
            email: "test@user.com",
            password: "secret",
            admin: true,
            _id: "663d2c2eba1b43a21226630c",
        },
        testUser2: {
            firstName: "Other",
            lastName: "Dude",
            email: "test@test.com",
            password: "test",
            admin: false,
            _id: "663d2c2eba1b43a21226639f",
        },
    },
    spots: {
        _model: "Spot",
        initialSpot1: {
            name: "Initial spot",
            description: "A sample spot",
            category: "Locale",
            latitude: 55,
            longitude: -55,
            userid: "663d2c2eba1b43a21226630c",
        },
        initialSpot2: {
            name: "A second initial spot",
            description: "testing what happens if the description is ridiculously long testing what happens if the description is ridiculously long testing what happens if the description is ridiculously long testing what happens if the description is ridiculously long testing what happens if the description is ridiculously long testing what happens if the description is ridiculously long testing what happens if the description is ridiculously long ",
            category: "Activity",
            latitude: 4,
            longitude: -4,
            userid: "663d2c2eba1b43a21226630c",
            img: 'http://res.cloudinary.com/dx2zbn7jb/image/upload/v1715286036/kfdzvb0slisf587orcbl.png',
        },
        initialSpot3: {
            name: "The other dude's spot",
            description: "Well it's a spot innit",
            category: "Site",
            latitude: 55,
            longitude: -55,
            userid: "663d2c2eba1b43a21226639f",
        },
    },
};
