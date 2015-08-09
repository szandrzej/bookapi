var date = new Date();
module.exports = [
    // Users
    {
        model: 'User',
        data: {
            id: 1,
            username: 'Andrzej Szmajnta',
            email: 'andrzej@test.com',
            password: 'qwerty',
            role: 'admin',
            activated: false,
            activationCode: '123456789'
        }
    },
    {
        model: 'User',
        data: {
            id: 2,
            username: 'Kasia Szmajnta',
            email: 'kasia@test.com',
            password: 'qwerty',
            activated: false,
            activationCode: '98765431'
        }
    },
    {
        model: 'User',
        data: {
            id: 3,
            username: 'User Szmajnta',
            email: 'usero@test.com',
            password: 'qwerty',
            activated: true,
            activationCode: '98765431'
        }
    },

    // Test token!
    {
        model: 'Token',
        data: {
            id: 1,
            expirationDate: date.getTime() + 1000*60*60*24*30,
            accessToken: 'tokenofadminm7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX9',
            UserId: 1
        }
    },
    {
        model: 'Token',
        data: {
            id: 2,
            expirationDate: date.getTime() + 1000*60*60*24*30,
            accessToken: 'tokenofuserym7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX8',
            UserId: 2
        }
    },

    // Authors
    {
        model: 'Author',
        data: {
            id: 1,
            firstName: 'Henryk',
            lastName: 'Sienkiewicz'
        }
    },
    {
        model: 'Author',
        data: {
            id: 2,
            firstName: "Andrzej",
            lastName: "Sapkowski"
        }
    },
    {
        model: 'Author',
        data: {
            id: 3,
            firstName: "J.R.R",
            lastName: "Tolkien"
        }
    },
    {
        model: 'Author',
        data: {
            id: 4,
            firstName: "Adam",
            lastName: "Mickiewicz"
        }
    },
    {
        model: 'Author',
        data: {
            id: 5,
            firstName: "Boleslaw",
            lastName: "Prus"
        }
    },

    // COLLECTIONS

    {
        model: 'Collection',
        data: {
            id: 1,
            title: 'Pierwsza kolekcja',
            creator: 1,
            users: [1,2]
        }
    },

    // LOCATIONS

    {
        model: 'Location',
        data: {
            id: 1,
            name: 'Domek z kart'
        }
    },

    // BOOKS

    {
        model: 'Book',
        data: {
            id: 1,
            title: 'Władca Pierścieni: Drużyna Pierścienia',
            author: 3,
            collection: 1,
            location: 1
        }
    },
    {
        model: 'Book',
        data: {
            id: 2,
            title: 'Władca Pierscieni: Dwie Wieże',
            author: 3,
            collection: 1,
            location: 1
        }
    },
];