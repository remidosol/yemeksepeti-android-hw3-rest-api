import Env from '@ioc:Adonis/Core/Env'
import { S3ServiceConfig } from '@ioc:Services/S3Config'

export const servicesConfig: S3ServiceConfig = {
  upload: {
    s3ForcePathStyle: true,

    profile: Env.get('AWS_PROFILE', 'yemeksepeti-hw3') as string,

    ep: Env.get('AWS_EP') as string,

    bucketName: Env.get('AWS_MAIN_BUCKET_NAME', 'yemeksepeti-hw3') as string,

    accessKeyId: Env.get('AWS_ACCESS_KEY_ID') as string,

    secretAccessKey: Env.get('AWS_SECRET_ACCESS_KEY') as string,

    region: Env.get('AWS_REGION') as string,
  },
}
