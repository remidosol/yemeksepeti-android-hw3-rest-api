declare module '@ioc:Services/S3' {
  import { S3Service } from 'services/S3Service'

  const s3ImageService: S3Service

  export default s3ImageService
}
