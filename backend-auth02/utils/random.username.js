import crypto from "crypto";

const randomUsername = ()=>
{
    let bytes = crypto.randomBytes(5);
    return bytes.toString("hex")
}

export {randomUsername};