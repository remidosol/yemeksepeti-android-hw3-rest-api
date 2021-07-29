/*
|--------------------------------------------------------------------------
| AdonisJs Server
|--------------------------------------------------------------------------
|
| The contents in this file is meant to bootstrap the AdonisJs application
| and start the HTTP server to accept incoming connections. You must avoid
| making this file dirty and instead make use of `lifecycle hooks` provided
| by AdonisJs service providers for custom code.
|
*/

import 'reflect-metadata'
import sourceMapSupport from 'source-map-support'
import { Ignitor } from '@adonisjs/core/build/standalone'
import Env from '@ioc:Adonis/Core/Env'

sourceMapSupport.install({ handleUncaughtExceptions: false })

Env.set('PORT', process.env.PORT || Env.get('PORT'))

new Ignitor(__dirname)
  .httpServer()
  .start()
  .catch((error) => {
    console.warn(error.message)
    console.warn(error.stack)
  })
