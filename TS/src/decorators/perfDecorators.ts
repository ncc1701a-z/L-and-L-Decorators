import { performance } from "perf_hooks";
import "reflect-metadata";

type ThisWithTimings = {
    __timings: unknown[]
}

export function LogTimingDecorator<T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
        __timings = [];
        printTimings = () => {
            console.log(this.__timings);
        }
    }
}

const importantMetadataKey = Symbol('ImportantDecorator');

export function TimingDecorator(enableCaching = false) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const decoratedMethod = descriptor.value;

        let origFunc: any;

        const cache = new Map<string, any>();

        descriptor.value = async function (...args: any[]) {
            const key = JSON.stringify(args);

            let start: number = 0;
            let end: number = 0;

            async function invokeOriginalMethod(context: any) {
                return decoratedMethod.apply(context, args);
            }

            if (enableCaching) {
                if (cache.get(key)) {
                    start = performance.now();
                    origFunc = await cache.get(key);
                    end = performance.now();
                } else {
                    start = performance.now();
                    origFunc = await invokeOriginalMethod(this);
                    cache.set(key, origFunc);
                    end = performance.now();
                }
            } else {
                start = performance.now();
                origFunc = await invokeOriginalMethod(this);
                end = performance.now();
            }

            const delta = end - start;

            const importantParams: unknown[] = [];

            let importantParameters: number[] = Reflect.getOwnMetadata(importantMetadataKey, target, propertyKey);

            if (importantParameters) {
                importantParameters.forEach((parameterIndex: number) => {
                    importantParams.push(args[parameterIndex]);
                });
            }

            if ((this as any).__timings) {
                (this as any).__timings.push({
                    method: propertyKey,
                    time: delta,
                    importantParams
                })
            } else {
                console.log(delta);
            }

            return origFunc;
        }
    }
}

export function ImportantDecorator(target: Object, propertyKey: string | symbol, parameterIndex: number) {
    let existingImportantParameters: number[] = Reflect.getOwnMetadata(importantMetadataKey, target, propertyKey) || [];
    existingImportantParameters.push(parameterIndex);

    return Reflect.defineMetadata(importantMetadataKey, existingImportantParameters, target, propertyKey);
}

export function CacheDecorator() {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const value = descriptor.value;

        let cache = new Map<string, any>();

        descriptor.value = async function (...args: Array<any>) {
            const key = JSON.stringify(args);

            if (cache.has(key)) {
                return cache.get(key);
            } else {
                const origFunc = value.apply(this, args);
                cache.set(key, origFunc);

                return origFunc
            }
        };
    }
}



