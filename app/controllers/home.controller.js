const homeController = async (req, res) => {
    res.status(200).json({
        "success": true,
        "message": 'Todo bien, todo correcto y yo que me alegroo. 😎',
        "data": null
    });
}
module.exports = { homeController };
