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
    // GET SINGLE ITEM
    // ---------------------

    if (method === "GET") {

        const url =
            new URL(request.url);

        const id =
            url.searchParams.get("id");

        const item =
            await env.DB
                .prepare(`
                    SELECT *
                    FROM items
                    WHERE id=?
                    AND user_id=?
                `)
                .bind(
                    id,
                    user.id
                )
                .first();

        if (!item) {
            return Response.json(
                { error: "Not found" },
                { status: 404 }
            );
        }

        return Response.json(item);
    }

    // ---------------------
    // CREATE
    // ---------------------

    if (method === "POST") {

        const body =
            await request.json();

        const result =
            await env.DB
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
                    body.name || "",
                    body.type || "",
                    body.location || "",
                    body.details || "",
                    body.image_key || "",
                    body.hidden ? 1 : 0,
                    body.in_use ? 1 : 0,
                    body.temporary_location || ""
                )
                .run();

        return Response.json({
            success: true,
            id: result.meta.last_row_id
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
                UPDATE items
                SET

                name=?,
                type=?,
                location=?,
                details=?,
                image_key=?,
                hidden=?,
                in_use=?,
                temporary_location=?

                WHERE id=?
                AND user_id=?
            `)
            .bind(

                body.name,
                body.type,
                body.location,
                body.details,
                body.image_key,
                body.hidden ? 1 : 0,
                body.in_use ? 1 : 0,
                body.temporary_location,

                body.id,
                user.id

            )
            .run();

        return Response.json({
            success: true
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
                DELETE FROM items
                WHERE id=?
                AND user_id=?
            `)
            .bind(
                id,
                user.id
            )
            .run();

        return Response.json({
            success: true
        });
    }

    return Response.json(
        { error: "Method not allowed" },
        { status: 405 }
    );
}
