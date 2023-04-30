import { FinderConfig, FinderSortMethods, FinderSortOrders, FinderDateEntry } from './types'; // Adjust the path as needed

export function validateConfig(config: Partial<FinderConfig>): FinderConfig {
    const defaultConfig: FinderConfig = {
        paths: ['.'],
        ignorePaths: ['node_modules', '.git'],
        ignoreTypes: ['lock'],
        onlyTypes: [],
        maxDepth: 100,
    };

    const finalConfig: FinderConfig = { ...defaultConfig, ...config };

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
        (dateKey) => {
            const dateValue = finalConfig[dateKey as keyof FinderConfig] as
                | FinderDateEntry
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
        }
    );

    if (
        finalConfig.sortBy &&
        !Object.values(FinderSortMethods).includes(finalConfig.sortBy)
    ) {
        throw new TypeError(
            'Config Validation Error:\n"sortBy" must be a valid FinderSortMethods value (name | type | size | created | modified)'
        );
    }

    if (
        finalConfig.sortOrder &&
        !Object.values(FinderSortOrders).includes(finalConfig.sortOrder)
    ) {
        throw new TypeError(
            'Config Validation Error:\n"sortOrder" must be a valid FinderSortOrders value (asc | desc)'
        );
    }

    if (finalConfig.replaceBase && typeof finalConfig.replaceBase !== 'string') {
        throw new TypeError('Config Validation Error:\n"replaceBase" must be a string');
    }

    return finalConfig;
}
