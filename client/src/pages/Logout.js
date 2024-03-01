const { redirect } = require("react-router-dom");

const action  = () => {
    localStorage.removeItem('token');
    return redirect('/');
}

exports.action = action;