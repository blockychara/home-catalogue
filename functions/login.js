function randomId() {

    return crypto.randomUUID();

}

async function hashPassword(password){

    const data =
        new TextEncoder()
            .encode(password);

    const hash =
        await crypto.subtle.digest(
            "SHA-256",
            data
        );

    return [...new Uint8Array(hash)]
        .map(x =>
            x.toString(16)
             .padStart(2,"0")
        )
        .join("");

}

export async function onRequestPost(context){

    const { request, env } = context;

    const body =
        await request.json();

    const username =
        body.username;

    const password =
        body.password;

    const hash =
        await hashPassword(password);

    const user =
        await env.DB
            .prepare(`
                SELECT *
                FROM users
                WHERE username=?
                AND password_hash=?
            `)
            .bind(
                username,
                hash
            )
            .first();

    if(!user){

        return Response.json(
            {
                error:"Invalid login"
            },
            {
                status:401
            }
        );

    }

    const sessionId =
        randomId();

    await env.DB.prepare(`
        INSERT INTO sessions(
            id,
            user_id,
            expires_at
        )
        VALUES(
            ?,
            ?,
            datetime(
                'now',
                '+30 days'
            )
        )
    `)
    .bind(
        sessionId,
        user.id
    )
    .run();

    return new Response(
        JSON.stringify({
            success:true
        }),
        {
            headers:{
                "Set-Cookie":
                    `session=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Lax`
            }
        }
    );

}
