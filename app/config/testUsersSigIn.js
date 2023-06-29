const newUser = {
    userName: "userTest",
    userEmail: "userTest@gmail.com",
    userPassword: "Qwerty05.",
    userAge: 22,
    role: '2'
};
const newUserAdmin = {
    userName: "userAdmin",
    userEmail: "userAdmin@gmail.com",
    userPassword: "Qwerty05.",
    userAge: 22,
    role: '1'
};
const newUserInsert = {
    userName: "userTest2",
    userEmail: "userTest2@gmail.com",
    userPassword: "Qwerty06.",
    userAge: 22,
    role: '2'
};
const newUserBadRole = {
    userName: "userTest3",
    userEmail: "userTest2@gmail.com",
    userPassword: "Qwerty06.",
    userAge: 22,
    role: '3'
};

module.exports = {
    newUser,
    newUserInsert,
    newUserBadRole,
    newUserAdmin
}