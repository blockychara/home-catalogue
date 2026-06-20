export async function onRequestGet(
    context
){

    const { env } = context;

    const rows =
        await env.DB.prepare(`
            SELECT
                username,
                catalog_name,
                description
            FROM users
            WHERE is_public=1
            ORDER BY catalog_name
        `)
        .all();

    return Response.json(
        rows.results
    );

}
