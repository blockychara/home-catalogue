import { getUser } from "./session";

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
            UPDATE users
            SET
                is_public=?
            WHERE id=?
        `)
        .bind(
            body.is_public ? 1 : 0,
            user.id
        )
        .run();

    return Response.json({
        success:true
    });

}
