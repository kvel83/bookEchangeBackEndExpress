const newUser = {
    userName: "userTest",
    userEmail: "userTest@gmail.com",
    userPassword: "Qwerty05.",
    userAge: 22,
    role: 2
};
const newUserInsert = {
    userName: "userTest2",
    userEmail: "userTest2@gmail.com",
    userPassword: "Qwerty06.",
    userAge: 22,
    role: 2
};
const testLogin = {
    userName: "user3",
    userPassword: "Qwerty03."
};
const wrongTestLoginPass = {
    userName: "user3",
    userPassword: "Qwerty11."
};
const wrongTestLoginUser = {
    userName: "user33",
    userPassword: "Qwerty03."
}
const wrongUser = {
    name: "wrongUser"
};

module.exports = {
    newUser,
    newUserInsert,
    testLogin,
    wrongTestLoginPass,
    wrongTestLoginUser,
    wrongUser
}