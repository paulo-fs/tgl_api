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
import Database from '@ioc:Adonis/Lucid/Database'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

// TEST ROUTES
Route.group(() => {
  Route.get('test_db_connection', async ({ response }: HttpContextContract) => {
    await Database.report().then(({ health }) => {
      const { healthy, message } = health
      if (healthy) return response.ok({ message })
    })
  })

  Route.get('/', async () => {
    return { hello: 'world!!' }
  })
})

// PUBLIC ROUTES
Route.group(() => {
  Route.post('users/create', 'UsersController.store')
  Route.post('login', 'AuthController.login')
}).prefix('api')

// AUTHENTICATED ROUTES
Route.group(() => {
  Route.get('test', ({ response }) => {
    return response.ok({ message: 'You are authorized' })
  })
})
  .prefix('api')
  .middleware(['auth', 'is:admin,employee'])

// CLIENT ROUTES

//ADMIN AND EMPLYOYEE ROUTES
Route.group(() => {
  Route.get('users', 'UsersController.index')
  Route.get('users/:id', 'UsersController.show')
  Route.put('users/:id', 'UsersController.update')
})
  .prefix('api')
  .middleware(['auth', 'is:admin,employee'])

// ADMIN ROUTES
Route.group(() => {
  Route.delete('users/:id', 'UsersController.destroy')
})
  .prefix('api')
  .middleware(['auth', 'is:admin'])
