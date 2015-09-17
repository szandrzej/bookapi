var date = new Date();
module.exports = [
    // Users
    {
        model: 'User',
        data: {
            id: 1,
            username: 'Andrzej Szmajnta',
            email: 'andrzej.szmajnta@jazzy.pro',
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
            email: 'andrzejdaniel.szm@gmail.com',
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
            expirationDate: new Date((date.getTime() + 1000*60*60*24*30)),
            accessToken: 'tokenofadminm7R9MnrUotoNRtnOBZ6gyh7s2XadPNRcsYKUlCdQpSYtDCX9',
            UserId: 1
        }
    },
    {
        model: 'Token',
        data: {
            id: 2,
            expirationDate: new Date((date.getTime() + 1000*60*60*24*30)),
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
            lastName: "Tolkien",
            nationality: "ENG"
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
    {
        model: 'Author',
        data: {
            id: 6,
            firstName: "Stephen",
            lastName: "King",
            nationality: "ENG"
        }
    },
    {
        model: 'Author',
        data: {
            id: 7,
            firstName: "Agatha",
            lastName: "Christie",
            nationality: "ENG"
        }
    },
    {
        model: 'Author',
        data: {
            id: 8,
            firstName: "J.K.",
            lastName: "Rowling",
            nationality: "ENG"
        }
    },
    {
        model: 'Author',
        data: {
            id: 9,
            firstName: "Leo",
            lastName: "Tolstoy",
            nationality: "RUS"
        }
    },
    {
        model: 'Author',
        data: {
            id: 10,
            firstName: "Alexander",
            lastName: "Pushkin",
            nationality: "RUS"
        }
    },
    {
        model: 'Author',
        data: {
            id: 11,
            firstName: "Ernest",
            lastName: "Hemingway",
            nationality: "ENG"
        }
    },

// BOOKS

    {
        model: 'Book',
        data: {
            id: 1,
            title: 'Władca Pierścieni: Drużyna Pierścienia',
            author: 3
        }
    },
    {
        model: 'Book',
        data: {
            id: 2,
            title: 'Władca Pierscieni: Dwie Wieże',
            author: 3
        }
    },
    {
        model: 'Book',
        data: {
            id: 3,
            title: 'Władca Pierscieni: Powrót Króla',
            author: 3,
            description: 'Dlalalalalalalalala'
        }
    },

    // COLLECTIONS

    {
        model: 'Collection',
        data: {
            id: 1,
            title: 'Pierwsza kolekcja',
            creator: 1,
            Users: [1, 2],
            Books: [1, 3]
        }
    },
    {
        model: 'Collection',
        data: {
            id: 2,
            title: 'Druga kolekcja',
            creator: 2,
            Users: [2],
            Books: [1, 2, 3]
        }
    },
];