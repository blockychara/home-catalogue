function parseCookie(cookieHeader, name) {

    const match =
        cookieHeader?.match(
            new RegExp(
                `${name}=([^;]+)`
            )
        );

    return match
        ? match[1]
        : null;
}

export async function getUser(
    request,
    env
){

    const cookie =
        request.headers.get(
            "Cookie"
        ) || "";

    const sessionId =
        parseCookie(
            cookie,
            "session"
        );

    if(!sessionId)
        return null;

    const session =
        await env.DB
            .prepare(`
                SELECT *
                FROM sessions
                WHERE id=?
            `)
            .bind(sessionId)
            .first();

    if(!session)
        return null;

    const user =
        await env.DB
            .prepare(`
                SELECT *
                FROM users
                WHERE id=?
            `)
            .bind(session.user_id)
            .first();

    return user;
}

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

    return Response.json({

        id:user.id,

        username:user.username,

        catalog_name:
            user.catalog_name,

        is_public:
            user.is_public

    });

}
