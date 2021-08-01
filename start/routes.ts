/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

Route.get('/', async ({ response }: HttpContextContract) => {
  return response.redirect('/docs')
})

Route.post('/register', 'AuthController.register')
Route.post('/login', 'AuthController.login')
Route.get('/logout', 'AuthController.logout').middleware(['auth'])

Route.group(() => {
  Route.get('/', 'RestaurantsController.index')
  Route.get('/:restaurant_id', 'RestaurantsController.find')
  Route.post('/address/:restaurant_id', 'RestaurantsController.storeRestaurantAddress').middleware([
    'auth',
  ])
  Route.post('/food', 'RestaurantsController.addFoodToRestaurant').middleware(['auth'])
  Route.post('/store', 'RestaurantsController.store').middleware(['auth'])
  Route.post('/update/:restaurant_id', 'RestaurantsController.update').middleware(['auth'])
  Route.delete('/delete/:restaurant_id', 'RestaurantsController.destroy').middleware(['auth'])
}).prefix('/restaurants')

Route.group(() => {
  Route.get('/', 'FoodsController.index')
  Route.get('/:food_id', 'FoodsController.find')
  Route.post('/store', 'FoodsController.store').middleware(['auth'])
  Route.post('/update/:food_id', 'FoodsController.update').middleware(['auth'])
  Route.delete('/delete/:food_id', 'FoodsController.destroy').middleware(['auth'])
}).prefix('/foods')

Route.group(() => {
  Route.get('/', 'OrdersController.index')
  Route.get('/:order_id', 'OrdersController.find')
  Route.post('/store', 'OrdersController.store').middleware(['auth'])
  Route.post('/update/:order_id', 'OrdersController.update').middleware(['auth'])
  Route.delete('/delete/:order_id', 'OrdersController.destroy').middleware(['auth'])
}).prefix('/orders')

Route.group(() => {
  Route.get('/', 'UsersController.index')
  Route.get('/:user_id', 'UsersController.find')
  Route.get('/orders', 'UsersController.getOrders').middleware(['auth'])
  Route.post('/address/:user_id', 'UsersController.storeUserAddress').middleware(['auth'])
  Route.post('/store', 'UsersController.store').middleware(['auth'])
  Route.post('/update/:user_id', 'UsersController.update').middleware(['auth'])
  Route.delete('/delete/:user_id', 'UsersController.destroy').middleware(['auth'])
}).prefix('/users')
