"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upperDirectiveTransformer = void 0;
const utils_1 = require("@graphql-tools/utils");
const graphql_1 = require("graphql");
function upperDirectiveTransformer(schema, directiveName) {
    return (0, utils_1.mapSchema)(schema, {
        [utils_1.MapperKind.OBJECT_FIELD]: (fieldConfig) => {
            var _a;
            const upperDirective = (_a = (0, utils_1.getDirective)(schema, fieldConfig, directiveName)) === null || _a === void 0 ? void 0 : _a[0];
            if (upperDirective) {
                const { resolve = graphql_1.defaultFieldResolver } = fieldConfig;
                fieldConfig.resolve = async function (source, args, context, info) {
                    const result = await resolve(source, args, context, info);
                    if (typeof result === 'string') {
                        return result.toUpperCase();
                    }
                    return result;
                };
                return fieldConfig;
            }
        },
    });
}
exports.upperDirectiveTransformer = upperDirectiveTransformer;
//# sourceMappingURL=upper-case.directive.js.map