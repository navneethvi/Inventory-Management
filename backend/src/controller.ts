import { Request, Response, NextFunction } from "express";
import csvParser from "csv-parser";
import { createReadStream } from "fs";
import winston from "winston";


const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
  ],
});

const getInventoryDatas = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filters = req.query;
        const inventoryData: any[] = [];
        logger.info('Starting to process the CSV file');

        logger.info('Filters applied:', filters);

        createReadStream('./src/data/sample-data-v2.csv')
            .pipe(csvParser())
            .on('data', (row) => {
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
                    logger.info('Row matched filters:', row);  // Log matched rows
                }
            })
            .on('end', () => {
                logger.info('CSV file processing finished');
                res.json(inventoryData);
            })
            .on('error', (error) => {
                logger.error('Error reading CSV file:', error);  
                next(error);
            });
    } catch (error) {
        logger.error('Error in getInventoryDatas:', error);  
        next(error);
    }
};

export default getInventoryDatas;
