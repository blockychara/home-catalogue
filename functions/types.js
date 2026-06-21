import { getUser } from "./session";

export async function onRequest(context) {

    const { request, env } = context;

    const user = await getUser(
        request,
        env
    );

    if (!user) {

        return Response.json(
            { error: "Unauthorized" },
            { status: 401 }
        );

    }

    const method = request.method;

    // ---------------------
    // GET
    // ---------------------

    if (method === "GET") {

        const result =
            await env.DB
                .prepare(`
                    SELECT *
                    FROM item_types
                    WHERE user_id=?
                    ORDER BY value
                `)
                .bind(user.id)
                .all();

        return Response.json(
            result.results
        );

    }

    // ---------------------
    // CREATE
    // ---------------------

    if (method === "POST") {

        const body =
            await request.json();

        await env.DB
            .prepare(`
                INSERT INTO item_types(
                    user_id,
                    value,
                    hidden
                )
                VALUES(?,?,?)
            `)
            .bind(
                user.id,
                body.value,
                body.hidden ? 1 : 0
            )
            .run();

        return Response.json({
            success:true
        });

    }

    // ---------------------
    // UPDATE
    // ---------------------

    if (method === "PUT") {

        const body =
            await request.json();

        await env.DB
            .prepare(`
                UPDATE item_types
                SET
                    value=?,
                    hidden=?
                WHERE id=?
                AND user_id=?
            `)
            .bind(
                body.value,
                body.hidden ? 1 : 0,
                body.id,
                user.id
            )
            .run();

        return Response.json({
            success:true
        });

    }

    // ---------------------
    // DELETE
    // ---------------------

    if (method === "DELETE") {

        const url =
            new URL(request.url);

        const id =
            url.searchParams.get("id");

        await env.DB
            .prepare(`
                DELETE FROM item_types
                WHERE id=?
                AND user_id=?
            `)
            .bind(
                id,
                user.id
            )
            .run();

        return Response.json({
            success:true
        });

    }

    return Response.json(
        { error:"Method not allowed" },
        { status:405 }
    );

}
