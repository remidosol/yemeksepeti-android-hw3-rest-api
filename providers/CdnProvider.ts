import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class CdnProvider {
  constructor(protected application: ApplicationContract) {}

  public register() {
    // Register your own bindings

    this.application.container.singleton('Services/S3', () => {
      const S3Service = require('../services/S3Service').S3Service
      const Config = this.application.container.use('Adonis/Core/Config')
      return new S3Service(Config)
    })
  }

  public async boot() {
    // All bindings are ready, feel free to use them
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
