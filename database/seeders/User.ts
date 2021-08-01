import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import Address from 'App/Models/Address'
import Profile from 'App/Models/Profile'
import { PaymentMethods } from 'App/Models/Order'
import faker from 'faker/locale/tr'

export default class UserSeeder extends BaseSeeder {
  public async run() {
    try {
      let methods = [PaymentMethods.CASH, PaymentMethods.COUPON, PaymentMethods.CREDIT_CARD]

      for (let i = 0; i < 10; i++) {
        let randAddressCount = faker.datatype.number({ min: 1, max: 3, precision: 1 })
        let randOrderCount = faker.datatype.number({ min: 10, max: 20, precision: 1 })
        let randGender = faker.datatype.number({ min: 0, max: 1, precision: 1 })

        let user = await User.create({
          email: faker.internet.email(),
          password: 'remidosol4434',
        })

        await user.save()
        await user.refresh()

        let profile = await Profile.create({
          firstName: faker.name.firstName(randGender),
          lastName: faker.name.lastName(randGender),
          mobileNumber: faker.phone.phoneNumber('+9053########'),
          avatarUrl: faker.image.imageUrl(500, 500, 'people', true),
          userId: user.id,
        })

        await profile.save()
        await profile.refresh()

        for (let j = 0; j < randAddressCount; j++) {
          const address = await Address.create({
            country: 'Turkey',
            city: faker.address.city(),
            district: faker.address.streetName(),
            neighborhood: faker.address.streetAddress(),
            street: faker.address.streetName(),
            latitude: parseFloat(faker.address.latitude(35.86666667, 37.06666667, 9)),
            longitude: parseFloat(faker.address.longitude(35.86666667, 36.58333333, 9)),
          })
          await user.related('userAddresses').attach([address.id])
        }

        for (let k = 0; k < randOrderCount; k++) {
          let randMethodIdx = faker.datatype.number({ min: 0, max: 2, precision: 1 })
          const order = await user.related('orders').create({
            restaurantId: faker.datatype.number({ min: 1, max: 50, precision: 1 }),
            orderNote: faker.lorem.sentence(5),
            orderPaymentMethod: methods[randMethodIdx],
          })

          let randFoodCount = faker.datatype.number({ min: 1, max: 10, precision: 1 })
          for (let x = 0; x < randFoodCount; x++) {
            let randFoodId = faker.datatype.number({ min: 1, max: 200, precision: 1 })
            await order.related('orderFoods').attach([randFoodId])
          }
        }

        await user.save()
        await user.refresh()
      }
    } catch (error) {
      console.warn(error.message)
      console.warn(error.stack)
    }
  }
}
