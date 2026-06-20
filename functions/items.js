import {
    getUser
}
from "./session";

export async function onRequestGet(
    context
){

    const user =
        await getUser(
            context.request,
            context.env
        );

    if(!user){

        return Response.json(
            {
                error:"Unauthorized"
            },
            {
                status:401
            }
        );

    }

    const items =
        await context.env.DB
            .prepare(`
                SELECT *
                FROM items
                WHERE user_id=?
            `)
            .bind(user.id)
            .all();

    return Response.json(
        items.results
    );

}
