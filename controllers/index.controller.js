module.exports = {
    index: (req, res, next) => {
        // todo
        res.render('index', { title: 'Express' });
    }
};