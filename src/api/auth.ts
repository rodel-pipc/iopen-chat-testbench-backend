import express from "express";

const router = express.Router();

router.get<object, any>("/login", (req, res) => {
    res.send('login endpoint')
});

export default router;
