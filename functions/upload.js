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

    const form =
        await context.request.formData();

    const file =
        form.get("image");

    if(!file){

        return Response.json(
            {
                error:"No image"
            },
            {
                status:400
            }
        );

    }

    const extension =
        file.name
            .split(".")
            .pop();

    const key =
        `${user.id}/${
            crypto.randomUUID()
        }.${extension}`;

    await context.env.IMAGES.put(
        key,
        await file.arrayBuffer(),
        {
            httpMetadata:{
                contentType:
                    file.type
            }
        }
    );

    return Response.json({
        success:true,
        key
    });

}
