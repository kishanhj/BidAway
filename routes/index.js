

const constructorMethod = app => {

    app.use("*", (req,res) => {
        res.sendStatus(404).json({error:"Not Found"});
    });

}

module.exports = constructorMethod;