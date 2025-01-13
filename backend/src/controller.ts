import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import csvParser from "csv-parser";
import winston from "winston";
import { Readable } from 'stream';
import { Request, Response, NextFunction } from "express";


const s3Client = new S3Client({
    region: process.env.AWS_S3_REGION,
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_S3_SECRET_KEY as string,
    },
});

export const streamToBuffer = (stream: Readable): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', (err) => reject(err));
    });
};

const logger = winston.createLogger({
    level: 'info',
    transports: [
        new winston.transports.Console({ format: winston.format.simple() }),
    ],
});



const getInventoryDatas = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filters = req.query;
        const params = {
            Bucket: 'educore-bucket',
            Key: '2025-01-12T22:59:48.147Z-sample-data-v2.csv', 
        };

        const inventoryData: any[] = [];
        logger.info('Starting to process the CSV file');

        const { Body } = await s3Client.send(new GetObjectCommand(params));

        if (!Body) {
            const error = new Error('No data returned from S3.');
            logger.error(error.message);
            return next(error);
        }

        if (Body instanceof Readable) {
            Body.pipe(csvParser())
                .on('data', (row: any) => {
                    logger.debug('Processing row:', row);

                    let match = true;
                    for (const key in filters) {
                        if (filters[key] && row[key] !== filters[key]) {
                            logger.debug(`Filter mismatch for ${key}: expected ${filters[key]}, but got ${row[key]}`);
                            match = false;
                            break;
                        }
                    }

                    if (match) {
                        inventoryData.push(row);
                        logger.info('Row matched filters:', row);
                    }
                })
                .on('end', () => {
                    logger.info('CSV file processing finished');
                    res.json(inventoryData);
                })
                .on('error', (error: any) => {
                    logger.error('Error processing CSV data:', error);
                    next(error);
                });
        } else if (Buffer.isBuffer(Body)) {
            const bufferStream = Readable.from(Body); 
            bufferStream.pipe(csvParser())
                .on('data', (row: any) => {
                    logger.debug('Processing row:', row);

                    let match = true;
                    for (const key in filters) {
                        if (filters[key] && row[key] !== filters[key]) {
                            logger.debug(`Filter mismatch for ${key}: expected ${filters[key]}, but got ${row[key]}`);
                            match = false;
                            break;
                        }
                    }

                    if (match) {
                        inventoryData.push(row);
                        logger.info('Row matched filters:', row);
                    }
                })
                .on('end', () => {
                    logger.info('CSV file processing finished');
                    res.json(inventoryData);
                })
                .on('error', (error: any) => {
                    logger.error('Error processing CSV data:', error);
                    next(error);
                });
        } else {
            const error = new Error('Received an unexpected Body type.');
            logger.error(error.message);
            return next(error);
        }

    } catch (error) {
        logger.error('Error in getInventoryDatas:', error);
        next(error);
    }
};

export default getInventoryDatas;
