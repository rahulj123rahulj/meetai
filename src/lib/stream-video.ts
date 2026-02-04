import { StreamClient } from "@stream-io/node-sdk";
// or
// const { StreamClient } = require("@stream-io/node-sdk");

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
const secret = process.env.NEXT_PUBLIC_STREAM_SECRET_KEY!;
export const streamClient = new StreamClient(apiKey, secret);