import express from 'express'
import { getAllAnimals } from '../controllers/animals'

const router = express.Router()

router.get('/', async (_req, res): Promise<any> => {
  const animals = await getAllAnimals()
  return (animals !== undefined) ? res.status(200).send(animals) : res.sendStatus(404)
})
export default router
