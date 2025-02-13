import RedisService from "../lib/redis";
import {Injectable} from "@nestjs/common";
import {Email} from "./model/email";
import {ShortEmail} from "./dto/shortEmail";

@Injectable()
export class EmailRepository {
    private redisClient = RedisService.getInstance().getClient();

    async getAllShortEmailsByPattern(pattern: string, cursor = 0, count = 1000): Promise<ShortEmail[]> {
        try {
            const result: ShortEmail[] = [];

            do {
                const [newCursor, keys] = await this.redisClient.scan(cursor, "MATCH", pattern, "COUNT", count);
                cursor = parseInt(newCursor);

                if (keys.length > 0) {
                    const pipeline = this.redisClient.pipeline();
                    keys.forEach((key) => pipeline.get(key));
                    const values = (await pipeline.exec() || (() => {
                        throw new Error('Redis pipeline execution failed')
                    })()) as [Error | null, string][];

                    //map fetched values
                    const projectedValues = values.map(([error, dataStr], index) => {
                        const data = Email.fromJSON(JSON.parse(dataStr))
                        if (!error && data && data.to) {
                            const keyParts = keys[index].split(":");
                            const unixTimestamp = keyParts[keyParts.length - 1];
                            const date = new Date(parseInt(unixTimestamp));

                            return new ShortEmail(data.from, data.to, data.subject, date);
                        }
                        return null;
                    }).filter(item => item !== null);

                    result.push(...projectedValues);
                }
            } while (cursor !== 0)

            return result.slice(0, count);
        } catch (error) {
            console.error(`Error getting keys by pattern ${pattern}`, error);
            throw new Error(`Could not get keys by pattern ${pattern}`);
        }
    }

    async getEmailByKey(key: string): Promise<Email | null> {
        try {
            const value = await this.redisClient.get(key);
            return value ? Email.fromJSON(JSON.parse(value)) : null;
        } catch (error) {
            console.error(`Error getting key ${key}: `, error);
            throw new Error('Could not retrieve data');
        }
    }

    async existsEmailAddressByKey(key: string): Promise<boolean> {
        return this.redisClient.get(key).then( isExist => {
            if (isExist == null) return false;
            else return parseInt(isExist, 10) == 1
            }
        )
    }

    async setEmailAddress(key: string, emailAddress: string): Promise<string> {
        return this.redisClient.set(key, emailAddress, 'EX', process.env.TTL)
    }
}
