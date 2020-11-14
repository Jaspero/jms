import {Storage} from '@google-cloud/storage';
import * as functions from 'firebase-functions';
import {unlink} from 'fs';
import {tmpdir} from 'os';
import {basename, dirname, join} from 'path';
import * as sharp from 'sharp';
import {promisify} from 'util';
import {unpackGenerateImageString} from '../utils/unpack-generate-image-string';

export const fileCreated = functions
  .runWith({
    memory: '1GB',
    timeoutSeconds: 300
  })
  .storage.object()
  .onFinalize(async ({bucket, name, contentType, metadata}: any) => {
    const fileName = basename(name);
    const dirName = dirname(name);

    /**
     * Skip if the file is already a thumb or is autogenerated
     * or there aren't any meta files to generate
     */
    if (
      !contentType.startsWith('image/') ||
      !metadata ||
      !metadata['generate_1'] ||
      metadata.generated
    ) {
      return;
    }

    /**
     * Temporary main file download
     */
    const fileTemp = join(tmpdir(), fileName);
    const toGenerate = [];
    const webpToGenerate = [];

    for (const key in metadata) {
      if (key.includes('generate_')) {
        const {
          filePrefix,
          height,
          width,
          webpVersion
        } = unpackGenerateImageString(metadata[key]);
        const fName = filePrefix + fileName;
        const tmpDir = join(tmpdir(), fName);

        if (filePrefix || width || height) {
          toGenerate.push({
            tmpDir,
            fName,
            height,
            width
          });
        }

        if (webpVersion) {
          webpToGenerate.push({
            fName: fName.replace(/(.jpg|.png|.jpeg)/i, '.webp'),
            source: tmpDir,
            destination: tmpDir.replace(/(.jpg|.png|.jpeg)/i, '.webp')
          });
        }
      }
    }

    const generateMetadata = {
      generated: 'true',
      source: fileName,
      moduleId: metadata.moduleId,
      documentId: metadata.documentId
    };

    const storage = new Storage().bucket(bucket);
    await storage.file(name).download({
      destination: fileTemp
    });

    await Promise.all(
      toGenerate.map(file =>
        sharp(fileTemp)
          .resize(file.width || null, file.height || null, {fit: 'inside'})
          .toFile(file.tmpDir)
      )
    );

    if (webpToGenerate.length) {
      await Promise.all(
        webpToGenerate.map(file =>
          sharp(file.source)
            .webp({lossless: true})
            .toFile(file.destination)
        )
      );
    }

    await Promise.all([
      ...toGenerate.map(file =>
        storage.upload(file.tmpDir, {
          metadata: {
            metadata: generateMetadata,
            contentType
          },
          destination: join(dirName, 'generated', file.fName)
        })
      ),

      ...webpToGenerate.map(file =>
        storage.upload(file.destination, {
          metadata: {
            metadata: generateMetadata,
            contentType: 'image/webp'
          },
          destination: join(dirName, 'generated', file.fName)
        })
      )
    ]);

    const unLink = promisify(unlink);

    await Promise.all(toGenerate.map(it => unLink(it.tmpDir)));

    return true;
  });
