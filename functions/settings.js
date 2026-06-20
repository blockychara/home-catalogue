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

    const settings =
        await context.env.DB
            .prepare(`
                SELECT *
                FROM settings
                WHERE user_id=?
            `)
            .bind(user.id)
            .first();

    return Response.json(
        settings
    );

}

export async function onRequestPost(
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

    const body =
        await context.request.json();

    await context.env.DB
        .prepare(`
            UPDATE settings
            SET

            theme=?,
            grid_size=?,
            show_photos=?,
            show_details=?,
            photo_first=?,
            sort_mode=?

            WHERE user_id=?
        `)
        .bind(

            body.theme,

            body.grid_size,

            body.show_photos ? 1 : 0,

            body.show_details ? 1 : 0,

            body.photo_first ? 1 : 0,

            body.sort_mode,

            user.id

        )
        .run();

    return Response.json({
        success:true
    });

}
