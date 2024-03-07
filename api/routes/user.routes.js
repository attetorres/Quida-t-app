const router = require('express').Router()

const { getAllUsers, getOneUser, updateUser, updateUserPsycho, deleteUser, psychoStatusRole, getSelfUser, getUserPsycho } = require('../controllers/user.controller')
const { checkPsycho, checkAdmin } = require('../middlewares/checkAuth.middleware')

router.get('/', checkPsycho, getAllUsers) 
router.get('/profile', getSelfUser)
router.get('/profile/psychologist', getUserPsycho)
router.get('/:userId', checkPsycho,  getOneUser) 

router.put('/', updateUser)
router.put('/:userId', checkPsycho, updateUserPsycho) // checked
router.put('/admin/:userId', checkAdmin, psychoStatusRole)

router.delete('/', deleteUser)

module.exports = router