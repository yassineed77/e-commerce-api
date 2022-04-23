const Review = require("../models/Review")

const getAll = async (req, res) => {
    const reviews = await Review.find({ product: req.params.productId })
    res.status(200).json(reviews)
}

const createReview = async (req, res) => {
    req.body.user = req.user.userId
    req.body.product = req.params.productId
    const review = await Review.create(req.body)
    res.status(200).json(review)
}

const getReview = async (req, res) => {
    const review = await Review.findById(req.params.id)

    if(!review){
        return res.status(500).send(`no review with the id ${req.params.id}`)
    }
    res.status(200).json(review)
}

const deleteReview = async (req, res) => {
    
    const rev = await Review.findById(req.params.id)
    if(rev.user.toString() !== req.user.userId){
        return res.status(500).send('you can only delete your reviews')
    }

    const review = await Review.findByIdAndDelete(req.params.id)

    if(!review){
        return res.status(500).send(`no review with the id ${req.params.id}`)
    }

    res.status(200).send("deleted successfully")
}

const updateReview = async (req, res) => {
    
    const rev = await Review.findById(req.params.id)
    if(rev.user.toString() !== body.user.userId){
        return res.status(500).send('you can only delete your reviews')
    }

    req.body.user = req.user.userId
    req.body.product = req.params.productId
    const review = await Review.findByIdAndUpdate({ _id: req.params.id}, req.body)

    if(!review){
        return res.status(500).send(`no review with the id ${req.params.id}`)
    }

    res.status(200).send("updated successfully")
}

module.exports = {
    getAll,
    createReview,
    getReview,
    deleteReview,
    updateReview
}