export const seedData = {
    users: {
      _model: "User",
      testUser: {
        firstName: "test",
        lastName: "user",
        email: "test@user.com",
        password: "secret",
        admin: true,
        _id: "663d2c2eba1b43a21226630c",
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
        userid: "663d2c2eba1b43a21226630c",
      },
      initialSpot2: {
        name: "A second initial spot",
        description: "Another sample spot",
        category: "Scenery",
        latitude: 4,
        longitude: -4,
        userid: "663d2c2eba1b43a21226630c",
        img: 'http://res.cloudinary.com/dx2zbn7jb/image/upload/v1715286036/kfdzvb0slisf587orcbl.png',
      },
    },
  };