import { getAnimalFilters } from '../controllers/animals'
import express from 'express'

const router = express.Router()
router.get('/:country', async (req, res): Promise<any> => {
  const filters = await getAnimalFilters(req.params.country as unknown as number)
  return (filters !== undefined) ? res.status(200).json(filters) : res.sendStatus(404)
})

export default router
