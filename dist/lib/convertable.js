export function Convertable(converter, reverseConverter) {
    class Convertable {
        constructor(options, ...misc) {
            const converted = converter(...misc)(options);
            for (const key in converted) {
                this[key] = converted[key];
            }
        }
        static toInput = reverseConverter ? (options, ...misc) => (reverseConverter(...misc)(options)) : undefined;
        static createConverter = converter;
        static reverseConverter = reverseConverter;
    }
    return Convertable;
}
//# sourceMappingURL=convertable.js.map