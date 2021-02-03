import AWS = require('aws-sdk');
import { ipcMain, BrowserWindow } from 'electron';
// tslint:disable-next-line:max-line-length
import { GetObjectOutput } from 'aws-sdk/clients/s3';

import fs = require('fs');

import path = require('path');
import { AWSError } from 'aws-sdk';

AWS.config.apiVersions = {
  s3: '2006-03-01',
};
AWS.config.region = 'us-east-1';

export class S3Service {
  private s3: AWS.S3;
  constructor() {
    this.s3 = new AWS.S3();
  }

  // private downloadCache(env: string) {
  //
  //   let r = this.getObject(account, bucket, key);
  //   let originalPath = path.parse(key);
  //   let filename = `${originalPath.name}${originalPath.ext}`;
  //   saveTo = saveTo ? saveTo : defaultDownloadLocation;
  //   if (!fs.existsSync(saveTo)) {
  //     this.window.webContents.send('S3-LocationNotFound', { path: saveTo });
  //     return;
  //   }
  //   let downloadFile = path.join(saveTo, filename);
  //   if (fs.existsSync(downloadFile)) {
  //     filename = `${originalPath.name}_1${originalPath.ext}`;
  //     downloadFile = path.join(saveTo, filename);
  //   }
  //   this.jobs.addJob(jobID, 'download', r.request, filename, saveTo, downloadFile);
  //   r.result.then((_) => {
  //     let file = fs.createWriteStream(downloadFile);
  //     file.write(_.Body);
  //     file.close();
  //     // tslint:disable-next-line:max-line-length
  //     this.window.webContents.send('S3-DownloadSuccessful', { account, bucket, key, saveAs: downloadFile });
  //   }).catch((err) => {
  //     // tslint:disable-next-line:max-line-length
  //     this.window.webContents.send('S3-DownloadFailed', { account, bucket, key, saveAs: downloadFile });
  //   });
  // }
  public getObject(bucket: string, key: string): Promise<GetObjectOutput> {
    const promise = new Promise<GetObjectOutput>((resolve, reject) => {
      const params = {
        Bucket: bucket,
        Key: key,
      };
      this.s3.getObject(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
    return promise;
  }
}
