import delay from "delay"

export default async function waitUntil(conditionFn, timeout, err) {
  return new Promise(async function (resolve) {
    err = err || "waitUntil : timeout on condition : " + conditionFn
    while (!conditionFn()) {
      //console.log(conditionFn())
      if (timeout < 0) {
        throw new Error(err)
      }
      await delay(300)
      timeout -= 300
    }
    resolve()
  })
}
