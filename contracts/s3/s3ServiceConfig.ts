declare module '@ioc:Services/S3Config' {
  interface S3ServiceConfig {
    upload: {
      s3ForcePathStyle: boolean
      profile: string
      ep: string
      bucketName: string
      accessKeyId: string
      secretAccessKey: string
      region: string
    }
  }
}
