export async function onRequestGet(
    context
){

    const url =
        new URL(
            context.request.url
        );

    const key =
        url.searchParams.get(
            "key"
        );

    if(!key){

        return new Response(
            "Missing key",
            {
                status:400
            }
        );

    }

    const object =
        await context.env.IMAGES.get(
            key
        );

    if(!object){

        return new Response(
            "Not Found",
            {
                status:404
            }
        );

    }

    return new Response(
        object.body,
        {
            headers:{
                "Content-Type":
                    object.httpMetadata
                    ?.contentType
                    || "image/jpeg"
            }
        }
    );

}
