import {
    getUser
}
from "./session";

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
            INSERT INTO items(

                user_id,

                name,

                type,

                location,

                details,

                image_key,

                hidden,

                in_use,

                temporary_location

            )
            VALUES(
                ?,?,?,?,?,?,?,?,?
            )
        `)
        .bind(

            user.id,

            body.name,

            body.type,

            body.location,

            body.details,

            body.image_key,

            body.hidden ? 1 : 0,

            body.in_use ? 1 : 0,

            body.temporary_location

        )
        .run();

    return Response.json({
        success:true
    });

}
