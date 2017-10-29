import {graphiqlKoa, graphqlKoa} from "graphql-server-koa";
import {makeExecutableSchema} from "graphql-tools";
import * as koaBody from "koa-bodyparser";
import * as Router from "koa-router";
import {Pool} from "pg";
import resolvers from "./resolvers";
import schema from "./schema";

// import {formatError} from "apollo-errors";
export interface IGraphqlContext {
    db: Pool;
}

const router          = new Router();
const myGraphQLSchema = makeExecutableSchema({
    resolvers,
    typeDefs: schema,
});
const qlPath = "/graphql";

router.post(qlPath, koaBody(), graphqlKoa((ctx) => {

    const context: IGraphqlContext = {
        db: ctx.db,
    };

    return {
        context,
        schema: myGraphQLSchema,
        // formatError,
    } as any; // cast to as any due to wired ts issue error TS2345: Argument of type '(ctx: Context) => { context: IGraphqlContext; schema: GraphQLSchema; }' is not assignable to parameter of type 'GraphQLServerOptions | KoaGraphQLOptionsFunction'.
}));
router.get("/graphiql", graphiqlKoa({endpointURL: qlPath}));

export default router.routes();
