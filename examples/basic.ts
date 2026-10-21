import { throttle } from "../dist/index.js";
const log = throttle((value: string) => console.log(value), 100);
log("first");
log("latest");
log.flush();
log.cancel();
