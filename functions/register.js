export async function onRequestPost(context) {

    const { request, env } = context;

    const body = await request.json();

    const username =
        body.username?.trim();

    const password =
        body.password?.trim();

    const catalogName =
        body.catalogName?.trim();

    if (!username || !password || !catalogName) {
        return Response.json(
            { error: "Missing fields" },
            { status: 400 }
        );
    }

    const encoder =
        new TextEncoder();

    const data =
        encoder.encode(password);

    const hashBuffer =
        await crypto.subtle.digest(
            "SHA-256",
            data
        );

    const hash =
        [...new Uint8Array(hashBuffer)]
            .map(x =>
                x.toString(16)
                 .padStart(2, "0")
            )
            .join("");

    try {

        const result =
            await env.DB
                .prepare(`
                    INSERT INTO users(
                        username,
                        password_hash,
                        catalog_name
                    )
                    VALUES(?,?,?)
                `)
                .bind(
                    username,
                    hash,
                    catalogName
                )
                .run();

        await env.DB.prepare(`
            INSERT INTO settings(
                user_id
            )
            VALUES(?)
        `)
        .bind(
            result.meta.last_row_id
        )
        .run();

        return Response.json({
            success:true
        });

    } catch {

        return Response.json(
            {
                error:"Username exists"
            },
            {
                status:400
            }
        );

    }

}
