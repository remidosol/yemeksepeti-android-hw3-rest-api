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

Route.group(() => {
  Route.get('/', 'RestaurantsController.index')
  Route.get('/:restaurant_id', 'RestaurantsController.find')
  Route.post('/store', 'RestaurantsController.store')
  Route.post('/update/:restaurant_id', 'RestaurantsController.update')
  Route.delete('/delete/:restaurant_id', 'RestaurantsController.delete')
}).prefix('/restaurants')

Route.group(() => {
  Route.get('/', 'FoodsController.index')
  Route.get('/:food_id', 'FoodsController.find')
  Route.post('/store', 'FoodsController.store')
  Route.post('/update/:food_id', 'FoodsController.update')
  Route.delete('/delete/:food_id', 'FoodsController.delete')
}).prefix('/foods')

Route.group(() => {
  Route.get('/', 'OrdersController.index')
  Route.get('/:order_id', 'OrdersController.find')
  Route.post('/store', 'OrdersController.store')
  Route.post('/update/:order_id', 'OrdersController.update')
  Route.delete('/delete/:order_id', 'OrdersController.delete')
}).prefix('/orders')

Route.group(() => {
  Route.get('/', 'UsersController.index')
  Route.get('/:user_id', 'UsersController.find')
  Route.post('/store', 'UsersController.store')
  Route.post('/update/:user_id', 'UsersController.update')
  Route.delete('/delete/:user_id', 'UsersController.delete')
}).prefix('/users')
