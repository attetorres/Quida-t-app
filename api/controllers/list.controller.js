const AssignedUsers = require('../models/assignedUser.model')
const ListModel = require('../models/list.model')
const UserModel = require('../models/user.model')


const createList = async (req, res) => {
    try {
        req.body.userId = res.locals.user.id 
        const list = await ListModel.create(req.body)

        res.status(200).json({ message: 'List created', list: list })

    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
}

const getAllLists = async (req, res) => {
    try {
        const list = await ListModel.findAll({
            attributes: {exclude: ['userId']}
        })

        if (!list) {
            return res.status(404).send('List not found')
        }

        return res.status(200).json(list)

    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
}

const getMyLists = async (req, res) => {
    try {
        const createdLists = await ListModel.findAll({
            where: {
                userId: res.locals.user.id
            }
        })

        const assignedLists = await AssignedUsers.findAll({
            where: {
                userId: res.locals.user.id
            }
        }) 

        if (createdLists) {
            res.status(500).json(createdLists)
        }

    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
}

const getOneList = async (req, res) => {
    try {
        const list = await ListModel.findByPk(req.params.listId, {
            attributes: {exclude: ['userId']}
        })
        if (list) {
            return res.status(200).json(list)
        } else {
            return res.status(404).send('List not found')
        }
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
}

const updateList = async (req, res) => {
    try {
        const user = await UserModel.findByPk(res.locals.user.id)

        const list = await ListModel.findByPk(req.params.listId)
  
        if (user.id !== list.userId) {
            return res.status(500).send('Unauthorized')
        }

        const result = await ListModel.update(req.body, {
            where: {
                id: req.params.listId
            }
        })
       
        return res.status(200).json('List updated successfully')

    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }

}

const deleteList = async (req, res) => {
    try {

        const user = await UserModel.findByPk(res.locals.user.id)

        const list = await ListModel.findByPk(req.params.listId)

        if (user.id !== list.userId) {
            return res.status(500).send('Unauthorized')
        }

        const result = await ListModel.destroy({
            where: {
                id: req.params.listId,
            }
        })
        if (result) {
            return res.status(200).json('List deleted')
        } else {
            return res.status(404).send('List not found')
        }

    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
}


const assignList = async (req, res) => {
    try {
        
        const user = await UserModel.findByPk(req.params.userId)

        console.log(user.psychologist, res.locals.user.id)

        if (user.psychologist !== res.locals.user.id) {
            return res.status(500).send('You are not this patient\'s psychologist')
        }

        const list = await ListModel.findByPk(req.params.listId)

        if (list.userId !== res.locals.user.id) {
            return res.status(500).send('You are not this list\'s creator')
        }

        const assignation = await AssignedUsers.create({
            userId: req.params.userId,
            listId: req.params.listId
        })

        if (!assignation) return res.status(500).send('List could not be assigned')

        res.status(200).json(assignation)

    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }

   
  
    // const user = req params :userId 


    // check user.psychologist = token.id

    
}

module.exports = {
    createList,
    getAllLists,
    getOneList,
    updateList,
    deleteList,
    getMyLists,
    assignList
}