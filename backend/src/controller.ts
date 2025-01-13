import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import csvParser from "csv-parser";
import winston from "winston";
import { Readable } from "stream";
import { Request, Response, NextFunction } from "express";

// Initialize S3 Client
const s3Client = new S3Client({
    region: process.env.AWS_S3_REGION,
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_S3_SECRET_KEY as string,
    },
});

// Utility function to convert stream to buffer
export const streamToBuffer = (stream: Readable): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("end", () => resolve(Buffer.concat(chunks)));
        stream.on("error", (err) => reject(err));
    });
};

// Set up Winston logger
const logger = winston.createLogger({
    level: "info",
    transports: [
        new winston.transports.Console({ format: winston.format.simple() }),
    ],
});

// Controller to fetch and filter inventory data
const getInventoryDatas = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filters = req.query;
        console.log("filters:", filters);

        const params = {
            Bucket: "educore-bucket",
            Key: "2025-01-12T22:59:48.147Z-sample-data-v2.csv",
        };

        const inventoryData: any[] = [];
        logger.info("Starting to process the CSV file");

        const { Body } = await s3Client.send(new GetObjectCommand(params));

        if (!Body) {
            const error = new Error("No data returned from S3.");
            logger.error(error.message);
            return next(error);
        }

        // Function to process each row of the CSV
        const processRow = (row: any) => {
            logger.debug("Processing row:", row);

            let match = true;

            // Apply filters
            for (const key in filters) {
                const filterValues = Array.isArray(filters[key]) ? filters[key] : [filters[key]];
                
                // Check if filter is present and if it matches any of the filter values
                if (key !== "duration" && filterValues.length > 0 && !filterValues.some(value => row[key]?.toLowerCase() === String(value).toLowerCase())) {
                    logger.debug(`Filter mismatch for ${key}: expected one of ${filterValues}, but got ${row[key]}`);
                    match = false;
                    break;
                }
            }

            if (match && filters.duration) {
                // Ensure filters.duration is an array
                const durations = Array.isArray(filters.duration) ? filters.duration : [filters.duration];
                const rowDate = new Date(row.timestamp);
                const now = new Date();
                let startDate: Date;
                let endDate: Date = now;
            
                if (durations.includes("this-month")) {
                    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                } else if (durations.includes("last-month")) {
                    startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                    endDate = new Date(now.getFullYear(), now.getMonth(), 0);
                } else if (durations.includes("last-3-months")) {
                    startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
                } else {
                    startDate = new Date(0); // Defaults to the very beginning of time
                }
            
                if (rowDate < startDate || rowDate > endDate) {
                    logger.debug(`Date mismatch: Row date ${rowDate} is not in range ${startDate} - ${endDate}`);
                    match = false;
                }
            }
            if (match) {
                inventoryData.push(row);
                logger.info("Row matched filters:", row);
            }
        };

        // Handle CSV stream
        const handleCsvStream = (stream: Readable) => {
            stream
                .pipe(csvParser())
                .on("data", processRow)
                .on("end", () => {
                    logger.info("CSV file processing finished");
                    res.json(inventoryData);
                })
                .on("error", (error: any) => {
                    logger.error("Error processing CSV data:", error);
                    next(error);
                });
        };

        if (Body instanceof Readable) {
            handleCsvStream(Body);
        } else if (Buffer.isBuffer(Body)) {
            const bufferStream = Readable.from(Body);
            handleCsvStream(bufferStream);
        } else {
            const error = new Error("Received an unexpected Body type.");
            logger.error(error.message);
            return next(error);
        }
    } catch (error) {
        logger.error("Error in getInventoryDatas:", error);
        next(error);
    }
};

export default getInventoryDatas;
