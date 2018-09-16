const INTRO = `
介绍
猫，恐龙：https://media.giphy.com/media/jC9Rj3Z9uh7kk/giphy.gif
恐龙，吃：https://media.giphy.com/media/wUstLscu99j4Q/giphy.gif
吃，平衡： https://media.giphy.com/media/ZeB4HcMpsyDo4/giphy.gif
平衡，疼痛：https://media.giphy.com/media/IxVCZND7MaBqg/giphy.gif
`

const BAOBAO = `
宝宝太贪吃了
仓鼠，婴儿：https://media.giphy.com/media/qBKtN0G9XEPL2/giphy.gif
婴儿，恐怖：https://media.giphy.com/media/Ki9ZNTNS7aC9q/giphy.gif
恐怖，门：https://media.giphy.com/media/EBcGLJze7aJb2/giphy.gif
门，偷窃：https://media.giphy.com/media/k0ClmuzSsgRNe/giphy.gif
偷窃，鸭子：https://media.giphy.com/media/5h262Y4ebY65WKhTgR/giphy.gif
鸭子，咬：https://media.giphy.com/media/l0IyhIzRI9erMeri8/giphy.gif
咬，变：https://media.giphy.com/media/13lLqCeTpkVVgA/giphy.gif
变，足球：https://media.giphy.com/media/JjAdpCxrdro7m/giphy.gif
足球，屁股：https://media.giphy.com/media/mhicJGJVAg48w/giphy.gif
屁股，汽车：https://media.giphy.com/media/xj7vpUdQv4kpi/giphy.gif
汽车，马：https://media.giphy.com/media/yY3oWUQKgmRzy/giphy.gif
马，面具：https://media.giphy.com/media/8RxCFgu88jUbe/giphy.gif
面具，蝙蝠侠：https://media.giphy.com/media/UZ12sB7FMkjG8/giphy.gif
蝙蝠侠，炸弹：https://media.giphy.com/media/Mliueouehmpag/giphy.gif
炸弹，牛仔：https://media.giphy.com/media/yxNk7H1VsZ7CU/giphy.gif
`

function parse(text) {
  let lines = text.trim().split('\n')
  let picts = lines.slice(1)
    .map(line => {
      let [label, link] = line.split('：')
      let id = link.split('/')[4]
      return {label, id}
    })
  return {
    title: lines[0],
    picts
  }
}

module.exports = [INTRO, BAOBAO].map(parse)
