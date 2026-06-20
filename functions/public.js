export async function onRequestGet(
    context
){

    const url =
        new URL(
            context.request.url
        );

    const username =
        url.searchParams.get(
            "username"
        );

    const user =
        await context.env.DB
            .prepare(`
                SELECT *
                FROM users
                WHERE username=?
                AND is_public=1
            `)
            .bind(username)
            .first();

    if(!user){

        return Response.json(
            {
                error:"Not found"
            },
            {
                status:404
            }
        );

    }

    const items =
        await context.env.DB
            .prepare(`
                SELECT *
                FROM items
                WHERE user_id=?
                AND hidden=0
                ORDER BY name
            `)
            .bind(user.id)
            .all();

    return Response.json({

        catalog:user.catalog_name,

        description:
            user.description,

        items:
            items.results

    });

}
