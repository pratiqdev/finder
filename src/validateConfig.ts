import { Finder, FinderConfig } from './types'; // Adjust the path as needed
import { log } from './utils';

function getDateFromNegativeUnixTimestampOrString(timestamp: string | number) {
    if(!timestamp) {
        log.validate('no timestamp, returning...')
        return
    }

    log.validate('Getting date from time:', timestamp)
    let ms;
    if (typeof timestamp === 'number' && timestamp < 0) {
        // usage of a number will always refer to negative time travel
        ms = Math.abs(timestamp * 1000);
        log.validate('Time is a "number". Calculating negative time offset:', ms)

    } else if (typeof timestamp === 'string' && timestamp.startsWith('-')) {
        log.validate(`Time is an "offset string". Parsing offset...`)
        // only parse time strings this way if they start with '-'
        const match = timestamp.match(/(-?\d+)([dhm])/);
        if (match) {
            const value = parseInt(match[1]);
            const unit = match[2];
            log.validate(`Parsed offset: ${value}  ${unit}`)
            switch (unit) {
                case 'd':
                    ms = value * 24 * 60 * 60 * 1000;
                    break;
                case 'h':
                    ms = value * 60 * 60 * 1000;
                    break;
                case 'm':
                    ms = value * 60 * 1000;
                    break;
                default:
                    // throw new Error(`Invalid time unit (${unit}) from "${timestamp}"`);
                    ms = value * 1000;
            }
            log.validate(`Calculated milliseconds: ${ms}`)
        } else {
            throw new Error(`Invalid time string: ${timestamp}`);
        }
    } else {
        let d = new Date(timestamp)
        log.validate(`Invalid offset argument. Returning date:`, d)
        return d
    }
    let d = new Date(Date.now() - ms)
    log.validate(`Final date:`, {
        date: d,
        string: d.toString(),
        unix: d.getTime(),
        offset: ms
    })
    return d
}


export function validateConfig(config: Partial<FinderConfig>): FinderConfig {
    log.validate(`Validating config object...`)
    const defaultConfig: FinderConfig = {
        paths: ['.'],
        ignorePaths: ['node_modules', '.git'],
        ignoreTypes: ['lock'],
        onlyTypes: [],
        maxDepth: 100,
    };

    const finalConfig: FinderConfig = { ...defaultConfig, ...config }

    if (!Array.isArray(finalConfig.paths)) {
        throw new TypeError('Config Validation Error:\n"paths" must be an array of strings');
    }

    if (finalConfig.ignorePaths && !Array.isArray(finalConfig.ignorePaths)) {
        throw new TypeError('Config Validation Error:\n"ignorePaths" must be an array of strings');
    }

    if (finalConfig.ignoreTypes && !Array.isArray(finalConfig.ignoreTypes)) {
        throw new TypeError('Config Validation Error:\n"ignoreTypes" must be an array of strings');
    }

    if (finalConfig.onlyTypes && !Array.isArray(finalConfig.onlyTypes)) {
        throw new TypeError('Config Validation Error:\n"onlyTypes" must be an array of strings');
    }

    if (
        finalConfig.maxDepth &&
        (typeof finalConfig.maxDepth !== 'number' || finalConfig.maxDepth < 0)
    ) {
        throw new TypeError('Config Validation Error:\n"maxDepth" must be a non-negative number');
    }

    const dateEntryTypes = ['string', 'number', 'object'];

    ['modifiedAfter', 'modifiedBefore', 'createdAfter', 'createdBefore'].forEach(
        (dateKey: string) => {
            const dateValue = finalConfig[dateKey as keyof FinderConfig] as
                | Date
                | null;

            if (
                dateValue &&
                !dateEntryTypes.includes(typeof dateValue) &&
                !(dateValue instanceof Date) &&
                !Array.isArray(dateValue)
            ) {
                throw new TypeError(
                    `Config Validation Error:\n"${dateKey}" must be a valid FinderDateEntry (Date | string | [number, number, number] | {year:number, month:number, date:number})`
                );
            }

            let key = dateKey as keyof FinderConfig
            let val = finalConfig[key] 
            
            finalConfig[key] = getDateFromNegativeUnixTimestampOrString(val as any) as unknown as never


        }
    );

    if (
        finalConfig.sortBy &&
        !['name','size','date','type','created','modified'].includes(finalConfig.sortBy)
    ) {
        throw new TypeError(
            'Config Validation Error:\n"sortBy" must be a valid SortMethod value (name | type | size | created | modified)'
        );
    }

    if (
        finalConfig.sortOrder &&
        !['asc', 'desc'].includes(finalConfig.sortOrder)
    ) {
        throw new TypeError(
            'Config Validation Error:\n"sortOrder" must be a valid SortOrder value (asc | desc)'
        );
    }

    if (finalConfig.replaceBase && typeof finalConfig.replaceBase !== 'string') {
        throw new TypeError('Config Validation Error:\n"replaceBase" must be a string');
    }
    const DEFAULTS = {
        ignorePaths: ['node_modules', '.git'],
        ignoreTypes: ['lock'],
    }

    // if (!finalConfig.ignoreTypes) finalConfig.ignoreTypes = DEFAULTS.ignoreTypes
    // if (!finalConfig.ignorePaths) finalConfig.ignorePaths = DEFAULTS.ignorePaths

    log.validate(`Parsed and validated config object:`, finalConfig)

    return finalConfig;
}
