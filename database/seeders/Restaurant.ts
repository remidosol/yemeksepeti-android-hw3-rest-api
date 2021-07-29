import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Restaurant from 'App/Models/Restaurant'
import Address from 'App/Models/Address'
import faker from 'faker/locale/tr'

export default class RestaurantSeeder extends BaseSeeder {
  public async run() {
    try {
      for (let i = 0; i < 50; i++) {
        let restaurant = await Restaurant.create({
          name: faker.company.companyName(),
          typeOfRestaurant: faker.name.jobArea(),
          logoUrl: faker.image.business(500, 500),
        })

        await restaurant.save()
        await restaurant.refresh()

        const address = await Address.create({
          country: 'Turkey',
          city: faker.address.city(),
          district: faker.address.streetName(),
          neighborhood: faker.address.streetAddress(),
          street: faker.address.streetName(),
          latitude: parseFloat(faker.address.latitude(35.86666667, 37.06666667, 9)),
          longitude: parseFloat(faker.address.longitude(35.86666667, 36.58333333, 9)),
        })

        await address.save()
        await address.refresh()

        await restaurant.related('restaurantAddress').attach([address.id])

        let randFoodCount = faker.datatype.number({ min: 30, max: 50, precision: 1 })

        for (let j = 0; j < randFoodCount; j++) {
          let randFoodId = faker.datatype.number({ min: 1, max: 200, precision: 1 })
          await restaurant.related('restaurantFoods').attach([randFoodId])
        }

        await restaurant.save()
        await restaurant.refresh()
      }
    } catch (error) {
      console.warn(error.message)
      console.warn(error.stack)
    }
  }
}
