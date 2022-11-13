export function delay<T>(time: number, data: T): Promise<T> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(data);
        }, time);
    });
}

export function decorate(decorators: any, target: any, propertyKey: string | symbol, propertyDescriptor: PropertyDescriptor) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") {
        const attributes = Reflect.decorate(decorators, target, propertyKey, propertyDescriptor);
        return Object.defineProperty(target, propertyKey, attributes);
    }
}

export function param(paramIndex: number, decorator: any) {
    return function (target: any, propertyKey: string | symbol) {
        decorator(target, propertyKey, paramIndex);
    }
}
