import { ConfigContract } from '@ioc:Adonis/Core/Config'
import Env from '@ioc:Adonis/Core/Env'
import { S3ServiceConfig } from '@ioc:Services/S3Config'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import fs from 'fs'
import { v4 as uuid } from 'uuid'

import { S3, SharedIniFileCredentials, Endpoint, config } from 'aws-sdk'

export class S3Service {
  constructor(protected Config: ConfigContract) {
    //
  }

  private uploadConfig: Pick<S3ServiceConfig, 'upload'> = {
    upload: {
      s3ForcePathStyle: true,

      profile: Env.get('AWS_PROFILE') as string,

      ep: Env.get('AWS_EP') as string,

      bucketName: Env.get('AWS_MAIN_BUCKET_NAME') as string,

      accessKeyId: Env.get('AWS_ACCESS_KEY_ID') as string,

      secretAccessKey: Env.get('AWS_SECRET_ACCESS_KEY') as string,

      region: Env.get('AWS_REGION') as string,
    },
  }

  private getS3(): S3 {
    const { upload } = this.uploadConfig

    const credentials = new SharedIniFileCredentials({ profile: upload.profile })

    config.credentials = credentials

    const ep = new Endpoint(upload.ep)

    return new S3({
      endpoint: ep,
      credentials: {
        accessKeyId: upload.accessKeyId,
        secretAccessKey: upload.secretAccessKey,
      },
      region: upload.region,
      s3ForcePathStyle: upload.s3ForcePathStyle,
    })
  }

  /**
   *
   * @param bucketName string
   * @returns Promise<{ message: string; url: string | undefined } | undefined>
   */
  public async createOneBucket(
    bucketName: string
  ): Promise<{ message: string; url: string | undefined } | undefined> {
    let response: { message: string; url: string | undefined } | undefined = {
      message: '',
      url: '',
    }

    try {
      await this.getS3()
        .createBucket({ Bucket: bucketName, ACL: 'public-read' }, (err, data) => {
          if (err) {
            console.log(err)
          } else {
            response = {
              message: `Successfully created your bucket named as ${bucketName}`,
              url: data.Location,
            }
          }
        })
        .promise()

      return response
    } catch (error) {
      console.log(error.message)
      console.log(error.stack)
    }
  }

  /**
   *
   * @param bucketName string
   * @returns Promise<{ message: string } | undefined>
   */
  public async deleteOneBucket(bucketName: string): Promise<{ message: string } | undefined> {
    let response: { message: string } = {
      message: '',
    }

    try {
      await this.getS3()
        .deleteBucket({ Bucket: bucketName }, (err) => {
          if (err) {
            console.log(err.message)
            console.log(err.stack)
          } else {
            response = {
              message: `Successfully deleted your bucket named as ${bucketName}`,
            }
            return response
          }
        })
        .promise()

      return response
    } catch (error) {
      console.log(error.message)
      console.log(error.stack)
    }
  }

  /**
   *
   * @param file MultipartFileContract
   * @param bucketName string
   * @returns Promise<{ url: string } | undefined>
   */
  public async uploadToBucket(
    file: MultipartFileContract,
    bucketName: string // this bucketName can be sent with uuid of user. i.e.: '${auth.user!.uuid}/modelName'
  ): Promise<{ url: string } | undefined> {
    try {
      const { type, subtype, extname } = file

      let mimeTypeFromMultipartFile = type + '/' + subtype

      const newFileName = uuid() + '.' + extname

      await this.getS3()
        .upload(
          {
            Key: newFileName,
            Bucket: bucketName,
            ContentType: mimeTypeFromMultipartFile,
            Body: fs.createReadStream(file.tmpPath!),
            ACL: 'public-read',
          },
          (err) => {
            if (err) {
              console.log(err)
            }
          }
        )
        .promise()

      return {
        url: `${this.uploadConfig.upload.ep}/` + bucketName + '/' + newFileName,
      }
    } catch (err) {
      console.log(err.message)
      console.log(err.stack)
      return err
    }
  }

  /**
   *
   * @param bucketName string - the path of file without file name on S3 Bucket
   * @param keyName string - the file name with extension that will be removed
   * @returns Promise<{ message: string }>
   */
  public async deleteFromBucket(
    bucketName: string,
    keyName: string
  ): Promise<{
    message: string
  }> {
    let response: { message: string } = {
      message: '',
    }
    try {
      await this.getS3()
        .deleteObject(
          {
            Key: keyName,
            Bucket: bucketName,
          },
          (err) => {
            if (err) {
              console.log(err)
              response = {
                message: err.message,
              }
            } else {
              response = {
                message: `Successfully deleted your object from bucket named as ${bucketName}`,
              }
            }
          }
        )
        .promise()

      return response
    } catch (err) {
      console.log(err.message)
      console.log(err.stack)
      return err
    }
  }
}
