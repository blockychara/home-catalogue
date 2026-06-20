export async function onRequestPost(
    context
){

    return new Response(
        "",
        {
            headers:{
                "Set-Cookie":
                "session=; Path=/; Max-Age=0"
            }
        }
    );

}
