import express from 'express'
import { getAllAnimals, getFilteredAnimals } from '../controllers/animals'

const router = express.Router()

router.get('/', async (req, res): Promise<any> => {
  const params: any = req.query

  let animals
  if (params.filters === undefined) {
    animals = await getAllAnimals()
  } else {
    animals = await getFilteredAnimals(params)
  }
  return (animals !== undefined) ? res.status(200).send(animals) : res.sendStatus(404)
})

router.get('/:id', async (_req, res): Promise<any> => {
  return res.sendStatus(404)
})

export default router
