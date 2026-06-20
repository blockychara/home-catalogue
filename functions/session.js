export async function getUser(
    request,
    env
){

    const cookie =
        request.headers.get("Cookie")
        || "";

    const match =
        cookie.match(
            /session=([^;]+)/
        );

    if(!match)
        return null;

    const sessionId =
        match[1];

    const session =
        await env.DB.prepare(`
            SELECT *
            FROM sessions
            WHERE id=?
        `)
        .bind(sessionId)
        .first();

    if(!session)
        return null;

    const user =
        await env.DB.prepare(`
            SELECT *
            FROM users
            WHERE id=?
        `)
        .bind(session.user_id)
        .first();

    return user;

}
