export async function onRequestGet(
    context
){

    const result =
        await context.env.DB
            .prepare(`
                SELECT *
                FROM themes
                ORDER BY name
            `)
            .all();

    return Response.json(
        result.results
    );

}
