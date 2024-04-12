const express = require("express");
const app = express();
const PORT = 8007;

app.use(express.json());

app.get('/Login', (req, res) => {
    res.status(200).send({
        Login: "is working"
    });
});

app.post('/Login/:id', (req, res) => {
    const { id } = req.params;
    const { Login } = req.body;

    if (!Login) {
        res.status(418).send({ message: "you need to login" });
    } else {
        res.send({ Login: `Login with ${id}` });
    }
});

app.listen(PORT, () => {
    console.log(`API is live at port ${PORT}`);
});
