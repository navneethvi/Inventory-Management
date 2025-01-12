import { Request, Response, NextFunction } from "express";
import csvParser from "csv-parser";
import AWS from 'aws-sdk';
import winston from "winston";

const s3 = new AWS.S3();

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

        s3.getObject(params, (err, data) => {
            if (err) {
                logger.error('Error fetching CSV file from S3:', err);
                return next(err);
            }

            const csvStream = csvParser();
            const csvBuffer = data.Body; 

            require('streamifier').createReadStream(csvBuffer)
                .pipe(csvStream)
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
                .on('error', (error : any) => {
                    logger.error('Error processing CSV data:', error);
                    next(error);
                });
        });
    } catch (error) {
        logger.error('Error in getInventoryDatas:', error);
        next(error);
    }
};

export default getInventoryDatas;
