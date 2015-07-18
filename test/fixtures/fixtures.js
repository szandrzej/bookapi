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
            role: 'admin'
        }
    },
    {
        model: 'User',
        data: {
            id: 2,
            username: 'Kasia Szmajnta',
            email: 'kasia@test.com',
            password: 'qwerty'
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
];