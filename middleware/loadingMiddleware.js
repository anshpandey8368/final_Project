module.exports = async (req, res, next) => {
    try{
        res.render('loading');
    }
    catch(error){
        console.log(error);
        res.status(500).send('Server error');
    }
}