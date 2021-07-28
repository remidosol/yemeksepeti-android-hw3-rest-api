import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Food from 'App/Models/Food'
import faker from 'faker/locale/tr'

export default class FoodSeeder extends BaseSeeder {
  public async run() {
    try {
      for (let i = 0; i < 200; i++) {
        let food = await Food.create({
          name: faker.commerce.productName(),
          price: faker.datatype.float({ min: 3.0, max: 159.9, precision: 0.4 }),
          imageUrl: faker.image.food(500, 500),
        })

        await food.save()
      }
    } catch (error) {
      console.warn(error.message)
      console.warn(error.stack)
    }
  }
}
